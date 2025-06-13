/*
  # Create subscription and voting system

  1. New Tables
    - `subscriptions`
      - `email` (text, primary key)
      - `created_at` (timestamp)
      - `active` (boolean)
    - `votes`
      - `id` (uuid, primary key)
      - `email` (text, foreign key)
      - `candidate` (text)
      - `timestamp` (timestamp)
      - `ip_address` (text, optional)

  2. Security
    - Disable RLS for public access (controlled by application)
    - Add unique constraint to prevent multiple votes per email
    - Add foreign key relationship between votes and subscriptions

  3. Indexes
    - Email indexes for performance
    - Timestamp index for vote queries
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
CREATE INDEX IF NOT EXISTS idx_subscriptions_email ON subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_votes_email ON votes(email);
CREATE INDEX IF NOT EXISTS idx_votes_candidate ON votes(candidate);
CREATE INDEX IF NOT EXISTS idx_votes_timestamp ON votes(timestamp);

-- Agregar constraint único: un voto por email (usando DO block para manejar IF NOT EXISTS)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'one_vote_per_email'
    ) THEN
        ALTER TABLE votes ADD CONSTRAINT one_vote_per_email UNIQUE (email);
    END IF;
END $$;

-- Agregar foreign key relationship (usando DO block para manejar IF NOT EXISTS)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'votes_email_fkey'
    ) THEN
        ALTER TABLE votes ADD CONSTRAINT votes_email_fkey 
        FOREIGN KEY (email) REFERENCES subscriptions(email) ON DELETE CASCADE;
    END IF;
END $$;