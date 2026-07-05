#!/bin/sh
set -e

cd /var/www/html

setup_needed=false
[ ! -f vendor/autoload.php ] && setup_needed=true
[ ! -f public/build/manifest.json ] && setup_needed=true
[ ! -f .env ] && setup_needed=true

if [ "$setup_needed" = "true" ]; then
    (
        if [ ! -f vendor/autoload.php ]; then
            composer install --no-interaction --prefer-dist --optimize-autoloader --no-progress
        fi

        if [ ! -f .env ]; then
            cp .env.example .env
            php artisan key:generate --force
        fi

        if [ ! -f public/build/manifest.json ]; then
            npm ci --no-audit --no-fund --prefer-offline
            npm run build
        fi

        php artisan migrate --force --no-interaction || true
    ) &
fi

exec "$@"
