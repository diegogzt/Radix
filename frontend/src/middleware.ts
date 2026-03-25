import { defineMiddleware } from 'astro:middleware';
import { createServerSupabaseClient } from '@lib/supabase';

const PUBLIC_ROUTES = ['/login', '/api/auth/callback', '/api/auth/login'];

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Allow public routes
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return next();
  }

  // Allow static assets
  if (pathname.startsWith('/_astro') || pathname.startsWith('/favicon')) {
    return next();
  }

  const supabase = createServerSupabaseClient(
    context.request.headers.get('cookie'),
    (name, value, options) => {
      context.cookies.set(name, value, options as Record<string, unknown>);
    },
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return context.redirect('/login');
  }

  // Attach user and supabase client to locals
  context.locals.user = user;
  context.locals.supabase = supabase;

  return next();
});
