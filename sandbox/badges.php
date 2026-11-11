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

// Бейджи храним только для авторизованных учеников (SSO), как и прогресс.
$user = requireAuth($auth);
$userId = (int)($user['id'] ?? 0);

$BADGE_DEFINITIONS = [
    'first_lesson' => ['name' => 'First Steps', 'description' => 'Complete your first lesson', 'check' => fn($stats) => $stats['total_lessons_completed'] >= 1],
    'both_lessons' => ['name' => 'Two Tools', 'description' => 'Complete both setup lessons', 'check' => fn($stats) => $stats['total_lessons_completed'] >= 2],
    'all_lessons' => ['name' => 'Graduate', 'description' => 'Complete all lessons', 'check' => fn($stats) => $stats['total_lessons_completed'] >= 3],
    'perfect_score' => ['name' => 'Perfect Score', 'description' => 'Get 100% on all quizzes', 'check' => function($stats) use ($db, $userId) {
        $all = $db->getAllProgress($userId);
        if (count($all) < 2) return false;
        foreach ($all as $p) {
            if ($p['quiz_score'] < 100) return false;
        }
        return true;
    }],
    'streak_2' => ['name' => 'On Fire', 'description' => 'Complete 2 lessons in a row', 'check' => fn($stats) => $stats['current_streak'] >= 2],
];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $badges = $db->getBadges($userId);
    jsonResponse(['badges' => $badges]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $stats = $db->getStats($userId);
    $earned = $db->getUserBadges($userId);
    $newBadges = [];

    foreach ($BADGE_DEFINITIONS as $badgeId => $def) {
        if (in_array($badgeId, $earned)) {
            continue;
        }
        if ($def['check']($stats)) {
            $added = $db->addBadge($userId, $badgeId);
            if ($added) {
                $newBadges[] = ['id' => $badgeId, 'name' => $def['name'], 'description' => $def['description']];
            }
        }
    }

    jsonResponse(['new_badges' => $newBadges, 'all_badges' => $db->getBadges($userId)]);
}

errorResponse('Method not allowed', 405);
