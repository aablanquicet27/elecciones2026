# Instrucciones de Despliegue en Vercel

## Problemas Solucionados

### 1. Error 404 en archivos JS/CSS
**Problema:** Los archivos generados por Vite no se cargaban correctamente en Vercel.

**Solución:** 
- Se creó el archivo `vercel.json` con configuración de rewrites para SPA
- Se actualizó `vite.config.ts` con configuraciones de build optimizadas

### 2. Error 404/406 en DigitalOcean Agent
**Problema:** La conexión con DigitalOcean Agent fallaba por ruta incorrecta.

**Solución:** 
- Se corrigió la ruta de `/chat/completions` a `/api/v1/chat/completions`
- Se cambió de `process.env` a `import.meta.env` (correcto para Vite)
- Se agregó validación de credenciales antes de hacer la llamada
- Se instaló la dependencia `axios` que faltaba

### 3. Meta tag deprecado
**Problema:** `apple-mobile-web-app-capable` está deprecado.

**Solución:** 
- Se reemplazó por `mobile-web-app-capable`

### 4. Error 401 en manifest.json
**Solución:** 
- Se agregaron headers CORS en `vercel.json` para el manifest

## Configuración de Variables de Entorno en Vercel

Para que la conexión con DigitalOcean Agent funcione, debes configurar las siguientes variables de entorno en Vercel:

1. Ve a tu proyecto en Vercel
2. Navega a **Settings** → **Environment Variables**
3. Agrega las siguientes variables:

```
VITE_DO_AGENT_ENDPOINT=https://tu-agente.agents.do-ai.run
VITE_DO_AGENT_ACCESS_KEY=tu_clave_de_acceso
```

**IMPORTANTE:** 
- NO incluyas `/api/v1/chat/completions` al final del endpoint
- Ejemplo correcto: `https://abc123.agents.do-ai.run`
- Ejemplo incorrecto: `https://abc123.agents.do-ai.run/api/v1/chat/completions`

## Cómo Obtener las Credenciales de DigitalOcean Agent

### 1. Configurar el Endpoint como Público (si usas chatbot)
1. Ve a **Plataforma de agentes** en DigitalOcean
2. Selecciona tu **Espacio de trabajo**
3. Haz clic en tu **Agente**
4. En la pestaña **Información general**, sección **ENDPOINT**
5. Haz clic en **Editar** y selecciona **Público**
6. Copia la URL del endpoint

### 2. Crear una Clave de Acceso
1. En la página de tu agente, ve a la pestaña **Configuración**
2. En la sección **Claves de acceso de endpoints**, haz clic en **Crear clave**
3. Dale un nombre (ej: "Vercel Production")
4. Copia la clave secreta (¡no se mostrará de nuevo!)

## Después de Configurar las Variables

1. Haz un nuevo deploy en Vercel (o espera al próximo push)
2. Verifica que las variables estén disponibles
3. Prueba el chatbot en tu sitio desplegado

## Verificación Local

Para probar localmente:

1. Copia `.env.example` a `.env.local`:
```bash
cp .env.example .env.local
```

2. Edita `.env.local` con tus credenciales reales

3. Ejecuta el proyecto:
```bash
npm run dev
```

## Solución de Problemas

### Si sigues viendo error 404
- Verifica que el endpoint esté activo en DigitalOcean
- Confirma que la URL del endpoint sea correcta (sin rutas adicionales)
- Revisa los logs de Vercel en **Deployments** → **[tu deploy]** → **Functions**

### Si ves error 401/403
- Verifica que la clave de acceso sea correcta
- Confirma que el endpoint esté configurado como público (si es necesario)
- Regenera la clave de acceso si es necesario

### Si los archivos CSS/JS no cargan
- Asegúrate de que `vercel.json` esté en la raíz del proyecto
- Verifica que el build command sea `npm run build`
- Confirma que el output directory sea `dist`
