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


  $idutente=$_GET['id'];


    include ('db2.inc.php');  // NEW MYSQL //

    $out1 = [];

    $MySql = "SELECT discipline.iddisciplina, nomedisc FROM discipline
      left join discipline_main on discipline_main.iddisciplina=discipline.iddisciplina
          WHERE idutente = '$idutente'  AND livello >0
      ORDER BY nomedisc ASC";

    $Result = mysqli_query($db, $MySql);
    while ( $res = mysqli_fetch_array($Result)   ) {

      $curdisc= $res['iddisciplina'];
      $nomedisc= $res['nomedisc'];
      $out2 = [];

      $MySql2 = "SELECT nomepotere, attivo, livellopot from poteri
        LEFT JOIN poteri_main ON poteri.idpotere=poteri_main.idpotere
        WHERE idutente=$idutente and iddisciplina = $curdisc";

      $Result2 = mysqli_query($db, $MySql2);
      while ($res2=mysqli_fetch_array($Result2, MYSQLI_ASSOC)) {
        $out2 [] = $res2;
      }

      $out1 [] = [
        'nomedisc' => $nomedisc,
        'iddisciplina' => $curdisc ,
        'poteri'  => $out2
      ];

    }




    $output = json_encode ($out1, JSON_UNESCAPED_UNICODE);
    echo $output;

?>
