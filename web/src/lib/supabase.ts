import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { createServerClient as createSSRClient, parseCookieHeader } from '@supabase/ssr';
import type { Database } from './types';

/**
 * Browser-side Supabase client (singleton).
 * Used in React islands (client:load components).
 */
let browserClient: SupabaseClient<Database> | null = null;

export function getSupabaseBrowserClient(): SupabaseClient<Database> {
  if (browserClient) return browserClient;

  browserClient = createClient<Database>(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
  );

  return browserClient;
}

/**
 * Server-side Supabase client (per-request).
 * Used in Astro frontmatter and middleware.
 * Handles auth cookies for SSR.
 */
export function createServerSupabaseClient(
  cookieHeader: string | null,
  setCookie: (name: string, value: string, options: Record<string, unknown>) => void,
): SupabaseClient<Database> {
  return createSSRClient<Database>(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(cookieHeader ?? '');
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            setCookie(name, value, options as Record<string, unknown>);
          });
        },
      },
    },
  );
}

/**
 * Convenience: create server client from Astro context.
 */
export function getServerClient(Astro: {
  request: Request;
  cookies: {
    set: (name: string, value: string, options?: Record<string, unknown>) => void;
  };
}): SupabaseClient<Database> {
  return createServerSupabaseClient(
    Astro.request.headers.get('cookie'),
    (name, value, options) => {
      Astro.cookies.set(name, value, options);
    },
  );
}
