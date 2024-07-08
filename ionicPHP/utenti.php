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


	$excl=$_GET['excl'];
	$incl=$_GET['incl'];


	include ('db2.inc.php');  // NEW MYSQL //

 	$out1 = [];
	$out2 = [];

	if ( $incl != 'H') {
		if ($excl == '') {
			$MySql = "SELECT idutente, nomepg FROM personaggio ORDER BY nomepg ";
		} else {
			$MySql = "SELECT idutente, nomepg FROM personaggio WHERE idutente != $excl ORDER BY nomepg";
		}
		$Result = mysqli_query($db, $MySql);
		while ( $res = mysqli_fetch_array($Result,MYSQLI_ASSOC)   ) {
			$out1 [] =$res;
		}
		$output = json_encode ($out1, JSON_UNESCAPED_UNICODE);

	} else  {
		$MySql = "SELECT idutente, nomepg FROM personaggio  ORDER BY nomepg";
		$Result = mysqli_query($db, $MySql);
		while ( $res = mysqli_fetch_array($Result,MYSQLI_ASSOC)   ) {
			$out1 [] =$res;
		}
		$MySql = "SELECT idutente, nomepg FROM HUNTERpersonaggio ORDER BY nomepg";
		$Result = mysqli_query($db, $MySql);
		while ( $res = mysqli_fetch_array($Result,MYSQLI_ASSOC)   ) {
			$out2 [] =$res;
		}
		$out = [
			'V' => $out1,
			'H' => $out2
		];
		$output = json_encode ($out, JSON_UNESCAPED_UNICODE);
	}


  echo $output;


?>
