# Repository Guidelines

## Project Structure & Module Organization
- Primary routes live under `app/` (e.g., `app/page.tsx` for the landing view and `app/layout.tsx` for shared shells).
- Global styles and Tailwind tokens sit in `app/globals.css`; extend design variables there when introducing new themes.
- Shared React components belong in `components/`, with UI primitives in `components/ui/` following shadcn patterns and TypeScript exports.
- Utilities reside in `lib/` (see `lib/utils.ts` for the `cn` helper); favor the `@/*` path aliases defined in `tsconfig.json` over deep relative imports.
- Static assets belong in `public/`; update `components.json` when registering additional UI elements.

## Build, Test, and Development Commands
- `pnpm install` — install dependencies (pnpm is the expected package manager).
- `pnpm dev` — launch the Next.js dev server with Turbopack at `http://localhost:3000`.
- `pnpm build` — produce an optimized production build; run before release branches or deployments.
- `pnpm start` — serve the production build locally for smoke tests.
- `pnpm lint` — run ESLint with the Next.js Core Web Vitals ruleset; ensure a clean run before requesting review.

## Coding Style & Naming Conventions
- Write TypeScript-first React components; PascalCase file names for components (`Button.tsx`) and camelCase for utilities.
- Keep indentation at two spaces and rely on ESLint autofix; prefer Tailwind utility classes and tokens over bespoke CSS.
- Use functional components and the shared `cn` helper for composing class names; avoid anonymous default exports.
- Co-locate component-specific assets (icons, mock data) alongside the component folder when practical.

## Testing Guidelines
- Automated tests are not yet configured; when introducing suites, favor React Testing Library with files named `ComponentName.test.tsx` placed in `__tests__/` near the source.
- Cover critical logic (utilities in `lib/`) with focused unit tests and smoke-test new UI via Playwright snapshots where feasible.
- Always run `pnpm lint` and exercise affected flows in `pnpm dev` before requesting review.

## Commit & Pull Request Guidelines
- Existing history uses short imperative subjects (`Initial commit from Create Next App`); keep summaries under 72 characters and in present tense.
- Adopt Conventional Commit prefixes for clarity (e.g., `feat: add sidebar filters`, `fix: correct button aria state`).
- Each PR should describe the change, list manual verification steps, and attach screenshots or GIFs for UI-impacting updates.
- Reference related issues using `Fixes #123` and flag any breaking changes in the description.
