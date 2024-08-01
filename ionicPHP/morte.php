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



	include 'messaggi.inc.php';

	include ('db2.inc.php');  // NEW MYSQL //


 	$idutente = $_GET['id'];


	$Mysql="SELECT nomepg FROM personaggio WHERE idutente=$idutente";
	$Result=mysqli_query($db, $Mysql);
	$res=mysqli_fetch_array($Result);
	$nomepg=$res['nomepg'];

	$xnomepg=mysqli_real_escape_string($db, $nomepg);


	$Mysql="SELECT target FROM legami WHERE domitor=$idutente";
	$Result=mysqli_query($db, $Mysql);

	$messaggio ="ha raggiunto la Morte Ultima";

	while ( $res=mysqli_fetch_array($Result)) {
		$target=$res['target'];

		$Mysql="INSERT INTO dadi ( idutente, nomepg, Ora, Testo, Destinatario) VALUES ( $idutente, '$xnomepg', NOW(), '$messaggio' , $target ) ";
		mysqli_query($db, $Mysql);

		master2user($idutente,$messaggio, $db);

	}


	/* mando lo stesso messaggio ai master */

	user2master($idutente,$messaggio, $db);




/* do other stuff */
$Mysql="UPDATE personaggio set PScorrenti = 0 , fdv=0 WHERE idutente=$idutente";
$Result=mysqli_query($db, $Mysql);

$Mysql="DELETE from legami WHERE target=$idutente  or domitor=$idutente";
$Result=mysqli_query($db, $Mysql);


?>
