<?php
class Database {
    private $db;

    public function __construct($dbPath) {
        $dir = dirname($dbPath);
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }
        $this->db = new SQLite3($dbPath);
        $this->db->enableExceptions(true);
        $this->db->exec('PRAGMA journal_mode=WAL');
    }

    public function init() {
        $this->db->exec("
            CREATE TABLE IF NOT EXISTS progress (
                user_id TEXT NOT NULL,
                lesson_number INTEGER NOT NULL,
                completed INTEGER DEFAULT 0,
                quiz_score INTEGER DEFAULT 0,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (user_id, lesson_number)
            )
        ");
        $this->db->exec("
            CREATE TABLE IF NOT EXISTS badges (
                user_id TEXT NOT NULL,
                badge_id TEXT NOT NULL,
                earned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (user_id, badge_id)
            )
        ");
        $this->db->exec("
            CREATE TABLE IF NOT EXISTS sessions (
                token TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                user_name TEXT,
                user_email TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                expires_at DATETIME NOT NULL
            )
        ");
    }

    public function getProgress($userId, $lessonNumber) {
        $stmt = $this->db->prepare("SELECT * FROM progress WHERE user_id = :uid AND lesson_number = :ln");
        $stmt->bindValue(':uid', $userId, SQLITE3_TEXT);
        $stmt->bindValue(':ln', $lessonNumber, SQLITE3_INTEGER);
        $result = $stmt->execute();
        return $result->fetchArray(SQLITE3_ASSOC) ?: null;
    }

    public function setProgress($userId, $lessonNumber, $completed, $quizScore) {
        $stmt = $this->db->prepare("
            INSERT INTO progress (user_id, lesson_number, completed, quiz_score, updated_at)
            VALUES (:uid, :ln, :comp, :qs, CURRENT_TIMESTAMP)
            ON CONFLICT(user_id, lesson_number)
            DO UPDATE SET completed = :comp, quiz_score = :qs, updated_at = CURRENT_TIMESTAMP
        ");
        $stmt->bindValue(':uid', $userId, SQLITE3_TEXT);
        $stmt->bindValue(':ln', $lessonNumber, SQLITE3_INTEGER);
        $stmt->bindValue(':comp', $completed ? 1 : 0, SQLITE3_INTEGER);
        $stmt->bindValue(':qs', $quizScore, SQLITE3_INTEGER);
        $stmt->execute();
    }

    public function getAllProgress($userId) {
        $stmt = $this->db->prepare("SELECT * FROM progress WHERE user_id = :uid ORDER BY lesson_number");
        $stmt->bindValue(':uid', $userId, SQLITE3_TEXT);
        $result = $stmt->execute();
        $rows = [];
        while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
            $rows[] = $row;
        }
        return $rows;
    }

    public function getStats($userId) {
        $progress = $this->getAllProgress($userId);
        $completed = 0;
        $totalScore = 0;
        $lessonsCompleted = [];
        foreach ($progress as $p) {
            if ($p['completed']) {
                $completed++;
                $lessonsCompleted[] = $p['lesson_number'];
            }
            $totalScore += $p['quiz_score'];
        }
        $streak = 0;
        if (!empty($lessonsCompleted)) {
            $sorted = $lessonsCompleted;
            sort($sorted);
            $streak = 1;
            for ($i = 1; $i < count($sorted); $i++) {
                if ($sorted[$i] === $sorted[$i - 1] + 1) {
                    $streak++;
                } else {
                    $streak = 1;
                }
            }
        }
        return [
            'total_lessons_completed' => $completed,
            'total_lessons_available' => 10,
            'total_quiz_score' => $totalScore,
            'current_streak' => $streak,
            'percentage' => count($progress) > 0 ? round(($completed / 10) * 100) : 0,
        ];
    }

    public function getBadges($userId) {
        $stmt = $this->db->prepare("SELECT * FROM badges WHERE user_id = :uid ORDER BY earned_at DESC");
        $stmt->bindValue(':uid', $userId, SQLITE3_TEXT);
        $result = $stmt->execute();
        $rows = [];
        while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
            $rows[] = $row;
        }
        return $rows;
    }

    public function addBadge($userId, $badgeId) {
        $stmt = $this->db->prepare("INSERT OR IGNORE INTO badges (user_id, badge_id) VALUES (:uid, :bid)");
        $stmt->bindValue(':uid', $userId, SQLITE3_TEXT);
        $stmt->bindValue(':bid', $badgeId, SQLITE3_TEXT);
        $stmt->execute();
        return $this->db->changes() > 0;
    }

    public function cleanupSessions() {
        $this->db->exec("DELETE FROM sessions WHERE expires_at < CURRENT_TIMESTAMP");
    }

    public function getSession($token) {
        $stmt = $this->db->prepare("SELECT * FROM sessions WHERE token = :t AND expires_at > CURRENT_TIMESTAMP");
        $stmt->bindValue(':t', $token, SQLITE3_TEXT);
        $result = $stmt->execute();
        return $result->fetchArray(SQLITE3_ASSOC) ?: null;
    }

    public function createSession($token, $userId, $userName, $userEmail, $expiresAt) {
        $stmt = $this->db->prepare("
            INSERT OR REPLACE INTO sessions (token, user_id, user_name, user_email, expires_at)
            VALUES (:t, :uid, :name, :email, :exp)
        ");
        $stmt->bindValue(':t', $token, SQLITE3_TEXT);
        $stmt->bindValue(':uid', $userId, SQLITE3_TEXT);
        $stmt->bindValue(':name', $userName, SQLITE3_TEXT);
        $stmt->bindValue(':email', $userEmail, SQLITE3_TEXT);
        $stmt->bindValue(':exp', $expiresAt, SQLITE3_TEXT);
        $stmt->execute();
    }

    public function deleteSession($token) {
        $stmt = $this->db->prepare("DELETE FROM sessions WHERE token = :t");
        $stmt->bindValue(':t', $token, SQLITE3_TEXT);
        $stmt->execute();
    }

    public function getUserBadges($userId) {
        $stmt = $this->db->prepare("SELECT badge_id FROM badges WHERE user_id = :uid");
        $stmt->bindValue(':uid', $userId, SQLITE3_TEXT);
        $result = $stmt->execute();
        $ids = [];
        while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
            $ids[] = $row['badge_id'];
        }
        return $ids;
    }
}
