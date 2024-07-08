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


	header('Content-Type: text/html; charset=utf-8');

	include ('db2.inc.php');   // NEW MYSQLI //

	$barcode=$_GET['barcode'];

	$Mysql="SELECT * FROM oggetti  WHERE barcode='$barcode'  ";
	$Result=mysqli_query($db,$Mysql);
	if (mysqli_errno($db)) die ( mysqli_errno($db).": ".mysqli_error($db) ."+".$Mysql);


	$out=[];

	$res=mysqli_fetch_array($Result,MYSQLI_ASSOC);
	$idx=$res['idoggetto'];



	$Mysql2="SELECT * FROM cond_oggetti WHERE idoggetto=$idx ORDER BY valcond ASC";
	$Result2=mysqli_query($db,$Mysql2);
	while ( $res2=mysqli_fetch_array($Result2,MYSQLI_ASSOC)) {
		if ($res2['tipocond'] == 'A' ){
			switch ( $res2['tabcond'] ) {
				case 1: $cc="Forza" ; break;
				case 2: $cc="Destrezza" ; break;
				case 3: $cc="Attutimento" ; break;
				case 4: $cc="Carisma" ; break;
				case 5: $cc="Persuasione" ; break;
				case 6: $cc="Saggezza" ; break;
				case 7: $cc="Percezione" ; break;
				case 8: $cc="Intelligenza" ; break;
				case 9: $cc="Prontezza" ; break;
			}
		}
		if ($res2['tipocond'] == 'S' ){
			$ids=$res2['tabcond'];
			$Mysql4="SELECT nomeskill FROM skill_main WHERE idskill = $ids";
			$Result4=mysqli_query($db,$Mysql4);
			$res4=mysqli_fetch_array($Result4);
			$cc = $res4['nomeskill'];
		}
		if ($res2['tipocond'] == 'D' ){
			$ids=$res2['tabcond'];
			$Mysql4="SELECT nomedisc FROM discipline_main WHERE iddisciplina = $ids";
			$Result4=mysqli_query($db,$Mysql4);
			$res4=mysqli_fetch_array($Result4);
			$cc = $res4['nomedisc'];
		}
		if ($res2['tipocond'] == 'P' ){
			$ids=$res2['tabcond'];
			$Mysql4="SELECT nomepotere FROM poteri_main WHERE idpotere = $ids";
			$Result4=mysqli_query($db,$Mysql4);
			$res4=mysqli_fetch_array($Result4);
			$cc = $res4['nomepotere'];
		}

		$esito[] = array ( "cc" => $cc , "con"=> $res2);
	}

	$newout = [
		"oggetto" => $res,
		"condizioni" => $esito
	];



	$output = json_encode ($newout, JSON_UNESCAPED_UNICODE);
    echo $output;


?>
