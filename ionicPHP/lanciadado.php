<?

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


 header('Content-Type: text/html; charset=utf-8');


include ("db2.inc.php"); // NEW MYSQL //

  $postdata = file_get_contents("php://input");
  $request = json_decode($postdata);

  $idutente = $request->userid;



  $Mysql="SELECT nomepg FROM personaggio WHERE idutente=$idutente";
  if ( $res=mysqli_fetch_array(mysqli_query($db, $Mysql)) ) {
    $nomepg= mysqli_real_escape_string( $db, $res['nomepg'] );
  } else {
    $Mysql="SELECT nomepg FROM HUNTERpersonaggio WHERE idutente=$idutente";
    if ( $res=mysqli_fetch_array(mysqli_query($db, $Mysql)) ) {
      $nomepg= mysqli_real_escape_string($db,  $res['nomepg'] );
    } else {
      $nomepg="NARRAZIONE";
    }
  }



		$tiro=rand(1,5);
    if ( $idutente == 228 && $tiro == 5 ) {
      $tiro=rand(1,5);
    }
    if ( $idutente == 1 && $tiro == 1 ) {
      $tiro=rand(1,5);
    }
		$testo="tira ".$tiro;
		$Mysql="INSERT INTO dadi ( idutente, nomepg, Ora, Testo) VALUES ( $idutente, '$nomepg', NOW(), '$testo' ) ";
		mysqli_query($db, $Mysql);




?>
