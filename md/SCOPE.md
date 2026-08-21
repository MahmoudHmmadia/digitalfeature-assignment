# Scope

## Built

### Foundation

- Bun/Turborepo workspace containing Angular, Express, and shared TypeScript.
- Feature-oriented backend routes, controllers, Joi validation, middleware, and
  Prisma data access.
- Standalone Angular pages with separate feature services, typed API services,
  reusable UI components, and lazy-loaded route trees.
- English and Arabic UI/response translations.

### Authentication and accounts

- Registration, six-digit OTP verification/resend, login, logout, forgot/reset
  password, JWT session validation, and development OTP behavior.
- Public/authenticated/admin Angular route guards.
- Profile name/avatar updates and self-service account deletion.
- Admin account listing, searching, pagination, suspension, deletion, and
  restoration.

### Feedback workflow

- Feedback creation, detail, editing, and deletion with category validation.
- Server-side ownership checks; administrators can moderate feedback.
- Search, category/status filtering, pinned-first sorting, pagination, personal
  feedback, and derived vote/comment counts.
- Admin status changes and pin/unpin actions.
- Fixed submission limit of ten requests per user in a 24-hour window.

### Votes and comments

- Vote/unvote toggle and paginated vote activity.
- Comment list/create/edit/delete and personal activity.
- Comment ownership checks and admin deletion/moderation at the API level.

### Administration and settings

- Admin overview analytics.
- Category list/create/edit/activate/retire/delete behavior, including rejection
  when a category is still referenced.
- Application version and maintenance mode. Enabling maintenance invalidates
  normal-user sessions and blocks their login.

### UX, API, data, and deployment

- Main feedback/auth/admin screens with loading, empty, and error handling.
- Reusable inputs, buttons, cards, dialogs, filters, pagination, and searchable
  select components.
- Responsive navigation and role-specific layouts.
- Idempotent demonstration seed with users, categories, 30 feedback requests,
  votes, and comments.
- OpenAPI 3.0 document, Swagger UI, bearer authorization, and schemas for the
  implemented modules.
- Multi-stage Dockerfiles, complete Docker Compose stack, and Kubernetes
  manifests with health probes, persistent storage, runtime configuration, and
  secret references.

## Deliberately not built or incomplete

- Open-source identity-provider integration and social login. Custom auth is the
  largest explicit assignment mismatch.
- Configurable status entities; statuses are currently integer workflow values.
- Invite-only/domain-restricted registration, comment approval, configurable
  submission limits, and general feature-flag storage.
- Server-persisted user settings for language, filters, notification delivery,
  and preferences. Theme/default sort/notification choices are local browser
  preferences only.
- Email notification delivery beyond authentication OTP email.
- Database enforcement of one vote per user/request. The controller checks
  before creating a vote, but the Prisma schema lacks the required compound
  unique constraint and concurrent requests can race.
- Automated unit, integration, and end-to-end tests.
- Fully implemented UI for the placeholder admin status/moderation routes. The
  corresponding working operations are available through feedback screens/API
  where noted.
- Production infrastructure such as TLS/Ingress, external secret management,
  MongoDB authentication/replication/backups, autoscaling, monitoring, and a CI
  pipeline.

## Assumptions and interpretations

- Role `0` is ADMIN and role `1` is USER, matching the existing schema and
  middleware.
- The assignment's recommendation of NestJS/PostgreSQL permits an explicitly
  justified Express/MongoDB implementation; Angular remains mandatory.
- A modular monolith is proportionate for this product and still satisfies the
  request to explain service boundaries.
- Categories can be retired with `isActive`; hard deletion is allowed only when
  no feedback references the category.
- Maintenance mode is the implemented behavior-changing administrative setting.
- Vote and comment counts are derived rather than persisted.
- In `DEV`, OTP `000000` is a deliberate local convenience and must not be used in
  production.
- The original assignment PDF is authoritative if `TASK_CONTEXT.md` differs.

## With another week

1. Integrate Keycloak or Authentik, including email/password, Google sign-in,
   a social provider, account mapping, logout, container configuration, and
   auth integration tests. The current Google sign-in buttons only show that
   the provider integration is still in development.
2. Add a database-enforced compound unique vote constraint and test concurrent
   vote attempts.
3. Model configurable statuses and the remaining registration, approval,
   notification, rate-limit, and feature-flag settings.
4. Add API integration tests for authorization/ownership and Angular end-to-end
   tests for the critical user/admin journeys.
5. Complete the placeholder admin views and run an accessibility pass covering
   keyboard flow, focus, labels, contrast, and both languages.
6. Add CI for typecheck, build, tests, container scanning, and immutable image
   publishing; add production ingress, managed secrets, observability, and
   database backup/restore procedures.
