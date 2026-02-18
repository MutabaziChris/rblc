/**
 * Supabase Client Configuration
 * 
 * This file exports two Supabase clients:
 * 1. `supabase` - Client-side client (uses anon key, respects RLS)
 * 2. `createServerClient()` - Server-side client (uses service role key, bypasses RLS)
 * 
 * Usage:
 * - Use `supabase` in client components and public API routes
 * - Use `createServerClient()` in admin API routes for full database access
 */

import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

/**
 * Client-side Supabase client
 * Uses anon key and respects Row Level Security (RLS) policies
 * Use this in React components and public API routes
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Server-side Supabase client with service role key
 * Bypasses RLS policies - use only in admin API routes
 * 
 * @returns Supabase client with admin privileges
 */
export const createServerClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
