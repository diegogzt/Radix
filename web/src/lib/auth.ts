import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

type Client = SupabaseClient<Database>;

export async function signIn(
  client: Client,
  email: string,
  password: string,
) {
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  return data;
}

export async function signOut(client: Client) {
  const { error } = await client.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function getSession(client: Client) {
  const { data, error } = await client.auth.getSession();
  if (error) throw new Error(error.message);
  return data.session;
}

export async function getUser(client: Client) {
  const { data, error } = await client.auth.getUser();
  if (error) return null;
  return data.user;
}

/**
 * Look up the Facultatiu (doctor) record matching an auth user's email.
 */
export async function getFacultatuiByEmail(client: Client, email: string) {
  const { data, error } = await client
    .from('Facultatiu')
    .select('*')
    .eq('email', email)
    .single();

  if (error) return null;
  return data;
}
