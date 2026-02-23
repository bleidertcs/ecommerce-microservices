#!/bin/sh
set -e

# Extract host and port from DATABASE_URL
DB_HOST=$(echo $DATABASE_URL | sed -e 's|.*@||' -e 's|:.*||' -e 's|/.*||')
DB_PORT=$(echo $DATABASE_URL | sed -e 's|.*:||' -e 's|/.*||' | grep -E '^[0-9]+$' || echo 5432)

echo "Waiting for database at $DB_HOST:$DB_PORT..."
until nc -z "$DB_HOST" "$DB_PORT"; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

echo "Database is up - executing migrations"
npx prisma migrate deploy

echo "Executing seed"
npx prisma db seed

echo "Starting application"
exec node dist/main.js
