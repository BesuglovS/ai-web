<?php
/**
 * Аутентификация ai-web.
 * Реализация вынесена в общий AuthClient (shared/php/auth-client/AuthClient.php):
 * проверка по единой куке auth_session на .nayanovaacademy.ru через auth-web.
 * Локальные JWT-токены и таблица sessions больше не используются.
 */
require_once __DIR__ . '/AuthClient.php';

class Auth
{
    /** Конструктор оставлен для совместимости со старым вызовом new Auth($config, $db) */
    public function __construct($config = null, $db = null)
    {
    }

    /**
     * Текущий пользователь из auth-web (по куке auth_session) либо null.
     * @return array|null {id, login, display_name, is_admin}
     */
    public function getCurrentUser()
    {
        return AuthClient::check();
    }

    /**
     * Совместимость со старым интерфейсом: токен больше не используется,
     * авторизация определяется кукой auth_session.
     */
    public function checkSession($token)
    {
        return AuthClient::check();
    }

    public function createSession($token, $userId, $userName, $userEmail)
    {
        return null;
    }

    public function destroySession($token)
    {
    }

    public function login($credentials)
    {
        return ['success' => false, 'error' => 'Используйте единый вход через auth.nayanovaacademy.ru'];
    }

    public function getUserFromToken($token)
    {
        return AuthClient::check();
    }
}
