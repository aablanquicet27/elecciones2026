-- Crear tabla para guardar historial de noticias
CREATE TABLE IF NOT EXISTS noticias_historial (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  date DATE NOT NULL,
  source TEXT NOT NULL,
  candidates TEXT[] DEFAULT '{}',
  political_parties TEXT[] DEFAULT '{}',
  image_url TEXT,
  image_alt TEXT,
  has_media BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  url_hash TEXT UNIQUE -- Para evitar duplicados
);

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_noticias_date ON noticias_historial(date DESC);
CREATE INDEX IF NOT EXISTS idx_noticias_created_at ON noticias_historial(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_noticias_source ON noticias_historial(source);
CREATE INDEX IF NOT EXISTS idx_noticias_has_media ON noticias_historial(has_media);
CREATE INDEX IF NOT EXISTS idx_noticias_candidates ON noticias_historial USING GIN(candidates);
CREATE INDEX IF NOT EXISTS idx_noticias_political_parties ON noticias_historial USING GIN(political_parties);

-- Función para limpiar noticias muy antiguas (opcional, para no acumular infinitamente)
CREATE OR REPLACE FUNCTION limpiar_noticias_antiguas()
RETURNS void AS $$
BEGIN
  DELETE FROM noticias_historial 
  WHERE created_at < NOW() - INTERVAL '6 months';
END;
$$ LANGUAGE plpgsql; 