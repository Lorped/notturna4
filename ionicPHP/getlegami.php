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

 	$Mysql="SELECT nomepg, livello, DATE_FORMAT(dataultima,'%d-%m-%Y') as dataultima from legami  LEFT JOIN personaggio ON idutente=domitor WHERE target=$idutente";
	$Result=mysqli_query ($db, $Mysql);
	while ( $res=mysqli_fetch_array($Result,MYSQLI_ASSOC)  ) {
		$out_t[] = $res;
	}
	$Mysql="SELECT nomepg, livello, DATE_FORMAT(dataultima,'%d-%m-%Y') as dataultima from legami LEFT JOIN personaggio ON idutente=target  WHERE domitor=$idutente";
	$Result=mysqli_query ($db, $Mysql);
	while ( $res=mysqli_fetch_array($Result,MYSQLI_ASSOC)  ) {
		$out_d[] = $res;
	}

	$out = array (
		'domitor' => $out_d ,
		'target' => $out_t
	);

	$output = json_encode($out);
    echo $output;







?>
