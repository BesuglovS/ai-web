<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

require_once __DIR__ . '/Auth.php';
require_once __DIR__ . '/Database.php';
$config = require __DIR__ . '/config.php';

$token = null;
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    $token = str_replace('Bearer ', '', $_SERVER['HTTP_AUTHORIZATION']);
}

if (!$token) {
    echo json_encode(['authenticated' => false]);
    exit;
}

$db = new Database($config['db_path']);
$auth = new Auth($config, $db);
$user = $auth->checkSession($token);

if ($user) {
    echo json_encode(['authenticated' => true, 'user' => $user]);
} else {
    echo json_encode(['authenticated' => false]);
}
