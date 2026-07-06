<?php

declare(strict_types=1);

namespace App\Database;

use Illuminate\Database\Connectors\PostgresConnector;

class NeonPostgresConnector extends PostgresConnector
{
    /**
     * @param  array<string, mixed>  $config
     */
    protected function getDsn(array $config): string
    {
        $dsn = parent::getDsn($config);

        $endpoint = $config['endpoint'] ?? null;

        if (is_string($endpoint) && $endpoint !== '') {
            $dsn .= ";options=endpoint={$endpoint}";
        }

        return $dsn;
    }
}
