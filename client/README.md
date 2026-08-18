# feedbackhub-frontend

Angular frontend template for FeedbackHub.

## Architecture

The structure intentionally mirrors the supplied React template:

- `src/app/api` — API client/services
- `src/app/assets` — static application assets
- `src/app/components` — reusable application components
- `src/app/components/ui` — reusable UI primitives
- `src/app/constants` — application constants
- `src/app/context` — global Angular Signals/state
- `src/app/firebase` — Firebase/FCM integration
- `src/app/hooks` — reusable application helpers/services
- `src/app/lang` — translations
- `src/app/lib` — generic utilities
- `src/app/pages` — route-level pages
- `src/app/providers` — application-wide providers/config
- `src/app/routes` — Angular routes
- `src/app/types` — shared TypeScript types
- `src/app/interceptors` — HTTP interceptors

## React -> Angular mapping

| Existing React template | Angular equivalent |
|---|---|
| React | Angular standalone components |
| React Router | Angular Router |
| React Hook Form | Angular Reactive Forms |
| Preact Signals | Angular Signals |
| React Query | TanStack Angular Query |
| Axios | Axios kept for API compatibility |
| Radix UI | Small Angular UI primitives |
| lucide-react | lucide-angular |
| Tailwind CSS | Tailwind CSS v4 |
| clsx / tailwind-merge | Same |
| Firebase | Same Firebase SDK |

## Start

```bash
bun install
bun run dev
```

Open http://localhost:4200.

## Build

```bash
bun run build
```

The production build is generated under `dist/`.

## Package manager

Detected: `bun`

Override:

```bash
PACKAGE_MANAGER=pnpm ./angular.sh my-feedbackhub
```
