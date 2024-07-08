<?php

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

$version = $request->version;

if (isset($postdata) && $username != "" && $password !="" ) {

  include ('db2.inc.php');  // NEW MYSQL //

	// pulizia periodica
	$MM="DELETE FROM dadi WHERE DATE_ADD( Ora , INTERVAL 24 HOUR )<NOW()";
	mysqli_query($db, $MM);


  $MySql = "SELECT idutente FROM utente WHERE nome = '".addslashes($username)."' AND password = '".addslashes($password)."'";
  $Result = mysqli_query($db, $MySql);
  if ( $res = mysqli_fetch_array($Result)   ) {
    $idutente = $res['idutente'];

    if ( $version == "") {   // OLD - NO VERSION -> Vampire

      controlla_ps ( $idutente, $db) ;
      controlla_fdv ( $idutente, $db ) ;
      controlla_legami ($idutente, $db ) ;
      controlla_maesta ($idutente, $db ) ;

      $MySql = "SELECT *  FROM personaggio
            LEFT JOIN clan ON personaggio.idclan=clan.idclan
            LEFT JOIN statuscama ON personaggio.idstatus=statuscama.idstatus
            LEFT JOIN sentieri ON personaggio.idsentiero=sentieri.idsentiero
            LEFT JOIN generazione ON personaggio.generazione=generazione.generazione
            LEFT JOIN blood ON personaggio.bloodp=blood.bloodp
            WHERE idutente = '$idutente' ";

      $Result = mysqli_query($db, $MySql);
      if ( $res = mysqli_fetch_array($Result,MYSQLI_ASSOC)   ) {
        $output = json_encode($res);
        echo $output;
      } else {
          header("HTTP/1.1 404 Not Found");
      }

    } else {
      // NEW VERSION -> VAMP OR HUNTER

      $MySql = "SELECT COUNT(*) as c FROM personaggio WHERE idutente = '$idutente'";
      $Result = mysqli_query($db, $MySql);
      $res = mysqli_fetch_array($Result) ;
      $vamp = $res['c'];
      $MySql = "SELECT COUNT(*) as c FROM HUNTERpersonaggio WHERE idutente = '$idutente'";
      $Result = mysqli_query($db, $MySql);
      $res = mysqli_fetch_array($Result) ;
      $hunt = $res['c'];

      if ( $vamp == '1' ) { //VAMPIRO
        controlla_ps ( $idutente, $db ) ;
        controlla_fdv ( $idutente, $db ) ;
        controlla_legami ($idutente, $db ) ;
        controlla_maesta ($idutente, $db ) ;

        $MySql = "SELECT *  FROM personaggio
          LEFT JOIN clan ON personaggio.idclan=clan.idclan
          LEFT JOIN statuscama ON personaggio.idstatus=statuscama.idstatus
          LEFT JOIN sentieri ON personaggio.idsentiero=sentieri.idsentiero
          LEFT JOIN generazione ON personaggio.generazione=generazione.generazione
          LEFT JOIN blood ON personaggio.bloodp=blood.bloodp
          WHERE idutente = '$idutente' ";

        $Result = mysqli_query($db, $MySql);
        $res = mysqli_fetch_array($Result,MYSQLI_ASSOC);
        $out = array (
          'tipo' => "V" ,
          'res' => $res
        );
        $output = json_encode($out);
        echo $output;
      } elseif ( $hunt == '1') { //HUNTER
        controlla_fdv ( $idutente, $db ) ;
        $MySql = "SELECT *  FROM HUNTERpersonaggio
          LEFT JOIN HUNconspiracy ON HUNTERpersonaggio.idclan=HUNconspiracy.idconspiracy
          WHERE idutente = '$idutente' ";
        $Result = mysqli_query($db, $MySql);
        $res = mysqli_fetch_array($Result,MYSQLI_ASSOC);
        $out = array (
          'tipo' => "H" ,
          'res' => $res
        );
        $output = json_encode($out);
        echo $output;
      } else {
        header("HTTP/1.1 404 Not Found");
      }

    }

  } else {  // WRONG PWD
    header("HTTP/1.1 401 Unauthorized");
  }

} else { // NO post data (!!)
    header("HTTP/1.1 401 Unauthorized");
}


//  ================================  //

function controlla_fdv ( $idutente , $db ) {    //controllo-aggiorno fdv

  $Mysql="SELECT fdv,fdvmax,lastfdv FROM personaggio WHERE idutente=$idutente";
  $Result=mysqli_query ($db, $Mysql);
  $res=mysqli_fetch_array($Result);

  $fdv=$res['fdv'];
  $fdvmax=$res['fdvmax'];
  $lastfdv=$res['lastfdv'];

  if ( $fdv == $fdvmax ) {  // tutto ok
    $Mysql="UPDATE personaggio SET lastfdv=NOW()  WHERE idutente=$idutente";
    $Result=mysqli_query ($db, $Mysql);

  } else {
    $base=strtotime("2017-01-01 18:00:00");
    $qlastftv=strtotime($lastfdv);
    $now=time();

    $tramonti0=floor( ($qlastftv - $base)/( 24*60*60 )) ;
    $tramonti1=floor(($now - $base) / ( 24*60*60 ) );

    $difftramonti=$tramonti1-$tramonti0;

    if ( $difftramonti > 0 ) {
      $newfdv=$fdv+$difftramonti;
      if ($newfdv > $fdvmax)  {$newfdv=$fdvmax ;}

      $newlastfdv=$base + $tramonti1*( 24*60*60 )+1;

      $newlastfdvstring=date("Y-m-d H:i:s",$newlastfdv );

      $Mysql="UPDATE personaggio SET fdv = $newfdv , lastfdv = '$newlastfdvstring' WHERE idutente=$idutente";
      $Result=mysqli_query ($db, $Mysql);

    } else {
      // echo "<br>da quando ho controlato fdv non è passato un tramonto";
    }
  } // fine verifica se fdv < fdvmax
} // fine controllo fdv



function controlla_ps ( $idutente, $db ) {  //inizio test su ps

  $Mysql="SELECT PScorrenti, sete, addsete, lastps FROM personaggio
    LEFT JOIN statuscama ON personaggio.idstatus = statuscama.idstatus
    LEFT JOIN blood ON personaggio.bloodp = blood.bloodp
  WHERE idutente=$idutente";
  $Result=mysqli_query ($db, $Mysql);
  $res=mysqli_fetch_array($Result);

  $PScorrenti=$res['PScorrenti'];
  $setetot=$res['sete']+$res['addsete'];
  $lastps=$res['lastps'];

  if ( $PScorrenti == $setetot ) {  // tutto ok
    //
  } else {
    $now=time();
    $qlastps=strtotime($lastps);

    $diff =  ($now - $qlastps) / (24*60*60);

    if ( $diff > 1 ) {
      $newlastps=date("Y-m-d H:i:s",$now );
      $Mysql="UPDATE personaggio SET PScorrenti = $setetot , lastps = '$newlastps' WHERE idutente=$idutente";
      $Result=mysqli_query ($db, $Mysql);
    }
  }
}  //fine test su ps

function controlla_legami ($idutente, $db) {
  // legami
  $Mysql="DELETE FROM legami WHERE target = $idutente and livello = 1 and (DATE_ADD(dataultima, INTERVAL 75 DAY) < NOW())";
  $Result = mysqli_query($db, $Mysql);
  $Mysql="UPDATE legami SET livello=1 , dataultima=NOW() WHERE target = $idutente and livello = 2 and (DATE_ADD(dataultima, INTERVAL 165 DAY) < NOW())";
  $Result = mysqli_query($db, $Mysql);
  $Mysql="UPDATE legami SET livello=2 , dataultima=NOW() WHERE target = $idutente and livello = 3 and (DATE_ADD(dataultima, INTERVAL 315 DAY) < NOW())";
  $Result = mysqli_query($db, $Mysql);
}

function controlla_maesta ( $idutente, $db) {  //inizio test su ps

  $Mysql="SELECT nummaesta, lastmaesta, fdv FROM personaggio
  WHERE idutente=$idutente";
  $Result=mysqli_query ($db, $Mysql);
  $res=mysqli_fetch_array($Result);

  $nummaesta=$res['nummaesta'];
  $lastmaesta=$res['lastmaesta'];
  $fdv=$res['fdv'];

  if ( $nummaesta == $fdv ) {  // tutto ok
    //
  } else {
    $now=time();
    $qlastps=strtotime($lastmaesta);

    $diff =  ($now - $qlastps) / (24*60*60);

    if ( $diff > 1 ) {
      $newlastps=date("Y-m-d H:i:s",$now );
      $Mysql="UPDATE personaggio SET nummaesta =$fdv , lastmaesta = NOW() WHERE idutente=$idutente";
      $Result=mysqli_query ($db, $Mysql);
    }
  }
}  //fine test su ps

?>