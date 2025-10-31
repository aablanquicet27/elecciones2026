# Solución a Errores de Producción - 404 en CSS/JS

## 🐛 Errores Encontrados

```
index-Cbgg7nR6.css:1  Failed to load resource: the server responded with a status of 404
index-CCAIOVK3.js:1   Failed to load resource: the server responded with a status of 404
<meta name="apple-mobile-web-app-capable" content="yes"> is deprecated
```

## ✅ Causas Identificadas

1. **No había servicio de frontend configurado en Render** - Solo estaba el backend, por lo que los archivos estáticos no se servían correctamente
2. **Meta tag obsoleta** - `apple-mobile-web-app-capable` necesita ser complementada con `mobile-web-app-capable`
3. **Falta de configuración base explícita** - No había configuración de rutas base en Vite

## 🔧 Soluciones Implementadas

### 1. ✅ Configuración de Frontend en render.yaml

Agregado nuevo servicio de frontend tipo `static`:

```yaml
services:
  # Frontend - Aplicación React
  - type: web
    name: elecciones-frontend
    env: static
    buildCommand: npm install && npm run build
    staticPublishPath: ./dist
    envVars:
      - key: VITE_SUPABASE_URL
      - key: VITE_SUPABASE_ANON_KEY
      - key: VITE_DO_AGENT_ENDPOINT
      - key: VITE_DO_AGENT_ACCESS_KEY
    headers:
      - path: /*
        name: Cache-Control
        value: public, max-age=0, must-revalidate
      - path: /assets/*
        name: Cache-Control
        value: public, max-age=31536000, immutable
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
```

**Beneficios:**
- ✅ Sirve archivos estáticos directamente
- ✅ Cache óptimo para assets (1 año)
- ✅ Reescritura de rutas para SPA
- ✅ Variables de entorno del frontend incluidas

### 2. ✅ Meta Tag Actualizada en index.html

Agregada la meta tag recomendada:

```html
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
```

### 3. ✅ Configuración Mejorada de Vite

Actualizado `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  base: '/', // Rutas absolutas desde la raíz
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Sin sourcemaps en producción
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[hash].[ext]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js',
      },
    },
  }
})
```

**Mejoras:**
- ✅ Base explícita en `/`
- ✅ Nombres de archivos consistentes
- ✅ Sin sourcemaps (reduce tamaño)
- ✅ Cache-busting con hashes

## 🚀 Cómo Desplegar

### Opción A: Despliegue Automático (Recomendado)

1. **Hacer commit de los cambios:**
```bash
git add .
git commit -m "fix: Corregir errores 404 en producción y configurar frontend"
git push
```

2. **En Render.com:**
   - Ve a tu dashboard de Render
   - Los cambios en `render.yaml` serán detectados automáticamente
   - Render creará el nuevo servicio `elecciones-frontend`
   - Espera a que el build termine

3. **Configurar variables de entorno en Render:**
   - Ve al servicio `elecciones-frontend`
   - En "Environment" agrega:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
     - `VITE_DO_AGENT_ENDPOINT` (opcional)
     - `VITE_DO_AGENT_ACCESS_KEY` (opcional)

### Opción B: Despliegue Manual

Si prefieres crear el servicio manualmente:

1. **En Render.com, crea un nuevo "Static Site":**
   - Name: `elecciones-frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

2. **Configura las variables de entorno** (mismo que arriba)

3. **Deploy**

## 📊 Arquitectura Resultante

```
┌─────────────────────────┐
│  elecciones-frontend    │  ← Nueva (frontend estático)
│  https://elecciones...  │
└─────────────────────────┘

┌─────────────────────────┐
│  elecciones-api         │  ← Existente (backend)
│  https://api...         │
└─────────────────────────┘

┌─────────────────────────┐
│  noticias-updater       │  ← Existente (cron job)
│  Cada 2 horas           │
└─────────────────────────┘
```

## 🔍 Verificación

### 1. Verificar Build Local

```bash
npm run build
```

Deberías ver:
```
✓ built in XXXms
dist/index.html
dist/assets/[nombre].[hash].css
dist/assets/[nombre].[hash].js
```

### 2. Verificar en Producción

Una vez desplegado:

1. **Abre DevTools (F12)**
2. **Verifica que NO haya errores 404**
3. **Verifica en Network tab:**
   - `index.html` → 200 OK
   - `assets/*.css` → 200 OK
   - `assets/*.js` → 200 OK

### 3. Verificar Cache Headers

En Network tab, verifica los headers:
- HTML: `Cache-Control: public, max-age=0, must-revalidate`
- Assets: `Cache-Control: public, max-age=31536000, immutable`

## 🎯 Beneficios de los Cambios

1. **Rendimiento mejorado:**
   - Cache agresivo para assets (1 año)
   - Sin sourcemaps = archivos más pequeños
   - Servido directamente como estático

2. **SEO y PWA:**
   - Rutas correctamente configuradas
   - Meta tags actualizadas
   - Compatible con SPA routing

3. **Mantenimiento:**
   - Separación clara frontend/backend
   - Escalabilidad independiente
   - Logs separados por servicio

## ⚠️ Importante

### URLs Actualizadas

Después del despliegue tendrás:
- **Frontend:** `https://elecciones-frontend.onrender.com`
- **Backend API:** `https://elecciones-api.onrender.com`

**Actualiza la URL del cron job** si es necesario (ya está actualizada en render.yaml)

### Costos

Render.com free tier incluye:
- ✅ 1 Static Site (frontend)
- ✅ 1 Web Service (backend)
- ✅ Cron jobs limitados

## 🐛 Troubleshooting

### Si siguen los errores 404:

1. **Verifica el build local:**
   ```bash
   npm run build
   ls -la dist/
   ```

2. **Limpia caché del navegador:**
   - Ctrl + Shift + R (hard refresh)
   - O DevTools → Network → Disable cache

3. **Verifica variables de entorno en Render:**
   - Deben comenzar con `VITE_`
   - Deben estar en el servicio de frontend

4. **Revisa logs de Render:**
   - Build logs
   - Deploy logs

### Si el routing no funciona:

Verifica que en render.yaml esté:
```yaml
routes:
  - type: rewrite
    source: /*
    destination: /index.html
```

Esto permite que React Router maneje las rutas.

## 📝 Archivos Modificados

- ✅ `render.yaml` - Agregado servicio de frontend
- ✅ `vite.config.ts` - Configuración optimizada
- ✅ `index.html` - Meta tag actualizada

## 🎉 Resultado Esperado

Después de estos cambios:
- ✅ NO más errores 404 en CSS/JS
- ✅ NO más warnings de meta tags obsoletas
- ✅ Carga rápida con cache optimizado
- ✅ Routing de SPA funcionando
- ✅ PWA compatible

---

**Nota:** Estos cambios requieren un nuevo despliegue. Los cambios en `render.yaml` crearán automáticamente el nuevo servicio de frontend.
