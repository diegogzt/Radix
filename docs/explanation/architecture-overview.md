# Architecture Overview

The Radix Medical Dashboard is a modern, full-stack web application designed for monitoring medical treatments involving radioisotopes.

## Technology Stack

- **Framework**: [Astro](https://astro.build/) (v5) - Used for server-side rendering, routing, and overall project structure.
- **Frontend Components**: [React](https://react.dev/) (v19) - Used for interactive "islands" like the dashboard charts and real-time monitoring.
- **Backend/Database**: [Supabase](https://supabase.com/) - Provides PostgreSQL, Authentication, and Real-time capabilities.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - For a responsive and modern user interface.
- **Icons**: [Lucide React](https://lucide.dev/) - For consistent and high-quality iconography.
- **Charts**: [Recharts](https://recharts.org/) - For data visualization of health metrics.

## Component Architecture

The project follows the "Astro Islands" architecture, where static content is rendered as HTML, and interactive parts are hydrated as React components.

- **Layouts**: Located in `src/layouts/`, these define the common page structure (Sidebar, Navbar).
- **React Components**: Located in `src/components/`, these are divided by feature (dashboard, patients, monitoring, etc.).
- **Astro Pages**: Located in `src/pages/`, these serve as the entry points for different routes and often pass data from Supabase to React components.

## Data Flow

1.  **Server-side**: Astro pages fetch initial data from Supabase using the server client (`getServerClient`).
2.  **Hydration**: Data is passed as props to React components.
3.  **Client-side**: React components use the Supabase browser client (`getSupabaseBrowserClient`) for client-side actions and real-time subscriptions.
4.  **Utilities**: Core logic for queries, authentication, and state management is centralized in `src/lib/`.

## Key Directories

- `/src/lib`: Helper functions and TypeScript types for Supabase and Auth.
- `/src/components/ui`: Reusable UI primitives (buttons, cards, inputs).
- `/src/components/monitoring`: Specialized components for real-time health data.
