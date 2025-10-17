#!/bin/sh
# Entry point for backend container: wait for DB, run migrations/init, then start app

set -e

host="${DB_HOST:-db}"
port="${DB_PORT:-5432}"
user="${POSTGRES_USER:-postgres}"
db_name="${POSTGRES_DB:-postgres}"

wait_for_db() {
  echo "Waiting for database at ${host}:${port}..."
  until pg_isready -h "$host" -p "$port" -U "$user" >/dev/null 2>&1; do
    sleep 1
  done
}

run_init() {
  echo "Running database init (init_db.py)..."
  python init_db.py
}

wait_for_db
run_init

echo "Starting Flask app..."
exec python app.py
