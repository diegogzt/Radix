# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All frontend commands must be run from the `frontend/` directory. Uses **bun** as the package manager.

```bash
# Development
cd frontend && bun run dev        # Start dev server (port 4321)
cd frontend && bun run build      # Production build
cd frontend && bun run preview    # Preview production build

# Type checking
cd frontend && bunx tsc --noEmit

# Backend (FastAPI)
cd backend && pip install -r requirements.txt
cd backend && uvicorn app.main:app --reload --port 8000
```

## Architecture

### Astro Islands Pattern

The frontend uses **Astro 5 SSR** (`output: 'server'`, `@astrojs/node` standalone adapter) with selective React hydration:
- `.astro` files are server-rendered — use for layout, data fetching via Supabase in frontmatter
- `.tsx` files with `client:load` are React islands — use for interactive, real-time, or stateful UI
- Static content stays in Astro; interactivity is isolated to islands

### Page Routing

| Route | File | Notes |
|---|---|---|
| `/` | `pages/index.astro` | Entry point |
| `/dashboard` | `pages/dashboard.astro` | Main dashboard |
| `/login` | `pages/login.astro` | Public |
| `/patients` | `pages/patients/index.astro` | Patient list |
| `/patients/[id]` | `pages/patients/[id].astro` | Patient detail |
| `/treatments` | `pages/treatments/index.astro` | Treatment list |
| `/treatments/new` | `pages/treatments/new.astro` | New treatment form |
| `/treatments/[treatmentId]` | `pages/treatments/[treatmentId].astro` | Treatment detail |
| `/monitoring` | `pages/monitoring/index.astro` | Live monitoring |
| `/settings` | `pages/settings.astro` | Settings |
| `/api/auth/login` | `pages/api/auth/login.ts` | POST — email/password sign-in |
| `/api/auth/callback` | `pages/api/auth/callback.ts` | GET — OAuth callback |

### Auth Flow

Auth is enforced in `src/middleware.ts`. Every non-public route passes through it:
1. Middleware creates a per-request server Supabase client (cookie-based session)
2. `supabase.auth.getUser()` validates the session
3. On success: `context.locals.user` and `context.locals.supabase` are set for use in `.astro` frontmatter
4. On failure: redirects to `/login`

Public routes: `/login`, `/api/auth/callback`, `/api/auth/login`

### Supabase Clients — Two Types

Defined in `src/lib/supabase.ts`:

- `getSupabaseBrowserClient()` — singleton, used inside React islands (`client:load`)
- `createServerSupabaseClient(cookieHeader, setCookie)` — per-request, used in middleware
- `getServerClient(Astro)` — convenience wrapper for `.astro` frontmatter

**Never use the browser client in `.astro` frontmatter** — it runs on the server during SSR and won't have access to browser cookies.

### Database (Supabase PostgreSQL)

Schema is **immutable** (V5). 11 tables with PascalCase names:

| Table | Purpose |
|---|---|
| `Treatment` | Central join table — links Patient, Facultatiu, Dispositiu_Rellotge, Radioisotope, UnitCatalog |
| `Patient` | Patient records |
| `Facultatiu` | Physicians |
| `Dispositiu_Rellotge` | IoT wearable devices (MAC, battery, status) |
| `Radioisotope` | Radioactive isotopes catalog |
| `HealthMetrics` | Biometrics: BPM, radiation, distance, steps — **Realtime enabled** |
| `Alerta_Metge` | Medical alerts — **Realtime enabled** |
| `UnitCatalog` | Measurement units |
| `GameSession` | Patient game engagement |
| `MotivationMessage` | Messages to patients |
| `Settings` | Per-patient preferences |

Realtime subscriptions (for `Alerta_Metge` and `HealthMetrics`) must be enabled in the Supabase Dashboard.

### Backend (FastAPI)

The FastAPI backend (`backend/`) is currently a scaffold — only `/health` exists. The directory structure (`app/api/routes/`, `app/models/`, `app/schemas/`, `app/services/`) is in place for expansion. Key dependency: `supabase>=2.4.5` for server-side Supabase access.

### Path Aliases

Configured in `tsconfig.json`:
- `@components/*` → `src/components/*`
- `@layouts/*` → `src/layouts/*`
- `@lib/*` → `src/lib/*`
- `@styles/*` → `src/styles/*`

### Environment Variables

Create `frontend/.env` with:
```
PUBLIC_SUPABASE_URL=...
PUBLIC_SUPABASE_ANON_KEY=...
```

Both are prefixed `PUBLIC_` so Astro exposes them client-side via `import.meta.env`.

### Key Library Files

- `src/lib/supabase.ts` — Supabase client factories (browser singleton + server per-request)
- `src/lib/types.ts` — Full TypeScript database schema (generated types for all 11 tables)
- `src/lib/queries.ts` — All Supabase query functions; add new data-access logic here
- `src/lib/realtime.ts` — Real-time subscription setup for `HealthMetrics` and `Alerta_Metge`
- `src/lib/utils.ts` — General utility functions

### UI Libraries

- **Tailwind CSS v3** via `@astrojs/tailwind`
- **recharts** — charts and data visualizations
- **lucide-react** — icon set
- **zod** — schema validation

### Node & Package Manager

Node 22+ required (see `.nvmrc`). Use `bun` not `npm` or `yarn`.
