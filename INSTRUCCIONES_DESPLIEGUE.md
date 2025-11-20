# Instrucciones para Redesplegar la Función de Supabase

## Problema Resuelto

Se han corregido los siguientes errores en el chat de IA:

1. **Error 406 (Not Acceptable)**: Causado por formato de respuesta incompatible
2. **TypeError: Cannot read properties of undefined (reading 'trim')**: Causado por valores undefined en el componente
3. **Falta de validación de email**: Ahora es obligatorio ingresar email antes de usar el chat

## Cambios Realizados

### 1. Función de Supabase Edge Function (`supabase/functions/chat-ai/index.ts`)
- Simplificado el formato de streaming
- Removido TransformStream complejo
- Retorno directo del stream de OpenAI con headers correctos
- Mejorada compatibilidad con @ai-sdk/react

### 2. Componente de Chat (`src/components/AIChatBubbleNew.tsx`)
- Agregada pantalla de validación de email obligatoria
- Email se guarda en localStorage para persistencia
- Mejorado manejo de errores con validaciones null/undefined
- Agregadas validaciones en renderizado de tool calls

## Pasos para Redesplegar la Función de Supabase

**IMPORTANTE**: La función de Supabase Edge Function necesita ser redesplegada manualmente para que los cambios surtan efecto.

### Opción 1: Usando Supabase CLI (Recomendado)

```bash
# 1. Asegúrate de tener Supabase CLI instalado
npm install -g supabase

# 2. Login a Supabase
supabase login

# 3. Link al proyecto (si no está linkeado)
supabase link --project-ref gsidmhliqzyntcjwzasg

# 4. Desplegar la función
supabase functions deploy chat-ai
```

### Opción 2: Desde el Dashboard de Supabase

1. Ve a https://supabase.com/dashboard/project/gsidmhliqzyntcjwzasg
2. Navega a **Edge Functions** en el menú lateral
3. Selecciona la función `chat-ai`
4. Haz clic en **Deploy** o **Redeploy**
5. Copia y pega el contenido del archivo `supabase/functions/chat-ai/index.ts`
6. Guarda y despliega

### Opción 3: Usando GitHub Actions (Si está configurado)

Si tienes GitHub Actions configurado para desplegar automáticamente:

1. Los cambios ya están en GitHub
2. El workflow debería ejecutarse automáticamente
3. Verifica el estado en la pestaña **Actions** de GitHub

## Verificación

Una vez redesplegada la función, verifica que el chat funcione correctamente:

1. Abre https://eleccionescolombia.org
2. Haz clic en el botón del chat de IA
3. Ingresa un email válido
4. Haz clic en "Comenzar Chat"
5. Escribe una pregunta de prueba
6. Verifica que la respuesta se muestre correctamente sin errores

## Notas Adicionales

- El frontend (Vercel) ya está actualizado y funcionando
- La validación de email ya está activa
- Solo falta redesplegar la función de Supabase para que el streaming funcione correctamente
- Si sigues teniendo problemas, verifica que la variable de entorno `OPENAI_API_KEY` esté configurada en Supabase

## Contacto

Si necesitas ayuda adicional, revisa los logs de Supabase Edge Functions en:
https://supabase.com/dashboard/project/gsidmhliqzyntcjwzasg/logs/edge-functions
