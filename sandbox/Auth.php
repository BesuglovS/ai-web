<?php
class Auth {
    private $config;
    private $db;

    public function __construct($config, $db) {
        $this->config = $config;
        $this->db = $db;
    }

    public function checkSession($token) {
        $session = $this->db->getSession($token);
        if (!$session) {
            $userInfo = $this->getUserFromToken($token);
            if ($userInfo) {
                $this->createSession($token, $userInfo['id'], $userInfo['name'], $userInfo['email']);
                return $userInfo;
            }
            return null;
        }
        return [
            'id' => $session['user_id'],
            'name' => $session['user_name'],
            'email' => $session['user_email'],
        ];
    }

    public function createSession($token, $userId, $userName, $userEmail) {
        $expires = date('Y-m-d H:i:s', time() + $this->config['session_timeout']);
        $this->db->createSession($token, $userId, $userName, $userEmail, $expires);
    }

    public function destroySession($token) {
        $this->db->deleteSession($token);
    }

    public function login($credentials) {
        $url = $this->config['auth_service_url'] . '/api/auth/login';
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($credentials),
            CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 10,
            CURLOPT_SSL_VERIFYPEER => true,
        ]);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        if ($error) {
            return ['success' => false, 'error' => 'Connection failed: ' . $error];
        }

        $data = json_decode($response, true);
        if ($httpCode !== 200 || !$data) {
            return ['success' => false, 'error' => $data['error'] ?? 'Login failed'];
        }
        return ['success' => true, 'token' => $data['token'], 'user' => $data['user'] ?? null];
    }

    public function getUserFromToken($token) {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return null;
        }
        $payload = $parts[1];
        $padded = $payload . str_repeat('=', (4 - strlen($payload) % 4) % 4);
        $decoded = base64_decode($padded, true);
        if ($decoded === false) {
            return null;
        }
        $data = json_decode($decoded, true);
        if (!$data || !isset($data['sub'])) {
            return null;
        }
        if (isset($data['exp']) && $data['exp'] < time()) {
            return null;
        }
        return [
            'id' => $data['sub'],
            'name' => $data['name'] ?? $data['sub'],
            'email' => $data['email'] ?? '',
        ];
    }

    public function getCurrentUser() {
        $token = null;
        if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $token = str_replace('Bearer ', '', $_SERVER['HTTP_AUTHORIZATION']);
        }
        if (!$token) return null;
        return $this->checkSession($token);
    }
}
