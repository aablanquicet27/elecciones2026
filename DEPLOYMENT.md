# 🚀 Guía de Despliegue - Sistema de Noticias Automatizado

## 📋 Resumen del Sistema

El sistema ahora está configurado para:
- ✅ **Actualizaciones automáticas cada 2 horas** (como solicitaste)
- ✅ **Guardado automático en Supabase** 
- ✅ **Vista unificada** (sin pestañas separadas)
- ✅ **Soporte para imágenes** en las noticias
- ✅ **Cron job automatizado** en Render

## 🛠️ Configuración en Render

### 1. Variables de Entorno Requeridas

Configura estas variables en tu dashboard de Render:

```
EXA_API_KEY=8c34ddda-1f18-41b8-856d-a1270349b220
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_KEY=tu-service-key-aqui
SUPABASE_ANON_KEY=tu-anon-key-aqui
NODE_ENV=production
```

### 2. Despliegue del Servidor

1. **Conecta tu repositorio** en Render
2. **Configura el servicio web:**
   - Build Command: `npm install`
   - Start Command: `node server/server.js`
   - Environment: `Node`
   - Region: `Oregon` (recomendado)

3. **Configura el cron job:**
   - Usar `render.yaml` (incluido en el proyecto)
   - Se ejecuta cada 2 horas: `0 */2 * * *`

### 3. Configuración de Supabase

1. **Ejecuta las migraciones:**
   ```sql
   -- Migración principal
   \i supabase/migrations/20250113000000_create_news_table.sql
   
   -- Migración de imágenes
   \i supabase/migrations/20250613050000_add_image_fields.sql
   ```

2. **Configura Row Level Security (RLS):**
   ```sql
   -- Permitir lectura pública
   ALTER TABLE noticias_historial ENABLE ROW LEVEL SECURITY;
   
   CREATE POLICY "Allow public read access" ON noticias_historial
   FOR SELECT TO public USING (true);
   
   -- Permitir inserción solo desde el servidor
   CREATE POLICY "Allow server insert" ON noticias_historial
   FOR INSERT TO service_role USING (true);
   ```

## 🔄 Funcionamiento del Sistema

### Flujo Automatizado:
1. **Cada 2 horas** → Servidor obtiene noticias de Exa API
2. **Filtra duplicados** → Solo guarda noticias nuevas
3. **Guarda en Supabase** → Base de datos persistente
4. **Actualiza caché** → Para respuestas rápidas
5. **Frontend unificado** → Muestra todo en una vista

### Endpoints Disponibles:
- `GET /daily-news` → Noticias combinadas (API + historial)
- `GET /supabase-stats` → Estadísticas de la base de datos
- `GET /images-stats` → Estadísticas de imágenes
- `GET /health` → Estado del servidor
- `POST /force-update` → Actualización manual

## 🎯 Beneficios del Nuevo Sistema

### ✅ Para el Usuario:
- **Vista unificada** → Todas las noticias en un solo lugar
- **Actualización automática** → Cada 2 horas sin intervención
- **Persistencia** → Noticias guardadas permanentemente
- **Imágenes incluidas** → Contenido más rico
- **Carga rápida** → Combina caché + base de datos

### ✅ Para el Desarrollo:
- **Escalabilidad** → Base de datos robusta
- **Monitoreo** → Estadísticas y salud del sistema
- **Mantenimiento** → Limpieza automática de datos antiguos
- **Flexibilidad** → Fácil agregar nuevas funcionalidades

## 📊 Monitoreo y Estadísticas

### Verificar que todo funciona:
```bash
# Estado del servidor
curl https://elecciones202.onrender.com/health

# Estadísticas de Supabase
curl https://elecciones202.onrender.com/supabase-stats

# Estadísticas de imágenes
curl https://elecciones202.onrender.com/images-stats
```

### Respuestas esperadas:
```json
{
  "success": true,
  "server": "running",
  "cache": "completed",
  "supabase": "configured",
  "timestamp": "2024-01-13T10:00:00.000Z"
}
```

## 🔧 Mantenimiento

### Limpieza de datos antiguos:
```sql
-- Ejecutar cada 6 meses
SELECT limpiar_noticias_antiguas();
```

### Monitoreo de logs:
- Render Dashboard → Logs
- Buscar: `✅ noticias guardadas en Supabase`
- Verificar: Actualizaciones cada 2 horas

## 🚨 Resolución de Problemas

### Si las noticias no se actualizan:
1. Verificar variables de entorno
2. Revisar logs de Render
3. Probar endpoint `/force-update`
4. Verificar conexión a Supabase

### Si Supabase falla:
1. Verificar `SUPABASE_URL` y `SUPABASE_SERVICE_KEY`
2. Revisar políticas RLS
3. Verificar tabla `noticias_historial` existe
4. Comprobar límites de la cuenta

## 📈 Próximos Pasos

El sistema está listo para:
- ✅ Agregar notificaciones por email
- ✅ Implementar análisis de sentimiento
- ✅ Crear dashboard de administración
- ✅ Exportar datos a CSV/PDF
- ✅ Integrar con otras APIs de noticias

---

**🎉 ¡El sistema está completamente automatizado y optimizado!**

- **Actualizaciones**: Cada 2 horas automáticamente
- **Almacenamiento**: Persistente en Supabase
- **Vista**: Unificada sin pestañas
- **Imágenes**: Incluidas en las noticias
- **Mantenimiento**: Mínimo requerido 