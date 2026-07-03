#!/bin/sh
set -e

cd /var/www/html

if [ ! -d vendor ]; then
    composer install --no-interaction --prefer-dist
fi

if [ ! -f .env ]; then
    cp .env.example .env
    php artisan key:generate --force
fi

if [ ! -f public/build/manifest.json ]; then
    npm ci
    npm run build
fi

php artisan migrate --force --no-interaction 2>/dev/null || true

exec "$@"
