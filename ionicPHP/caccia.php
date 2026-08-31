<?php
	include ('messaggi.inc.php');

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





	require_once __DIR__ . '/db2.inc.php';    // NEW MSQLI //

 	$idutente=$_GET['id'];
	$BS=$_GET['BS'];

	// $idutente = 1 ;   // TEST *****************

	

 	$Mysql="SELECT nomepg,  maxps, idlds from personaggio 
		LEFT JOIN generazione ON personaggio.generazione = generazione.generazione
		WHERE idutente=$idutente";
	$Result=mysqli_query ($db, $Mysql);
	$res=mysqli_fetch_array($Result);

	$maxps=$res['maxps'];
	$nomepg=$res['nomepg'];
	$xnomepg=mysqli_real_escape_string($db,$nomepg);
	$idslds=$res['idlds'];

	$Mysql="UPDATE personaggio SET PScorrenti = $maxps , lastps=NOW()  WHERE idutente=$idutente";
	mysqli_query ($db, $Mysql);

	//die(print_r($response));

	$Mysql="SELECT chance from chanceviolazione";
	$Result=mysqli_query($db,$Mysql);
	$res=mysqli_fetch_array($Result);
	$chance=$res['chance'];

	if ( $BS == 1) {
		$chance =	$chance  +5 ;
	}
	if ( $idslds == 22) {      // RIARIO
		$chance =	$chance +5 ;
	}
	if ( $idslds == 7) {      // dedalo
		$chance =	$chance +5 ;
	}
	if ( $idslds == 24) {      // galan
		$chance =	$chance +5 ;
	}

	$QD="SELECT * from pregidifetti where idutente=$idutente and idpregio=16"; //Zanne perm
	$RD=mysqli_query($db,$QD);
	if ($pres=mysqli_fetch_array($RD)) {
		$chance =	$chance +5 ;
	};
	

	$tiro=rand(1,100);

	if ($tiro < $chance)  {

		$testo="VIOLAZIONE della MASQUERADE per ".$nomepg. "  durante la Caccia.";
		$xtesto=mysqli_real_escape_string($db, $testo);
		$Mysql="INSERT INTO dadi ( idutente, nomepg, Ora, Testo, Destinatario) VALUES ( 0, 'NARRAZIONE', NOW(), '$xtesto' , 0 ) ";
		mysqli_query($db, $Mysql);

		//die ("here tiro =" . $tiro. ' mysql = '.$Mysql);
		sleep(1);
		master2master($testo);
	}



	$out= "OK";
	echo json_encode($out, JSON_UNESCAPED_UNICODE);

?>
