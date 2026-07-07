<?php

declare(strict_types=1);

namespace App\Database;

final class RuntimeEnv
{
    public static function get(string $key): ?string
    {
        $value = $_ENV[$key] ?? $_SERVER[$key] ?? getenv($key);

        if (! is_string($value) || $value === '') {
            return null;
        }

        return $value;
    }

    public static function filled(string $key): bool
    {
        return self::get($key) !== null;
    }
}
