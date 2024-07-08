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

  $outtaum = [];

  $MySql = "SELECT * FROM taumaturgie
    left join taumaturgie_main on taumaturgie_main.idtaum=taumaturgie.idtaum
    WHERE idutente = '$idutente'
    ORDER BY principale ASC";

  $Result = mysqli_query($db, $MySql);
  while ( $res = mysqli_fetch_array($Result)   ) {

    $curtaum= $res['idtaum'];
    $nometaum= $res['nometaum'];
    $livello= $res['livello'];
    $out2 = [];

    $MySql2 = "SELECT * from taumaturgie2
      WHERE idtaum=$curtaum and livello=0";
    $Result2 = mysqli_query($db, $MySql2);

    if ( ! $res2=mysqli_fetch_array($Result2) ) {

      $MySql3 = "SELECT * from taumaturgie2
        WHERE idtaum=$curtaum and livello <= $livello";

      $Result3 = mysqli_query($db, $MySql3);
      while ($res3=mysqli_fetch_array($Result3, MYSQLI_ASSOC)) {
        $out2 [] = $res3;
      }

    } else {

      if (  $livello <5) {
        $out2 [] = [
          'idtaum2' => $res2['idtaum2'],
          'idtaum' => $res2['idtaum'],
          'livello' => $livello,
          'nometaum2' => $res2['nometaum2']
        ];
      }
      if ( $livello == 5) {
        $out2 [] = [
          'idtaum2' => $res2['idtaum2'],
          'idtaum' => $res2['idtaum'],
          'livello' => 4,
          'nometaum2' => $res2['nometaum2']
        ];
        $out2 [] = [
          'idtaum2' => $res2['idtaum2'],
          'idtaum' => $res2['idtaum'],
          'livello' => 5,
          'nometaum2' => $res2['nometaum2']
        ];
      }
    }

    $outtaum [] = [
      'nometaum' => $nometaum,
      'xlivello' => $livello ,
      'poteri'  => $out2
    ];

  }

  $outnecro = [];

  $MySql = "SELECT * FROM necromanzie
    left join necromanzie_main on necromanzie_main.idnecro=necromanzie.idnecro
    WHERE idutente = '$idutente'
    ORDER BY principale ASC";

  $Result = mysqli_query($db, $MySql);
  while ( $res = mysqli_fetch_array($Result)   ) {

    $curnecro= $res['idnecro'];
    $nomenecro= $res['nomenecro'];
    $livello= $res['livello'];
    $out2 = [];


    $MySql3 = "SELECT * from necromanzie2
        WHERE idnecro=$curnecro and livello <= $livello";

    $Result3 = mysqli_query($db, $MySql3);
    while ($res3=mysqli_fetch_array($Result3, MYSQLI_ASSOC)) {
      $out2 [] = $res3;
    }



    $outnecro [] = [
      'nomenecro' => $nomenecro,
      'xlivello' => $livello ,
      'poteri'  => $out2
    ];

  }

  $outx [] = [
    'taum' => $outtaum,
    'necro' => $outnecro
  ];



    $output = json_encode ($outx, JSON_UNESCAPED_UNICODE);
    echo $output;

?>
