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


	$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
	

	require_once __DIR__ . '/db2.inc.php';  // NEW MYSQL //

 	$out = [];
	
	
	if ($id !== false && $id !== null && $id > 0) {
        $mysql = "SELECT forza, destrezza, attutimento, carisma, persuasione,
            saggezza, percezione, intelligenza, prontezza
            FROM personaggio WHERE idutente = " . (int) $id;
        $result = mysqli_query($db, $mysql);
        $livelli = mysqli_fetch_assoc($result);
        $attributi = [
            'forza' => 'Forza',
            'destrezza' => 'Destrezza',
            'attutimento' => 'Attutimento',
            'carisma' => 'Carisma',
            'persuasione' => 'Persuasione',
            'saggezza' => 'Saggezza',
            'percezione' => 'Percezione',
            'intelligenza' => 'Intelligenza',
            'prontezza' => 'Prontezza'
        ];
        $bonusPerAttributo = array_fill_keys(array_keys($attributi), []);

        if ($livelli) {
            $condizioni = [];
            foreach (array_keys($attributi) as $nome) {
                $condizioni[] = "(nomeattr = '$nome' AND livelloattr <= " . (int) $livelli[$nome] . ')';
            }

            $mysql = 'SELECT nomeattr, livelloattr, bonus FROM focusattr WHERE ' . implode(' OR ', $condizioni);
            $result = mysqli_query($db, $mysql);
            while ($res = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
                $bonusPerAttributo[$res['nomeattr']][] = $res;
            }
        }

        foreach ($attributi as $nome => $etichetta) {
            $out[] = [
                'attr' => $etichetta,
                'bonus' => $bonusPerAttributo[$nome]
            ];
        }
	}

	$output = json_encode ($out, JSON_UNESCAPED_UNICODE);

	echo $output;
	

?>
