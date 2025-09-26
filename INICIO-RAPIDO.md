# 🚀 INICIO RÁPIDO - Elecciones Colombia 2026 para Play Store

## ⚡ ¡Todo está listo! Solo ejecuta estos comandos:

### 1️⃣ Opción FÁCIL (Recomendado)
```bash
# Ejecutar script maestro que hace todo automáticamente
node deploy-to-playstore.cjs
```

### 2️⃣ Opción PASO A PASO
```bash
# 1. Generar iconos y recursos
node generate-icons.cjs

# 2. Configurar proyecto Android
node android-setup.cjs

# 3. Generar APK/AAB para Play Store
node build-release.cjs

# 4. Verificar que todo está listo
node verify-playstore-ready.cjs
```

### 3️⃣ Usando npm scripts
```bash
# Scripts rápidos
npm run playstore:setup     # Configurar Android
npm run playstore:icons     # Generar iconos
npm run playstore:build     # Generar AAB
npm run playstore:verify    # Verificar todo
npm run playstore:deploy    # Script maestro
```

## 📂 Archivo para subir a Play Store
**Después de ejecutar los scripts, sube este archivo:**
```
android/app/build/outputs/bundle/release/app-release.aab
```

## 📋 Información para Play Store Console
- **Nombre:** Elecciones Colombia 2026
- **ID:** com.agapaibro.elecciones2026
- **Versión:** "Lanzamiento Beta"
- **Desarrollador:** AgapaiApp
- **Email:** agapaibro@gmail.com

## 🎯 Notas de Versión (copia y pega)
```
🗳️ ¡Bienvenido a Elecciones Colombia 2026!

Esta es la versión inicial de tu app definitiva para seguir las elecciones presidenciales.

✨ Características incluidas:
• Análisis en tiempo real de intención de voto
• Perfiles completos de candidatos presidenciales
• Mapas regionales interactivos
• Noticias electorales actualizadas
• Comparación entre candidatos
• Predicciones basadas en datos históricos

📊 Datos actualizados de las principales encuestadoras del país

¡Gracias por ser parte de la democracia informada!
```

## 🔗 Links útiles
- 📖 **Guía completa:** README-PLAY-STORE.md
- 📄 **Info de Play Store:** play-store-info.md
- 🏪 **Play Store Console:** https://play.google.com/console/

## ⚠️ Si tienes problemas
1. **Verifica status:** `node verify-playstore-ready.cjs`
2. **Instala dependencias:** `npm install`
3. **Revisa requisitos:** Java JDK + Android SDK

## 🎊 ¡Listo para publicar!
Tu app está **completamente configurada** para Play Store. Solo ejecuta el script y súbela. ¡En menos de 30 minutos estará en línea! 🚀
