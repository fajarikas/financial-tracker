# Stage 1: Build Frontend + Prepare Composer for Wayfinder
FROM node:22-alpine AS frontend-builder
WORKDIR /app

# Install PHP & Composer in node stage
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

# Run composer install FIRST so Wayfinder can run during npm build
RUN composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev
RUN npm install && npm run build

# Stage 2: Runtime Backend
FROM php:8.4-fpm-alpine

# Install system dependencies & PHP extensions
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

# Set working directory
WORKDIR /var/www/html

# Copy project files from stage 1
COPY --from=frontend-builder /app .

# Setup Permissions
RUN chown -R www-data:www-data storage bootstrap/cache

# Copy Nginx configuration
COPY .docker/nginx.conf /etc/nginx/http.d/default.conf
COPY .docker/supervisord.conf /etc/supervisord.conf

# Expose port
EXPOSE 80

# Start Supervisor
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
