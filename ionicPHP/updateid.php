<?php
header("Access-Control-Allow-Origin: *");

//http://stackoverflow.com/questions/18382740/cors-not-working-php
if (isset($_SERVER['HTTP_ORIGIN'])) {
	header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
	header('Access-Control-Allow-Credentials: true');
   header('Access-Control-Max-Age: 86400');    // cache for 1 day
 }
 
// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
 
	if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
		header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         
 
	if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
		header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
	exit(0);
}

	
// $action: 'batchAdd' (iscrizione) oppure 'batchRemove' (disiscrizione)
function manageTopic($action, $id, $topic, $accessToken) {
	$curl = curl_init('https://iid.googleapis.com/iid/v1:' . $action);
	if ($curl === false) {
		return ['ok' => false, 'error' => 'curl init failed'];
	}

	curl_setopt_array($curl, [
		CURLOPT_POST => true,
		CURLOPT_HTTPHEADER => [
			'Authorization: Bearer ' . $accessToken,
			'access_token_auth: true',
			'Content-Type: application/json',
		],
		CURLOPT_POSTFIELDS => json_encode([
			'to' => '/topics/' . $topic,
			'registration_tokens' => [$id],
		]),
		CURLOPT_RETURNTRANSFER => true,
	]);
	$response = curl_exec($curl);
	$httpStatus = curl_getinfo($curl, CURLINFO_HTTP_CODE);
	$curlError = curl_error($curl);
	curl_close($curl);

	// batchAdd/batchRemove rispondono 200 con l'esito per token in results[]
	$decoded = is_string($response) ? json_decode($response, true) : null;
	$tokenError = $decoded['results'][0]['error'] ?? null;
	if ($response === false || $httpStatus < 200 || $httpStatus >= 300 || $tokenError) {
		$detail = 'HTTP ' . $httpStatus . ' ' . $curlError . ' ' . ($tokenError ?? $response);
		error_log('FCM ' . $action . ' topic ' . $topic . ' failed: ' . $detail);
		return ['ok' => false, 'error' => $detail];
	}
	return ['ok' => true];
}

function unsubscribeFromTopic($id, $oldclan, $accessToken) {
	manageTopic('batchRemove', $id, $oldclan, $accessToken);
}





	
require_once __DIR__ . '/db2.inc.php';  //NEW MYSQL //

header('Content-Type: application/json; charset=utf-8');

$id = $_GET['id'] ?? null;
$userid = filter_input(INPUT_GET, 'userid', FILTER_VALIDATE_INT);
$pwa = $_GET['pwa'] ?? null;

if (!is_string($id) || $id === '' || $userid === false || $userid === null || $userid <= 0) {
	http_response_code(400);
	echo json_encode(['error' => 'Invalid token or user id']);
	exit;
}

$statement = mysqli_prepare($db, 'UPDATE utente SET registrationID = ? WHERE idutente = ?');
if (
	$statement === false ||
	!mysqli_stmt_bind_param($statement, 'si', $id, $userid) ||
	!mysqli_stmt_execute($statement)
) {
	error_log('Unable to save FCM registration token');
	http_response_code(500);
	echo json_encode(['error' => 'Unable to save FCM registration token']);
	exit;
}
mysqli_stmt_close($statement);




// SE IL PARAMETRO PWA è 'pwa' ALORA MI DISISCRIVO AI TOPIC E MI ISCIVO AL MIO - ALTRIMENTI ESCO
if ($pwa !== 'pwa') {

	$OK = "OK";
	$output = json_encode ($OK, JSON_UNESCAPED_UNICODE);
    echo $output;
	exit;
}




require_once __DIR__ . '/get_access_token.php';
$accessToken = get_access_token(__DIR__ . '/notturna-93b8f-firebase-adminsdk-lsd7l-9f862f300c.json');
if (!$accessToken) {
	error_log('Unable to obtain Firebase access token for topic subscription');
	http_response_code(500);
	echo json_encode(['error' => 'Unable to obtain Firebase access token for topic subscription']);
	exit;
}

$mysql="SELECT nomeclan FROM personaggio
	LEFT JOIN clan ON personaggio.idclan = clan.idclan
	WHERE personaggio.idutente = ?"; 
$stmt = mysqli_prepare($db, $mysql);
mysqli_stmt_bind_param($stmt, 'i', $userid);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
$row = mysqli_fetch_assoc($result);
mysqli_stmt_close($stmt);
$nomeclan = $row['nomeclan'] ?? null;


$mysql="SELECT nomeclan FROM clan ";
$stmt = mysqli_prepare($db, $mysql);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$oldclan = '';
while ($row = mysqli_fetch_array($result)) {
	$oldclan = $row['nomeclan'] ;
	unsubscribeFromTopic($id, $oldclan, $accessToken);
}
mysqli_stmt_close($stmt);


// Subscribe to the clan topic

if (!$nomeclan) {
	http_response_code(404);
	echo json_encode(['error' => 'Clan not found for user']);
	exit;
}

$subscription = manageTopic('batchAdd', $id, $nomeclan, $accessToken);
if (!$subscription['ok']) {
	http_response_code(502);
	echo json_encode(['error' => 'FCM clan topic subscription failed: ' . $subscription['error']]);
	exit;
}

echo json_encode(['ok' => true, 'topic' => $nomeclan]);
?>
