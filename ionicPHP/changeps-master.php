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




	include ('messaggi.inc.php');
	require_once __DIR__ . '/db2.inc.php';  // NEW MYSQL //

 	$idutente=$_GET['id'];
	$change=$_GET['change'];

	$Mysql="SELECT PScorrenti, maxps,  nomepg FROM personaggio
		LEFT JOIN generazione ON personaggio.generazione=generazione.generazione
		WHERE idutente=$idutente";
	$Result=mysqli_query ($db, $Mysql);
	$res=mysqli_fetch_array($Result);

	$PScorrenti=$res['PScorrenti'];
	$nomepg=$res['nomepg'];

	if ( ($PScorrenti+$change) >= 0 && ($PScorrenti+$change) <= $res['maxps'] ) {
		$Mysql="UPDATE personaggio SET PScorrenti = $PScorrenti+$change , lastps=NOW() WHERE idutente=$idutente";
		$Result=mysqli_query ($db, $Mysql);


		if ($change > 0) {
			$testo=$nomepg." ha recuperato $change livello di Sete";
		} else {
			$testo=$nomepg." ha perso ".abs($change)." livello di Sete";
		}

		$xtesto=mysqli_real_escape_string($db, $testo);
		$Mysql="INSERT INTO dadi ( idutente, nomepg, Ora, Testo, Destinatario) VALUES ( 0, 'NARRAZIONE', NOW(), '$xtesto' , $idutente ) ";
		mysqli_query($db, $Mysql);


		master2user($idutente, $testo, $db);
		// set post fields



	}


	echo json_encode("OK", JSON_UNESCAPED_UNICODE);

?>
