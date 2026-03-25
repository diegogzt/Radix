# Authentication Flow

This guide explains how authentication is handled in the Radix Medical Dashboard using Astro and Supabase.

## Overview

The project uses **Supabase SSR** to manage authentication sessions seamlessly between the client and server.

- **Server-side**: Authentication is handled in Astro middleware and frontmatter.
- **Client-side**: Authentication is managed using the Supabase browser client in React components.

## 1. Login Process

The login page (`src/pages/login.astro`) uses a standard form. When submitted, it calls the `signIn` function from `src/lib/auth.ts`.

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});
```

Supabase then sets a session cookie, which is automatically shared with the server.

## 2. Middleware Protection

Astro middleware (`src/middleware.ts`) checks for a valid session on every request. If a user is not authenticated and tries to access a protected route (like `/dashboard`), they are redirected to `/login`.

```typescript
// Example middleware logic
const supabase = getServerClient(context);
const { data: { user } } = await supabase.auth.getUser();

if (!user && !context.url.pathname.startsWith('/login')) {
  return context.redirect('/login');
}
```

## 3. Session Management

- **`getServerClient(Astro)`**: Creates a server-side Supabase client using Astro's request context and cookies.
- **`getSupabaseBrowserClient()`**: Returns a singleton Supabase client for use in browser-rendered components.

## 4. User Scoping

Authentication is linked to the `facultatiu` (doctor) records. After a user logs in, we often fetch their corresponding doctor record to scope data access:

```typescript
import { getFacultatuiByEmail } from '../lib/auth';

const user = await getUser(supabase);
const doctor = await getFacultatuiByEmail(supabase, user.email);
```

## Log Out

Logged-out users are redirected to the home page or login screen after their session is destroyed via `supabase.auth.signOut()`.
