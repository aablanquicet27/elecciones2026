/*
  # Create noticias_historial table

  1. New Tables
    - `noticias_historial`
      - `id` (bigint, primary key, auto-generated)
      - `title` (text, not null) - News headline
      - `content` (text, not null) - Full article text
      - `date` (text) - Publication date as text
      - `source` (text) - News source name
      - `candidates` (text array, default empty) - Mentioned candidates
      - `political_parties` (text array, default empty) - Mentioned parties
      - `url_hash` (text, unique) - Hash to prevent duplicates
      - `created_at` (timestamptz, default now()) - Record creation timestamp

  2. Security
    - Enable RLS on `noticias_historial` table
    - Add policy for anonymous users to read all news (public data)
    - Add policy for authenticated users to insert news

  3. Indexes
    - Index on `created_at` for fast ordering
    - Index on `url_hash` for fast duplicate checking
*/

CREATE TABLE IF NOT EXISTS noticias_historial (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  date text DEFAULT '',
  source text DEFAULT '',
  candidates text[] DEFAULT '{}',
  political_parties text[] DEFAULT '{}',
  url_hash text UNIQUE DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE noticias_historial ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read news"
  ON noticias_historial
  FOR SELECT
  TO anon, authenticated
  USING (created_at IS NOT NULL);

CREATE POLICY "Authenticated users can insert news"
  ON noticias_historial
  FOR INSERT
  TO authenticated
  WITH CHECK (title IS NOT NULL AND title != '');

CREATE INDEX IF NOT EXISTS idx_noticias_created_at ON noticias_historial (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_noticias_url_hash ON noticias_historial (url_hash);
