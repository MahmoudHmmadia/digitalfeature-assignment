#!/bin/sh
set -eu

if [ "${PRISMA_DB_PUSH:-true}" = "true" ]; then
  /app/node_modules/.bin/prisma db push \
    --schema /app/server/prisma/schema.prisma \
    --skip-generate
fi

exec bun /app/server/server.js
