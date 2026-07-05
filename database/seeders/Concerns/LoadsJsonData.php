<?php

declare(strict_types=1);

namespace Database\Seeders\Concerns;

use RuntimeException;

trait LoadsJsonData
{
    /**
     * @return list<array<string, mixed>>
     */
    protected function loadJsonData(string $filename): array
    {
        $path = database_path('data/'.$filename);

        $contents = file_get_contents($path);

        if ($contents === false) {
            throw new RuntimeException("Unable to read seed data: {$filename}");
        }

        /** @var list<array<string, mixed>> */
        return json_decode($contents, true, 512, JSON_THROW_ON_ERROR);
    }
}
