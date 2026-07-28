<?php
require_once __DIR__ . '/sandbox_common.php';
require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/Auth.php';

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

// Use auth user ID or fallback to device-based ID
$userId = $user ? $userId : null;
if (!$userId) {
    // For unauthenticated users, use IP + user-agent as anonymous ID
    $userId = 'anon_' . md5($_SERVER['REMOTE_ADDR'] . ($_SERVER['HTTP_USER_AGENT'] ?? ''));
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $lesson = isset($_GET['lesson']) ? (int)$_GET['lesson'] : null;
    if ($lesson !== null) {
        $progress = $db->getProgress($userId, $lesson);
        jsonResponse(['progress' => $progress]);
    }
    $all = $db->getAllProgress($userId);
    $stats = $db->getStats($userId);
    jsonResponse(['progress' => $all, 'stats' => $stats]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = getJsonBody();
    $lessonNumber = $body['lesson_number'] ?? null;
    $completed = $body['completed'] ?? false;
    $quizScore = $body['quiz_score'] ?? 0;

    if ($lessonNumber === null || !is_numeric($lessonNumber)) {
        errorResponse('lesson_number is required');
    }

    $db->setProgress($userId, (int)$lessonNumber, $completed, (int)$quizScore);
    jsonResponse(['success' => true]);
}

errorResponse('Method not allowed', 405);
