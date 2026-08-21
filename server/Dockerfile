FROM oven/bun:1.3.5-alpine AS build

WORKDIR /app

COPY package.json bun.lock turbo.json ./
COPY client/package.json ./client/package.json
COPY server/package.json ./server/package.json
RUN bun install --frozen-lockfile

COPY shared ./shared
COPY server ./server

WORKDIR /app/server
RUN bun run db:generate && bun run build

FROM oven/bun:1.3.5-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000

COPY --from=build --chown=bun:bun /app/node_modules ./node_modules
COPY --from=build --chown=bun:bun /app/server/package.json ./server/package.json
COPY --from=build --chown=bun:bun /app/server/server.js ./server/server.js
COPY --from=build --chown=bun:bun /app/server/prisma ./server/prisma
COPY --from=build --chown=bun:bun /app/server/public ./server/public
COPY --from=build --chown=bun:bun /app/server/scripts/docker-entrypoint.sh ./server/scripts/docker-entrypoint.sh

RUN chmod +x /app/server/scripts/docker-entrypoint.sh \
    && mkdir -p /app/logs \
    && chown -R bun:bun /app/logs /app/server/public

USER bun
EXPOSE 3000

ENTRYPOINT ["/app/server/scripts/docker-entrypoint.sh"]
