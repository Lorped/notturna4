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


	header('Content-Type: text/html; charset=utf-8');

	require_once __DIR__ . '/db2.inc.php';    // NEW MYSQL //


	$idutente=$_GET['id'];
	if ($idutente=="" || $idutente == 0 ) {
		die();
	}
	
	$out = [];

	$mysql = "SELECT logscanogg.idoggetto, nomeoggetto, DATE_FORMAT(datascan, '%d/%m %H:%i') as datascan, descrizione 
		FROM logscanogg 
		left join oggetti on oggetti.idoggetto = logscanogg.idoggetto
		WHERE idutente = '$idutente' 
		ORDER BY logscanogg.datascan DESC ";
	$result = mysqli_query($db, $mysql);
	$scans = [];
	while ($res = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
		$scans[] = $res;
	}

	$esitiPerOggetto = [];
	if ($scans) {
		$idOggetti = implode(',', array_unique(array_map(function ($scan) {
			return (int) $scan['idoggetto'];
		}, $scans)));
		$mysql3 = "SELECT idoggetto, motivo, descrizione FROM logscanfull
			WHERE idutente = '$idutente' AND idoggetto IN ($idOggetti)";
		$result3 = mysqli_query($db, $mysql3);
		while ($res3 = mysqli_fetch_array($result3, MYSQLI_ASSOC)) {
			$esitiPerOggetto[$res3['idoggetto']][] = [
				'motivo' => $res3['motivo'],
				'descrizione' => $res3['descrizione']
			];
		}
	}

	foreach ($scans as $res) {
		$idx = $res['idoggetto'];
		$xx = [
			'nomeoggetto' => $res['nomeoggetto'],
			'descrizione' => $res['descrizione'],
			'datascan' => $res['datascan'],
			'esito' => $esitiPerOggetto[$idx] ?? []
		];
		$out[] = $xx;
	}

	

	$output = json_encode ($out, JSON_UNESCAPED_UNICODE);
    echo $output;


?>