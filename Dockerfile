# Stage 1: Build Frontend
FROM node:22-alpine AS frontend-builder
WORKDIR /app
COPY . .
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

# Copy project files
COPY . .
COPY --from=frontend-builder /app/public/build ./public/build

# Install Composer dependencies
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev

# Setup Permissions
RUN chown -R www-data:www-data storage bootstrap/cache

# Copy Nginx configuration
COPY .docker/nginx.conf /etc/nginx/http.d/default.conf
COPY .docker/supervisord.conf /etc/supervisord.conf

# Expose port
EXPOSE 80

# Start Supervisor
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
