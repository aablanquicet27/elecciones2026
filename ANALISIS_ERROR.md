# Análisis del Error en la Aplicación de Elecciones Colombia 2026

## Problema Identificado

Al hacer clic en el botón del chat de IA, la página se crashea mostrando una pantalla en blanco y generando los siguientes errores:

### Error 1: HTTP 406 (Not Acceptable)
```
Failed to load resource: the server responded with a status of 406 ()
```

### Error 2: TypeError - Cannot read properties of undefined (reading 'trim')
```
TypeError: Cannot read properties of undefined (reading 'trim')
    at XD (index-BrpTL28k.js:427:6226)
    at qh (index-BrpTL28k.js:38:16998)
    ...
```

## Análisis de la Causa

### 1. Error 406 en la función de Supabase
El error 406 indica que el servidor de Supabase Edge Functions está rechazando la solicitud. Esto puede deberse a:
- Headers incorrectos en la petición
- Formato de respuesta no compatible con lo que el cliente espera
- Problema con el streaming de datos

### 2. Error de `.trim()` en undefined
El error ocurre cuando se intenta llamar `.trim()` en un valor `undefined`. Revisando el código:

**En `AIChatBubbleNew.tsx` (línea 301):**
```typescript
disabled={!input.trim() || isLoading}
```

**En `lib/ai-tools.tsx` (líneas 18-25):**
```typescript
nombre: values[0]?.trim() || '',
tendenciaPolitica: values[2]?.trim() || '',
partido: values[5]?.trim() || '',
region: values[6]?.trim() || '',
profesion: values[7]?.trim() || '',
```

El problema principal parece estar en el hook `useChat` de `@ai-sdk/react` que no está recibiendo una respuesta válida del servidor.

## Causa Raíz

El error 406 en la función de Supabase `chat-ai` está causando que el hook `useChat` no inicialice correctamente algunas propiedades, lo que resulta en valores `undefined` cuando se intenta acceder a ellos.

**Problema específico en `supabase/functions/chat-ai/index.ts`:**

La función está intentando hacer streaming directo de la respuesta de OpenAI, pero el formato de respuesta no es compatible con lo que espera el cliente `@ai-sdk/react`. El cliente espera un formato específico de "data stream" que incluye metadatos y estructura específica, no solo el stream raw de OpenAI.

## Solución Propuesta

### 1. Corregir la función de Supabase Edge Function
Necesitamos usar el SDK de Vercel AI (`ai` package) en el edge function para manejar correctamente el streaming y el formato de respuesta.

### 2. Agregar validación de email obligatoria
Implementar validación para requerir email antes de permitir el uso del chat (como solicitó el usuario).

### 3. Agregar manejo de errores robusto
Implementar try-catch y validaciones para evitar crashes cuando hay errores de red o del servidor.
