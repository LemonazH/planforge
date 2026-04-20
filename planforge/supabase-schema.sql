-- ============================================================
-- PLANFORGE — Schema Database Supabase
-- Incolla questo nell'SQL Editor di Supabase e clicca RUN
-- ============================================================

-- ─── TABELLA PROFILI UTENTE ──────────────────────────────────
-- Si popola automaticamente quando un utente si registra
CREATE TABLE public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT NOT NULL,
  full_name     TEXT,
  plan          TEXT NOT NULL DEFAULT 'free',   -- 'free' | 'pro'
  plans_used    INTEGER NOT NULL DEFAULT 0,      -- contatore piani generati (piano free)
  plans_limit   INTEGER NOT NULL DEFAULT 3,      -- limite piano free
  stripe_customer_id   TEXT,
  stripe_subscription_id TEXT,
  subscription_status  TEXT DEFAULT 'inactive', -- 'active' | 'canceled' | 'inactive'
  subscription_end_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── TABELLA BUSINESS PLAN ───────────────────────────────────
CREATE TABLE public.business_plans (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,                        -- "Business Plan — NomeAzienda"
  company_name  TEXT NOT NULL,
  sector        TEXT,
  stage         TEXT,
  country       TEXT,
  form_data     JSONB NOT NULL,                       -- tutti i dati del wizard
  output_text   TEXT NOT NULL,                        -- testo markdown generato
  search_queries TEXT[],                              -- query Google usate
  word_count    INTEGER,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── TRIGGER: crea profilo automaticamente alla registrazione ─
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── TRIGGER: aggiorna updated_at automaticamente ────────────
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER plans_updated_at
  BEFORE UPDATE ON public.business_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ─── ROW LEVEL SECURITY (RLS) ────────────────────────────────
-- Gli utenti vedono SOLO i propri dati
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_plans ENABLE ROW LEVEL SECURITY;

-- Profili: l'utente può leggere e aggiornare solo il proprio
CREATE POLICY "Utente vede solo il proprio profilo"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Utente aggiorna solo il proprio profilo"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Business plan: l'utente vede e crea solo i propri
CREATE POLICY "Utente vede solo i propri piani"
  ON public.business_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Utente crea piani propri"
  ON public.business_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Utente elimina propri piani"
  ON public.business_plans FOR DELETE
  USING (auth.uid() = user_id);

-- Service role (usato dal server Next.js) bypassa RLS
-- Il service_role_key è già privilegiato per default in Supabase

-- ─── INDICI per performance ───────────────────────────────────
CREATE INDEX idx_business_plans_user_id ON public.business_plans(user_id);
CREATE INDEX idx_business_plans_created_at ON public.business_plans(created_at DESC);
CREATE INDEX idx_profiles_stripe_customer ON public.profiles(stripe_customer_id);

-- ─── VISTA: statistiche utente (comoda per la dashboard) ─────
CREATE VIEW public.user_stats AS
SELECT
  p.id,
  p.email,
  p.plan,
  p.plans_used,
  p.plans_limit,
  COUNT(bp.id) AS total_plans,
  MAX(bp.created_at) AS last_plan_at
FROM public.profiles p
LEFT JOIN public.business_plans bp ON bp.user_id = p.id
GROUP BY p.id, p.email, p.plan, p.plans_used, p.plans_limit;
