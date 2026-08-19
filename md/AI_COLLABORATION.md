# AI Collaboration

## Tools Used

- Codex coding assistant for code inspection, implementation, and documentation drafting.

## Working Method

1. Read the task context and existing auth files first.
2. Identify mismatches between controller, validation, Prisma schema, and routes.
3. Apply a focused fix without adding dependencies.
4. Document assignment gaps instead of hiding unfinished work.
5. Run type/build verification after changes.

## Non-Trivial Examples

### Auth Contract Mismatch

Prompt: complete auth depending on the task context.

Initial output risk: implement fields like phone/location because validation mentioned them.

Correction: Prisma Account does not contain those fields, so registration now accepts display-name input and persists only supported Account fields.

### OTP Expiry Bug

Initial code rejected every account with a `codeExpiry` value.

Correction: OTP verification now rejects only missing or past expiry timestamps.

### Identity Provider Gap

Assignment requires an open-source identity provider and social login.

Correction: The current increment stabilizes existing auth but records the provider requirement as an explicit gap in README, SCOPE, and DECISIONS.

## AI-Heavy Commit Convention

Use a clear commit footer when AI materially contributed:

```text
AI-Assisted: Codex helped inspect, implement, and verify this change; developer reviewed the final diff.
```
