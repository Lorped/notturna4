<?php
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json; charset=utf-8');

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
        header('Access-Control-Allow-Methods: POST, OPTIONS');
    }

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    }

    exit(0);
}

require_once __DIR__ . '/db2.inc.php';

$request = json_decode(file_get_contents('php://input'));
if (json_last_error() !== JSON_ERROR_NONE || !is_object($request)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON request']);
    exit;
}

if (
    !isset($request->idutente, $request->contatto, $request->cell, $request->home, $request->note)
) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

$idutente = filter_var($request->idutente, FILTER_VALIDATE_INT);
$cell = filter_var($request->cell, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
$home = filter_var($request->home, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
$contatto = $request->contatto;
$note = $request->note;

if (
    $idutente === false || $idutente < 1 ||
    !is_string($contatto) || trim($contatto) === '' ||
    preg_match('/\A.{1,255}\z/us', $contatto) !== 1 ||
    !is_string($note) || preg_match('/\A.{0,50}\z/us', $note) !== 1 ||
    $cell === null || $home === null
) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid contact data']);
    exit;
}

$cell = (int) $cell;
$home = (int) $home;

try {
    $stmt = mysqli_prepare(
        $db,
        'INSERT INTO rubrica (owner, contatto, cell, home, note) VALUES (?, ?, ?, ?, ?)'
    );
    if ($stmt === false) {
        throw new mysqli_sql_exception(mysqli_error($db));
    }
    if (!mysqli_stmt_bind_param($stmt, 'isiis', $idutente, $contatto, $cell, $home, $note)) {
        throw new mysqli_sql_exception(mysqli_stmt_error($stmt));
    }
    if (!mysqli_stmt_execute($stmt)) {
        throw new mysqli_sql_exception(mysqli_stmt_error($stmt));
    }
    mysqli_stmt_close($stmt);
} catch (mysqli_sql_exception $exception) {
    error_log('addrubrica.php: ' . $exception->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Unable to add contact']);
    exit;
}

echo json_encode(['success' => true]);
?>
