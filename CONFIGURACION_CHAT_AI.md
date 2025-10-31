# Configuración del Chat de IA con Digital Ocean

## 🎯 Resumen

El componente **AIChatBubble** ahora está completamente implementado y visible en todas las páginas de la aplicación. Aparece como un botón flotante púrpura en la esquina inferior derecha.

## ✅ Cambios Realizados

1. ✅ **Componente AIChatBubble completamente implementado** con:
   - UI moderna y responsiva con diseño de chat flotante
   - Botón flotante con indicador de estado en línea
   - Interfaz de chat completa con historial de mensajes
   - Animaciones suaves y transiciones
   - Manejo de errores robusto
   - Indicador de carga mientras procesa mensajes

2. ✅ **Corregido el uso de variables de entorno**: Cambiado de `process.env` a `import.meta.env` (correcto para Vite)

3. ✅ **Componente visible sin restricciones**: Removida la restricción de suscripción - ahora se muestra siempre

4. ✅ **Instalada librería lucide-react** para los iconos del chat

## 🔧 Configuración Requerida

Para que el chat funcione correctamente, necesitas crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

### 1. Crear archivo `.env`

```bash
# En la raíz del proyecto (/workspace)
touch .env
```

### 2. Agregar las variables de entorno

```env
# Configuración de Supabase (ya deberías tenerlas)
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase

# Configuración de Digital Ocean AI Agent
VITE_DO_AGENT_ENDPOINT=https://your-agent.ondigitalocean.app
VITE_DO_AGENT_ACCESS_KEY=tu_clave_de_acceso_digital_ocean
```

### 3. Obtener las credenciales de Digital Ocean

#### Opción A: Si ya tienes un AI Agent desplegado

1. Ve a tu panel de Digital Ocean
2. Navega a "AI Agents" o "Apps"
3. Copia el **Endpoint URL** (ejemplo: `https://your-agent-name.ondigitalocean.app`)
4. Copia el **Access Key** desde la configuración del agent

#### Opción B: Si necesitas crear un nuevo AI Agent

1. Ve a [Digital Ocean AI Agents](https://cloud.digitalocean.com/)
2. Crea un nuevo AI Agent
3. Configura el modelo (GPT-4, Claude, etc.)
4. Copia las credenciales generadas

### 4. Reiniciar el servidor de desarrollo

```bash
# Detén el servidor actual (Ctrl+C)
# Inicia nuevamente
npm run dev
```

## 🧪 Verificar que Funciona

1. **Ver el botón flotante**: Deberías ver un botón circular púrpura con un icono de mensaje en la esquina inferior derecha

2. **Abrir el chat**: Haz clic en el botón para abrir la ventana de chat

3. **Mensaje de bienvenida**: Deberías ver un mensaje de bienvenida del asistente

4. **Probar una pregunta**: Escribe una pregunta sobre las elecciones y presiona Enter o el botón de enviar

## 🐛 Solución de Problemas

### El botón no aparece

- Verifica que el servidor esté corriendo (`npm run dev`)
- Abre las herramientas de desarrollador (F12) y busca errores en la consola
- Verifica que no haya errores de TypeScript

### El chat muestra error al enviar mensajes

1. **Error de configuración**: Verifica que las variables de entorno estén correctamente configuradas:
   ```bash
   # Verifica que las variables estén disponibles
   echo $VITE_DO_AGENT_ENDPOINT
   echo $VITE_DO_AGENT_ACCESS_KEY
   ```

2. **Error 401 (No autorizado)**: La `VITE_DO_AGENT_ACCESS_KEY` es incorrecta

3. **Error 404 (No encontrado)**: El `VITE_DO_AGENT_ENDPOINT` es incorrecto o el agent no existe

4. **Error de conexión**: Verifica tu conexión a internet o que el agent esté activo en Digital Ocean

### Error 406 de Supabase (en la consola)

Este error aparece porque el componente `SubscriptionModal` intenta verificar suscripciones. Puedes ignorarlo si no necesitas la funcionalidad de suscripciones. Para solucionarlo:

```sql
-- En Supabase, crea la tabla subscriptions si no existe:
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Asegúrate de que el RLS esté configurado correctamente
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Política para permitir SELECT
CREATE POLICY "Allow anonymous select" ON subscriptions
  FOR SELECT TO anon USING (true);
```

## 📝 Características del Chat

- **Contexto especializado**: El asistente está configurado para análisis político de Colombia 2026
- **Historial de conversación**: Mantiene el contexto de la conversación
- **UI moderna**: Diseño tipo chat moderno con gradientes y animaciones
- **Responsive**: Funciona en diferentes tamaños de pantalla
- **Indicadores visuales**: Estado en línea, indicador de escritura, etc.

## 🎨 Personalización

Puedes personalizar el contexto del sistema en el archivo `AIChatBubble.tsx`:

```typescript
const SYSTEM_CONTEXT = 'Tu contexto personalizado aquí...';
```

## 📚 Archivos Modificados

- `src/components/AIChatBubble.tsx` - Componente principal (completamente reescrito)
- `src/App.tsx` - Removida restricción de suscripción
- `package.json` - Agregada dependencia lucide-react
- `.env.example` - Archivo de ejemplo con variables necesarias

## 🚀 Próximos Pasos

1. Configura tus variables de entorno en `.env`
2. Reinicia el servidor de desarrollo
3. Abre la aplicación en el navegador
4. Busca el botón flotante púrpura en la esquina inferior derecha
5. ¡Prueba el chat con preguntas sobre las elecciones!

---

**Nota**: Recuerda NO subir el archivo `.env` a Git. El archivo `.gitignore` debería incluir `*.env` para prevenir esto.
