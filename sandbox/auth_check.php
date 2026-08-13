<?php
/**
 * Проверка авторизации через единый auth-web (кука auth_session).
 * Вызывается из JavaScript ai-web (same-origin).
 */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/Auth.php';

$user = (new Auth())->getCurrentUser();

if ($user) {
    echo json_encode(['authenticated' => true, 'user' => $user], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} else {
    echo json_encode(['authenticated' => false]);
}
