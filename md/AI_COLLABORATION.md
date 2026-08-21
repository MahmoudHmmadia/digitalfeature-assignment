# AI Collaboration

## Tools and division of labor

The project was developed in VS Code and Antigravity. AI tools included ChatGPT,
Codex, Gemini, and Claude Opus. Models were selected by task rather than using
one model for everything:

- Claude Opus was used for higher-level structure and for translating established
  React architecture ideas into Angular patterns.
- ChatGPT helped convert existing automation/templates and discuss Angular best
  practices.
- Gemini was useful for focused UI revisions, translations, repetitive cleanup,
  and component-level changes.
- Codex was used for repository-aware implementation, review, verification, API
  documentation, deployment artifacts, and final documentation.

The developer has substantial full-stack and DevOps experience with Node.js,
Express, NestJS, React, and Next.js. The backend shape, domain sequencing,
authorization expectations, automation approach, and deployment direction were
developer-led. Angular was the unfamiliar part, so AI support was concentrated
there. Generated code was treated as a draft: it was fitted to the existing
structure, read, tested in the UI/API, and corrected before being kept.

## Working method

1. Start from existing personal automation for hooks, components, utilities,
   responses, middleware, and module scaffolding rather than generate an
   unrelated project structure.
2. Ask AI to translate the React-oriented frontend automation into Angular 20
   concepts and establish the Bun/Turborepo client/server workspace.
3. Build authentication first, then connect Angular to real API contracts with
   separate page presentation, feature services, reusable controls, and dialogs.
4. Implement vertical feature slices: feedback and categories, then role-based
   routes and screens, then votes, comments, accounts, and settings.
5. Add Swagger schemas and operations module by module, while the API context was
   fresh.
6. Exercise the UI, improve components and links, add missing English/Arabic
   strings, and extract repeated patterns such as searchable selects.
7. Run type/build checks, inspect diffs, and finish deployment and documentation
   artifacts.

The method changed during the assignment. Early prompts asked for broader
structure conversion because Angular patterns were new. Later prompts became
smaller and contract-driven: one page, service, translation group, Swagger
module, or deployment concern at a time. This made review easier and reduced the
chance that a UI change silently altered backend behavior.

## Three non-trivial examples

### 1. Translating React automation into Angular architecture

**Prompt excerpt**

> Here is the automation/structure I use in React for API calls, hooks,
> components, utilities, and pages. Convert it to Angular 20 best practices.
> Keep UI separate from logic, use reusable components, and do not copy React
> hooks literally when Angular has a better pattern.

**Initial output:** AI proposed Angular equivalents for API clients, query and
mutation helpers, standalone components, route definitions, and feature
services. Some naming deliberately stayed familiar (`use-custom-query`,
`use-calls`) to make the transition easier.

**Developer review and changes:** The developer chose the final boundaries,
kept page components focused on presentation/orchestration, moved calls and
state into injectable services, used signals where appropriate, and extracted
reusable form/UI controls. React mental models were retained only when they fit
Angular dependency injection and lifecycle behavior.

**Why this mattered:** This was not simple boilerplate generation. It established
the frontend architecture used by every later feature while letting an
experienced React developer work productively in Angular.

### 2. Building feedback/categories across roles and layers

**Prompt excerpt**

> Build the feedback and category flows against the existing Express API. Users
> need list/detail/create/edit behavior with search, filters, pagination, votes,
> and comments. Admins need separate routes for triage, pin/status actions, and
> category management. Keep reusable dialogs/components and put authorization on
> the backend, not only in Angular.

**Initial output:** AI drafted Angular pages/services and helped extend the API
contracts for the feature slice. It accelerated repetitive wiring between typed
requests, loading states, form controls, route parameters, and page templates.

**Developer review and changes:** The work was split into public authentication,
authenticated user, and admin route trees. The developer checked API ownership
and role enforcement, aligned validation with Prisma, separated feature services
from UI, reused cards/dialogs/filters, and documented each module in Swagger as
it was completed.

**Verification:** The flows were exercised in the browser and through Swagger:
create/edit/delete ownership, list filters and pagination, admin pin/status
changes, and category operations. Missing assignment items were recorded rather
than represented as complete.

### 3. UI review, translations, and reusable controls

**Prompt excerpt**

> Review the current Angular UI for repeated controls, missing English/Arabic
> translations, broken links, loading/empty/error states, and mobile issues.
> Extract a searchable select and other reusable pieces where there is real
> duplication. Keep API/state logic out of the template components.

**Initial output:** Gemini/Codex produced targeted translation additions,
component revisions, and suggestions for reusable selects, filters, pagination,
dialogs, and response handling.

**Developer review and changes:** The developer tested both route trees and
languages, corrected component inputs and links, rejected one-off abstractions,
and kept only components that simplified multiple screens. UI changes were
checked against live API responses rather than static mock data.

**Why this mattered:** Broad UI cleanup can easily create inconsistent contracts
or untranslated strings. Restricting each pass to a visible behavior made the
changes reviewable.

## Failures, hallucinations, and rejected output

- Early AI suggestions sometimes looked too much like React with Angular syntax.
  They were refactored into dependency-injected services, signals, reactive
  forms, and Angular route/lifecycle patterns.
- Generated UI work occasionally missed translations or produced a control that
  solved only one screen. Manual navigation in English and Arabic exposed these
  gaps; repeated behavior was extracted and one-off abstractions were rejected.
- An early documentation snapshot described the repository as authentication
  only and listed feedback, votes, comments, admin, and settings as unbuilt. That
  became false as the implementation progressed. The final documentation was
  rewritten from the actual route, controller, schema, and page inventory.
- AI output was not accepted as proof that a feature was complete. Builds,
  Swagger/manual API checks, role/ownership review, and browser testing were used
  to find integration gaps.
- The identity-provider requirement and missing database vote uniqueness were
  not hidden by generated prose. They remain explicit limitations.

## What the developer did without delegating ownership

- Chose the architecture and feature order.
- Reused and adapted established backend/project automation.
- Defined domain boundaries, API shapes, role/ownership rules, and reusable UI
  expectations.
- Selected the model appropriate to the task and narrowed prompts as the codebase
  matured.
- Reviewed generated code, resolved integration issues, tested the UI/API, and
  decided what to keep or reject.
- Accepted responsibility for incomplete requirements and documented follow-up
  work.

## AI-heavy commit convention

Material AI assistance is marked with a consistent footer:

```text
AI-Assisted: <tool/model> helped with <scope>; developer reviewed and verified the final diff.
```

Small completions that do not materially shape a commit do not require the
footer. The convention identifies collaboration; it does not transfer ownership
of the result to the model.
