#!/bin/sh
set -e

cd /var/www/html

if [ "$(id -u)" = "0" ]; then
    chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || true
fi

setup_needed=false
[ ! -f vendor/autoload.php ] && setup_needed=true
[ ! -f public/build/manifest.json ] && setup_needed=true
[ ! -f .env ] && setup_needed=true
[ ! -f node_modules/.package-lock.json ] && setup_needed=true

if [ "$setup_needed" = "true" ]; then
    if [ ! -f vendor/autoload.php ]; then
        composer install --no-interaction --prefer-dist --optimize-autoloader --no-progress
    fi

    if [ ! -f .env ]; then
        cp .env.example .env
        php artisan key:generate --force
    fi

    if [ ! -f node_modules/.package-lock.json ]; then
        npm ci --no-audit --no-fund
    fi

    if [ ! -f public/build/manifest.json ]; then
        npm run build
    fi

    if [ "$(id -u)" = "0" ]; then
        chown -R www-data:www-data storage bootstrap/cache public/build 2>/dev/null || true
    fi
fi

php artisan migrate --force --no-interaction || true

exec "$@"
