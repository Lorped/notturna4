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


	include ('db2.inc.php');   //NEW MYSQL //



$postdata = file_get_contents("php://input");
$request = json_decode($postdata);



$idcondizione = $request->idcondizione;
$tabcond = $request->tabcond;
$valcond = $request->valcond;
$descrX = mysqli_real_escape_string($db, $request->descrX);




// inizio output XML




	$MySql = "UPDATE cond_oggetti SET tabcond=$tabcond , valcond=$valcond , descrX='$descrX' WHERE idcondizione=$idcondizione  ";
	$Result = mysqli_query($db, $MySql);
	if (mysqli_errno($db)) die ( mysqli_errno($db).": ".mysqli_error($db)."+". $Mysql );


?>
