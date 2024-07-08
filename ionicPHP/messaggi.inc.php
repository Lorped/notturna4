<?php

function pushmsg ($fields) {

	$api_key = "AAAAxERgxJ4:APA91bGb0CqFmwPOIV1tN9BSOG7yucKmCpymJf0Pp1YRXlX3wIn8RlbYqMYjnDavyLP4-j9uSzVAlLwB0e7oYzwsaJa2H_yTE3LjzXL1UoOaf-EO00MewK9VyHbOeyvezg-2CTyRulba";
	$ch = curl_init('https://fcm.googleapis.com/fcm/send');

	// MODIFICA
	// $ch = curl_init('https://fcm.googleapis.com/v1/projects/notturna-93b8/messages:send') ;

	// Authorization: Bearer ya29.ElqKBGN2Ri_Uz...HnS_uNreA , 



	$headers = array (
		'Authorization: key=' . $api_key,
		'Content-Type: application/json'
	);

	$post=json_encode($fields, JSON_UNESCAPED_SLASHES);

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

	//die(print_r($response));

}


function user2master ( $idutente , $testo, $db ) {

	$Mysql="SELECT nomepg FROM personaggio WHERE idutente=$idutente";
	$Result=mysqli_query($db, $Mysql);
	if ( $res=mysqli_fetch_array($Result) ) {
		$nomepg=$res['nomepg'];
	} else {
		$Mysql="SELECT nomepg FROM HUNTERpersonaggio WHERE idutente=$idutente";
		$Result=mysqli_query($db, $Mysql);
		$res=mysqli_fetch_array($Result);
		$nomepg=$res['nomepg'];
	}




	$fields =  array(
		'to' => '/topics/master',
		'data'=> [
			'message'=> $testo ,
			'title'=> $nomepg,
			'image'=> 'icon',
			'soundname' => 'default',
			'priority' => 2
		]
	);
	pushmsg ($fields);
}


function master2master ( $testo ) {
	$fields =  array(
		'to' => '/topics/master',
		'data'=> [
			'message'=> $testo ,
			'title'=> 'NARRAZIONE',
			'image'=> 'icon',
			'soundname' => 'default',
			'priority' => 2
		]
	);
	pushmsg ($fields);
}

function master2user ( $idutente , $testo , $db) {

	$Mysql="SELECT registrationID FROM utente WHERE idutente=$idutente";
	$Result=mysqli_query($db, $Mysql);
	$res=mysqli_fetch_array($Result);

	if ($res['registrationID'] != "" ) {

		$fields= array(
			'to'=>$res['registrationID'],
			'data'=> [
				'message'=> $testo ,
				'title'=> 'NARRAZIONE',
				'image'=> 'icon',
				'soundname' => 'default',
				'priority' => 2
			]
		);

	} else {

		$fields= array(
			'to'=>'/topics/userid'.$idutente,
			'data'=> [
				'message'=> $testo ,
				'title'=> 'NARRAZIONE',
				'image'=> 'icon',
				'soundname' => 'default',
				'priority' => 2
			]
		);

	}

	pushmsg ($fields);
}












?>
