<?php

declare(strict_types=1);

namespace App\Database;

use Illuminate\Support\Facades\Config;

final class UpstashRedisConfigurator
{
    public static function apply(): void
    {
        $redisUrl = RuntimeEnv::get('REDIS_URL') ?? RuntimeEnv::get('KV_URL');

        if ($redisUrl !== null) {
            self::applyConnection($redisUrl);

            return;
        }

        $restUrl = RuntimeEnv::get('UPSTASH_REDIS_REST_URL') ?? RuntimeEnv::get('KV_REST_API_URL');
        $token = RuntimeEnv::get('UPSTASH_REDIS_REST_TOKEN') ?? RuntimeEnv::get('KV_REST_API_TOKEN');

        if ($restUrl === null || $token === null) {
            return;
        }

        $host = parse_url($restUrl, PHP_URL_HOST);

        if (! is_string($host) || $host === '') {
            return;
        }

        $password = rawurlencode($token);
        $baseUrl = "rediss://default:{$password}@{$host}:6379";

        self::applyConnection($baseUrl);
    }

    private static function applyConnection(string $url): void
    {
        Config::set('database.redis.default.url', $url);
        Config::set('database.redis.default.database', '0');
        Config::set('database.redis.cache.url', $url);
        Config::set('database.redis.cache.database', '0');
    }
}
