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





	include ('db2.inc.php'); // NEW MYSQL //


	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);

 	$idutente=$request->idutente;
 	$destinatario=$request->destinatario;
	$messaggio=$request->messaggio;
 	//$messaggio=mysql_real_escape_string( $request->messaggio );


	$Mysql="SELECT nomepg FROM personaggio WHERE idutente=$idutente";
	if ( $res=mysqli_fetch_array(mysqli_query($db, $Mysql)) ) {
		$nomepg=$res['nomepg'];
	} else {
		$nomepg="NARRAZIONE";
	}

	$Mysql="SELECT nomepg FROM personaggio WHERE idutente=$destinatario";
	if ( $res=mysqli_fetch_array(mysqli_query($db, $Mysql)) ) {
		$nomepgdest=$res['nomepg'];
	} else {
		$nomepgdest="NARRAZIONE";
	}

	$xmessaggio =' a '.$nomepgdest.' (Telepatia): '.$messaggio;
	$xmessaggio=mysqli_real_escape_string($db, $xmessaggio);

	$xnomepg=mysqli_real_escape_string($db, $nomepg);

	$Mysql="INSERT INTO dadi ( idutente, nomepg, Ora, Testo, Destinatario) VALUES ( $idutente, '$xnomepg', NOW(), '$xmessaggio' , $destinatario ) ";
	mysqli_query($db, $Mysql);
	if (mysqli_errno($db))  die ( mysqli_errno($db).": ".mysqli_error($db)."+". $Mysql );

	$Mysql="UPDATE personaggio SET PScorrenti = PScorrenti-1 , lastps=NOW() WHERE idutente=$idutente";
	$Result=mysqli_query ($db,$Mysql);



	$Mysql="SELECT registrationID FROM utente WHERE idutente=$destinatario";
	$Result=mysqli_query($db,$Mysql);
	$res=mysqli_fetch_array($Result);

	if ($res['registrationID'] != "" ) {

		$fields= array(
			'to'=>$res['registrationID'],
			'data'=> [
				'message'=> 'TELEPATIA: '.$messaggio ,
				'title'=> $nomepg,
				'image'=> 'icon'
			]
		);


	} else {

		$fields= array(
			'to'=>'/topics/userid'.$destinatario,
			'data'=> [
				'message'=> 'TELEPATIA: '.$messaggio  ,
				'title'=> $nomepg,
				'image'=> 'icon'
			]
		);

	}


	$api_key="AAAAxERgxJ4:APA91bGb0CqFmwPOIV1tN9BSOG7yucKmCpymJf0Pp1YRXlX3wIn8RlbYqMYjnDavyLP4-j9uSzVAlLwB0e7oYzwsaJa2H_yTE3LjzXL1UoOaf-EO00MewK9VyHbOeyvezg-2CTyRulba";
	$ch = curl_init('https://fcm.googleapis.com/fcm/send');

	$headers = array (
		'Authorization: key=' . $api_key,
		'Content-Type: application/json'
	);

	//die( print_r($headers));

	$post=json_encode($fields, JSON_UNESCAPED_SLASHES);

	//die (print_r($post));

	curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

	curl_setopt($ch, CURLOPT_POSTFIELDS, $post );
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

	curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
	// Disabling SSL Certificate support temporarly
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);


	// execute!
	$response = curl_exec($ch);

	// close the connection, release resources used
	curl_close($ch);

	// do anything you want with your response

	//die(print_r($response));




?>
