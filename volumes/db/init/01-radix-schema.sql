-- ============================================================
-- RADIX Medical Dashboard — Custom Schema
-- Applied after Supabase base schema is initialized.
-- ============================================================

-- Run this only in the 'postgres' database (default for supabase/postgres image)

\c postgres

-- Source the project migration
\i /docker-entrypoint-initdb.d/radix_migration.sql
