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
    php84-iconv \
    php84-pdo \
    php84-pdo_mysql \
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
    curl \
    mysql-client \
    php84-pdo \
    php84-pdo_mysql \
    php84-mysqlnd \
    php84-gd \
    php84-zip \
    php84-intl \
    php84-opcache \
    php84-iconv \
    php84-mbstring \
    php84-session \
    php84-fileinfo \
    php84-xml \
    php84-xmlwriter \
    php84-dom \
    php84-tokenizer \
    php84-ctype \
    php84-bcmath \
    php84-openssl \
    php84-phar \
    php84-curl

RUN ln -sf /usr/bin/php84 /usr/bin/php

WORKDIR /var/www/html

COPY --from=frontend-builder /app .

RUN chown -R www-data:www-data storage bootstrap/cache

COPY .docker/nginx.conf /etc/nginx/http.d/default.conf
COPY .docker/supervisord.conf /etc/supervisord.conf

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
