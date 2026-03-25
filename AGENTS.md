# Agent Guidelines for Radix Medical Dashboard

## Project Overview

Monorepo structure with:
- **web/** - Astro 5 SSR frontend (React islands) - uses bun
- **api/** - Java/Spring Boot backend
- Root folder contains agent configuration (skills, memory, documentation)

## Build Commands

### Web (run from `web/` directory)

```bash
cd web
bun install           # Install dependencies
bun run dev          # Start dev server (port 4321)
bun run build        # Production build
bun run preview      # Preview production build
bunx tsc --noEmit   # TypeScript type checking
```

### API (run from `api/` directory)

```bash
cd api
./mvnw spring-boot:run  # Start development server
./mvnw package           # Build JAR file
java -jar target/radix-*.jar  # Run production build
```

## Code Style Guidelines

### Web (Astro/React/TypeScript)

- **Astro Islands Pattern**: Use `.astro` files for server-rendered layout and data fetching.
  Use `.tsx` React components with `client:load` for interactive UI.
- **Never use browser Supabase client in `.astro` frontmatter** — it runs on server during SSR.
- **PascalCase for database tables** (e.g., `Patient`, `Treatment`, `HealthMetrics`).

#### TypeScript

- Use strict TypeScript (extends `astro/tsconfigs/strict`).
- Define types in `src/lib/types.ts`.
- Use path aliases: `@components/*`, `@layouts/*`, `@lib/*`, `@styles/*`.
- Prefer interfaces over type aliases for object shapes.

#### Imports

- Use absolute imports with path aliases (e.g., `@lib/supabase`).
- Group imports: external libraries → internal modules → relative imports.
- Named imports preferred (e.g., `import { useState } from 'react'`).

#### React/Astro Components

- Use functional components with hooks.
- React components go in `src/components/` (PascalCase files).
- Astro components go in `src/components/` or `src/layouts/`.
- Client-side interactive components need `client:load` directive in Astro.

#### Naming Conventions

- Components: PascalCase (e.g., `PatientTable.tsx`, `TreatmentCard.astro`)
- Functions/variables: camelCase
- Constants: SCREAMING_SNAKE_CASE
- Files: kebab-case for non-component files

#### Error Handling

- Use Zod for form validation (already installed).
- Handle Supabase errors gracefully with user feedback.
- Log errors appropriately for debugging.

#### Database

- Use server Supabase client for SSR (`createServerSupabaseClient`).
- Use browser client only in React islands.
- All 11 tables: Patient, Treatment, Facultatiu, Dispositiu_Rellotge, Radioisotope,
  HealthMetrics, Alerta_Metge, UnitCatalog, GameSession, MotivationMessage, Settings.

#### Security

- Auth enforced in `src/middleware.ts`.
- Validate all user inputs with Zod.
- Never expose secrets in client-side code.

#### Styling

- Use Tailwind CSS v3 via `@astrojs/tailwind`.
- Utility classes preferred; avoid custom CSS unless necessary.
- Follow existing component patterns in `src/components/`.

### API (Java/Spring Boot)

- Follow Spring Boot conventions
- Use Java 17+ features
- Follow standard package structure (com.radix.*)

## Testing

No test framework configured. To add tests, prefer:
- Vitest for web unit tests
- Playwright for web E2E tests
- JUnit for API tests

## File Organization

```
radix-project/
├── api/                    # Java/Spring Boot backend
│   ├── src/
│   │   └── main/
│   │       ├── java/com/radix/
│   │       └── resources/
│   ├── pom.xml
│   └── mvnw
│
├── web/                    # Astro frontend
│   ├── src/
│   │   ├── components/     # React (.tsx) and Astro (.astro) components
│   │   ├── layouts/        # Astro layouts
│   │   ├── lib/            # Utilities, types, Supabase client, queries
│   │   ├── pages/          # Astro pages and API routes
│   │   └── styles/         # Global CSS
│   ├── package.json
│   ├── astro.config.mjs
│   └── tailwind.config.mjs
│
├── docs/                   # Documentation
├── skills/                 # Agent skills
├── AGENTS.md              # This file
└── CLAUDE.md              # Main documentation
```

## Key Files Reference

### Web
- `web/src/lib/supabase.ts` — Supabase client factories
- `web/src/lib/types.ts` — TypeScript types for database schema
- `web/src/lib/queries.ts` — Supabase query functions
- `web/src/middleware.ts` — Auth enforcement
- `web/astro.config.mjs` — Astro configuration (SSR mode)

### API
- `api/src/main/java/com/radix/RadixApplication.java` — Main Spring Boot application
- `api/pom.xml` — Maven configuration
