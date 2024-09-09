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

	$idutente = $request->idutente;
	$idamalgama = $request->idamalgama;
	

 	$Mysql="SELECT  nomepg FROM personaggio WHERE idutente=$idutente";
	$Result=mysqli_query ($db, $Mysql);
	$res=mysqli_fetch_array($Result);

	$nomepg=$res['nomepg'];
	$xnomepg=mysqli_real_escape_string($db, $nomepg);




	$Mysql="SELECT  * FROM amalgame_main WHERE idamalgama=$idamalgama";
	$Result=mysqli_query ($db, $Mysql);
	$res=mysqli_fetch_array($Result);
	$nomeamalgama=$res['nomeamalgama'];
	$fdv=$res['fdv'];
	$ps=$res['ps'];

	if ( $ps != 0 ) {
		$Mysql="UPDATE personaggio SET PScorrenti = PScorrenti- '$ps' , lastps=NOW() WHERE idutente=$idutente";
		mysqli_query ($db, $Mysql);
	}
	if ( $fdv != 0 ) {
		$Mysql="UPDATE personaggio SET fdv = fdv- '$ps' , lastfdv=NOW() WHERE idutente=$idutente";
		mysqli_query ($db, $Mysql);
	}
	



	

	$testo="ha utilizzato ".$nomeamalgama;
	$xtesto=mysqli_real_escape_string($db, $testo);
	//$Mysql="INSERT INTO dadi ( idutente, nomepg, Ora, Testo, Destinatario) VALUES ( $idutente, '$xnomepg', NOW(), '$xtesto' , $idutente ) ";
	$Mysql="INSERT INTO dadi ( idutente, nomepg, Ora, Testo, Destinatario) VALUES ( $idutente, '$xnomepg', NOW(), '$xtesto' , 0 ) ";
	mysqli_query($db, $Mysql);


	user2master($idutente, $testo, $db);

	$Mysql="SELECT * FROM personaggio  WHERE idutente=$idutente";
	$Result = mysqli_query($db, $Mysql);
	$res=mysqli_fetch_array($Result);

	if ( $res['PScorrenti'] == 1  ) {
		$testo=$nomepg." è a rischio Frenesia";
		master2master( $testo);
		$xtesto=mysqli_real_escape_string($db, $testo);
		$Mysql="INSERT INTO dadi ( idutente, nomepg, Ora, Testo, Destinatario) VALUES ( $idutente, '$xnomepg', NOW(), 'è a rischio Frenesia' , 0 ) ";
		mysqli_query($db, $Mysql);
	}



	$output = json_encode ($out1, JSON_UNESCAPED_UNICODE);
	echo $output;
	die();

?>
