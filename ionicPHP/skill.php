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


  //http://stackoverflow.com/questions/15485354/angular-http-post-to-php-and-undefined

header('Content-Type: text/html; charset=utf-8');

  $postdata = file_get_contents("php://input");
  $request = json_decode($postdata);

  $userid = $request->userid;

//$userid=1;

  if (isset($postdata)  ) {

    include ('db2.inc.php');  // NEW MYSQL //

    $out1 = [];

    $MySql = "SELECT nomeskill,livello,tipologia  FROM skill
          LEFT JOIN skill_main ON skill_main.idskill=skill.idskill
          WHERE idutente = '$userid' ";



    $Result = mysqli_query($db, $MySql);
    while ( $res = mysqli_fetch_array($Result,MYSQLI_ASSOC)   ) {
      //print_r ($res);

      $out1[] =  $res;
    }


    $MySql = "SELECT  nomedisc as nomeskill  ,livello,tipologia  FROM discipline
          LEFT JOIN discipline_main ON discipline_main.iddisciplina=discipline.iddisciplina
          WHERE idutente = '$userid'
          ORDER BY discipline.iddisciplina";

    $Result = mysqli_query($db, $MySql);
    while ( $res = mysqli_fetch_array($Result,MYSQLI_ASSOC)   ) {

      $out1[] =  $res;
    }

    $MySql = "SELECT  nomedisc as nomeskill  ,livello,tipologia  FROM HUNdiscipline
          LEFT JOIN HUNdiscipline_main ON HUNdiscipline_main.iddisciplina=HUNdiscipline.iddisciplina  
          WHERE idutente = '$userid'
          ORDER BY HUNdiscipline.iddisciplina";

    $Result = mysqli_query($db, $MySql);
    while ( $res = mysqli_fetch_array($Result,MYSQLI_ASSOC)   ) {

      $out1[] =  $res;
    }




   $MySql = "SELECT  nometaum as nomeskill  ,livello,tipologia  FROM taumaturgie
          LEFT JOIN taumaturgie_main ON taumaturgie_main.idtaum=taumaturgie.idtaum
          WHERE idutente = '$userid' ORDER BY livello DESC";

    $Result = mysqli_query($db, $MySql);
    while ( $res = mysqli_fetch_array($Result,MYSQLI_ASSOC)   ) {

      $out1[] =  $res;
    }

		$MySql = "SELECT  nomenecro as nomeskill  ,livello,tipologia  FROM necromanzie
          LEFT JOIN necromanzie_main ON necromanzie_main.idnecro=necromanzie.idnecro
          WHERE idutente = '$userid' ORDER BY livello DESC ";

    $Result = mysqli_query($db, $MySql);
    while ( $res = mysqli_fetch_array($Result,MYSQLI_ASSOC)   ) {

      $out1[] =  $res;
    }

    $MySql = "SELECT  nomeback as nomeskill  ,livello,tipologia  FROM background
          LEFT JOIN background_main ON background_main.idback=background.idback
          WHERE idutente = '$userid'
          ORDER BY background.idback";

    $Result = mysqli_query($db, $MySql);
    while ( $res = mysqli_fetch_array($Result,MYSQLI_ASSOC)   ) {

      $out1[] =  $res;
    }

    $MySql = "SELECT  nomecontatto as nomeskill  ,livello,tipologia  FROM contatti
          WHERE idutente = '$userid'
          ORDER BY livello DESC";

    $Result = mysqli_query($db, $MySql);
    while ( $res = mysqli_fetch_array($Result,MYSQLI_ASSOC)   ) {

      $out1[] =  $res;
    }

    $MySql = "SELECT  nomepregio as nomeskill  ,valore as livello,tipologia  FROM pregidifetti
      LEFT JOIN pregidifetti_main ON pregidifetti_main.idpregio=pregidifetti.idpregio
          WHERE idutente = '$userid' ";

    $Result = mysqli_query($db, $MySql);
    while ( $res = mysqli_fetch_array($Result,MYSQLI_ASSOC)   ) {

      $out1[] =  $res;
    }

    $MySql = "SELECT  nomerituale as nomeskill  ,livello,tipologia  FROM rituali_t
      LEFT JOIN rituali_t_main ON rituali_t_main.idrituale=rituali_t.idrituale
               WHERE idutente = '$userid' ";

    $Result = mysqli_query($db, $MySql);
    while ( $res = mysqli_fetch_array($Result,MYSQLI_ASSOC)   ) {

      $out1[] =  $res;
    }
     $MySql = "SELECT  nomerituale as nomeskill  ,livello,tipologia  FROM rituali_n
      LEFT JOIN rituali_n_main ON rituali_n_main.idrituale=rituali_n.idrituale
               WHERE idutente = '$userid' ";

    $Result = mysqli_query($db, $MySql);
    while ( $res = mysqli_fetch_array($Result,MYSQLI_ASSOC)   ) {

      $out1[] =  $res;
    }


    $output = json_encode ($out1, JSON_UNESCAPED_UNICODE);
    echo $output;




  } else {
       header("HTTP/1.1 401 Unauthorized");
      echo "-1";
}
?>
