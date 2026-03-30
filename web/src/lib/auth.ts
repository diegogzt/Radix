/**
 * Auth utilities — all calls go through api.raddix.pro, no Supabase.
 */

const API_BASE = (import.meta.env.PUBLIC_API_URL as string | undefined) ?? '';

export async function signIn(email: string): Promise<{ nom: string; email: string }> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error ?? 'Login fallido');
  return { nom: data.nom, email: data.email };
}
