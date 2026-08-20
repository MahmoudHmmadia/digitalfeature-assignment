# FeedbackHub — AI & Developer Task Context

> Single source of truth for an AI coding assistant or developer working on the FeedbackHub technical assignment.
>
> The original assignment remains authoritative if this document and the assignment ever disagree.

## 1. Product Overview

FeedbackHub is an **internal product feedback board**.

Employees use it to:

- submit feature requests and product feedback
- browse existing requests
- search and filter requests
- upvote requests
- discuss requests through comments
- manage their own requests, profile, and preferences

Admins use it to:

- review incoming feedback
- change request statuses
- pin important requests
- manage categories and statuses
- moderate comments/content
- configure application-wide behavior

### Product goal

Prevent duplicate suggestions from repeatedly arriving through email by making product feedback visible, searchable, discussable, prioritized, and trackable.

---

## 2. Core Entity: Feedback Request

| Field          | Meaning                            |
| -------------- | ---------------------------------- |
| `title`        | Short summary                      |
| `description`  | Longer free text                   |
| `category`     | Admin-configurable classification  |
| `status`       | Admin-configurable workflow status |
| `author`       | User who submitted it              |
| `voteCount`    | Derived from individual votes      |
| `commentCount` | Derived from comments              |
| `pinned`       | Admin-controlled                   |
| `createdAt`    | Creation timestamp                 |
| `updatedAt`    | Last update timestamp              |

### Initial category examples

- Bug
- Feature
- Improvement
- Question

Categories must be configurable by admins.

### Initial status examples

- New
- Under Review
- Planned
- In Progress
- Done
- Declined

Statuses must be configurable by admins.

---

## 3. Supporting Entities

### User

A user can:

- register/sign in through the identity provider
- browse, search, filter, and paginate requests
- create, edit, and delete their own requests
- vote and withdraw a vote
- create, edit, and delete their own comments
- manage profile/settings
- delete their account

### Admin

An admin has all user capabilities plus:

- change request status
- pin/unpin requests
- moderate/delete comments
- create and retire categories
- manage statuses
- manage application settings

### Vote

A vote represents one user's upvote for one request.

**Critical invariant:**

```text
A user may vote for a given request at most once.
```

The database should enforce this with:

```text
UNIQUE(userId, feedbackRequestId)
```

The user must be able to withdraw the vote.

### Comment

A comment contains:

- author
- request
- content
- creation timestamp
- update timestamp

The author can edit/delete their own comment. Admins can moderate/delete inappropriate comments.

---

## 4. Roles and Authorization

### USER

```text
Browse
Search
Filter
Paginate
Create feedback
Edit own feedback
Delete own feedback
Vote
Remove vote
Comment
Edit own comments
Delete own comments
Manage own profile/settings
Delete own account
```

### ADMIN

Everything a user can do, plus:

```text
Change feedback status
Pin/unpin feedback
Moderate comments
Manage categories
Manage statuses
Manage application settings
```

### Security rule

Authorization must be enforced on the **backend**.

Hiding a button in Angular is not authorization.

The backend must verify:

- authentication
- role
- ownership
- admin privileges
- request permissions

---

## 5. Core User Journeys

### Normal User

1. Registers or signs in through the identity provider.
2. Lands on the request list.
3. Uses sorting, status/category filters, text search, and pagination.
4. Opens a request.
5. Reads its discussion.
6. Votes/unvotes.
7. Adds a comment.
8. Creates a new request.
9. Edits their own request.
10. Deletes their own request.
11. Updates profile and application preferences.

### Admin

1. Signs in.
2. Reviews recently submitted requests.
3. Changes request status.
4. Pins important requests.
5. Deletes inappropriate comments.
6. Adds categories.
7. Retires unused categories.
8. Adjusts application-wide settings.

---

## 6. Settings

### User-level

- display name
- avatar or initials
- theme: light/dark/system
- language
- default list sorting
- default status filter
- default category filter
- email notification preferences
- notification for comments on own requests
- account deletion

### Admin-level

- categories
- statuses
- registration policy
- comment approval
- submission rate limit
- at least one feature flag that visibly changes application behavior

### Registration policies

```text
OPEN
INVITE_ONLY
RESTRICTED_TO_SPECIFIC_EMAIL_DOMAINS
```

### Feature flags

A feature flag must affect real behavior.

Example:

```text
enableVoting = false
```

When disabled:

- voting UI should be disabled/hidden
- backend voting operations must also reject the operation

Important configuration must be respected by both frontend and backend.

---

## 7. Configuration Resolution

There are global defaults and user-specific preferences.

Example:

```text
global default sorting
        ↓
user saved sorting preference
        ↓
effective sorting
```

Avoid a chain of blocking requests during application startup.

Prefer:

- one efficient configuration endpoint
- parallel requests
- cached server state
- sensible defaults
- lazy loading

---

## 8. Required Technology

### Frontend

**Angular is required.**

Do not replace it with React, Next.js, Vue, or Svelte unless the assignment provider explicitly approves it.

Recommended approach:

```text
Angular
Standalone Components
Angular Signals
Angular Router
Reactive Forms
TanStack Angular Query
Tailwind CSS
TypeScript
```

The chosen Angular version must be justified.

### Backend

Node.js is preferred.

Recommended:

```text
Node.js
NestJS
Prisma
PostgreSQL
```

A modular monolith is acceptable if its boundaries and reasoning are documented.

### Authentication

Use an open-source identity provider supporting:

- email/password
- at least one social provider

Do **not** implement authentication primitives yourself.

### Deployment

Cloud-native:

- containerized
- environment-driven configuration
- orchestrator-ready

Docker Compose and/or Kubernetes manifests are appropriate.

---

## 9. Frontend Architecture

Preserve the project's existing clean architecture:

```text
src/app/
├── api/
├── assets/
├── components/
│   └── ui/
├── constants/
├── context/
├── firebase/
├── hooks/
├── lang/
├── lib/
├── pages/
├── providers/
├── routes/
├── types/
└── interceptors/
```

Recommended feature expansion:

```text
pages/
├── login/
├── feedback/
│   ├── list/
│   ├── details/
│   ├── create/
│   └── edit/
├── profile/
└── admin/
    ├── categories/
    ├── statuses/
    ├── comments/
    └── settings/
```

API layer:

```text
api/
├── auth.api.ts
├── feedback.api.ts
├── comments.api.ts
├── votes.api.ts
├── categories.api.ts
├── statuses.api.ts
└── settings.api.ts
```

### Architecture rules

- Use standalone Angular components.
- Keep page components focused on presentation/orchestration.
- Keep API calls out of random components.
- Use services for reusable business/application behavior.
- Use Signals for appropriate local/shared reactive state.
- Use TanStack Angular Query for server state, caching, and invalidation.
- Use Reactive Forms for forms.
- Avoid unnecessary global state.

---

## 10. Backend Architecture

Recommended modules:

```text
auth
users
feedback
votes
comments
categories
statuses
settings
```

Do not create microservices merely to appear sophisticated.

For an application of this size, a modular monolith with clear seams can be the correct engineering decision.

---

## 11. Database

Recommended models:

```text
User
FeedbackRequest
Category
Status
Vote
Comment
AppSettings
AllowedEmailDomain
```

### FeedbackRequest

```text
id
title
description
pinned
authorId
categoryId
statusId
createdAt
updatedAt
```

### Vote

```text
id
userId
feedbackRequestId
createdAt
```

Constraint:

```text
UNIQUE(userId, feedbackRequestId)
```

### Comment

```text
id
content
authorId
feedbackRequestId
createdAt
updatedAt
```

### Category

```text
id
name
description
isActive
createdAt
updatedAt
```

### Status

```text
id
name
description
position
isActive
createdAt
updatedAt
```

### AppSettings

Should hold application-wide settings such as:

```text
registration policy
comment approval
submission rate limit
feature flags
```

---

## 12. Derived Data

Do not store values that can safely be derived.

Prefer:

```text
Vote records → voteCount
Comment records → commentCount
```

instead of maintaining duplicate counters that can become inconsistent.

---

## 13. Validation

Frontend validation provides good UX.

Backend validation is authoritative.

Validate:

- required fields
- valid category/status
- comment content
- authentication
- ownership
- admin permissions
- vote uniqueness
- feature flags
- submission rate limits

Never trust the frontend alone.

---

## 14. UX Requirements

UX is part of the deliverable.

Every important async flow should consider:

```text
Loading
Success
Empty
Error
```

The application should have:

- responsive layout
- keyboard accessibility
- clear validation messages
- useful error messages
- empty states
- loading states
- obvious vote state
- obvious request status
- clear admin controls
- usable search/filter/pagination

---

## 15. Security

### Authentication

Use the identity provider.

### Authorization

Enforce authorization server-side.

### Ownership

Normal users must not be able to modify another user's resources.

### Votes

Use a database uniqueness constraint.

### Input

Validate API input.

### Secrets

Never commit secrets. Use environment variables.

---

## 16. Seed Data

Seed useful demonstration data.

At minimum:

### Users

```text
admin
normal user
```

### Categories

```text
Bug
Feature
Improvement
Question
```

### Statuses

```text
New
Under Review
Planned
In Progress
Done
Declined
```

### Feedback

Create enough realistic data to demonstrate:

- search
- filtering
- sorting
- pagination
- votes
- comments
- statuses
- categories
- pinned requests

---

## 17. Testing

Focus tests on important behavior.

### Authentication

```text
successful login
invalid credentials
unauthenticated access
```

### Feedback

```text
create request
edit own request
reject editing another user's request
delete own request
```

### Votes

```text
vote
withdraw vote
duplicate vote rejected
```

### Comments

```text
create comment
edit own comment
delete own comment
reject modifying another user's comment
admin moderation
```

### Admin

```text
change status
pin request
create category
retire category
change settings
```

### Configuration

```text
feature flag on/off
registration policy
comment approval
rate limit
```

---

## 18. AI Coding Rules

AI is explicitly encouraged by the assignment, but AI is an engineering assistant, not an autonomous owner of the codebase.

### AI should help with

- planning
- boilerplate
- implementation
- tests
- debugging
- code review
- explaining tradeoffs
- identifying edge cases

### AI must not

- invent requirements
- silently change architecture
- add unnecessary dependencies
- assume APIs without verification
- bypass security
- remove validation to make code compile
- hide unfinished functionality
- blindly copy generated code

### Required workflow

```text
1. Understand requirement
2. Inspect existing code
3. Plan affected layers
4. Implement
5. Review generated code
6. Run tests/typecheck/build
7. Manually verify behavior
8. Refactor if needed
9. Commit
```

For a feature such as voting, consider the complete chain:

```text
Requirement
↓
Database constraint
↓
Backend authorization
↓
API
↓
Query/mutation
↓
Angular UI
↓
Loading/error states
↓
Cache invalidation
↓
Tests
```

---

## 19. Avoid Overengineering

Do not add complexity without a reason.

Avoid things such as:

```text
10 microservices
event sourcing
CQRS everywhere
Kafka
distributed transactions
complex state machines
```

unless a real requirement justifies them.

The assignment rewards engineering judgment, not maximum architectural complexity.

---

## 20. Required Documentation

### README.md

Must explain:

- what the project is
- architecture
- prerequisites
- environment variables
- local setup
- database/seed setup
- running the application
- tests
- what works
- what does not work
- AI-heavy commit convention

### DECISIONS.md

For meaningful decisions:

```text
Context
Options considered
Decision
Reasoning
Consequences
```

Include architectural choices and reasoning.

### SCOPE.md

Explain:

- what was built
- what was deliberately not built
- assumptions
- interpretation of ambiguity
- what would be done with another week

### AI_COLLABORATION.md

Document:

- AI tools used
- division of labor
- working method
- three non-trivial examples
- prompts used
- initial output
- what was changed
- failures/hallucinations
- rejected AI output, if any
- AI-heavy commit convention

---

## 21. Git History

Use real commits. Do not squash the assignment into one commit.

Example:

```text
chore: initialize angular frontend
chore: initialize nestjs backend
feat(auth): integrate identity provider
feat(feedback): add request domain
feat(feedback): add request listing
feat(votes): add voting workflow
feat(comments): add comments
feat(admin): add request triage
feat(admin): add taxonomy management
feat(settings): add application configuration
test(votes): cover duplicate vote protection
test(feedback): cover ownership rules
docs: add architecture decisions
docs: add ai collaboration report
```

AI-heavy commits must use a consistent convention documented in the README.

---

## 22. Definition of Done

A feature is not complete merely because its UI exists.

Where relevant, check:

```text
[ ] Database
[ ] Backend domain logic
[ ] Backend authorization
[ ] Validation
[ ] API
[ ] Frontend integration
[ ] UI
[ ] Loading state
[ ] Empty state
[ ] Error state
[ ] Cache/state update
[ ] Tests
[ ] Documentation
```

---

## 23. Evaluation Priorities

The assignment emphasizes:

### 1. AI collaboration

Evidence that the developer:

- directed AI
- understood generated code
- verified output
- corrected mistakes
- made decisions
- remained in control

### 2. Engineering quality

- consistency
- naming
- readability
- error handling
- maintainability
- meaningful Git history

### 3. Correctness and security

- server-side authorization
- validation
- secure endpoints
- correct business rules

### 4. User experience

- loading
- empty states
- errors
- accessibility
- responsive layout
- actionable validation

### 5. Architecture

Judged by reasoning and suitability for the application's size, not by number of services.

### 6. Scope and communication

- clear scope
- explicit assumptions
- honest unfinished work
- good handling of ambiguity

---

## 24. Final Instruction to an AI Coding Assistant

When working on FeedbackHub:

1. Read the existing code before changing it.
2. Preserve the existing architecture unless there is a strong reason not to.
3. Do not introduce dependencies without justification.
4. Prefer simple, explicit solutions.
5. Keep business logic out of presentation components.
6. Enforce authorization on the backend.
7. Validate user input.
8. Use database constraints for important invariants.
9. Treat loading, empty, and error states as first-class UI states.
10. Never fake unfinished functionality.
11. Document ambiguous interpretations in `SCOPE.md`.
12. Explain important architectural tradeoffs.
13. Run tests, type checking, and production builds after meaningful changes.
14. Review AI-generated code before considering it finished.
15. Keep implementation proportional to the size of FeedbackHub.

---

## 25. Quick Reference

```text
PRODUCT
FeedbackHub — internal employee product feedback board

FRONTEND
Angular
Standalone Components
Angular Signals
Angular Router
Reactive Forms
TanStack Angular Query
Tailwind CSS
TypeScript

BACKEND
Node.js preferred
NestJS recommended
Prisma recommended
PostgreSQL recommended

AUTH
Open-source identity provider
Email/password
At least one social provider
No custom authentication primitives

ROLES
USER
ADMIN

ENTITIES
User
FeedbackRequest
Category
Status
Vote
Comment
AppSettings
AllowedEmailDomain

FEATURES
Authentication
Feedback CRUD
Search
Filtering
Sorting
Pagination
Voting
Unvoting
Comments
Comment editing/deletion
Admin moderation
Request triage
Pinning
Category management
Status management
User settings
Admin settings
Feature flags
Registration policy
Rate limiting
Notifications/preferences

IMPORTANT RULES
One vote per user/request
Ownership enforced server-side
Admin authorization enforced server-side
Vote/comment counts derived
Categories configurable
Statuses configurable
Feature flag visibly changes behavior

DEPLOYMENT
Containerized
Environment-driven
Cloud-native
Orchestrator-ready

DOCUMENTATION
README.md
DECISIONS.md
SCOPE.md
AI_COLLABORATION.md
```

## Source

Based on the supplied **FeedbackHub — Senior Full Stack Developer Technical Assignment**. The assignment states that FeedbackHub is an internal feedback board, defines the user/admin journeys and settings, requires Angular on the frontend, an open-source identity provider, cloud-native deployment, documented architecture decisions, and an AI collaboration write-up.
