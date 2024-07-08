<?
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

	
// header('Content-type: text/xml; charset="utf-8"');
// header('Content-Type: text/html; charset=utf-8');
	
include ('db2.inc.php');  //NEW MYSQL //


$id=$_GET['id'];
	
$userid=$_GET['userid'];
	
$MySql = "UPDATE utente SET registrationID='$id' WHERE idutente=$userid" ;
$Result = mysqli_query($db, $MySql);
	


?>
