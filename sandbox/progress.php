<?php
require_once __DIR__ . '/sandbox_common.php';
require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/Auth.php';
require_once __DIR__ . '/ProgressReporter.php';

$config = require __DIR__ . '/config.php';
setCorsHeaders($config['allowed_origins']);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$db = new Database($config['db_path']);
$db->init();
$auth = new Auth($config, $db);
$user = $auth->getCurrentUser();

$userId = $user ? (int)($user['id'] ?? 0) : null;
if (!$userId) {
    $userId = 'anon_' . md5($_SERVER['REMOTE_ADDR'] . ($_SERVER['HTTP_USER_AGENT'] ?? ''));
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $lesson = isset($_GET['lesson']) ? (int) $_GET['lesson'] : null;
    if ($lesson !== null) {
        $progress = $db->getProgress($userId, $lesson);
        jsonResponse(['progress' => $progress]);
    }
    $all = $db->getAllProgress($userId);
    $stats = $db->getStats($userId);
    $completedLessons = [];
    foreach ($all as $row) {
        if (!empty($row['completed'])) {
            $completedLessons[] = (int) $row['lesson_number'];
        }
    }
    jsonResponse(['progress' => $all, 'completedLessons' => $completedLessons, 'stats' => $stats]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = getJsonBody();
    $lessonNumber = isset($body['lesson']) ? $body['lesson'] : ($body['lesson_number'] ?? null);
    $completed = !empty($body['completed']);
    $quizScore = isset($body['quiz_score']) ? (int) $body['quiz_score'] : 0;

    if ($lessonNumber === null || !is_numeric($lessonNumber)) {
        errorResponse('lesson is required');
    }

    $db->setProgress($userId, (int) $lessonNumber, $completed, (int) $quizScore);

    if ($user) {
        $all = $db->getAllProgress($userId);
        $completedCount = 0;
        foreach ($all as $row) {
            if (!empty($row['completed'])) {
                $completedCount++;
            }
        }
        ProgressReporter::report((int) $userId, 'ai', $completedCount, (int) ($config['total_lessons'] ?? 50));
    }

    jsonResponse(['success' => true]);
}

errorResponse('Method not allowed', 405);
