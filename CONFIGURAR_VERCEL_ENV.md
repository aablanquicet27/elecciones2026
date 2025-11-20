# Configurar Variables de Entorno en Vercel

## Problema Actual

El chat está mostrando un error 404 porque las variables de entorno no están configuradas en Vercel. Necesitas agregar las credenciales de Supabase para que el frontend pueda conectarse a la función Edge Function.

---

## Pasos para Configurar en Vercel Dashboard

### 1. Accede al Dashboard de Vercel

Ve a: https://vercel.com/aablanquicet27s-projects/eleccionescolombia2026/settings/environment-variables

### 2. Agrega las siguientes variables de entorno:

#### Variable 1: VITE_SUPABASE_URL
- **Key**: `VITE_SUPABASE_URL`
- **Value**: `https://gsidmhliqzyntcjwzasg.supabase.co`
- **Environments**: Selecciona **Production**, **Preview**, y **Development**
- Haz clic en **Save**

#### Variable 2: VITE_SUPABASE_ANON_KEY
- **Key**: `VITE_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzaWRtaGxpcXp5bnRjand6YXNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MzY3OTksImV4cCI6MjA1ODQxMjc5OX0.RfJthlMKtZJ_DNZuNv_bAv8Acn_e-S_b57xS70ixy0I`
- **Environments**: Selecciona **Production**, **Preview**, y **Development**
- Haz clic en **Save**

#### Variable 3: VITE_SUPABASE_FUNCTIONS_URL
- **Key**: `VITE_SUPABASE_FUNCTIONS_URL`
- **Value**: `https://gsidmhliqzyntcjwzasg.supabase.co/functions/v1`
- **Environments**: Selecciona **Production**, **Preview**, y **Development**
- Haz clic en **Save**

### 3. Redesplegar el Proyecto

Después de agregar las variables de entorno, necesitas redesplegar el proyecto para que los cambios surtan efecto:

**Opción A: Desde el Dashboard**
1. Ve a la pestaña **Deployments**
2. Haz clic en los tres puntos (...) del deployment más reciente
3. Selecciona **Redeploy**
4. Confirma el redespliegue

**Opción B: Hacer un Push Vacío a GitHub**
```bash
git commit --allow-empty -m "chore: Trigger redeploy for env vars"
git push origin main
```

---

## Verificación

Una vez redesplegado:

1. Abre https://eleccionescolombia.org
2. Abre el chat de IA
3. Ingresa tu email
4. Escribe una pregunta
5. Verifica que la respuesta se muestre correctamente sin error 404

---

## Notas Importantes

- Las variables de entorno con prefijo `VITE_` son expuestas al cliente (frontend)
- Estas variables son seguras de exponer porque son públicas (ANON KEY)
- La API KEY de OpenAI debe estar configurada en Supabase Edge Functions (no en Vercel)
- Después de agregar variables de entorno, siempre es necesario redesplegar

---

## Alternativa: Usar Vercel CLI

Si prefieres usar la línea de comandos:

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Link al proyecto
vercel link

# Agregar variables de entorno
vercel env add VITE_SUPABASE_URL production
# Pegar: https://gsidmhliqzyntcjwzasg.supabase.co

vercel env add VITE_SUPABASE_ANON_KEY production
# Pegar el token

vercel env add VITE_SUPABASE_FUNCTIONS_URL production
# Pegar: https://gsidmhliqzyntcjwzasg.supabase.co/functions/v1

# Redesplegar
vercel --prod
```

---

**Una vez configuradas las variables de entorno y redesplegado, el chat funcionará correctamente.** 🎉
