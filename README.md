# FeedbackHub

FeedbackHub is a split Angular + Express application for internal product feedback workflows. The current implementation includes the authentication flow: register, verify email OTP, login, reset password, logout, and authenticated session storage in the client.

## Tech Stack

- Client: Angular 20, standalone components, reactive forms, Tailwind CSS 4
- Server: Express, TypeScript, Prisma, MongoDB, JWT auth
- Package manager: Bun 1.3.5
- Monorepo runner: Turborepo

## Requirements

Install these before running the project:

- Bun 1.3.5 or newer
- Node.js compatible with Angular 20
- MongoDB running locally or a MongoDB connection string

## Environment Files

Backend environment file: `server/.env`

```env
PORT=3000
MODE=DEV
DATABASE_URL=mongodb://127.0.0.1:27017/task
SECRET=your-super-secret-jwt-key-here
DEV_URL=http://localhost:3000
LOCATION_URL=https://nominatim.openstreetmap.org
EMAIL=your-email@gmail.com
PASSWORD=your-app-password
```

Client environment example: `client/.env.example`

```env
NG_MODE=DEV
NG_DEV_URL=http://localhost:3000/api
NG_PROD_URL=https://example.com/api
```

The Angular API client defaults to `http://localhost:3000/api`, so the backend should run on port `3000` unless you also change the client API URL.

## Install

From the repository root:

```bash
bun install
```

## Database Setup

Generate the Prisma client and sync the MongoDB schema:

```bash
bun run db:generate
bun run db:push
```

Optional admin seed:

```bash
bun run db:seed
```

## Run Development Servers

Run both client and server from the root:

```bash
bun run dev
```

Or run each side separately:

```bash
bun run dev:server
bun run dev:client
```

Default local URLs:

- Client: `http://localhost:4200`
- Backend API: `http://localhost:3000/api`
- Backend health: `http://localhost:3000/api/health`
- Swagger UI: `http://localhost:3000/api-docs`
- OpenAPI JSON: `http://localhost:3000/api-docs.json`

## Build

```bash
bun run build
```

Or build each side separately:

```bash
bun run build:server
bun run build:client
```

## Authentication Flow

1. Open the client at `http://localhost:4200/register`.
2. Create an account with first name, last name, email, and password.
3. The backend creates an unverified account and sends a six-digit OTP.
4. Continue to `/verify-otp` and submit the code.
5. After successful verification, the client stores the account token and redirects to the home page.
6. Existing verified users can sign in from `/login`.

For local development, check the OTP behavior in `server/utils/otp.ts` and the configured email credentials in `server/.env`.

## Main API Routes

All application API routes use the `/api` prefix.

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/check-code`
- `POST /api/auth/login`
- `POST /api/auth/new-code`
- `POST /api/auth/reset-password`
- `POST /api/auth/logout`
- `GET /api/auth/location?query=Damascus`

Use Swagger UI at `http://localhost:3000/api-docs` for request schemas, response schemas, and bearer token authorization.

## Verification Commands

These commands should pass before submitting changes:

```bash
bun run build:server
bun run build:client
curl http://localhost:3000/api/health
```
