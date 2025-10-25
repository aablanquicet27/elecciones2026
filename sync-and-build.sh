#!/bin/bash

# Script para sincronizar y compilar la app de Android
# Uso: ./sync-and-build.sh

echo "🔄 Sincronizando configuración de Capacitor con Android..."
npx cap sync android

if [ $? -eq 0 ]; then
    echo "✅ Sincronización completada exitosamente"
    echo ""
    echo "📱 Próximos pasos:"
    echo "1. Ejecuta: npx cap open android"
    echo "2. En Android Studio, haz clic en el botón 'Run' (▶️)"
    echo "3. La app se instalará y ejecutará en tu dispositivo/emulador"
    echo ""
    echo "🌐 La app cargará: https://www.eleccionescolombia.org"
else
    echo "❌ Error durante la sincronización"
    exit 1
fi

