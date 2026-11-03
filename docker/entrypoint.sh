#!/bin/sh
set -e

# Railway exposes the MySQL plugin credentials with MYSQL* names. Fall back to
# them when the standard Laravel DB_* variables are not set explicitly.
export DB_HOST="${DB_HOST:-${MYSQLHOST:-127.0.0.1}}"
export DB_PORT="${DB_PORT:-${MYSQLPORT:-3306}}"
export DB_DATABASE="${DB_DATABASE:-${MYSQLDATABASE:-dailypost}}"
export DB_USERNAME="${DB_USERNAME:-${MYSQLUSER:-root}}"
export DB_PASSWORD="${DB_PASSWORD:-${MYSQLPASSWORD:-}}"

export PORT="${PORT:-8080}"
export LOG_CHANNEL="${LOG_CHANNEL:-stderr}"

sed -i "s/Listen 80/Listen ${PORT}/" /etc/apache2/ports.conf
sed -i "s/<VirtualHost \*:80>/<VirtualHost *:${PORT}>/" /etc/apache2/sites-available/000-default.conf

mkdir -p storage/framework/sessions storage/framework/views storage/framework/cache storage/logs bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

php artisan migrate --force --no-interaction

if [ "${SEED_DATABASE:-false}" = "true" ]; then
    php artisan db:seed --force --no-interaction
fi

php artisan config:cache
php artisan storage:link || true

exec apache2-foreground
