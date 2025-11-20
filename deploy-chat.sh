#!/bin/bash

echo "🚀 Desplegando Chat IA Mejorado a Supabase"
echo "=========================================="
echo ""

# Verificar que Supabase CLI esté instalado
if ! command -v supabase &> /dev/null
then
    echo "❌ Supabase CLI no está instalado"
    echo "📦 Instalando Supabase CLI..."
    npm install -g supabase
fi

echo "✅ Supabase CLI encontrado"
echo ""

# Verificar que el usuario esté autenticado
echo "🔐 Verificando autenticación..."
if ! supabase projects list &> /dev/null
then
    echo "❌ No estás autenticado en Supabase"
    echo "🔑 Por favor ejecuta: supabase login"
    exit 1
fi

echo "✅ Autenticación verificada"
echo ""

# Desplegar la Edge Function
echo "📤 Desplegando Edge Function 'chat-ai'..."
supabase functions deploy chat-ai

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Edge Function desplegada exitosamente"
    echo ""
    echo "📋 Próximos pasos:"
    echo ""
    echo "1. Configura la variable de entorno OPENAI_API_KEY en Supabase:"
    echo "   supabase secrets set OPENAI_API_KEY=sk-tu-api-key"
    echo ""
    echo "2. O configúrala desde el Dashboard:"
    echo "   https://supabase.com/dashboard > Project Settings > Edge Functions > Secrets"
    echo ""
    echo "3. Actualiza tu archivo .env con las credenciales de Supabase:"
    echo "   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co"
    echo "   VITE_SUPABASE_ANON_KEY=tu-anon-key"
    echo "   VITE_SUPABASE_FUNCTIONS_URL=https://tu-proyecto.supabase.co/functions/v1"
    echo ""
    echo "4. Reemplaza el componente en src/App.tsx:"
    echo "   import AIChatBubble from './components/AIChatBubbleNew';"
    echo ""
    echo "🎉 ¡Listo! El chat IA está desplegado"
else
    echo ""
    echo "❌ Error al desplegar la Edge Function"
    echo "🔍 Verifica que estés vinculado a un proyecto:"
    echo "   supabase link --project-ref tu-project-ref"
    exit 1
fi
