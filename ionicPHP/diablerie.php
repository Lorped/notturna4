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



$diablerista=$_GET['diabl'];
$vittima=$_GET['vittima'];


  include ('db2.inc.php');  // NEW MYSQL //


		//controllo-aggiorno fdv

		$Mysql="SELECT * FROM personaggio WHERE idutente=$diablerista";
		$Result=mysqli_query ($db, $Mysql);
		$res=mysqli_fetch_array($Result);

    $oldbloodp=$res['bloodp'];
    $oldgen=$res['generazione'];
    $oldnote=$res['notemaster'];


    $Mysql="SELECT * FROM personaggio WHERE idutente=$vittima";
		$Result=mysqli_query ($db, $Mysql);
		$res=mysqli_fetch_array($Result);

		$bloodp=$res['bloodp'];
    $gen=$res['generazione'];
    $nomevittima=$res['nomepg'];

    $newgen = $oldgen;
    if ( $gen < $oldgen ) {
      $newgen= $gen +1 ;
    }
    if ( $gen == $oldgen-1 ) {
      $newgen = $gen;
    }

    $newbloodp=$oldbloodp;
    if ( $bloodp > $oldbloodp ) {
      $newbloodp = $bloodp;
    }

    $Mysql="SELECT * FROM generazione WHERE generazione=$newgen";
    $Result=mysqli_query($db, $Mysql);
    $res=mysqli_fetch_array($Result);

    if ( $newbloodp > $res['bloodpmax']   ) {
      $newbloodp = $res['bloodpmax'];
    }


    $Mysql="SELECT * from discipline
      WHERE livello != 0 and idutente=$vittima and iddisciplina != 98 and iddisciplina != 99 and iddisciplina !=19
      ORDER BY livello desc";

    $Result=mysqli_query($db, $Mysql);
    $res=mysqli_fetch_array($Result);

    $idd=$res['iddisciplina'];
    $lid=$res['livello'];


    if ( $idd != "") {

      $Mysql2="SELECT * from discipline
        LEFT JOIN discipline_main ON discipline.iddisciplina=discipline_main.iddisciplina
        WHERE discipline.iddisciplina=$idd and idutente=$diablerista";


      $Result2=mysqli_query($db,$Mysql2);
      $res2=mysqli_fetch_array($Result2);

      if ( $res2['livello']=="" || $res2['livello']==0  ) {

        $Mysql3= "INSERT INTO discipline  (iddisciplina,idutente,livello, DiClan)
          VALUES ($idd, $diablerista, 1 , 'S')";
        mysqli_query($db, $Mysql3);

        $txt="Acquisita disciplina ".$res2['nomedisc']." via diablerie";
        $Mysql3="INSERT INTO logpx (idutente, px, azione) values ($diablerista, 0, '$txt')";
        mysqli_query($db, $Mysql3);


      } else if ( $res2['livello'] < $lid ){
        $Mysql3= "UPDATE discipline SET livello=livello+1
          WHERE iddisciplina=$idd and idutente=$diablerista ";
        mysqli_query($db, $Mysql3);

        $txt="Incrementata disciplina ".$res2['nomedisc']." via diablerie";
        $Mysql3="INSERT INTO logpx (idutente, px, azione) values ($diablerista, 0, '$txt')";
        mysqli_query($db, $Mysql3);
      }
    }

    $Mysql3="UPDATE personaggio SET generazione=$newgen , bloodp=$newbloodp WHERE idutente=$diablerista";
    mysqli_query($db, $Mysql3);

    $txt="Diablerie -  BP: ".$newbloodp." Generazione: ".$newgen;
    $Mysql3="INSERT INTO logpx (idutente, px, azione) VALUES ($diablerista, 0, '$txt')";
    mysqli_query($db, $Mysql3);

    /*
    echo "<br>oldgen ".$oldgen;
    echo "<br>newgen ".$newgen;
    echo "<br>oldbloodp ".$oldbloodp;
    echo "<br>newbloodp ".$newbloodp;
    */

    $newnote=$oldnote.date('d-m-Y H:i')." eseguita diablerie su ".$nomevittima;

    $xnote=mysqli_real_escape_string($db, $newnote).'\\n';

    $Mysql3="UPDATE personaggio SET notemaster='$xnote'  WHERE idutente=$diablerista";
    mysqli_query($db, $Mysql3);

?>
