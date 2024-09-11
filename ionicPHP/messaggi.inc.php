<?php

include "get_access_token.php";



function pushmsg ($data) {

	$url = "https://fcm.googleapis.com/v1/projects/notturna-93b8f/messages:send";

	$access_token = get_access_token("notturna-93b8f-firebase-adminsdk-lsd7l-b077c17d5a.json");
    
    $options = array(
        CURLOPT_URL => $url,
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => array(
            "Authorization: Bearer " . $access_token,
            "Content-Type: application/json",
        ),
        CURLOPT_POSTFIELDS => json_encode($data),
    );
    $curl = curl_init();
    curl_setopt_array($curl, $options);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($curl);
    curl_close($curl);
    return $response;

}


function user2master ( $idutente , $testo, $db ) {

	$Mysql="SELECT nomepg FROM personaggio WHERE idutente=$idutente";
	$Result=mysqli_query($db, $Mysql);
	if ( $res=mysqli_fetch_array($Result) ) {
		$nomepg=$res['nomepg'];
	}

	$data = [
        'message' => [
            "notification"=> [
                "title" => "NOTTURNA",
                "body" => $nomepg." ".$testo,

                // 'sound' => 'default',
				// 'notification_priority' => '2'
            ],
            "android" => [
                "notification" => [
                    "channel_id" => "PushPluginChannel"
                ]
            ],
            //'token' => $token,
            'topic' => 'master' 
        ]
    ];

	pushmsg ($data);
}


function master2master ( $testo ) {
	$data = [
        'message' => [
            "notification"=> [
                "title" => "NOTTURNA",
                "body" => $testo,

                // 'sound' => 'default',
				// 'notification_priority' => '2'
            ],
            "android" => [
                "notification" => [
                    "channel_id" => "PushPluginChannel"
                ]
            ],
            //'token' => $token,
            'topic' => 'master' 
        ]
    ];

	pushmsg ($data);

}

function master2user ( $idutente , $testo , $db) {

	$Mysql="SELECT registrationID FROM utente WHERE idutente=$idutente";
	$Result=mysqli_query($db, $Mysql);
	$res=mysqli_fetch_array($Result);

	if ($res['registrationID'] != "" ) {

		$token= $res['registrationID'];

		$data = [
			'message' => [
				"notification"=> [
					"title" => "NOTTURNA",
					"body" => $testo,
	
					// 'sound' => 'default',
					// 'notification_priority' => '2'
				],
				"android" => [
					"notification" => [
						"channel_id" => "PushPluginChannel"
					]
				],
				'token' => $token,
				//'topic' => 'master' 
			]
		];
	
		pushmsg ($data);

	} else {

		// NON FACCIO NULLA

	}




}




function user2user ( $nomepg, $destinatario , $testo , $db) {

	$Mysql="SELECT registrationID FROM utente WHERE idutente=$destinatario";
	$Result=mysqli_query($db, $Mysql);
	$res=mysqli_fetch_array($Result);

	if ($res['registrationID'] != "" ) {

		$token= $res['registrationID'];

        // echo $token . "<p>" ; 

		$data = [
			'message' => [
				"notification"=> [
					"title" => "NOTTURNA",
					"body" => "TELEPATIA da ". $nomepg . ": " . $testo,
	
					// 'sound' => 'default',
					// 'notification_priority' => '2'
				],
				"android" => [
					"notification" => [
						"channel_id" => "PushPluginChannel"
					]
				],
				'token' => $token,
				//'topic' => 'master' 
			]
		];
	
		pushmsg ($data);

	} else {

		// NON FACCIO NULLA

	}




}


function master2clan ( $idclan , $nomeclan, $clanimg, $testo , $db) {

	// idclan non è usato, il topic è il nome del clan

	$data = [
        'message' => [
            "notification"=> [
                "title" => "NOTTURNA",
                "body" => "Messaggio per clan ".$nomeclan . ". ". $testo,
            ],
            "android" => [
                "notification" => [
                    "channel_id" => "PushPluginChannel",
                    'image' => "https://www.roma-by-night.it/imgs/".$clanimg,

                ]
            ],

            'topic' => $nomeclan 
        ]
    ];
	pushmsg ($data);

	

}





?>
