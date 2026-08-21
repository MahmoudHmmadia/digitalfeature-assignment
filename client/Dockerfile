FROM oven/bun:1.3.5-alpine AS build

WORKDIR /app

COPY package.json bun.lock turbo.json ./
COPY client/package.json ./client/package.json
COPY server/package.json ./server/package.json
RUN bun install --frozen-lockfile

COPY shared ./shared
COPY client ./client

WORKDIR /app/client
RUN bun run build

FROM nginx:1.27-alpine AS runtime

ENV API_UPSTREAM=http://server:3000

COPY client/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/client/dist/feedbackhub/browser /usr/share/nginx/html

EXPOSE 80
