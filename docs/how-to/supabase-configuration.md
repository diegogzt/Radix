# Supabase Configuration Guide

This guide describes how to set up and configure Supabase for the Radix Medical Dashboard.

## 1. Project Setup in Supabase

1.  Go to the [Supabase Dashboard](https://supabase.com/dashboard/) and create a new project.
2.  Once the project is created, navigate to **Project Settings > API**.
3.  Copy the `Project URL` and `anon public` Key.
4.  Paste these values into your `.env` file as `SUPABASE_URL` and `SUPABASE_ANON_KEY`.

## 2. Database Schema

The project uses a structured PostgreSQL schema. You can find the TypeScript type definitions in `src/lib/types.ts`.

### Key Tables

- **facultatiu**: Stores doctor information (email, name, specialty).
- **patient**: Stores patient information.
- **treatment**: Connects patients, doctors, and radioisotopes for specific medical treatments.
- **healthmetrics**: Stores recorded BPM, steps, and radiation levels for patients.
- **alerta_metge**: System alerts for doctors based on health metrics.

### Authentication Config

The project uses Supabase Auth via email and password. Ensure that **Email Auth** is enabled in your Supabase project under **Authentication > Providers**.

## 3. Row Level Security (RLS)

> [!IMPORTANT]
> For a medical application, data privacy is critical. Ensure RLS is enabled on all tables.

Example RLS policy for the `patient` table:
```sql
alter table public.patient enable row level security;

create policy "Doctors can view their patients"
  on public.patient
  for select
  using (
    exists (
      select 1 from public.treatment t
      join public.facultatiu f on t.facultatiu_id = f.id
      where t.patient_id = public.patient.id
      and f.email = auth.email()
    )
  );
```

## 4. Realtime Subscriptions

The dashboard uses Supabase Realtime for live updates of health metrics. Ensure that the `healthmetrics` table has **Realtime** enabled in the Supabase Table Editor.
