-- Cron job para actualizar noticias diariamente a las 8am UTC
-- Requiere: pg_cron y pg_net habilitados en Supabase Dashboard
-- Reemplazar SERVICE_ROLE_KEY con el valor real en Supabase SQL Editor

SELECT cron.schedule(
  'fetch-news-daily',
  '0 8 * * *',
  $$SELECT net.http_post(
    url := 'https://gsidmhliqzyntcjwzasg.supabase.co/functions/v1/fetch-news',
    headers := '{"Authorization": "Bearer SERVICE_ROLE_KEY"}'::jsonb,
    body := '{}'::jsonb
  )$$
);
