<?php
function jsonResponse($data, $code = 200) {
    http_response_code($code);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

function errorResponse($message, $code = 400) {
    jsonResponse(['error' => $message], $code);
}

function setCorsHeaders($allowedOrigins = ['*']) {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if (in_array('*', $allowedOrigins) || in_array($origin, $allowedOrigins)) {
        header('Access-Control-Allow-Origin: ' . ($origin ?: '*'));
    }
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Credentials: true');
}

function getUserFromRequest($auth) {
    $token = null;
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $token = str_replace('Bearer ', '', $_SERVER['HTTP_AUTHORIZATION']);
    }
    if (!$token) {
        return null;
    }
    return $auth->checkSession($token);
}

function requireAuth($auth) {
    $user = getUserFromRequest($auth);
    if (!$user) {
        errorResponse('Unauthorized', 401);
    }
    return $user;
}

function getJsonBody() {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}
