/*
  # Enable RLS on existing tables

  1. Security Changes
    - Enable RLS on `subscriptions` table
    - Enable RLS on `votes` table
    - Add policies for anon users to insert subscriptions (public sign-up)
    - Add policies for anon users to read their own subscriptions
    - Add policies for anon users to insert votes
    - Add policies for anon users to read their own votes
*/

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create subscriptions"
  ON subscriptions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (email IS NOT NULL AND email != '');

CREATE POLICY "Users can read subscriptions by email"
  ON subscriptions
  FOR SELECT
  TO anon, authenticated
  USING (email IS NOT NULL);

CREATE POLICY "Anyone can insert votes"
  ON votes
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (email IS NOT NULL AND candidate IS NOT NULL);

CREATE POLICY "Users can read votes by email"
  ON votes
  FOR SELECT
  TO anon, authenticated
  USING (email IS NOT NULL);
