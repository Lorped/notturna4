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

	include ('db2.inc.php');   // NEW MYSQL //

	$barcode=$_GET['barcode'];

	$Mysql="SELECT * FROM oggetti LEFT JOIN cond_oggetti ON oggetti.idoggetto = cond_oggetti.idoggetto WHERE barcode='$barcode' ORDER BY descrX ASC ,cond_oggetti.valcond ASC ";
	$Result=mysqli_query($db, $Mysql);
	if (mysqli_errno($db)) die ( mysqli_errno($db).": ".mysqli_error($db) ."+".$Mysql);


	$esito=[];


	$ok = 0;
	while ( $res=mysqli_fetch_array($Result)) {

		if ($ok==0) {
			$esito[] = array ( "tipo" => 0 , "desc"=> $res['nomeoggetto']);
			$esito[] = array ( "tipo" => 1 , "desc" => $res['descrizione']);

			$ok=1;
		}

		if ($res['tipocond'] == 'A' ){
			switch ( $res['tabcond'] ) {
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

			if ($res['descrX'] != "" ) {
				$esito[] = array ( "tipo"=> 2 , "desc" => $cc." ".$res['valcond'] , "descX" => $res['descrX'] );
			} else {
				$esito[] = array ( "tipo"=> 3 , "desc" => $cc." ".$res['valcond']  );
			}
		}

		if ($res['tipocond'] == 'S' ){

			$ids=$res['tabcond'];
			$Mysql4="SELECT nomeskill FROM skill_main WHERE idskill = $ids";
			$Result4=mysqli_query($db, $Mysql4);
			$res4=mysqli_fetch_array($Result4);

			if ($res['descrX'] != "" ) {
				$esito[] = array ( "tipo"=> 2  , "desc" => $res4['nomeskill']." ".$res['valcond']  , "descX" => $res['descrX'] );
			} else {
				$esito[] = array (  "tipo"=> 3 , "desc" => $res4['nomeskill']." ".$res['valcond']);
			}

		}
		if ($res['tipocond'] == 'D' ){
			$ids=$res['tabcond'];
			$Mysql4="SELECT nomedisc FROM discipline_main WHERE iddisciplina = $ids";
			$Result4=mysqli_query($db, $Mysql4);
			if (mysqli_errno($db)) die ( mysqli_errno($db).": ".mysqli_error($db) ."+".$Mysql4);
			$res4=mysqli_fetch_array($Result4);

			if ($res['descrX'] != "" ) {
				$esito[] = array ( "tipo"=> 2  , "desc" => $res4['nomedisc']." ".$res['valcond'] , "descX" => $res['descrX']  );
			} else {
				$esito[] = array ( "tipo"=> 3 , "desc" => $res4['nomeskill']." ".$res['valcond']  );
			}


		}

		if ($res['tipocond'] == 'P' ){
			$ids=$res['tabcond'];
			$Mysql4="SELECT * FROM poteri_main
			LEFT JOIN discipline_main on discipline_main.iddisciplina=poteri_main.iddisciplina
			WHERE idpotere = $ids";
			$Result4=mysqli_query($db,$Mysql4);
			if (mysqli_errno($db)) die ( mysqli_errno($db).": ".mysqli_error($db) ."+".$Mysql4);
			$res4=mysqli_fetch_array($Result4);

			if ($res['descrX'] != "" ) {
				$esito[] = array ( "tipo"=> 2  , "desc" => $res4['nomedisc'].'.'.$res4['livellopot'].' '.$res4['nomepotere'] , "descX" => $res['descrX']  );
			} else {
				$esito[] = array ( "tipo"=> 3 , "desc" => $res4['nomedisc'].'.'.$res4['livellopot'].' '.$res4['nomepotere'] );
			}


		}


	}


	$output = json_encode ($esito, JSON_UNESCAPED_UNICODE);
    echo $output;


?>
