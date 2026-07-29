import { createClient } from "@supabase/supabase-js";

/**
 * Supabase Client
 *
 * WHAT IT IS: Creates connections to your Supabase database.
 * WHY IT EXISTS: Every API route that reads/writes data uses this.
 * REAL WORLD ANALOGY: The phone line to your database — one for public calls (anon)
 *                     and one for admin calls (service_role).
 *
 * - supabase: for browser-safe operations (limited by Row Level Security)
 * - supabaseAdmin: for server-side operations (bypasses RLS, full access)
 */

// Client for browser-side or general operations
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Admin client for server-side operations (never expose this to the browser)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
