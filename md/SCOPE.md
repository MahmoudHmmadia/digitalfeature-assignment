# Scope

## Built In This Increment

- Completed the existing auth controller flow.
- Added a reusable safe Account response shape.
- Aligned auth validation with the current Prisma Account model.
- Fixed OTP expiry verification.
- Added reset password support for the existing route.
- Started assignment documentation files under `md/`.

## Deliberately Not Built Yet

- Open-source identity provider integration.
- Social login provider.
- Phone/location persistence for accounts.
- Full feedback, votes, comments, admin taxonomy, and settings modules.
- Auth integration tests.

## Assumptions

- Role `0` is ADMIN and role `1` is USER, matching the Prisma schema comment.
- Dev OTP remains `000000` when `MODE=DEV`.
- Email verification is required before login.
- Existing response helper format is preserved.

## With Another Week

- Replace custom auth primitives with a provider such as Keycloak, Authentik, or another assignment-approved open-source provider.
- Add social login and map provider identities to Account records.
- Add integration tests for login, invalid credentials, unauthenticated access, OTP verification, and password reset.
- Add the remaining backend modules and Angular flows.
