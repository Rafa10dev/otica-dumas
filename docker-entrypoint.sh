#!/bin/sh
set -eu

if [ -z "${DATABASE_URL:-}" ]; then
  echo "[startup] DATABASE_URL is required." >&2
  exit 1
fi

if [ -z "${AUTH_SECRET:-}" ]; then
  echo "[startup] AUTH_SECRET is required." >&2
  exit 1
fi

echo "[startup] Applying pending Prisma migrations..."
./node_modules/.bin/prisma migrate deploy

if [ "$#" -gt 0 ]; then
  exec "$@"
fi

exec node server.js
