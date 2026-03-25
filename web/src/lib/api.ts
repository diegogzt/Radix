/**
 * Cliente HTTP para el backend FastAPI.
 * La URL base se lee de PUBLIC_API_URL (configurable por .env sin tocar código).
 *
 * En islas React (client:load) usa la URL horneada en tiempo de build.
 * En .astro frontmatter (SSR) la lee del entorno en tiempo de ejecución.
 */

const API_BASE = (import.meta.env.PUBLIC_API_URL as string | undefined) ?? '';

export async function apiFetch<T = unknown>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error(`API ${res.status} — ${res.statusText} (${url})`);
  }

  return res.json() as Promise<T>;
}

/** GET helper */
export const apiGet = <T>(path: string) => apiFetch<T>(path);

/** POST helper */
export const apiPost = <T>(path: string, body: unknown) =>
  apiFetch<T>(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
