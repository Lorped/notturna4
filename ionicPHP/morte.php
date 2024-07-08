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


 	$idutente = $_GET['id'];


	$Mysql="SELECT nomepg FROM personaggio WHERE idutente=$idutente";
	$Result=mysqli_query($db, $Mysql);
	$res=mysqli_fetch_array($Result);
	$nomepg=$res['nomepg'];

	$xnomepg=mysqli_real_escape_string($db, $nomepg);


	$Mysql="SELECT target FROM legami WHERE domitor=$idutente";
	$Result=mysqli_query($db, $Mysql);

	$messaggio ="ha raggiunto la Morte Ultima";

	while ( $res=mysqli_fetch_array($Result)) {
		$target=$res['target'];

		$Mysql="INSERT INTO dadi ( idutente, nomepg, Ora, Testo, Destinatario) VALUES ( $idutente, '$xnomepg', NOW(), '$messaggio' , $target ) ";
		mysqli_query($db, $Mysql);

		$Mysql="SELECT registrationID FROM utente WHERE idutente=$target";
		$Result=mysqli_query($db, $Mysql);
		$res=mysqli_fetch_array($Result);

		if ($res['registrationID'] != "" ) {

			$fields= array(
				'to'=>$res['registrationID'],
				'data'=> [
					'message'=> $messaggio ,
					'title'=> $nomepg,
					'image'=> 'icon'
				]
			);


		} else {

			$fields= array(
				'to'=>'/topics/userid'.$destinatario,
				'data'=> [
					'message'=> $messaggio  ,
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


		$post=json_encode($fields, JSON_UNESCAPED_SLASHES);
		curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $post );
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
		$response = curl_exec($ch);
		curl_close($ch);

	}


	/* mando lo stesso messaggio ai master */

	user2master($idutente,$messaggio, $db);




/* do other stuff */
$Mysql="UPDATE personaggio set PScorrenti = 0 , fdv=0 WHERE idutente=$idutente";
$Result=mysqli_query($db, $Mysql);

$Mysql="DELETE from legami WHERE target=$idutente  or domitor=$idutente";
$Result=mysqli_query($db, $Mysql);


?>
