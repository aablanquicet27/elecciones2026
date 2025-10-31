#!/bin/bash

echo "🚀 Desplegando corrección de errores 404 a Vercel..."
echo ""

# Agregar archivos
echo "📦 Agregando archivos al staging..."
git add vercel.json DESPLIEGUE_VERCEL_URGENTE.md

# Commit
echo "💾 Haciendo commit..."
git commit -m "fix: Agregar configuración de Vercel para solucionar errores 404

- Agregado vercel.json con configuración de rewrites y headers
- Configurado cache optimizado para assets
- Solucionado problema de rutas que causaba 404
- Documentación de despliegue urgente incluida"

# Push
echo "⬆️  Haciendo push a GitHub..."
git push

echo ""
echo "✅ ¡Listo! Los cambios están en camino a Vercel"
echo ""
echo "🔄 Vercel iniciará el build automáticamente en 1-2 minutos"
echo "📊 Ve a tu dashboard de Vercel para ver el progreso"
echo ""
echo "⏱️  Tiempo estimado de despliegue: 2-3 minutos"
echo ""
echo "🧪 Después del despliegue:"
echo "   1. Abre tu sitio"
echo "   2. Presiona Ctrl+Shift+R (hard refresh)"
echo "   3. Verifica que no haya errores 404 en DevTools"
echo ""
echo "🎉 ¡Tu app estará funcionando sin errores 404!"
