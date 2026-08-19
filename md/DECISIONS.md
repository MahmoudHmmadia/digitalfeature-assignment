# Decisions

## Use Existing Express Auth For The Current Increment

Context: The assignment asks for an open-source identity provider, but the current backend already contains Express routes, Prisma Account persistence, JWT middleware, and OTP verification.

Options considered:

- Replace auth immediately with an identity provider.
- Stabilize the existing auth flow first, then document the provider gap.

Decision: Stabilize the existing flow for this increment.

Reasoning: Replacing the identity model requires choosing and wiring a provider, callback/session handling, social auth setup, frontend redirects, and data migration decisions. That is larger than completing the broken auth files in the current task.

Consequences:

- Auth endpoints compile toward the existing backend shape.
- Password hashing, JWT issuing, OTP verification, resend, reset password, and logout are implemented consistently.
- The identity-provider requirement remains a documented assignment gap.

## Store Only Fields Present In Prisma Account

Context: Validation previously required `phoneNumber` and the controller expected `name`, while Prisma Account only supports `email`, `password`, `name`, avatar/token/role/status fields, and timestamps.

Decision: Registration accepts `name` or `firstName`/`lastName`, but only persists fields represented by the Account model.

Consequence: The API no longer pretends to save unsupported profile fields. Adding phone/location later requires a Prisma schema change first.
