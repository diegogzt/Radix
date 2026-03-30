import type { APIRoute } from 'astro';

const API_BASE = import.meta.env.PUBLIC_API_URL ?? '';

export const POST: APIRoute = async ({ request, cookies }) => {
  const formData = await request.formData();
  const email = formData.get('email') as string;

  if (!email) {
    return new Response(JSON.stringify({ error: 'Email requerido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    return new Response(JSON.stringify({ error: data.error ?? 'Login fallido' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Store email in a cookie as the session identifier
  cookies.set('radix-user', encodeURIComponent(email), {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 8, // 8 hours
    secure: import.meta.env.PROD,
  });

  return new Response(JSON.stringify({ success: true, nom: data.nom }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
