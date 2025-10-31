# Solución de Errores en Vercel y DigitalOcean Agent

## 🔴 Problemas Detectados

### 1. Error 404 en archivos estáticos (index-CCAIOVK3.js, index-Cbgg7nR6.css)
**Causa:** Configuración incorrecta para SPA en Vercel

### 2. Error 404/406 en DigitalOcean Agent API
**Causa:** Ruta incorrecta de la API y uso incorrecto de variables de entorno en Vite

### 3. Error 401 en manifest.json
**Causa:** Falta de configuración CORS

### 4. Meta tag deprecado
**Causa:** Uso de `apple-mobile-web-app-capable` en lugar de `mobile-web-app-capable`

---

## ✅ Soluciones Implementadas

### 1. Nuevo archivo `vercel.json`
Se creó la configuración correcta para despliegue de SPA:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/manifest.json",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        }
      ]
    }
  ]
}
```

### 2. Corrección en `AIChatBubble.tsx`

**Antes:**
```typescript
// ❌ INCORRECTO
const response = await axios.post(
  `${process.env.VITE_DO_AGENT_ENDPOINT}/chat/completions`, // Ruta incorrecta
  // ...
);
```

**Después:**
```typescript
// ✅ CORRECTO
const agentEndpoint = import.meta.env.VITE_DO_AGENT_ENDPOINT; // Uso correcto para Vite
const agentAccessKey = import.meta.env.VITE_DO_AGENT_ACCESS_KEY;

const response = await axios.post(
  `${agentEndpoint}/api/v1/chat/completions`, // Ruta correcta según documentación
  {
    messages: [{ role: 'user', content: userMessage }],
    stream: false,
    include_functions_info: false,
    include_retrieval_info: false,
    include_guardrails_info: false
  },
  {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${agentAccessKey}`
    }
  }
);
```

### 3. Actualización de `vite.config.ts`
Se agregaron configuraciones para build optimizado:

```typescript
export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      },
    },
  },
  optimizeDeps: {
    include: [..., 'axios']
  }
});
```

### 4. Instalación de dependencia faltante
```bash
npm install axios
```

### 5. Actualización de `index.html`
Se reemplazó el meta tag deprecado:
```html
<!-- ❌ Antes -->
<meta name="apple-mobile-web-app-capable" content="yes">

<!-- ✅ Después -->
<meta name="mobile-web-app-capable" content="yes">
```

---

## 🚀 Pasos para Desplegar

### 1. Configurar Variables de Entorno en Vercel

**CRÍTICO:** Debes configurar estas variables en Vercel:

1. Ve a tu proyecto en Vercel
2. **Settings** → **Environment Variables**
3. Agrega:

```
VITE_DO_AGENT_ENDPOINT=https://tu-agente-id.agents.do-ai.run
VITE_DO_AGENT_ACCESS_KEY=tu_clave_secreta_aqui
```

**⚠️ IMPORTANTE:**
- NO incluyas `/api/v1/chat/completions` en el endpoint
- Copia la URL exacta desde tu panel de DigitalOcean
- La clave de acceso debe ser válida y activa

### 2. Cómo Obtener las Credenciales

#### A. Endpoint del Agente
1. Panel de DigitalOcean → **Plataforma de agentes**
2. Selecciona tu **Espacio de trabajo**
3. Selecciona tu **Agente**
4. En **Información general** → sección **ENDPOINT**
5. Haz clic en **Editar** y selecciona **Público**
6. Copia la URL (ej: `https://abc123xyz.agents.do-ai.run`)

#### B. Clave de Acceso
1. En la misma página del agente → pestaña **Configuración**
2. Sección **Claves de acceso de endpoints** → **Crear clave**
3. Dale un nombre (ej: "Vercel Production")
4. **¡Copia la clave inmediatamente!** (no se mostrará de nuevo)

### 3. Hacer Deploy

Después de configurar las variables de entorno:

```bash
# 1. Commit de los cambios
git add .
git commit -m "Fix: Corregir errores de Vercel y DigitalOcean Agent"

# 2. Push a tu rama
git push

# 3. Vercel hará el deploy automáticamente
```

O manualmente en Vercel:
- **Deployments** → **Redeploy**

---

## 🧪 Verificación

### En Desarrollo Local

1. Crea archivo `.env.local`:
```bash
cp .env.example .env.local
```

2. Edita `.env.local` con tus credenciales reales

3. Ejecuta:
```bash
npm install
npm run dev
```

4. Abre http://localhost:5173 y prueba el chat

### En Producción (Vercel)

1. Abre tu sitio desplegado
2. Abre la consola del navegador (F12)
3. Prueba el chat
4. **NO deberías ver:**
   - ❌ Error 404 en archivos JS/CSS
   - ❌ Error 404/406 en la API de DigitalOcean
   - ❌ Error 401 en manifest.json

---

## 🔍 Solución de Problemas

### Si sigues viendo Error 404 en DigitalOcean Agent:

1. **Verifica el endpoint:**
   ```bash
   # Prueba manualmente con curl
   curl -i -X POST \
     https://tu-agente.agents.do-ai.run/api/v1/chat/completions \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer TU_CLAVE" \
     -d '{"messages": [{"role": "user", "content": "test"}], "stream": false}'
   ```

2. **Verifica que el endpoint esté activo** en DigitalOcean

3. **Regenera la clave de acceso** si es necesario

### Si los archivos CSS/JS no cargan:

1. Verifica que `vercel.json` esté en la raíz del proyecto
2. En Vercel Settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Framework Preset:** `Vite`

### Si ves Error 406:

Esto significa que el servidor rechazó la solicitud. Verifica:
- El formato del cuerpo de la solicitud
- Los headers (Content-Type, Authorization)
- Que la clave de acceso sea válida

---

## 📋 Checklist Final

- [ ] `vercel.json` creado en la raíz
- [ ] `vite.config.ts` actualizado
- [ ] `AIChatBubble.tsx` corregido
- [ ] `index.html` actualizado (meta tag)
- [ ] `axios` instalado
- [ ] Variables de entorno configuradas en Vercel:
  - [ ] `VITE_DO_AGENT_ENDPOINT`
  - [ ] `VITE_DO_AGENT_ACCESS_KEY`
- [ ] Endpoint del agente configurado como **público** en DigitalOcean
- [ ] Clave de acceso creada y copiada
- [ ] Deploy realizado en Vercel
- [ ] Sitio probado en producción
- [ ] Chat funcionando correctamente

---

## 📚 Archivos Creados/Modificados

### Nuevos:
- ✨ `vercel.json` - Configuración de Vercel
- ✨ `.env.example` - Plantilla de variables de entorno
- ✨ `INSTRUCCIONES_DESPLIEGUE.md` - Guía detallada
- ✨ `SOLUCION_ERRORES_VERCEL.md` - Este archivo

### Modificados:
- 🔧 `src/components/AIChatBubble.tsx` - Corrección de API
- 🔧 `vite.config.ts` - Optimización de build
- 🔧 `index.html` - Actualización de meta tags
- 🔧 `package.json` - Agregado axios

---

## 💡 Notas Importantes

1. **Nunca expongas las claves de acceso** en el código fuente
2. Usa variables de entorno (`VITE_*`) para credenciales
3. En Vite usa `import.meta.env`, NO `process.env`
4. La ruta correcta es `/api/v1/chat/completions`, NO `/chat/completions`
5. El endpoint debe estar sin rutas adicionales al final
6. Siempre verifica que las variables estén configuradas antes de desplegar

---

## ✅ Resultado Esperado

Después de aplicar estos cambios y configurar las variables de entorno:

- ✅ Los archivos JS/CSS cargarán correctamente
- ✅ El chatbot se conectará exitosamente a DigitalOcean Agent
- ✅ No habrá errores 404, 406, o 401
- ✅ El manifest.json cargará sin problemas
- ✅ La app funcionará igual en desarrollo y producción
