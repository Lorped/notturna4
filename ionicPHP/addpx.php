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


	include ('db2.inc.php');

 	$idutente=$_GET['id'];
 	$px=$_GET['px'];

    

	if (is_numeric($px) && $px > 0 ) {
		$Mysql="UPDATE personaggio SET xp = xp + $px WHERE idutente=$idutente";
		$Result=mysqli_query ($db, $Mysql);

		$Azione = 'ADD' ;
		$MySql = "INSERT INTO logpx (idutente, px, Azione ) VALUES ( $idutente, $px , '$Azione' ) ";
	 	$Result = mysqli_query($db, $MySql);


	}


?>