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

	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);

	$domitor = $request->domitor;
	$target = $request->target;

	/***  mando messaggio di accettazione */
	$Mysql="SELECT nomepg FROM personaggio WHERE idutente=$target";
	if ( $res=mysqli_fetch_array(mysqli_query($db, $Mysql)) ) {
		$nomepg=$res['nomepg'];
	}

	$Mysql="SELECT nomepg FROM personaggio WHERE idutente=$domitor";
	if ( $res=mysqli_fetch_array(mysqli_query($db, $Mysql)) ) {
		$nomepgdest=$res['nomepg'];
	}

	$messaggio ='ha accettato la vitae di '.$nomepgdest;


	$Mysql="SELECT registrationID FROM utente WHERE idutente=$domitor";
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
			'to'=>'/topics/userid'.$domitor,
			'data'=> [
				'message'=> $messaggio ,
				'title'=> $nomepg,
				'image'=> 'icon'
			]
		);

	}


	$api_key = "AAAAxERgxJ4:APA91bGb0CqFmwPOIV1tN9BSOG7yucKmCpymJf0Pp1YRXlX3wIn8RlbYqMYjnDavyLP4-j9uSzVAlLwB0e7oYzwsaJa2H_yTE3LjzXL1UoOaf-EO00MewK9VyHbOeyvezg-2CTyRulba";
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


	$xnomepg=mysqli_real_escape_string($db, $nomepg);
	$xmessaggio=mysqli_real_escape_string($db, $messaggio);
	$Mysql="INSERT INTO dadi ( idutente, nomepg, Ora, Testo, Destinatario) VALUES ( $target, '$xnomepg', NOW(), '$xmessaggio' , $domitor ) ";
	mysqli_query($db , $Mysql);
/**********/


	$Mysql="UPDATE personaggio SET fdv=fdv-1 WHERE idutente= $domitor ";
	mysqli_query($db, $Mysql);

	$Mysql="SELECT * from personaggio  WHERE idutente=$domitor ";
	$Result=mysqli_query ($db, $Mysql);
	$res = mysqli_fetch_array($Result);
	if ($res['idclan'] == 7) {
		/* domitor tremere:  non faccio nulla*/
		// die();
	}

	$Mysql="SELECT * from pregidifetti  WHERE idutente=$target and idpregio=121";
	$Result=mysqli_query ($db, $Mysql);
	if ( $res = mysqli_fetch_array( $Result) ) {
		/* invincolabile non faccio nulla*/
		die();
	}


	$Mysql="SELECT max(livello) as m from legami  WHERE domitor!=$domitor AND target=$target";
	$Result=mysqli_query ($db, $Mysql);
	if ( $res = mysqli_fetch_array($Result) ) {
		if ( $res['m'] == 3 ) {
		/* già un legame di livello 3 con qualcuno.. non faccio nulla*/
			die();
		}
	}



	$Mysql="SELECT * from legami  WHERE domitor=$domitor AND target=$target";
	$Result=mysqli_query ($db, $Mysql);
	if ($res = mysqli_fetch_array($Result)) {

		$dataultima=$res['dataultima'];

		$tdataultima=strtotime($dataultima);
		$now=time();

		if ( $now-$tdataultima < 60*60*24 ) {
			/*troppo presto.. */
			die();
		}


		/* legame già presente */
		$oldlivello=$res['livello'];
		if ($oldlivello==1) {
			/* porto a 2 */
			$Mysql="UPDATE legami SET livello=2, dataultima=NOW() WHERE domitor=$domitor AND target=$target";
			$Result=mysqli_query ($db, $Mysql);
		} elseif ($oldlivello==2)  {
			/* porto a 3 e cancello gli altri */
			$Mysql="UPDATE legami SET livello=3, dataultima=NOW() WHERE domitor=$domitor AND target=$target";
			$Result=mysqli_query ($db, $Mysql);
			$Mysql="DELETE FROM legami  WHERE domitor!=$domitor AND target=$target";
			$Result=mysqli_query ($db, $Mysql);
		} else {
			/* già a 3: aggiorno la data */
			$Mysql="UPDATE legami SET  dataultima=NOW() WHERE domitor=$domitor AND target=$target";
			$Result=mysqli_query ($db, $Mysql);
		}
	} else {
		/* inserisco a 1  */
		$Mysql="INSERT INTO legami ( domitor, target, dataultima, livello) VALUES ($domitor, $target, NOW(), 1 )";
		$Result=mysqli_query ($db, $Mysql);
	}






?>
