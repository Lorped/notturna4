<?php

if (($argv[1] ?? '') === 'child') {
    $scenario = $argv[2];
    $_SERVER['REQUEST_METHOD'] = $scenario === 'options' ? 'OPTIONS' : 'GET';
    $_GET = match ($scenario) {
        'legacy' => ['userid' => '-1'],
        'first' => ['userid' => '-1', 'limit' => '2'],
        'next' => ['userid' => '-1', 'limit' => '2', 'before' => '8'],
        'public' => ['userid' => '0', 'limit' => '2', 'before' => '8'],
        'player' => ['userid' => '12', 'limit' => '2', 'before' => '8'],
        'bad-limit' => ['userid' => '-1', 'limit' => '101'],
        'bad-before' => ['userid' => '-1', 'before' => '8'],
        'options' => [],
    };

    register_shutdown_function(function (): void {
        fwrite(STDERR, 'STATUS:' . (http_response_code() ?: 200));
    });

    class FakeResult
    {
        public function __construct(private array $rows) {}

        public function fetch_assoc(): ?array
        {
            return array_shift($this->rows);
        }
    }

    class FakeStatement
    {
        private string $types = '';
        private array $params = [];

        public function __construct(private string $sql) {}

        public function bind_param(string $types, &...$params): void
        {
            $this->types = $types;
            $this->params = $params;
        }

        public function execute(): void
        {
            global $scenario;
            $sql = preg_replace('/\s+/', ' ', trim($this->sql));
            if (str_starts_with($sql, 'SELECT idclan, IDcronaca FROM personaggio')) {
                if ($this->types !== 'i' || $this->params !== [12]) {
                    throw new RuntimeException('Invalid profile parameters');
                }
                return;
            }

            $fields = $scenario === 'legacy' ? 'nomepg, Ora, Testo' : 'ID, nomepg, Ora, Testo';
            $expectedSql = "SELECT $fields FROM dadi";
            $expectedTypes = '';
            $expectedParams = [];
            if ($scenario === 'public') {
                $expectedSql .= ' WHERE Destinatario = -1 AND ID < ?';
                $expectedTypes = 'ii';
                $expectedParams = [8, 2];
            } elseif ($scenario === 'player') {
                $expectedSql .= ' WHERE (Destinatario = -1 OR Destinatario = ? OR idutente = ?'
                    . ' OR (clan = ? AND cronaca = -1) OR (clan = ? AND cronaca = ?)) AND ID < ?';
                $expectedTypes = 'iiiiiii';
                $expectedParams = [12, 12, 2, 2, 3, 8, 2];
            } elseif ($scenario === 'next') {
                $expectedSql .= ' WHERE ID < ?';
                $expectedTypes = 'ii';
                $expectedParams = [8, 2];
            } elseif ($scenario === 'first') {
                $expectedTypes = 'i';
                $expectedParams = [2];
            }
            $expectedSql .= ' ORDER BY ID DESC';
            if ($scenario !== 'legacy') {
                $expectedSql .= ' LIMIT ?';
            }
            if ($sql !== $expectedSql || $this->types !== $expectedTypes || $this->params !== $expectedParams) {
                throw new RuntimeException('Invalid paginated query or parameters');
            }
        }

        public function get_result(): FakeResult
        {
            global $scenario;
            if (str_starts_with($this->sql, 'SELECT idclan')) {
                return new FakeResult([['idclan' => 2, 'IDcronaca' => 3]]);
            }
            $ids = in_array($scenario, ['next', 'public', 'player'], true) ? [7, 6] : [9, 8];
            return new FakeResult(array_map(
                fn (int $id) => ['ID' => $id, 'nomepg' => 'Narratore', 'Ora' => '2026-01-01 12:00:00', 'Testo' => "Messaggio $id"],
                $ids
            ));
        }

        public function close(): void {}
    }

    class FakeDb
    {
        public function prepare(string $sql): FakeStatement
        {
            return new FakeStatement($sql);
        }
    }

    $source = file_get_contents(__DIR__ . '/../ionicPHP/dadi.php');
    $source = str_replace("require_once __DIR__ . '/db2.inc.php';", '$db = new FakeDb();', $source, $replacements);
    if ($replacements !== 1) {
        throw new RuntimeException('Unable to isolate the database');
    }
    eval('?>' . $source);
    exit;
}

$cases = [
    'legacy' => [200, null],
    'first' => [200, [9, 8]],
    'next' => [200, [7, 6]],
    'public' => [200, [7, 6]],
    'player' => [200, [7, 6]],
    'bad-limit' => [400, null],
    'bad-before' => [400, null],
    'options' => [204, null],
];

foreach ($cases as $scenario => [$expectedStatus, $expectedIds]) {
    $process = proc_open([PHP_BINARY, '-n', __FILE__, 'child', $scenario], [
        0 => ['pipe', 'r'],
        1 => ['pipe', 'w'],
        2 => ['pipe', 'w'],
    ], $pipes);
    if (!is_resource($process)) {
        throw new RuntimeException('Unable to start test process');
    }
    fclose($pipes[0]);
    $output = stream_get_contents($pipes[1]);
    $status = stream_get_contents($pipes[2]);
    fclose($pipes[1]);
    fclose($pipes[2]);
    $exitCode = proc_close($process);
    $payload = $output === '' ? null : json_decode($output, true, 512, JSON_THROW_ON_ERROR);

    if ($exitCode !== 0 || $status !== "STATUS:$expectedStatus") {
        throw new RuntimeException("$scenario failed: $status $output");
    }
    if ($expectedIds !== null && array_column($payload, 'id') !== $expectedIds) {
        throw new RuntimeException("$scenario returned incorrect IDs");
    }
    if ($scenario === 'legacy' && (count($payload) !== 2 || array_key_exists('id', $payload[0]))) {
        throw new RuntimeException('Legacy response shape changed');
    }
    if ($expectedStatus === 400 && !isset($payload['error'])) {
        throw new RuntimeException("$scenario did not report an error");
    }
    echo "PASS $scenario\n";
}
