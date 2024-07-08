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





	include ('db2.inc.php');    // NEW MSQLI //

 	$idutente=$_GET['id'];
	$recuperati=$_GET['recuperati'];
	$anim=$_GET['anim'];
	$vitae=$_GET['vitae'];
	$BS=$_GET['BS'];

	// $idutente = 1 ;   // TEST *****************

	$toxic=$_GET['toxic'];

 	$Mysql="SELECT * FROM personaggio
		LEFT JOIN statuscama ON personaggio.idstatus = statuscama.idstatus
		LEFT JOIN blood ON personaggio.bloodp = blood.bloodp
		WHERE idutente=$idutente";
	$Result=mysqli_query ($db, $Mysql);
	$res=mysqli_fetch_array($Result);

	$PScorrenti=$res['PScorrenti'];
	$setetot=$res['sete']+$res['addsete'];
	$lastps=$res['lastps'];
	$nomepg=$res['nomepg'];
	$xnomepg=mysqli_real_escape_string($db,$nomepg);



	$PScorrenti=$PScorrenti+$recuperati;
	if ($PScorrenti > $setetot) {
		$PScorrenti = $setetot;
	}

	if ( $anim == 1) {
		$Mysql="UPDATE personaggio SET PScorrenti = $PScorrenti , lastps=NOW() , lastcaccia=NOW() WHERE idutente=$idutente";
	} else if ( $vitae == 1) {
		$Mysql="UPDATE personaggio SET PScorrenti = $PScorrenti , lastps=NOW() , lastvitae=NOW() WHERE idutente=$idutente";
	} else {
		$Mysql="UPDATE personaggio SET PScorrenti = $PScorrenti , lastps=NOW() WHERE idutente=$idutente";
	}


	$Result=mysqli_query ($db, $Mysql);




	if ( $vitae == 1) {
		$testo=$nomepg." ha usato Rigenerazione della Vitae  (".$recuperati ." livelli di sete recuperati)";
		$xtesto=mysqli_real_escape_string($db, $testo);
		$Mysql="INSERT INTO dadi ( idutente, nomepg, Ora, Testo, Destinatario) VALUES ( 0, 'NARRAZIONE', NOW(), '$xtesto' , $idutente ) ";
		mysqli_query($db, $Mysql);

	} else {
		$testo=$nomepg." ha saziato la sua sete (".$recuperati ." livelli recuperati)";
		$xtesto=mysqli_real_escape_string($db, $testo);
		$Mysql="INSERT INTO dadi ( idutente, nomepg, Ora, Testo, Destinatario) VALUES ( 0, 'NARRAZIONE', NOW(), '$xtesto' , $idutente ) ";
		mysqli_query($db, $Mysql);
	}



		// set post fields

	master2user($idutente,$testo, $db);




	// do anything you want with your response

	//die(print_r($response));

	$Mysql="SELECT chance from chanceviolazione";
	$Result=mysqli_query($db,$Mysql);
	$res=mysqli_fetch_array($Result);
	$chance=$res['chance'];

	if ( $BS == 1) {
		$chance =	$chance * 2;
	}

	$tiro=rand(1,100);

	if ($tiro < $chance)  {

		$testo="VIOLAZIONE della MASQUERADE per ".$nomepg;
		$xtesto=mysqli_real_escape_string($db, $testo);
		$Mysql="INSERT INTO dadi ( idutente, nomepg, Ora, Testo, Destinatario) VALUES ( 0, 'NARRAZIONE', NOW(), '$xtesto' , 0 ) ";
		mysqli_query($db, $Mysql);

		//die ("here tiro =" . $tiro. ' mysql = '.$Mysql);
		sleep(1);
		master2master($testo);
	}


	if ( $toxic == 1) {

		$testo="Caccia sfortunata (Tossicodipendenza) per ".$nomepg;
		$xtesto=mysqli_real_escape_string($db, $testo);
		$Mysql="INSERT INTO dadi ( idutente, nomepg, Ora, Testo, Destinatario) VALUES ( 0, 'NARRAZIONE', NOW(), '$xtesto' , 0 ) ";
		mysqli_query($db, $Mysql);

		sleep(1);
		master2master($testo);

	}


	if ( $anim == 1) {
		$out= [
			'lastcaccia' => date("Y-m-d H:i:s")
		];
			echo json_encode($out, JSON_UNESCAPED_UNICODE);
	}
	if ( $vitae == 1) {
		$out= [
			'lastvitae' => date("Y-m-d H:i:s")
		];
			echo json_encode($out, JSON_UNESCAPED_UNICODE);
	}

?>
