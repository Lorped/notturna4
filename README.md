# notturna4

## Log dadi

`ionicPHP/dadi.php` mantiene la risposta esistente quando non si specificano
parametri di paginazione. Per richiedere una pagina, usare `limit` (da 1 a 100);
gli elementi includono anche l'`id` numerico. Per le pagine successive,
passare l'ultimo `id` ricevuto come `before`. Gli elementi sono ordinati per
`id` decrescente. `before` richiede `limit`.

Test isolati del contratto: `php tests/dadi-pagination.php`.
