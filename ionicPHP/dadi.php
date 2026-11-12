<?php

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Max-Age: 86400');

function respond(array $payload, int $statusCode = 200): void
{
    http_response_code($statusCode);

    try {
        echo json_encode(
            $payload,
            JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE | JSON_THROW_ON_ERROR
        );
    } catch (JsonException $exception) {
        error_log('dadi.php JSON encoding failed: ' . $exception->getMessage());
        http_response_code(500);
        echo '{"error":"Internal server error"}';
    }

    exit;
}

$requestMethod = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($requestMethod === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($requestMethod !== 'GET') {
    header('Allow: GET, OPTIONS');
    respond(['error' => 'Method not allowed'], 405);
}

$rawUserId = $_GET['userid'] ?? '0';
$userId = is_string($rawUserId) ? filter_var($rawUserId, FILTER_VALIDATE_INT) : false;

if ($userId === false) {
    respond(['error' => 'Invalid userid'], 400);
}

$limit = null;
if (array_key_exists('limit', $_GET)) {
    $rawLimit = $_GET['limit'];
    $limit = is_string($rawLimit)
        ? filter_var($rawLimit, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1, 'max_range' => 100]])
        : false;
    if ($limit === false) {
        respond(['error' => 'Invalid limit'], 400);
    }
}

$beforeId = null;
if (array_key_exists('before', $_GET)) {
    $rawBeforeId = $_GET['before'];
    $beforeId = is_string($rawBeforeId)
        ? filter_var($rawBeforeId, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]])
        : false;
    if ($beforeId === false || $limit === null) {
        respond(['error' => 'Invalid before'], 400);
    }
}

try {
    require_once __DIR__ . '/db2.inc.php';

    $clanId = -99;
    $chronicleId = -1;

    if ($userId !== -1 && $userId !== 0) {
        $profileStatement = $db->prepare(
            'SELECT idclan, IDcronaca FROM personaggio WHERE idutente = ?'
        );
        $profileStatement->bind_param('i', $userId);
        $profileStatement->execute();
        $profile = $profileStatement->get_result()->fetch_assoc();
        $profileStatement->close();

        if (is_array($profile)) {
            $clanId = (int) $profile['idclan'];
            $chronicleId = (int) $profile['IDcronaca'];
        }
    }

    $fields = $limit === null ? 'nomepg, Ora, Testo' : 'ID, nomepg, Ora, Testo';
    $sql = "SELECT $fields FROM dadi";
    $conditions = [];
    $types = '';
    $params = [];

    if ($userId === 0) {
        $conditions[] = 'Destinatario = -1';
    } elseif ($userId !== -1) {
        $conditions[] = '(Destinatario = -1
                OR Destinatario = ?
                OR idutente = ?
                OR (clan = ? AND cronaca = -1)
                OR (clan = ? AND cronaca = ?))';
        $types = 'iiiii';
        $params = [
            $userId,
            $userId,
            $clanId,
            $clanId,
            $chronicleId
        ];
    }
    if ($beforeId !== null) {
        $conditions[] = 'ID < ?';
        $types .= 'i';
        $params[] = $beforeId;
    }
    if ($conditions) {
        $sql .= ' WHERE ' . implode(' AND ', $conditions);
    }
    $sql .= ' ORDER BY ID DESC';
    if ($limit !== null) {
        $sql .= ' LIMIT ?';
        $types .= 'i';
        $params[] = $limit;
    }

    $statement = $db->prepare($sql);
    if ($types !== '') {
        $statement->bind_param($types, ...$params);
    }

    $statement->execute();
    $result = $statement->get_result();
    $posts = [];

    while ($row = $result->fetch_assoc()) {
        $date = new DateTimeImmutable($row['Ora']);
        $post = [
            'pg' => $row['nomepg'],
            'testo' => $row['Testo'] ?? '',
            'ora' => $date->format('H:i'),
            'data' => $date->format('d/m/Y'),
        ];
        if ($limit !== null) {
            $post['id'] = (int) $row['ID'];
        }
        $posts[] = $post;
    }

    $statement->close();

    respond($posts);
} catch (Throwable $exception) {
    error_log('dadi.php request failed: ' . $exception->getMessage());
    respond(['error' => 'Internal server error'], 500);
}
