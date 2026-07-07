<?php

declare(strict_types=1);

namespace App\Database;

use Illuminate\Support\Facades\Config;

final class RedisAvailability
{
    public static function configured(): bool
    {
        if (RuntimeEnv::filled('REDIS_URL') || RuntimeEnv::filled('KV_URL')) {
            return true;
        }

        return RuntimeEnv::filled('UPSTASH_REDIS_REST_URL') || RuntimeEnv::filled('KV_REST_API_URL');
    }

    public static function applyRuntimeFallback(): void
    {
        if (self::configured()) {
            UpstashRedisConfigurator::apply();
            Config::set('cache.stores.redis.connection', 'default');

            return;
        }

        if (! RuntimeEnv::filled('VERCEL')) {
            return;
        }

        Config::set('session.driver', 'cookie');
        Config::set('cache.default', 'array');
    }
}
