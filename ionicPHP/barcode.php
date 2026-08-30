<?php
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

	include ('messaggi.inc.php');
	require_once __DIR__ . '/db2.inc.php';    // NEW MYSQL //


	$idutente=$_GET['id'];
	if ($idutente=="" || $idutente == 0 ) {

		$out = [
			'nomeoggetto' => 'ATTENZIONE',
			'descrizione' => 'oggetto non definito',
			'esito' => [],
			'domanda' => null
		];
		$output = json_encode ($out, JSON_UNESCAPED_UNICODE);
    	echo $output;
		die();
	}
	

	$barcode=$_GET['barcode'];


	if ( $barcode == "999999999999" || $barcode == "999999999998" || $barcode == "999999999997" || $barcode == "999999999996" ) {


		$Mysql = "SELECT nomeplayer, xp , IDcronaca FROM personaggio WHERE idutente ='$idutente' ";
		$Result = mysqli_query($db, $Mysql);
		$res= mysqli_fetch_array($Result);

		$nome = $res['nomeplayer'];
		$xp = $res['xp'];
		$IDcronaca = $res['IDcronaca'];

		$Mysql = "SELECT * FROM segreteria WHERE idutente ='$idutente'  ";
		$Result = mysqli_query($db,$Mysql);
		if ( $res=mysqli_fetch_array($Result) ) {
			// esiste un record 

			$Mysql2 = "SELECT idutente, DATE_FORMAT( eventodata , '%d-%m-%Y alle  %H:%i' ) AS Ora  FROM segreteria WHERE idutente ='$idutente' AND date_add(eventodata, interval 12 HOUR) > now() ";
			$Result2 = mysqli_query($db,$Mysql2);

			if ($res2 = mysqli_fetch_array($Result2)) {
				$testo= $nome . " hai già effettuato la segreteria il " . $res2['Ora'];
				

				$out = [
					'nomeoggetto' => 'SEGRETERIA',
					'descrizione' => $testo,
					'esito' => [],
					'esitoSI' => [],
					'esitoNO' => [],
					'domanda' => null,
					'R1' => null,
					'R2' => null,
				];
				
				$output = json_encode ($out, JSON_UNESCAPED_UNICODE);
    			echo $output;
				die();

			} else {
		
				$testo='';		
				$testo = "Benvenuto a Notturna, ". $nome ;

				$saldo = $res['saldo'];

				if ( $saldo  == '0' ) {
	
					$testo = $testo . ". Verifica la tua situazione con la Narrazione e riprova.";
					$out = [
						'nomeoggetto' => 'SEGRETERIA',
						'descrizione' => $testo,
						'esito' => [],
						'esitoSI' => [],
						'esitoNO' => [],
						'domanda' => null,
						'R1' => null,
						'R2' => null,
					];
				
					$output = json_encode ($out, JSON_UNESCAPED_UNICODE);
					echo $output;
					die();
	
				} else {
					$num = $res ['eventi'];
	
					$num = $num + 1 ;
		
					$testo = $testo . ". Questo è il tuo evento numero ".$num . '.';

					$fc = 0;
					$check = (int)$barcode + (int)$IDcronaca;
					if ( $check != 1000000000000 ) {
						$fc = 1;
						$testo = "Sei un ospite in una cronaca diversa dalla tua. Grazie per essere qui!";
					} else {
						$testo = $testo . " Hai ". ($xp+1) . " eventi validi per la progressione.";
						$Mysql = "UPDATE personaggio SET xp = xp +1 WHERE idutente = '$idutente'";
						mysqli_query($db, $Mysql);
					}

					// AGGIORNO TABELLA !!! //
					$Mysql = "UPDATE segreteria set  eventi = eventi +1 , eventodata = NOW() , saldo = 0 WHERE idutente = '$idutente' ";
					mysqli_query($db, $Mysql);

					$date = new DateTime();
					$log =  "Segreteria ev. " . $date->format('d-m-Y') ;

					if ( $fc == 1 ) { 
						$log = $log . " (ospite)";
					}
					
					$Mysql = "INSERT INTO logpx (idutente, px, Azione ) VALUES ('$idutente', 0 , '$log' ) ";
					mysqli_query($db, $Mysql);
					
					$testo= $testo . " Segreteria effettuata, lunga notte!";
				}

			}

			$out = [
				'nomeoggetto' => 'SEGRETERIA',
				'descrizione' => $testo,
				'esito' => [],
				'esitoSI' => [],
				'esitoNO' => [],
				'domanda' => null,
				'R1' => null,
				'R2' => null,
			];		


			$output = json_encode ($out, JSON_UNESCAPED_UNICODE);
			echo $output;
			die();

		} else {
		
			$out = [
				'nomeoggetto' => 'SEGRETERIA',
				'descrizione' => 'Errore: non esiste un record di segreteria per questo utente',
				'esito' => [],
				'esitoSI' => [],
				'esitoNO' => [],
				'domanda' => null,
				'R1' => null,
				'R2' => null,
			];
			$output = json_encode ($out, JSON_UNESCAPED_UNICODE);
			echo $output;
			die();		

		}

	}

	// OGGETTO NORMALE //

	$condizioni = [];
	$nomeoggetto= '';
	$descrizione='';
	$esito = [];

	//verifica PARIRED //

	$Mysql8="SELECT * FROM oggetti WHERE barcode='$barcode' ";
	$Result8=mysqli_query($db, $Mysql8);

	$res8=mysqli_fetch_array($Result8);

	if ( mysqli_num_rows($Result8) == 0 ) {
		$out = [
			'nomeoggetto' => 'ATTENZIONE',
			'descrizione' => 'Oggetto non definito',
			'esito' => [],
			'esitoSI' => [],
			'esitoNO' => [],
			'domanda' => null,
			'R1' => null,
			'R2' => null,
		];
		$output = json_encode ($out, JSON_UNESCAPED_UNICODE);
		echo $output;
		die();
	}




	$idx=$res8['idoggetto'];
	$nomeoggetto=$res8['nomeoggetto'];
	$descrizione=$res8['descrizione'];
	$domanda=$res8['domanda'];
	$ifdomanda=$res8['ifdomanda'];
	$R1=$res8['r1'];
	$R2=$res8['r2'];

	$Mysql9="SELECT * FROM paired WHERE idoggetto1 = '$idx' or idoggetto2 = '$idx' ";
	$Result9=mysqli_query($db, $Mysql9);
	if ( $res9=mysqli_fetch_array($Result9) ) { // esiste un oggetto gemello

		//inserisco il log di questo oggetto e cancello i log più vecchi di 2 ore
		$MySql3 = "DELETE FROM `logscan` WHERE IDoggetto = $idx AND IDutente = $idutente ";
	  	$Result3 = mysqli_query($db, $MySql3);
      	$MySql3 = "INSERT INTO logscan (IDoggetto, IDutente ) VALUES ($idx, $idutente ) ";
      	$Result3 = mysqli_query($db, $MySql3);
		$MySql3 = "DELETE FROM `logscan` WHERE DATE_ADD(logscan.data, INTERVAL 120 MINUTE ) < NOW() ";
	  	$Result3 = mysqli_query($db, $MySql3);


		if ($res9['IDoggetto1'] == $idx ) {	
			$newoggetto=$res9['IDoggetto2'];
		} else {
			$newoggetto=$res9['IDoggetto1'];
		}
		// newoggetto è stato scansionato da poco ?
		$MySql6 = "SELECT * FROM logscan WHERE
        	IDoggetto = $newoggetto AND IDutente = $idutente AND DATE_ADD(logscan.data, INTERVAL 3 MINUTE) > NOW() ";
      	$Result6 = mysqli_query($db, $MySql6);
      	if ( $res6 = mysqli_fetch_array($Result6) ) {
        	// ok paired
			$descpaired = $res9['Paired'];

			$Mysql10="SELECT * FROM oggetti WHERE idoggetto='$newoggetto' ";
			$Result10=mysqli_query($db, $Mysql10);
			$res10=mysqli_fetch_array($Result10);
			$messaggio = "ha scansionato oggetto ". $res8['nomeoggetto'] ." e il suo gemello ". $res10['nomeoggetto'] .".";
		

			user2master($idutente,$messaggio, $db );

			$Mysql11="SELECT nomepg FROM personaggio WHERE idutente=$idutente";
			if ( $res11=mysqli_fetch_array(mysqli_query($db, $Mysql11)) ) {
					$nomepg=$res11['nomepg'];
				} else {
					$nomepg="NARRAZIONE";
			}
			$xnomepg=mysqli_real_escape_string($db, $nomepg);
			$xmessaggio=mysqli_real_escape_string($db, $messaggio );

			$Mysql12="INSERT INTO dadi ( idutente, nomepg, Ora, Testo, Destinatario) VALUES ( $idutente, '$xnomepg', NOW(), '$xmessaggio' , 0) ";
			mysqli_query($db, $Mysql12);

			$rigarisp = [
				'motivo' => 'Accoppiamento '.$res8['nomeoggetto'] . " + " . $res10['nomeoggetto']	,
				'descrizione' => $descpaired,
				'sino' => ''
			];
			$esito[] = $rigarisp;

		}
	}



	

	$Mysql="SELECT tipocond, tabcond, valcond, descrX, risp, subskill  FROM oggetti LEFT JOIN cond_oggetti ON oggetti.idoggetto = cond_oggetti.idoggetto WHERE barcode='$barcode' ORDER BY cond_oggetti.valcond ASC ";
	$Result=mysqli_query($db, $Mysql);
	if (mysqli_errno($db)) die ( mysqli_errno($db).": ".mysqli_error($db) ."+".$Mysql);

	while ( $res=mysqli_fetch_array($Result)) {
		$condizioni[]=$res;
	}




	foreach ($condizioni as $cond) {

		//condizioni su attributi

		if ($cond['tipocond'] == 'A' ){
			switch ( $cond['tabcond'] ) {
				case 1: $cc="forza" ; break;
				case 2: $cc="destrezza" ; break;
				case 3: $cc="attutimento" ; break;
				case 4: $cc="carisma" ; break;
				case 5: $cc="persuasione" ; break;
				case 6: $cc="saggezza" ; break;
				case 7: $cc="percezione" ; break;
				case 8: $cc="intelligenza" ; break;
				case 9: $cc="prontezza" ; break;
			}

			$Mysql2 = "SELECT ".$cc." FROM personaggio WHERE idutente ='$idutente' ";
			$Result2=mysqli_query($db,$Mysql2);
			$res2=mysqli_fetch_array($Result2);
			
			if ( $res2[$cc] >= $cond['valcond'] ) {

				$rigarisp = [
					'motivo' => ucfirst($cc),
					'descrizione' => $cond['descrX'],
					'sino' => $cond['risp']
				];
				$esito[] = $rigarisp;	

			} 
		}
				

		// CONTROLLO DISCIPLINE

		if ($cond['tipocond'] == 'D' ){
			$ids=$cond['tabcond'];
			$Mysql4="SELECT * FROM discipline left join discipline_main on discipline_main.iddisciplina=discipline.iddisciplina
				WHERE discipline.iddisciplina = $ids AND idutente = '$idutente' ";
			$Result4=mysqli_query($db, $Mysql4);

			if ( $res4=mysqli_fetch_array($Result4)  ) {		
				if ($res4['livello'] >= $cond['valcond'] ) {
					$rigarisp = [
						'motivo' => $res4['nomedisc'],
						'descrizione' => $cond['descrX'],
						'sino' => $cond['risp']
					];
					$esito[] = $rigarisp;	
				}
			}
		}

		// POTERI

		if ($cond['tipocond'] == 'P' ){
			$ids=$cond['tabcond'];
			$Mysql4="SELECT * FROM poteri left join poteri_main on poteri_main.idpotere=poteri.idpotere
				WHERE poteri.idpotere = $ids AND idutente = '$idutente' ";
			$Result4=mysqli_query($db, $Mysql4);

			if ( $res4=mysqli_fetch_array($Result4)  ) {
				
				$rigarisp = [
					'motivo' => $res4['nomepotere'],
					'descrizione' => $cond['descrX'],
					'sino' => $cond['risp']
				];
				$esito[] = $rigarisp;	

			}
		}

		// SKILL GENERICI

		if ($cond['tipocond'] == 'X' ){
			$ids=$cond['tabcond'];
			$Mysql4="SELECT * FROM skill left join skill_main on skill_main.idskill=skill.idskill
				WHERE skill.idskill = $ids AND idutente = '$idutente' ";
			$Result4=mysqli_query($db, $Mysql4);


			if ( $res4=mysqli_fetch_array($Result4)  ) {
				
				$rigarisp = [
					'motivo' => $res4['nomeskill'],
					'descrizione' => $cond['descrX'],
					'sino' => $cond['risp']
				];
				$esito[] = $rigarisp;	

			}
		}

	}


	// INIZIO SKILL  SPECIFICI


	foreach ($condizioni as $cond) {

		if ($cond['tipocond'] == 'S' ){

		//print_r($cond); 
		//echo "<br><br>";

			$ids=$cond['tabcond'];

			$Mysql4="SELECT * FROM skill left join skill_main on skill_main.idskill=skill.idskill
				WHERE skill_main.idskill = $ids AND idutente = '$idutente' ";
			$Result4=mysqli_query($db, $Mysql4);


			if ( $res4=mysqli_fetch_array($Result4)  ) {
				// HO UN SKILL GENERICO confermato. ESISTE UNA CONDIZIONE Su SKILL SPECIFICO ?
				$esistesoecifico=false;
				for ( $i=0; $i< count($condizioni); $i++ ) {
					
					if ( $condizioni[$i]['tipocond'] == 'SS' && $condizioni[$i]['subskill'] == $ids ) {

						$specifica = $condizioni[$i]['tabcond'];

						$mysql5="SELECT * FROM skill_main 
							left join skill on skill_main.idskill = skill.idskill
							WHERE skill_main.idskill =  $specifica  AND idutente = '$idutente' ";

						$Result5=mysqli_query($db, $mysql5);

						if ( $res5=mysqli_fetch_array($Result5)  ) {
							$esistesoecifico=true;

							// c'è una condizione su skill specifico verificato?
							if ( $res5['livello'] >= $condizioni[$i]['valcond'] ) {
								$rigarisp = [
									'motivo' => $res5['nomeskill'],
									'descrizione' => $condizioni[$i]['descrX'],
									'sino' => $cond['risp']
								];
								$esito[] = $rigarisp;										
							} else {
								// allora inserisco solo il generico perchè ho lo skill specifico troppo basso
								$rigarisp = [
									'motivo' => $res4['nomeskill'],
									'descrizione' => $cond['descrX'],
									'sino' => $cond['risp']
								];
								$esito[] = $rigarisp;	
							}
						} else {
							$esistesoecifico=true;
							// allora inserisco solo il generico perchè non ho lo skill specifico
							$rigarisp = [
								'motivo' => $res4['nomeskill'],
								'descrizione' => $cond['descrX'],
								'sino' => $cond['risp']
							];
							$esito[] = $rigarisp;
						}
					}
				}
				//se alla fine non esiste uno skill specifico verificato allora inserisco il generico
				if ( $esistesoecifico == false ) {
					$rigarisp = [
						'motivo' => $res4['nomeskill'],
						'descrizione' => $cond['descrX'],
						'sino' => $cond['risp']
					];
					$esito[] = $rigarisp;	
				}								

			}
		}
	}


	$esitoSI = [];
	$esitoNO = [];

	foreach ($esito as $riga) {
		if ($riga['sino'] === 'S') {
			$esitoSI[] = $riga;
		} elseif ($riga['sino'] === 'N') {
			$esitoNO[] = $riga;
		}
	}
	$esito = array_values(array_filter($esito, function($riga) {
		return $riga['sino'] !== 'S' && $riga['sino'] !== 'N';
	}));


	$mysql = "SELECT * FROM logscanogg WHERE idutente = '$idutente' AND idoggetto = '$idx' ";
	$result = mysqli_query($db, $mysql);
	if (mysqli_num_rows($result) == 0) {
		$mysql2 = "INSERT INTO logscanogg  (idutente, idoggetto)
			VALUES ('$idutente', '$idx') ";
		mysqli_query($db, $mysql2);
		foreach ($esito as $riga) {
			$mot = mysqli_real_escape_string($db, $riga['motivo']);
			$descr=mysqli_real_escape_string($db, $riga['descrizione']);
			$mysql3 = "INSERT INTO logscanfull  (idutente, idoggetto, motivo, descrizione)
				VALUES ('$idutente', '$idx', '$mot', '$descr') ";
			mysqli_query($db, $mysql3);

		}
	} else {
		// Cancello i logscanfull esistenti per questo oggetto e li reinserisco
		$newaccoppiamento = false;
		foreach ($esito as $riga) {
			if ( str_starts_with($riga['motivo'], 'Accoppiamento') ) {
				$newaccoppiamento = true;
			}	
		}
		if ( $newaccoppiamento ) { // cancello anche l'accoppiamento precedente se esiste
			$mysql4 = "DELETE FROM logscanfull WHERE idutente = '$idutente' AND idoggetto = '$idx'  ";
		} else {
			$mysql4 = "DELETE FROM logscanfull WHERE idutente = '$idutente' AND idoggetto = '$idx' and motivo not like 'Accoppiamento%' ";
		}
		mysqli_query($db, $mysql4);
		foreach ($esito as $riga) {
			$mot = mysqli_real_escape_string($db, $riga['motivo']);
			$descr=mysqli_real_escape_string($db, $riga['descrizione']);
			$mysql3 = "INSERT INTO logscanfull  (idutente, idoggetto, motivo, descrizione)
				VALUES ('$idutente', '$idx', '$mot', '$descr') ";
			mysqli_query($db, $mysql3);
		}
	}



	$out = [
		'nomeoggetto' => $nomeoggetto,
		'descrizione' => $descrizione,
		'esito' => $esito,
		'esitoSI' => $esitoSI,
		'esitoNO' => $esitoNO,
		'domanda' => $domanda,
		'R1' => $R1,
		'R2' => $R2,
	];

	header("HTTP/1.1 200 OK");
	$output = json_encode ($out, JSON_UNESCAPED_UNICODE);
    echo $output;


?>