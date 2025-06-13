/*
  # Crear sistema de suscripciones y votación

  1. Nuevas tablas
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
    - Desactivar RLS para acceso público controlado
    - Constraint único para un voto por email
    - Foreign key entre votes y subscriptions

  3. Optimización
    - Índices en campos de búsqueda frecuente
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
CREATE INDEX IF NOT EXISTS idx_votes_timestamp ON votes(timestamp);

-- Agregar constraint único para un voto por email (usando DO block para manejar si ya existe)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'one_vote_per_email'
    ) THEN
        ALTER TABLE votes ADD CONSTRAINT one_vote_per_email UNIQUE (email);
    END IF;
END $$;

-- Agregar foreign key relationship (usando DO block para manejar si ya existe)
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