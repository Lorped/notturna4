<?php

// putenv('GOOGLE_APPLICATION_CREDENTIALS=notturna-93b8f-firebase-adminsdk-lsd7l-b077c17d5a.json');

include "get_access_token.php";

function sendFCMNotification($access_token, $token) {
    $url = "https://fcm.googleapis.com/v1/projects/notturna-93b8f/messages:send";
    $data = [
        'message' => [
            "notification"=> [
                "title" => "NOTTURNA",
                "body" => "This is message body number 12.",


                // image sembra non funzionare!! 
                //'image' => "https://www.roma-by-night.it/imgs/lasombra.png",

                    //  "icon" => "https://www.clipscutter.com/image/brand/brand-256.png",
                    //  "image" => "https://images.unsplash.com/photo-1514473776127-61e2dc1dded3?w=871&q=80",
                    //  "click_action" => "https://example.com"
                
                // 'sound' => 'default',
				// 'notification_priority' => '2'
                
            ],
            "android" => [
                "notification" => [
                    "channel_id" => "NotturnaChannel",

                    // 'sound' => 'default',
				    // 'notification_priority' => '2'
                     
                    //eventuali valori specifici per android
                    //
                    //  "icon" => "https://www.clipscutter.com/image/brand/brand-256.png",

                    'image' => "https://www.roma-by-night.it/imgs/toreador.png",

                ]
            ],

            // inserire "token" o "topic"

            'token' => $token,
            //'topic' => 'Lasombra' 
        ]
    ];
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

$access_token = get_access_token("notturna-93b8f-firebase-adminsdk-lsd7l-b077c17d5a.json");

echo "acc => " . $access_token . '<p>';

$token = "---";  // INSERIRE !!


$response = sendFCMNotification($access_token, $token);

echo "resp => ". $response . '<p>';

/**
$device_tokens = [
    "device-token-here",
    "device-token-here"
];

foreach ($device_tokens as $token) {
    $response = sendFCMNotification($access_token, $token);
}
*/

?>