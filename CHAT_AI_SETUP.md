# 🤖 Configuración del Chat IA Mejorado

## 📋 Descripción

El chat IA ha sido completamente renovado con las siguientes mejoras:

### ✨ Características Principales

1. **GPT-5.1 de OpenAI** - Integración con el modelo más avanzado de OpenAI
2. **Streaming de Respuestas** - Las respuestas se generan en tiempo real, palabra por palabra
3. **Markdown Enriquecido** - Soporte completo para formato Markdown con encabezados, listas, negritas, etc.
4. **Generative UI** - Tarjetas interactivas de candidatos, comparaciones y estadísticas visuales
5. **Contexto Completo** - El asistente tiene acceso a todos los datos del CSV automáticamente
6. **Backend en Supabase** - Edge Functions para procesamiento serverless y seguro

### 🎨 Componentes de UI Generativa

El chat puede mostrar los siguientes componentes visuales:

- **CandidateCard** - Tarjeta detallada de un candidato con métricas
- **CandidateComparison** - Comparación visual entre múltiples candidatos
- **ElectoralStats** - Estadísticas electorales en formato de tarjetas
- **ElectoralInsight** - Insights y análisis destacados
- **Filtros por Tendencia** - Candidatos agrupados por ideología política

---

## 🚀 Instalación

### 1. Instalar Dependencias

Las dependencias ya están instaladas en el proyecto:

```bash
pnpm install
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
VITE_SUPABASE_FUNCTIONS_URL=https://tu-proyecto.supabase.co/functions/v1
```

### 3. Configurar Supabase Edge Function

#### 3.1 Instalar Supabase CLI

```bash
npm install -g supabase
```

#### 3.2 Iniciar Sesión en Supabase

```bash
supabase login
```

#### 3.3 Vincular el Proyecto

```bash
supabase link --project-ref tu-project-ref
```

#### 3.4 Configurar la Variable de Entorno OPENAI_API_KEY en Supabase

**Opción A: Desde el Dashboard de Supabase**

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Navega a **Project Settings** > **Edge Functions** > **Secrets**
3. Agrega una nueva secret:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: Tu API key de OpenAI (ej: `sk-...`)
4. Guarda los cambios

**Opción B: Desde la CLI**

```bash
supabase secrets set OPENAI_API_KEY=sk-tu-api-key-aqui
```

#### 3.5 Desplegar la Edge Function

```bash
supabase functions deploy chat-ai
```

---

## 🔧 Uso en el Proyecto

### Reemplazar el Componente Actual

En `src/App.tsx`, reemplaza el import del chat:

```tsx
// Antes
import AIChatBubble from './components/AIChatBubble';

// Después
import AIChatBubble from './components/AIChatBubbleNew';
```

### Estructura de Archivos

```
src/
├── components/
│   ├── AIChatBubbleNew.tsx          # Componente principal del chat
│   └── chat/
│       ├── CandidateCard.tsx        # Tarjeta de candidato
│       ├── CandidateComparison.tsx  # Comparación de candidatos
│       ├── ElectoralStats.tsx       # Estadísticas electorales
│       └── ElectoralInsight.tsx     # Insights destacados
├── lib/
│   └── ai-tools.tsx                 # Configuración de herramientas de IA
└── hooks/
    └── useAIChat.ts                 # Hook personalizado para el chat

supabase/
└── functions/
    └── chat-ai/
        └── index.ts                 # Edge Function de Supabase
```

---

## 🎯 Funcionalidades del Chat

### Comandos y Preguntas Sugeridas

El chat responde inteligentemente a preguntas como:

1. **Información de candidatos**
   - "¿Quién es Iván Cepeda?"
   - "Muéstrame información de Gustavo Bolívar"

2. **Comparaciones**
   - "Compara a Iván Cepeda con María Fernanda Cabal"
   - "¿Cuál es la diferencia entre los candidatos de izquierda?"

3. **Rankings**
   - "Muéstrame los top 5 candidatos"
   - "¿Quiénes tienen mejor favorabilidad?"

4. **Análisis por tendencia**
   - "Muéstrame los candidatos de derecha"
   - "¿Cuántos candidatos de centro hay?"

5. **Estadísticas generales**
   - "Dame un resumen de las elecciones"
   - "¿Cuál es el panorama electoral actual?"

### Ejemplo de Respuesta con Generative UI

Cuando preguntas "Muéstrame información de Iván Cepeda", el chat:

1. Genera una respuesta en texto con formato Markdown
2. Automáticamente muestra una **CandidateCard** con:
   - Foto y datos básicos
   - Intención de voto
   - Favorabilidad vs Desfavorabilidad
   - Información adicional (región, profesión, edad)

---

## 🔐 Seguridad

### Variables de Entorno

- **OPENAI_API_KEY**: Solo se configura en Supabase Edge Functions (backend)
- **VITE_SUPABASE_ANON_KEY**: Key pública segura para el frontend
- Las API keys NUNCA se exponen en el frontend

### CORS

La Edge Function está configurada con CORS para aceptar requests desde tu dominio.

---

## 🐛 Troubleshooting

### Error: "OPENAI_API_KEY no está configurada"

**Solución**: Verifica que hayas configurado la secret en Supabase:

```bash
supabase secrets list
```

Si no aparece, configúrala:

```bash
supabase secrets set OPENAI_API_KEY=sk-tu-api-key
```

### Error: "Failed to fetch"

**Solución**: Verifica que las variables de entorno en `.env` sean correctas:

```env
VITE_SUPABASE_FUNCTIONS_URL=https://tu-proyecto.supabase.co/functions/v1
```

### El chat no muestra tarjetas

**Solución**: Verifica que el CSV esté en `public/candidatos_presidenciales_2026_completo.csv` y que el formato sea correcto.

### Streaming no funciona

**Solución**: Asegúrate de que la Edge Function esté desplegada correctamente:

```bash
supabase functions list
```

---

## 📦 Dependencias Instaladas

```json
{
  "ai": "^5.0.98",
  "@ai-sdk/openai": "^2.0.69",
  "@ai-sdk/react": "^2.0.98",
  "react-markdown": "^10.1.0",
  "remark-gfm": "^4.0.1",
  "zod": "^3.25.76"
}
```

---

## 🎨 Personalización

### Cambiar el Modelo de OpenAI

En `supabase/functions/chat-ai/index.ts`, línea 51:

```typescript
model: 'gpt-4-turbo', // Cambiar a 'gpt-5' cuando esté disponible
```

### Agregar Nuevas Herramientas de UI

1. Crea un nuevo componente en `src/components/chat/`
2. Agrégalo a `src/lib/ai-tools.tsx`
3. Actualiza la Edge Function con la nueva herramienta
4. Agrega el renderizado en `AIChatBubbleNew.tsx`

### Personalizar Estilos

Los componentes usan Tailwind CSS. Puedes personalizar los colores y estilos directamente en cada componente.

---

## 📚 Recursos

- [AI SDK de Vercel](https://sdk.vercel.ai/docs)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [OpenAI API](https://platform.openai.com/docs)
- [React Markdown](https://github.com/remarkjs/react-markdown)

---

## ✅ Checklist de Implementación

- [x] Instalar dependencias del AI SDK
- [x] Crear componentes de UI generativa
- [x] Implementar Edge Function en Supabase
- [x] Configurar variables de entorno
- [ ] Desplegar Edge Function a Supabase
- [ ] Configurar OPENAI_API_KEY en Supabase
- [ ] Actualizar `.env` con credenciales de Supabase
- [ ] Reemplazar componente en App.tsx
- [ ] Probar funcionalidad completa

---

## 🎉 ¡Listo!

Una vez completados todos los pasos, tendrás un chat IA completamente funcional con:

- ✅ Streaming de respuestas en tiempo real
- ✅ Formato Markdown enriquecido
- ✅ Tarjetas interactivas de candidatos
- ✅ Comparaciones visuales
- ✅ Contexto completo de los datos electorales
- ✅ Backend seguro en Supabase
