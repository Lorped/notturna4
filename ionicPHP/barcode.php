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

	include ('db2.inc.php');    // NEW MYSQL //

	$idutente=$_GET['id'];
	if ($idutente=="") $idutente=0;

	$barcode=$_GET['barcode'];


	$Mysql="SELECT * FROM oggetti LEFT JOIN cond_oggetti ON oggetti.idoggetto = cond_oggetti.idoggetto WHERE barcode='$barcode' ORDER BY cond_oggetti.valcond ASC ";
	$Result=mysqli_query($db, $Mysql);
	if (mysqli_errno($db)) die ( mysqli_errno($db).": ".mysqli_error($db) ."+".$Mysql);


	$numrows = mysqli_num_rows($Result);

	$extra="";
	// $esterno=$res['fissomobile'];

	$ok = 0;
	while ( $res=mysqli_fetch_array($Result)) {

		$esterno=$res['fissomobile'];
		$nome=$res['nomeoggetto'];

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

			$Mysql2 = "SELECT ".$cc." FROM personaggio WHERE idutente ='$idutente' ";
			$Result2=mysqli_query($db,$Mysql2);
			if (mysqli_errno($db)) die ( mysqli_errno($db).": ".mysqli_error($db) ."+".$Mysql2);
			$res2=mysqli_fetch_array($Result2);
			if ( $res2[$cc]=='' ) {
				$Mysql2 = "SELECT ".$cc." FROM HUNTERpersonaggio WHERE idutente ='$idutente' ";
				$Result2=mysqli_query($db, $Mysql2);
				$res2=mysqli_fetch_array($Result2);
			}
			if ($res2[$cc] >= $res['valcond'] ) {
				$ok=1;
				if ($res['risp'] == '') {
					$extra=$extra." ".$res['descrX'];
				}
				if ($res['risp'] == 'S') {
					$extra_si=$extra_si." ".$res['descrX'];
				}
				if ($res['risp'] == 'N') {
					$extra_no=$extra_no." ".$res['descrX'];
				}

			}
//echo " cc =" .$cc. " valore = ". $res2[$cc] . "vs. " .$res['valcond'] . " OK = ".$ok ;
		}

		if ($res['tipocond'] == 'S' ){
			$ids=$res['tabcond'];
			$Mysql4="SELECT * FROM skill WHERE idskill = $ids AND idutente = '$idutente' ";
			$Result4=mysqli_query($db, $Mysql4);
			if (mysqli_errno($db)) die ( mysqli_errno($db).": ".mysqli_error($db) ."+".$Mysql4);

			if (mysqli_num_rows($Result4) !=0  ) {
				$res4=mysqli_fetch_array($Result4);
				if ($res4['livello'] >= $res['valcond'] ) {
					$ok=1;
					if ($res['risp'] == '') {
						$extra=$extra." ".$res['descrX'];
					}
					if ($res['risp'] == 'S') {
						$extra_si=$extra_si." ".$res['descrX'];
					}
					if ($res['risp'] == 'N') {
						$extra_no=$extra_no." ".$res['descrX'];
					}
				}
			}

//echo " skill =" .$ids. " valore = ". $res4['livello'] . "vs. " .$res['valcond'] . " OK = ".$ok ;
		}
		if ($res['tipocond'] == 'D' ){
			$ids=$res['tabcond'];
			$Mysql4="SELECT * FROM discipline WHERE iddisciplina = $ids AND idutente = '$idutente' ";
			$Result4=mysqli_query($db, $Mysql4);
			if (mysqli_errno($db)) die ( mysqli_errno($db).": ".mysqli_error($db) ."+".$Mysql4);

			if (mysqli_num_rows($Result4) !=0  ) {
				$res4=mysqli_fetch_array($Result4);
				if ($res4['livello'] >= $res['valcond'] ) {
					$ok=1;
					if ($res['risp'] == '') {
						$extra=$extra." ".$res['descrX'];
					}
					if ($res['risp'] == 'S') {
						$extra_si=$extra_si." ".$res['descrX'];
					}
					if ($res['risp'] == 'N') {
						$extra_no=$extra_no." ".$res['descrX'];
					}
				}
			}

//echo " disciplina =" .$ids. " valore = ". $res4['livello'] . "vs. " .$res['valcond'] . " OK = ".$ok ;
		}

		if ($res['tipocond'] == 'P' ){
			$ids=$res['tabcond'];
			$Mysql4="SELECT * FROM poteri WHERE idpotere = $ids AND idutente = '$idutente' ";
			$Result4=mysqli_query($db, $Mysql4);
			if (mysqli_errno($db)) die ( mysqli_errno($db).": ".mysqli_error($db) ."+".$Mysql4);

			if (mysqli_num_rows($Result4) !=0  ) {
				$ok=1;
				if ($res['risp'] == '') {
					$extra=$extra." ".$res['descrX'];
				}
				if ($res['risp'] == 'S') {
					$extra_si=$extra_si." ".$res['descrX'];
				}
				if ($res['risp'] == 'N') {
					$extra_no=$extra_no." ".$res['descrX'];
				}
			}
		}

		$domanda = [];
		if ( $res['ifdomanda'] == 1 ) {
			$domanda = [
				'Domanda' => $res['domanda'],
				'R1' => $res['r1'].' '.$extra_si,
				'R2' => $res['r2'].' '.$extra_no
	 		];
		}


		$esito=[];
		if ( $ok == 0 ) {
			if ( $res['descrizione']!="") {
				$esito[] = $res['nomeoggetto'];
				$esito[] = $res['descrizione'] ;
				
				if ( $res['ifdomanda'] == 1 ) {
				    $esito[] = $domanda;
				}
				
			} else {
				$esito[] = $res['nomeoggetto'];
				$esito[] = "- Nulla di speciale -";
				if ( $res['ifdomanda'] == 1 ) {
				    $esito[] = $domanda;
				}
			}
		} else {
			$esito[] = $res['nomeoggetto'];
			$esito[] = $res['descrizione'].'. '.$extra;
			
			if ( $res['ifdomanda'] == 1 ) {
				    $esito[] = $domanda;
			}
			
		}
		// $esito[] = $domanda;
		
		

	}



	if ( $esterno == 'E') {
		$Mysql="SELECT notemaster from personaggio WHERE idutente=$idutente";
		$Result=mysqli_query($db,$Mysql);
		$resx=mysqli_fetch_array($Result);
		$testo=$resx['notemaster'];
		$testo=mysqli_real_escape_string($db, $testo.date('d-m-Y H:i')." Visionato oggetto ".$nome).'\\n';
		$Mysql="UPDATE personaggio set notemaster = '$testo' WHERE idutente=$idutente";
		mysqli_query($db,$Mysql);


	}

	if ($numrows == 0){
		$esito=[];
		$esito[] = 'Attenzione';
		$esito[] = ' Oggetto non valido';

	}

	$output = json_encode ($esito, JSON_UNESCAPED_UNICODE);
    echo $output;


?>