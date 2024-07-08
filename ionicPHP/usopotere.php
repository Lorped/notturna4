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


	include ('db2.inc.php'); // NEW MYSQL //

	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);

	$idutente = $request->idutente;
	$pot = $request->potere;
	$livellopot = $request->livello;
	$aDisciplina = $request->aDisciplina;
	$aTAUMNECRO = $request->aTAUMNECRO;

 	$Mysql="SELECT  nomepg FROM personaggio WHERE idutente=$idutente";
	$Result=mysqli_query ($db, $Mysql);
	$res=mysqli_fetch_array($Result);

	$nomepg=$res['nomepg'];
	$xnomepg=mysqli_real_escape_string($db, $nomepg);

	if ($aDisciplina != "") {
	$Mysql="SELECT  nomedisc FROM discipline_main WHERE iddisciplina=$aDisciplina";
	$Result=mysqli_query ($db, $Mysql);
	$res=mysqli_fetch_array($Result);
	$nomedisc=$res['nomedisc'];
	} else {
		$nomedisc=$aTAUMNECRO;
	}




	if ( $livellopot == 5) {
		$Mysql="UPDATE personaggio SET PScorrenti = PScorrenti-2 , lastps=NOW() WHERE idutente=$idutente";
	} else {
		$Mysql="UPDATE personaggio SET PScorrenti = PScorrenti-1 , lastps=NOW() WHERE idutente=$idutente";
	}
	$Result=mysqli_query ($db, $Mysql);

	if ( $livellopot == 5 && $aDisciplina==2 ) { //maesta
		$Mysql="UPDATE personaggio SET nummaesta = nummaesta-1 , lastmaesta=NOW() WHERE idutente=$idutente";
		$Result=mysqli_query ($db, $Mysql);
	}


	

	$testo="ha utilizzato ".$nomedisc.".".$livellopot." ".$pot;
	$xtesto=mysqli_real_escape_string($db, $testo);
	$Mysql="INSERT INTO dadi ( idutente, nomepg, Ora, Testo, Destinatario) VALUES ( $idutente, '$xnomepg', NOW(), '$xtesto' , $idutente ) ";
	mysqli_query($db, $Mysql);


	user2master($idutente, $testo, $db);

	$Mysql="SELECT * FROM personaggio  WHERE idutente=$idutente";
	$Result = mysqli_query($db, $Mysql);
	$res=mysqli_fetch_array($Result);

	if ( $res['PScorrenti'] == 0  ) {
		$testo=$nomepg." è a rischio Frenesia";
		master2master( $testo);
		$xtesto=mysqli_real_escape_string($db, $testo);
		$Mysql="INSERT INTO dadi ( idutente, nomepg, Ora, Testo, Destinatario) VALUES ( $idutente, '$xnomepg', NOW(), 'è a rischio Frenesia' , 0 ) ";
		mysqli_query($db, $Mysql);
	}


	// Imposto PS
	if ($livellopot == 5 ) {
		$out1=array('ps' => 2);
	} else {
		$out1=array('ps' => 1);
	}
	$output = json_encode ($out1, JSON_UNESCAPED_UNICODE);
	echo $output;
	die();

?>
