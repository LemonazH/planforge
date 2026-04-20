// lib/supabase.js
// Due client separati: uno per il browser, uno per il server (con service role)

import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// ─── Client browser (componenti 'use client') ─────────────────────────────
// Usa la anon key — rispetta RLS
let browserClient;
export function getSupabaseBrowser() {
  if (!browserClient) {
    browserClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  return browserClient;
}

// ─── Client server con cookie (Server Components, Route Handlers) ─────────
// Usa la anon key + cookie di sessione dell'utente
export function getSupabaseServer() {
  const cookieStore = cookies();
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {}
      },
    },
  });
}

// ─── Admin client server-side (bypassa RLS, solo backend) ────────────────
// NON esporre mai al browser. Usato solo in Route Handlers per:
// - Webhook Stripe (aggiornare piano utente da outside)
// - Operazioni admin
let adminClient;
export function getSupabaseAdmin() {
  if (!adminClient) {
    adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return adminClient;
}
