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





	require_once __DIR__ . '/db2.inc.php';   // NEW MYSQL //

 	$idutente=$_GET['id'];
	$dom=$_GET['dom'];   /* se diversa da zero vale  come bonus al tiro di ped dominazione, pari al valore rd */

	if (!isset($dom)) {
		$dom = 0;
	}

 	$Mysql="SELECT fdv, attivazione FROM personaggio  
		LEFT JOIN statuscama on statuscama.idstatus=personaggio.idstatus 
		WHERE personaggio.idutente=$idutente";
	$Result=mysqli_query ($db, $Mysql);
	$res=mysqli_fetch_array($Result,MYSQLI_ASSOC);
	$fdv=$res['fdv'];
	$attivazione=$res['attivazione'];


	// check pregio
	$Mysql2="SELECT * FROM pregidifetti  WHERE idutente=$idutente and idpregio=54";  //vero amore	
	$Result2=mysqli_query ($db, $Mysql2);
	if ($res2=mysqli_num_rows($Result2)) {
		$fdv= $fdv + 1;
	}

	// check difetto
	$Mysql2="SELECT * FROM pregidifetti  WHERE idutente=$idutente and idpregio=27";  //volontà debole	
	$Result2=mysqli_query ($db, $Mysql2);
	if ($res2=mysqli_num_rows($Result2)) {
		$fdv= $fdv - 2;
	}

	$base = $fdv + $attivazione + $dom;
	$dadi = rand(1, $base);

	$dado = rand(1,5);

	if ( $dado == 1 and $idutente == 3) {
		$dado = rand(1,5);
	}

	$totale = $base * $dado;


	$out = [
		'tiro' => $totale,
	];
	
	$output = json_encode ($out, JSON_UNESCAPED_UNICODE);
	echo $output;








?>
