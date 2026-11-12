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

	$Mysql="SELECT fdv, fdvmax, nomepg FROM personaggio
		WHERE idutente=$idutente";
	$Result=mysqli_query ($db, $Mysql);
	$res=mysqli_fetch_array($Result);

	$fdv=$res['fdv'];
	$fdvmax=$res['fdvmax'];
	$nomepg=$res['nomepg'];

	if ( ($fdv+$change) >= 0 && ($fdv+$change) <= $fdvmax ) {
		$Mysql="UPDATE personaggio SET fdv = $fdv+$change , lastfdv=NOW() WHERE idutente=$idutente";
		$Result=mysqli_query ($db, $Mysql);

		if ($change > 0) {
			$testo=$nomepg." ha recuperato $change livello di Fdv";
		} else {
			$testo=$nomepg." ha perso ".abs($change)." livello di Fdv";
		}
		$xtesto=mysqli_real_escape_string($db, $testo);
		$Mysql="INSERT INTO dadi ( idutente, nomepg, Ora, Testo, Destinatario) VALUES ( 0, 'NARRAZIONE', NOW(), '$xtesto' , $idutente ) ";
		mysqli_query($db, $Mysql);



		master2user($idutente, $testo, $db);
		// set post fields



	}


	echo json_encode("OK", JSON_UNESCAPED_UNICODE);

?>
