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





	include ('db2.inc.php');  // NEW MYSQL //

 	$idutente=$_GET['id'];

 	$Mysql="SELECT * FROM personaggio
		LEFT JOIN generazione ON personaggio.generazione = generazione.generazione
		LEFT JOIN blood ON personaggio.bloodp = blood.bloodp
		WHERE idutente=$idutente";
	$Result=mysqli_query ($db, $Mysql);
	$res=mysqli_fetch_array($Result);

	$PScorrenti=$res['PScorrenti'];
	$ps=$res['ps'];
	$lastps=$res['lastps'];
	$nomepg=$res['nomepg'];
	$xnomepg=mysqli_real_escape_string($db, $nomepg);

	if ($PScorrenti > 0 ) {
		$Mysql="UPDATE personaggio SET PScorrenti = $PScorrenti-1, lastps=NOW()  WHERE idutente=$idutente";
		$Result=mysqli_query ($db, $Mysql);

		$testo="consuma un livello di sete per rigenerare ".$res['rigen']." danni";
		$xtesto=mysqli_real_escape_string($db, $testo);
		$Mysql="INSERT INTO dadi ( idutente, nomepg, Ora, Testo, Destinatario) VALUES ( $idutente, '$xnomepg', NOW(), '$xtesto' , 0) ";
		mysqli_query($db, $Mysql);
	}





?>
