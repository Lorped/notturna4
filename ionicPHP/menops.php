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





	include ('db2.inc.php');  // NEW MYSQL //

 	$idutente=$_GET['id'];

	$Mysql="SELECT PScorrenti, sete, lastps, nomepg FROM personaggio
		LEFT JOIN statuscama ON personaggio.idstatus = statuscama.idstatus
		LEFT JOIN blood ON personaggio.bloodp = blood.bloodp
		WHERE idutente=$idutente";
	$Result=mysqli_query ($db, $Mysql);
	$res=mysqli_fetch_array($Result);

	$PScorrenti=$res['PScorrenti'];
	$setetot=$res['sete']+$res['addsete'];
	$lastps=$res['lastps'];
	$nomepg=$res['nomepg'];

	if ($PScorrenti > 0 ) {
		$Mysql="UPDATE personaggio SET PScorrenti = $PScorrenti-1 , lastps=NOW() WHERE idutente=$idutente";
		$Result=mysqli_query ($db, $Mysql);


		$testo=$nomepg." ha perso 1 livello di sete";
		$xtesto=mysqli_real_escape_string($db, $testo);
		$Mysql="INSERT INTO dadi ( idutente, nomepg, Ora, Testo, Destinatario) VALUES ( 0, 'NARRAZIONE', NOW(), '$xtesto' , $idutente ) ";
		mysqli_query($db, $Mysql);


		master2user($idutente, $testo, $db);
		// set post fields



	}


?>
