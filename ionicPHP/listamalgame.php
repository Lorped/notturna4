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

   $out = [];

   $MySql = "SELECT * FROM amalgame
    LEFT JOIN amalgame_main on amalgame.idamalgama = amalgame_main.idamalgama
    WHERE idutente = '$idutente'  ";
  
  $Result = mysqli_query($db, $MySql);
  
  $amalgame = [];
  
  while ( $res = mysqli_fetch_array ($Result) ) {
  
    $iddisc1 = $res['iddisc1'];
    $iddisc2 = $res['iddisc2'];
    $lvldisc1 = $res['lvldisc1'];
    $lvldisc2 = $res['lvldisc2'];
  
    $mysql2 = "SELECT nomedisc from discipline_main where iddisciplina = '$iddisc1' ";
    $result2 = mysqli_query($db, $mysql2);
    $res2 = mysqli_fetch_array ($result2);
    $nomedisc1 = $res2['nomedisc'];
          
    $mysql2 = "SELECT nomedisc from discipline_main where iddisciplina = '$iddisc2' ";
    $result2 = mysqli_query($db, $mysql2);
    $res2 = mysqli_fetch_array ($result2);
    $nomedisc2 = $res2['nomedisc'];
  
  
  
    $amalgame [] = [
      'idamalgama' => $res['idamalgama'],
      'nomeamalgama' => $res['nomeamalgama'],
      'disc1' => $nomedisc1,
      'lvldisc1' => $res['lvldisc1'],
      'disc2' => $nomedisc2,
      'lvldisc2' => $res['lvldisc2'],
      'ps' => $res['ps'],
      'fdv' => $res['fdv'],
      ];
  }
  
  $out = [
    'amalgame' => $amalgame
  ];




    $output = json_encode ($out, JSON_UNESCAPED_UNICODE);
    echo $output;

?>
