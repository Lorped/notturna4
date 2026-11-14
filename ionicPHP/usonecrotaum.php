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
	require_once __DIR__ . '/db2.inc.php'; // NEW MYSQL //

	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);

	$idutente = $request->idutente;
	$potere = $request->potere;
	$idpotere = $request->idpotere;
	$livello = $request->livello;
	$disciplina = $request->disciplina;   // nome della via taumaturgica o necromantica
	$necrotaum = $request->necrotaum;   // 'N' se necromantica, 'T' se taumaturgica
	

 	$Mysql="SELECT PScorrenti, nomepg , cacciaobbligata, frenesia , bonusdisc, attivazione FROM personaggio
		LEFT JOIN statuscama ON personaggio.idstatus = statuscama.idstatus
		LEFT JOIN blood ON personaggio.bloodp = blood.bloodp
		LEFT JOIN generazione ON personaggio.generazione = generazione.generazione 
		WHERE idutente=$idutente";
	$Result=mysqli_query ($db, $Mysql);
	$res=mysqli_fetch_array($Result);

	$nomepg=$res['nomepg'];
	$xnomepg=mysqli_real_escape_string($db, $nomepg);
	$frenesia=$res['frenesia'];
	$cacciaobbligata=$res['cacciaobbligata'];
	$PScorrenti=$res['PScorrenti'];
	$bonusdisc=$res['bonusdisc'];
	$attivazione=$res['attivazione'];


	if ( $livello >= 5) {
		$Mysql="UPDATE personaggio SET PScorrenti = PScorrenti-2 , lastps=NOW() WHERE idutente=$idutente";
		$PScorrenti = $PScorrenti - 2;
	} else {
		$Mysql="UPDATE personaggio SET PScorrenti = PScorrenti-1 , lastps=NOW() WHERE idutente=$idutente";
		$PScorrenti = $PScorrenti - 1;
	}
	$Result=mysqli_query ($db, $Mysql);


	

	$testo="ha utilizzato ".$disciplina.".".$livello." ".$potere;
	$xtesto=mysqli_real_escape_string($db, $testo);
	//$Mysql="INSERT INTO dadi ( idutente, nomepg, Ora, Testo, Destinatario) VALUES ( $idutente, '$xnomepg', NOW(), '$xtesto' , $idutente ) ";
	$Mysql="INSERT INTO dadi ( idutente, nomepg, Ora, Testo, Destinatario) VALUES ( $idutente, '$xnomepg', NOW(), '$xtesto' , 0 ) ";
	mysqli_query($db, $Mysql);


	user2master($idutente, $testo, $db);

	if ( $PScorrenti <= $frenesia ) {
		$testo=$nomepg." è a rischio Frenesia";
		master2master( $testo);
		$xtesto=mysqli_real_escape_string($db, $testo);
		$Mysql="INSERT INTO dadi ( idutente, nomepg, Ora, Testo, Destinatario) VALUES ( $idutente, '$xnomepg', NOW(), 'è a rischio Frenesia' , 0 ) ";
		mysqli_query($db, $Mysql);
	} else if ( $PScorrenti <= $cacciaobbligata ) {
		$testo=$nomepg." è in Caccia Obbligata";
		master2master( $testo);
		$xtesto=mysqli_real_escape_string($db, $testo);
		$Mysql="INSERT INTO dadi ( idutente, nomepg, Ora, Testo, Destinatario) VALUES ( $idutente, '$xnomepg', NOW(), 'è in Caccia Obbligata' , 0 ) ";
		mysqli_query($db, $Mysql);
	}


	if ( $necrotaum == 'N' ) {


	$mysq="SELECT idnecro from necromanzie2 WHERE idnecro2=$idpotere";
	$Result=mysqli_query ($db, $mysq);
	$res=mysqli_fetch_array($Result);
	$idnecro=$res['idnecro'];

	$mysql="SELECT focus, livello from necromanzie WHERE idnecro=$idnecro and idutente=$idutente";
	$Result=mysqli_query ($db, $mysql);
	$res=mysqli_fetch_array($Result);
	$focus=$res['focus'];
	$livellodisc=$res['livello'];
	
	} else if ( $necrotaum == 'T' ) {

	$mysq="SELECT idtaum from taumaturgie2 WHERE idtaum2=$idpotere";
	$Result=mysqli_query ($db, $mysq);
	$res=mysqli_fetch_array($Result);
	$idtaum=$res['idtaum'];

	$mysql="SELECT focus, livello from taumaturgie WHERE idtaum=$idtaum and idutente=$idutente";
	$Result=mysqli_query ($db, $mysql);
	$res=mysqli_fetch_array($Result);
	$focus=$res['focus'];
	$livellodisc=$res['livello'];

	}

	$base = $livellodisc + $attivazione;
	if ( $focus == 1) {
		$base = $base + $bonusdisc;
	}

	$dado = rand(1,5);


	$totale = $base * $dado;


	$out = [
		'tiro' => $totale,
	];
	
	$output = json_encode ($out, JSON_UNESCAPED_UNICODE);
	echo $output;
	

?>
