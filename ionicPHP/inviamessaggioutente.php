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


	include ('db2.inc.php'); // NEW MYSQL //


	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);

 	$idutente=$request->idutente;
 	$destinatario=$request->destinatario;
	$messaggio=$request->messaggio;
 	//$messaggio=mysql_real_escape_string( $request->messaggio );

	//$idutente = 133;
	//$destinatario = 1 ;
	//$messaggio = "utima prova";


	$Mysql="SELECT nomepg FROM personaggio WHERE idutente=$idutente";
	if ( $res=mysqli_fetch_array(mysqli_query($db, $Mysql)) ) {
		$nomepg=$res['nomepg'];
	} else {
		$nomepg="NARRAZIONE";
	}

	$Mysql="SELECT nomepg FROM personaggio WHERE idutente=$destinatario";
	if ( $res=mysqli_fetch_array(mysqli_query($db, $Mysql)) ) {
		$nomepgdest=$res['nomepg'];
	} else {
		$nomepgdest="NARRAZIONE";
	}

	//$xmessaggio =' a '.$nomepgdest.' (Telepatia): '.$messaggio;
	$xmessaggio =' (Telepatia): '.$messaggio;
	$xmessaggio=mysqli_real_escape_string($db, $xmessaggio);

	$xnomepg=mysqli_real_escape_string($db, $nomepg);

	$Mysql="INSERT INTO dadi ( idutente, nomepg, Ora, Testo, Destinatario) VALUES ( $idutente, '$xnomepg', NOW(), '$xmessaggio' , $destinatario ) ";
	mysqli_query($db, $Mysql);
	if (mysqli_errno($db))  die ( mysqli_errno($db).": ".mysqli_error($db)."+". $Mysql );

	$Mysql="UPDATE personaggio SET PScorrenti = PScorrenti-1 , lastps=NOW() WHERE idutente=$idutente";
	$Result=mysqli_query ($db,$Mysql);



	user2user ($nomepg, $destinatario , $messaggio, $db);



?>
