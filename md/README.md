# FeedbackHub Assignment Notes

FeedbackHub is an internal product feedback board. Employees submit, search, vote on, and discuss feedback requests. Admins moderate content, manage workflow statuses/categories, pin important requests, and configure application behavior.

## Architecture

- Frontend target: Angular with standalone components, routing, reactive forms, signals where useful, and a typed API layer.
- Backend current implementation: Node.js, Express, TypeScript, Prisma, MongoDB.
- Backend target modules: auth, users, feedback, votes, comments, categories, statuses, settings.
- Authorization must be enforced in backend middleware/controllers, not only hidden in the UI.

## Local Backend

Required environment variables:

```text
DATABASE_URL=
SECRET=
MODE=DEV
EMAIL_FORM=
```

Useful commands from `server/`:

```text
bun install
bun run db:generate
bun run db:push
bun run dev
```

## Current Auth Status

Implemented endpoints:

- `POST /auth/register`
- `POST /auth/check-code`
- `POST /auth/login`
- `POST /auth/new-code`
- `POST /auth/reset-password`
- `POST /auth/logout`
- `GET /auth/location`

Important assignment gap: the assignment asks for an open-source identity provider with email/password and at least one social provider. The current codebase still uses custom email/password, JWT, and OTP primitives. This is documented as a scope/decision item until an identity provider is integrated.
