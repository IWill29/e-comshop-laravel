FROM php:8.4-fpm-alpine

RUN apk add --no-cache \
    bash \
    curl \
    git \
    icu-dev \
    libpq-dev \
    libzip-dev \
    nodejs \
    npm \
    oniguruma-dev \
    postgresql-dev \
    unzip \
    zip \
    && docker-php-ext-configure intl \
    && docker-php-ext-install \
        bcmath \
        intl \
        mbstring \
        opcache \
        pdo \
        pdo_pgsql \
        zip \
    && apk add --no-cache --virtual .build-deps $PHPIZE_DEPS \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apk del .build-deps

COPY --from=composer:2 --chmod=755 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY docker/php/conf.d/opcache.ini /usr/local/etc/php/conf.d/opcache.ini
COPY docker/php/conf.d/realpath.ini /usr/local/etc/php/conf.d/realpath.ini
COPY docker/php/www.conf /usr/local/etc/php-fpm.d/zz-docker-custom.conf

COPY --chmod=755 docker/php/entrypoint.sh /usr/local/bin/entrypoint.sh

ENTRYPOINT ["entrypoint.sh"]
CMD ["php-fpm", "-F"]
