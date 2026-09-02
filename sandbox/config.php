<?php
// Dev-origin по http добавляется только при локальном запуске:
// на проде HTTP_HOST — всегда ai.nayanovaacademy.ru.
$allowedOrigins = ['https://ai.nayanovaacademy.ru'];
$host = strtolower((string)($_SERVER['HTTP_HOST'] ?? ''));
if (preg_match('/^(localhost|127\.0\.0\.1)(:\d+)?$/', $host)) {
    $allowedOrigins[] = 'http://localhost:8080';
}

return [
    'db_path' => __DIR__ . '/../data/ai.db',
    'auth_service_url' => 'https://auth.nayanovaacademy.ru',
    'session_timeout' => 86400 * 30,
    'total_lessons' => 50,
    'allowed_origins' => $allowedOrigins,
];
