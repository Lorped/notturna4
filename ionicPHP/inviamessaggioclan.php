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


	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);

 	$idutente=$request->idutente;
 	$destinatario=$request->destinatario;
	$messaggio=$request->messaggio;

	$xmessaggio=mysqli_real_escape_string($db, $messaggio );


	

	// set post fields
	$Mysql="SELECT * FROM clan WHERE idclan=$destinatario";
	$Result=mysqli_query($db, $Mysql);
	$res=mysqli_fetch_array($Result);

	$nomeclan = $res['nomeclan']; //topic
	$clanimg = $res['clanimg'];

	$xmessaggio = "[".$nomeclan."] ".$xmessaggio;

	$Mysql="INSERT INTO dadi ( idutente, nomepg, Ora, Testo, Destinatario, clan) VALUES ( 0, 'NARRAZIONE', NOW(), '$xmessaggio' , 0 , '$destinatario') ";
	mysqli_query($db, $Mysql);

	master2clan($destinatario, $nomeclan, $clanimg, $messaggio, $db) ;





?>