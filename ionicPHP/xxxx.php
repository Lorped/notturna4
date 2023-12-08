<?php 

include ('db2.inc.php');

$idxx = array ( 307, 300, 308, 310, 106, 295, 316,  93, 312, 251,
                177, 267, 227, 144, 230, 111, 273, 311, 302, 224,
                233, 103,  13, 289, 236, 261, 222, 248, 196, 309, 
                197,  11, 235, 317, 219, 104, 263, 205, 243, 232,
                110, 194,   5, 306, 234, 262, 206, 318, 271, 250,
                124, 347, 293 );

$arrlength = count($idxx);
for ( $i = 0 ; $i< $arrlength ; $i++ ) {

    $id = $idxx[$i];

    echo "Cancello "+$id+"<p>";


    $mysql = "DELETE FROM background WHERE idutente = $id ";   
    mysqli_query($db , $mysql);

    $mysql = "DELETE FROM contatti WHERE idutente = $id ";   
    mysqli_query($db , $mysql);

    $mysql = "DELETE FROM discipline WHERE idutente = $id ";   
    mysqli_query($db , $mysql);

    $mysql = "DELETE FROM logpx WHERE idutente = $id ";   
    mysqli_query($db , $mysql);

    $mysql = "DELETE FROM necromanzie WHERE idutente = $id ";   
    mysqli_query($db , $mysql);

    $mysql = "DELETE FROM personaggio WHERE idutente = $id ";   
    mysqli_query($db , $mysql);

    $mysql = "DELETE FROM poteri WHERE idutente = $id ";   
    mysqli_query($db , $mysql);

    $mysql = "DELETE FROM pregidifetti WHERE idutente = $id ";   
    mysqli_query($db , $mysql);

    $mysql = "DELETE FROM rituali_n WHERE idutente = $id ";   
    mysqli_query($db , $mysql);

    $mysql = "DELETE FROM rituali_t WHERE idutente = $id ";   
    mysqli_query($db , $mysql);

    $mysql = "DELETE FROM rubrica WHERE owner = $id ";   
    mysqli_query($db , $mysql);

    $mysql = "DELETE FROM skill WHERE idutente = $id ";   
    mysqli_query($db , $mysql);

    $mysql = "DELETE FROM taumaturgie WHERE idutente = $id ";   
    mysqli_query($db , $mysql);

    $mysql = "DELETE FROM utente WHERE idutente = $id ";   
    mysqli_query($db , $mysql);
}

?>