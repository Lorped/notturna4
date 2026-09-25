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



	require_once __DIR__ . '/messaggi.inc.php';  // Include the user2master function

	require_once __DIR__ . '/db2.inc.php';  // NEW MYSQL //

 	$idutente=$_GET['id'];

 	$Mysql="SELECT * FROM personaggio
		LEFT JOIN generazione ON personaggio.generazione = generazione.generazione
		WHERE idutente=$idutente";
	$Result=mysqli_query ($db, $Mysql);
	$res=mysqli_fetch_array($Result);

	$PScorrenti=$res['PScorrenti'];
	$nomepg=$res['nomepg'];
	$xnomepg=mysqli_real_escape_string($db, $nomepg);

	$bol=$res['bol'];
	$valsentiero=$res['valsentiero'];

	if ($bol> $PScorrenti+1 || $PScorrenti<1 || $valsentiero<5) {
		exit(0);
	}

	if ($PScorrenti > 0 ) {
		$Mysql="UPDATE personaggio SET PScorrenti = $PScorrenti-$bol, lastps=NOW()  WHERE idutente=$idutente";
		$Result=mysqli_query ($db, $Mysql);

		$testo="consuma ".$bol." PS per usare Sussurro di Vita";
		$xtesto=mysqli_real_escape_string($db, $testo);
		$Mysql="INSERT INTO dadi ( idutente, nomepg, Ora, Testo, Destinatario) VALUES ( $idutente, '$xnomepg', NOW(), '$xtesto' , 0) ";
		mysqli_query($db, $Mysql);

		user2master($idutente,$testo, $db );
	}



?>
