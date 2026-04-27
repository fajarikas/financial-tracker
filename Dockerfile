FROM node:22-alpine AS frontend-builder
WORKDIR /app

RUN apk add --no-cache \
    php84 \
    php84-phar \
    php84-mbstring \
    php84-openssl \
    php84-json \
    php84-dom \
    php84-xml \
    php84-xmlwriter \
    php84-tokenizer \
    php84-ctype \
    php84-curl \
    php84-session \
    php84-fileinfo \
    curl

RUN ln -sf /usr/bin/php84 /usr/bin/php
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

COPY . .

RUN composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev
RUN npm install && npm run build

FROM php:8.4-fpm-alpine

RUN apk add --no-cache \
    nginx \
    supervisor \
    libpng-dev \
    libzip-dev \
    oniguruma-dev \
    icu-dev \
    linux-headers \
    curl \
    mysql-client

RUN docker-php-ext-install pdo_mysql gd zip intl opcache

WORKDIR /var/www/html

COPY --from=frontend-builder /app .

RUN chown -R www-data:www-data storage bootstrap/cache

COPY .docker/nginx.conf /etc/nginx/http.d/default.conf
COPY .docker/supervisord.conf /etc/supervisord.conf

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
