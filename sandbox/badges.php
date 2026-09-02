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
    'three_lessons' => ['name' => 'Getting Started', 'description' => 'Complete 3 lessons', 'check' => fn($stats) => $stats['total_lessons_completed'] >= 3],
    'five_lessons' => ['name' => 'Halfway There', 'description' => 'Complete 5 lessons', 'check' => fn($stats) => $stats['total_lessons_completed'] >= 5],
    'all_lessons' => ['name' => 'Graduate', 'description' => 'Complete all 10 lessons', 'check' => fn($stats) => $stats['total_lessons_completed'] >= 10],
    'perfect_score' => ['name' => 'Perfect Score', 'description' => 'Get 100% on all quizzes', 'check' => function($stats) use ($db, $user) {
        $all = $db->getAllProgress($userId);
        if (count($all) < 10) return false;
        foreach ($all as $p) {
            if ($p['quiz_score'] < 100) return false;
        }
        return true;
    }],
    'streak_3' => ['name' => 'On Fire', 'description' => 'Complete 3 lessons in a row', 'check' => fn($stats) => $stats['current_streak'] >= 3],
    'streak_5' => ['name' => 'Unstoppable', 'description' => 'Complete 5 lessons in a row', 'check' => fn($stats) => $stats['current_streak'] >= 5],
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
