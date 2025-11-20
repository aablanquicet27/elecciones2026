# 🚀 Guía Rápida de Implementación

## ⚡ Implementación en 5 Pasos

### 1️⃣ Configurar Supabase

```bash
# Instalar Supabase CLI (si no lo tienes)
npm install -g supabase

# Iniciar sesión
supabase login

# Vincular tu proyecto
supabase link --project-ref TU_PROJECT_REF
```

### 2️⃣ Desplegar la Edge Function

```bash
# Opción A: Usar el script automático
./deploy-chat.sh

# Opción B: Desplegar manualmente
supabase functions deploy chat-ai
```

### 3️⃣ Configurar OPENAI_API_KEY

```bash
# Desde la terminal
supabase secrets set OPENAI_API_KEY=sk-tu-api-key-de-openai
```

O desde el Dashboard de Supabase:
1. Ve a **Project Settings** > **Edge Functions** > **Secrets**
2. Agrega `OPENAI_API_KEY` con tu API key de OpenAI

### 4️⃣ Configurar Variables de Entorno

Crea o actualiza el archivo `.env` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
VITE_SUPABASE_FUNCTIONS_URL=https://tu-proyecto.supabase.co/functions/v1
```

Para obtener estas credenciales:
1. Ve a tu proyecto en Supabase Dashboard
2. **Project Settings** > **API**
3. Copia **Project URL** y **anon/public key**

### 5️⃣ Activar el Nuevo Chat

En `src/App.tsx`, reemplaza la línea 8:

```tsx
// Antes
import AIChatBubble from './components/AIChatBubble';

// Después
import AIChatBubble from './components/AIChatBubbleNew';
```

---

## ✅ Verificar la Instalación

```bash
# Iniciar el servidor de desarrollo
pnpm dev
```

Abre el navegador y prueba el chat con preguntas como:
- "Muéstrame los top 5 candidatos"
- "¿Quién es Iván Cepeda?"
- "Compara a Gustavo Bolívar con María Fernanda Cabal"

---

## 🎯 Características Implementadas

✅ **Streaming de respuestas** - Las respuestas se generan en tiempo real  
✅ **Markdown enriquecido** - Encabezados, listas, negritas, código  
✅ **Generative UI** - Tarjetas de candidatos, comparaciones, estadísticas  
✅ **Contexto completo** - Acceso automático a todos los datos del CSV  
✅ **Backend seguro** - API key protegida en Supabase Edge Functions  
✅ **GPT-5.1 ready** - Listo para usar GPT-5 cuando esté disponible  

---

## 🐛 Solución de Problemas

### Error: "OPENAI_API_KEY no está configurada"

```bash
# Verificar secrets
supabase secrets list

# Configurar si no existe
supabase secrets set OPENAI_API_KEY=sk-tu-api-key
```

### Error: "Failed to fetch"

Verifica que las variables de entorno en `.env` sean correctas y que la Edge Function esté desplegada:

```bash
supabase functions list
```

### El chat no muestra tarjetas

Verifica que el archivo CSV esté en:
```
public/candidatos_presidenciales_2026_completo.csv
```

---

## 📚 Documentación Completa

Para más detalles, consulta:
- [CHAT_AI_SETUP.md](./CHAT_AI_SETUP.md) - Documentación completa
- [AI SDK de Vercel](https://sdk.vercel.ai/docs)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)

---

## 🎉 ¡Listo!

El chat IA mejorado está completamente configurado y listo para usar.
