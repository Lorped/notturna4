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
 


$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$username = $request->username;
$password = $request->password;

//$username = "user";
//$password = "secret"; 


if (isset($postdata) && $username != "" && $password !="" ) {
    
	include ('db2.inc.php');  // NEW MYSQL //
	
	// pulizia periodica
	$MM="DELETE FROM dadi WHERE DATE_ADD( Ora , INTERVAL 24 HOUR )<NOW()";
	mysqli_query($db, $MM);	
	//
 
	$MySql = "SELECT idutente FROM utente WHERE nome = '".addslashes($username)."' AND password = '".addslashes($password)."' AND admin = 1 ";
	$Result = mysqli_query($db, $MySql);
	if ( $res = mysqli_fetch_array($Result,MYSQLI_ASSOC)   ) {
		$output = json_encode($res);
		echo $output;
	} else {    
    header("HTTP/1.1 401 Unauthorized");
	//echo "KO";
	} 
} else {
	header("HTTP/1.1 401 Unauthorized");
}

?>
