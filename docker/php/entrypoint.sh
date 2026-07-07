#!/bin/sh
set -e

cd /var/www/html

git config --global --add safe.directory /var/www/html 2>/dev/null || true

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

fi

php artisan migrate --force --no-interaction || true

if [ "${DOCKER_ROUTE_CACHE:-1}" = "1" ]; then
    php artisan route:cache --no-interaction 2>/dev/null || true
    php artisan view:cache --no-interaction 2>/dev/null || true
fi

exec "$@"
