<?php
function jsonResponse($data, $code = 200) {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
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
    header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Allow-Credentials: true');
}

/**
 * Текущий пользователь по единой куке auth_session (общий AuthClient).
 */
function getUserFromRequest($auth) {
    return $auth->getCurrentUser();
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
