-- ============================================
-- RADIX Medical Dashboard - Database Migration
-- Creates all required tables in public schema
-- ============================================

-- 1. patient (no FK dependencies)
CREATE TABLE IF NOT EXISTS public.patient (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. facultatiu (no FK dependencies)
CREATE TABLE IF NOT EXISTS public.facultatiu (
  id SERIAL PRIMARY KEY,
  nom TEXT NOT NULL,
  email TEXT NOT NULL,
  especialitat TEXT
);

-- 3. dispositiu_rellotge (no FK dependencies)
CREATE TABLE IF NOT EXISTS public.dispositiu_rellotge (
  id SERIAL PRIMARY KEY,
  mac_address TEXT NOT NULL,
  model TEXT,
  nivell_bateria INT,
  estat TEXT DEFAULT 'DISPONIBLE'
);

-- 4. radioisotope (no FK dependencies)
CREATE TABLE IF NOT EXISTS public.radioisotope (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  symbol TEXT,
  type TEXT,
  half_life DOUBLE PRECISION
);

-- 5. unitcatalog (no FK dependencies)
CREATE TABLE IF NOT EXISTS public.unitcatalog (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  symbol TEXT NOT NULL
);

-- 6. treatment (depends on patient, facultatiu, dispositiu_rellotge, radioisotope, unitcatalog)
CREATE TABLE IF NOT EXISTS public.treatment (
  id SERIAL PRIMARY KEY,
  patient_id INT REFERENCES public.patient(id),
  facultatiu_id INT REFERENCES public.facultatiu(id),
  rellotge_id INT REFERENCES public.dispositiu_rellotge(id),
  radioisotope_id INT REFERENCES public.radioisotope(id),
  unit_id INT REFERENCES public.unitcatalog(id),
  initial_radiation DOUBLE PRECISION,
  isolation_days INT,
  room INT,
  start_date TIMESTAMPTZ,
  expected_end_date TIMESTAMPTZ,
  status TEXT DEFAULT 'ACTIVE'
);

-- 7. alerta_metge (depends on treatment)
CREATE TABLE IF NOT EXISTS public.alerta_metge (
  id SERIAL PRIMARY KEY,
  treatment_id INT REFERENCES public.treatment(id),
  tipus_alerta TEXT,
  missatge TEXT,
  resolta BOOLEAN DEFAULT false,
  creada_el TIMESTAMPTZ DEFAULT now()
);

-- 8. healthmetrics (depends on treatment)
CREATE TABLE IF NOT EXISTS public.healthmetrics (
  id SERIAL PRIMARY KEY,
  treatment_id INT REFERENCES public.treatment(id),
  bpm INT,
  current_radiation DOUBLE PRECISION,
  distance DOUBLE PRECISION,
  steps INT,
  recorded_at TIMESTAMPTZ DEFAULT now()
);

-- 9. gamesession (depends on patient)
CREATE TABLE IF NOT EXISTS public.gamesession (
  id SERIAL PRIMARY KEY,
  patient_id INT REFERENCES public.patient(id),
  score INT,
  level_reached INT,
  played_at TIMESTAMPTZ DEFAULT now()
);

-- 10. motivationmessage (depends on patient)
CREATE TABLE IF NOT EXISTS public.motivationmessage (
  id SERIAL PRIMARY KEY,
  patient_id INT REFERENCES public.patient(id),
  message_text TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  sent_at TIMESTAMPTZ DEFAULT now()
);

-- 11. settings (depends on patient)
CREATE TABLE IF NOT EXISTS public.settings (
  id SERIAL PRIMARY KEY,
  patient_id INT REFERENCES public.patient(id),
  theme TEXT,
  unit TEXT,
  notifications_enabled BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (optional, recommended)
-- ALTER TABLE public.patient ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.treatment ENABLE ROW LEVEL SECURITY;
-- etc.
