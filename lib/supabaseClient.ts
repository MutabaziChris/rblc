/**
 * Supabase Client Configuration
 *
 * This file exports two Supabase clients:
 * 1. `supabase` - Client-side client (uses anon key, respects RLS)
 * 2. `createServerClient()` - Server-side client (uses service role key, bypasses RLS)
 *
 * Lazy-initialized to avoid "Missing Supabase environment variables" during Vercel build
 * when env vars are not yet available. Validation happens on first use at runtime.
 *
 * Usage:
 * - Use `supabase` in client components and public API routes
 * - Use `createServerClient()` in admin API routes for full database access
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      throw new Error('Missing Supabase environment variables');
    }
    _supabase = createClient(url, key);
  }
  return _supabase;
}

/**
 * Client-side Supabase client
 * Uses anon key and respects Row Level Security (RLS) policies
 * Use this in React components and public API routes
 */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    return (getSupabase() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

/**
 * Server-side Supabase client with service role key
 * Bypasses RLS policies - use only in admin API routes
 *
 * @returns Supabase client with admin privileges
 */
export const createServerClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
  if (!serviceRoleKey) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
