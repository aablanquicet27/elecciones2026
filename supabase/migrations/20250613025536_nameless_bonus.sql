/*
  # Sistema de Suscripciones y Votación Electoral

  1. Nuevas Tablas
    - `subscriptions`
      - `email` (text, primary key)
      - `created_at` (timestamp)
      - `active` (boolean)
    - `votes`
      - `id` (uuid, primary key)
      - `email` (text, foreign key)
      - `candidate` (text)
      - `timestamp` (timestamp)
      - `ip_address` (text)

  2. Seguridad
    - Desactivar RLS para ambas tablas (acceso público controlado)
    - Constraint único para un voto por email

  3. Índices
    - Optimización para búsquedas por email
*/

-- Crear tabla de suscripciones
CREATE TABLE IF NOT EXISTS subscriptions (
  email text PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  active boolean DEFAULT true
);

-- Crear tabla de votos
CREATE TABLE IF NOT EXISTS votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  candidate text NOT NULL,
  timestamp timestamptz DEFAULT now(),
  ip_address text
);

-- Desactivar RLS para acceso público controlado
ALTER TABLE subscriptions DISABLE ROW LEVEL SECURITY;
ALTER TABLE votes DISABLE ROW LEVEL SECURITY;

-- Crear índices para optimización
CREATE INDEX IF NOT EXISTS idx_email ON subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_votes_email ON votes(email);
CREATE INDEX IF NOT EXISTS idx_votes_timestamp ON votes(timestamp);

-- Constraint único: un voto por email
ALTER TABLE votes ADD CONSTRAINT IF NOT EXISTS one_vote_per_email UNIQUE (email);

-- Foreign key relationship
ALTER TABLE votes ADD CONSTRAINT IF NOT EXISTS votes_email_fkey 
  FOREIGN KEY (email) REFERENCES subscriptions(email) ON DELETE CASCADE;