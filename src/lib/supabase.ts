import { createClient } from '@supabase/supabase-js';

/**
 * Browser Supabase client for the contact form.
 * Reads public env vars (see .env.local.example). The anon key is safe to
 * expose; protect writes with Row Level Security on the `messages` table.
 *
 * Expected table:
 *   create table messages (
 *     id uuid primary key default gen_random_uuid(),
 *     name text not null,
 *     email text not null,
 *     message text not null,
 *     created_at timestamptz default now()
 *   );
 *   -- RLS policy: allow anon INSERT only.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** True when env vars are present — lets the form degrade gracefully if not. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;
