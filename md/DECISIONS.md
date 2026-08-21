# Architecture Decisions

## 1. Use a modular monolith

**Context:** FeedbackHub has several domains, but it is still one product with a
small deployment footprint and strongly related transactions.

**Options considered:** multiple services; a modular NestJS application; an
Express modular monolith.

**Decision:** Use one Express API, organized by routes, controllers, validation,
middleware, and Prisma models for each feature.

**Reasoning:** The developer already had a well-understood Express automation
structure and could spend assignment time on product behavior instead of
service-to-service infrastructure. Separate deployment units would not improve
this product at its current size.

**Consequences:** Local development and deployment remain simple. Feature seams
are visible in code, but independent scaling and strict compile-time module
boundaries would require later refactoring.

## 2. Keep Angular page presentation separate from application logic

**Context:** Angular was required, while the developer's strongest frontend
experience and existing automation were in React/Next.js.

**Options considered:** put API calls and state directly in page components;
adopt a large global store; translate the existing React separation into Angular
services, signals, and reusable standalone components.

**Decision:** Use standalone page components for presentation/orchestration,
feature services for API/state logic, typed API classes for transport, and small
reusable UI components and dialogs.

**Reasoning:** This preserves the developer's proven separation of concerns
without forcing React patterns into Angular. Signals cover local/shared reactive
state; TanStack Angular Query and the custom query/mutation services handle
server-state behavior without an unnecessary global store.

**Consequences:** Pages are easier to review and UI controls are reusable.
Angular-specific patterns required more learning and AI-assisted iteration than
the backend.

## 3. Use Angular 20 and standalone components

**Context:** The assignment requires Angular and asks that the chosen version be
justified.

**Options considered:** an older NgModule-based release; the current Angular 20
toolchain with standalone components.

**Decision:** Use the project's Angular 20.3 baseline with standalone components,
lazy route loading, reactive forms, and signals.

**Reasoning:** It provides the modern standalone, signals, and lazy-loading
patterns needed by the project and avoids legacy NgModule conventions.

**Consequences:** The application uses current Angular patterns and requires a
recent Node.js toolchain.

## 4. Use Prisma with MongoDB

**Context:** PostgreSQL was recommended, not mandatory. The developer's project
automation already supported Prisma and MongoDB.

**Options considered:** PostgreSQL; MongoDB with raw queries; MongoDB through
Prisma.

**Decision:** Use MongoDB 7 as a replica set through Prisma 6.

**Reasoning:** Prisma provides a typed data layer and schema in a familiar
workflow, and MongoDB reduced setup time for this implementation.

**Consequences:** The deployment must initialize a replica set. Relations and
important invariants still need careful schema design. In particular, duplicate
votes are currently guarded in application code but not yet by a database-level
compound unique constraint; that remains a correctness gap.

## 5. Derive vote and comment counts

**Context:** Persisted counters can drift from their source records.

**Options considered:** increment/decrement counters on feedback records; derive
counts from related votes and comments.

**Decision:** Use Prisma relation counts and serialize `voteCount`,
`commentCount`, and `hasVoted` in API responses.

**Reasoning:** The source records remain authoritative and the current data size
does not justify denormalized counters.

**Consequences:** Writes are simpler and consistent. Very large datasets may
eventually require indexed aggregation or cached counters with reconciliation.

## 6. Retain custom authentication and document the mismatch

**Context:** The assignment explicitly asks for an open-source identity provider
with email/password and at least one social provider. The implemented backend
already contained custom JWT, password hashing, email OTP, and token middleware.

**Options considered:** stop feature work and integrate Keycloak/Authentik;
retain the custom flow and present it as fully compliant; finish and harden the
existing flow while recording the requirement gap.

**Decision:** Complete the existing auth flow and state clearly that it does not
meet the identity-provider/social-login requirement.

**Reasoning:** A correct provider integration affects callbacks, account mapping,
session handling, social credentials, client redirects, deployment, and tests.
Adding it superficially would be worse than an explicit scope decision.

**Consequences:** Registration, OTP, login, password reset, logout, guards, and
role authorization work, but the submission is not fully compliant in this
area. Provider integration is the first planned follow-up.

## 7. Use role-specific route trees and server-side authorization

**Context:** USER and ADMIN have different journeys, but hiding Angular controls
does not enforce permissions.

**Options considered:** one flat route table with conditional UI; separate
public/user/admin route definitions backed by API authorization.

**Decision:** Split Angular route definitions by public, user, and admin access,
and enforce authentication, ownership, and admin role checks in Express
middleware/controllers.

**Reasoning:** The route structure makes navigation intent clear while the API
remains the security boundary.

**Consequences:** Unauthorized client navigation is redirected and direct API
requests are still checked. Any new mutation must include a backend permission
review, not only a route guard.

## 8. Use same-origin API routing in every environment

**Context:** A browser build containing `http://localhost:3000` fails when it is
served from a container or cluster and creates avoidable CORS configuration.

**Options considered:** compile a different API URL for every environment;
generate a runtime JavaScript configuration file; use `/api` and proxy it.

**Decision:** The Angular client calls relative `/api`. Angular CLI proxies it in
development and Nginx proxies it in containers. Nginx's `API_UPSTREAM` is an
environment variable.

**Reasoning:** One client artifact can move between environments, while backend
discovery remains runtime configuration.

**Consequences:** Production ingress must send the site through the provided
Nginx layer or preserve the same `/api` routing contract.

## 9. Provide Compose and Kubernetes artifacts

**Context:** The assignment asks for containerized, environment-driven,
orchestrator-ready deployment artifacts.

**Options considered:** Compose only; Kubernetes only; both from the same images.

**Decision:** Provide multi-stage client/server Dockerfiles, a complete Compose
stack, and Kustomize-compatible Kubernetes manifests with probes, resource
requests, Secrets/ConfigMaps, and persistent storage.

**Reasoning:** Compose gives reviewers a short local path; Kubernetes demonstrates
the orchestration boundary without changing the application architecture.

**Consequences:** The manifests use a single-node MongoDB replica set and local
image names. A real production deployment still needs immutable registry tags,
TLS/Ingress, managed secrets, backups, and a production database topology.
