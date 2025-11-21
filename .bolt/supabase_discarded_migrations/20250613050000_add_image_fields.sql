-- Agregar campos de imagen a la tabla noticias_historial si no existen
ALTER TABLE noticias_historial 
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS image_alt TEXT,
ADD COLUMN IF NOT EXISTS has_media BOOLEAN DEFAULT false;

-- Crear índices adicionales para los nuevos campos
CREATE INDEX IF NOT EXISTS idx_noticias_has_media ON noticias_historial(has_media);
CREATE INDEX IF NOT EXISTS idx_noticias_candidates ON noticias_historial USING GIN(candidates);
CREATE INDEX IF NOT EXISTS idx_noticias_political_parties ON noticias_historial USING GIN(political_parties);

-- Actualizar noticias existentes para marcar has_media = true si tienen image_url
UPDATE noticias_historial 
SET has_media = true 
WHERE image_url IS NOT NULL 
AND image_url != '' 
AND has_media = false; 