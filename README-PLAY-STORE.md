# 🚀 Guía Completa: Publicar Elecciones Colombia 2026 en Play Store

## 📖 Resumen

Tu aplicación **Elecciones Colombia 2026** ya está lista para ser publicada en Google Play Store. Este README te guía paso a paso para subirla y configurarla correctamente.

## ⚡ Inicio Rápido (EJECUTA ESTO PRIMERO)

```bash
# 1. Ejecutar script maestro (recomendado)
node deploy-to-playstore.js

# 2. O ejecutar paso a paso:
node android-setup.js      # Configurar Android
node generate-icons.js     # Generar estructura de iconos
node copy-resources.js     # Copiar iconos (después de generarlos)
node build-release.js      # Generar APK/AAB para Play Store
```

## 📁 Archivos Importantes Creados

### Scripts de Configuración
- `android-setup.js` - Configura Capacitor y Android
- `generate-icons.js` - Crea estructura para iconos
- `build-release.js` - Genera APK y AAB firmados
- `deploy-to-playstore.js` - **SCRIPT MAESTRO** (ejecuta todo)
- `copy-resources.js` - Copia iconos al proyecto Android

### Configuración
- `capacitor.config.ts` - Configuración de Capacitor
- `package.json` - Actualizado con scripts Android
- `vite.config.ts` - Optimizado para Capacitor

### Documentación
- `play-store-info.md` - **TODA la información para Play Store**
- `PLAY_STORE_CHECKLIST.md` - Lista de verificación
- `keystore-config.txt` - Configuración de firma

### Recursos Gráficos
- `android-resources/` - Carpeta con iconos y splash screens
- `android-resources/icon-base.svg` - Icono base editable
- `android-resources/splash-base.svg` - Splash screen base

## 🎯 ARCHIVO PARA PLAY STORE

**📤 SUBE ESTE ARCHIVO:**
```
android/app/build/outputs/bundle/release/app-release.aab
```

## 📋 Pasos en Play Store Console

### 1. Crear Aplicación
1. Ve a [Play Store Console](https://play.google.com/console/)
2. Crea nueva aplicación
3. Nombre: **Elecciones Colombia 2026**
4. ID: **com.agapaibro.elecciones2026**

### 2. Subir AAB
1. Ve a "Versiones de la app" → "Pruebas internas"
2. Crea nueva versión
3. Sube `app-release.aab`
4. Nombre de versión: **"Lanzamiento Beta"**

### 3. Información de la App
**Usa la información de `play-store-info.md`:**

#### Descripción Corta
```
Análisis y predicciones electorales para las elecciones presidenciales 2026
```

#### Notas de Versión (es-419)
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

### 4. Assets Requeridos

#### Screenshots (Genera desde tu app)
- Dashboard principal
- Perfiles de candidatos
- Mapas regionales
- Análisis comparativo
- Noticias

#### Iconos
- **512x512px** - Icono principal
- **1024x1024px** - Para Play Store

## 🔧 Requisitos Técnicos

### Tu Sistema Necesita
- **Node.js** (v16+)
- **Java JDK** (v11+)
- **Android SDK** (recomendado Android Studio)

### Verificar Instalación
```bash
npx cap doctor
```

## 🚨 Solución de Problemas

### Error: "Android SDK not found"
1. Instala Android Studio
2. Abre Android Studio y descarga SDK
3. Configura variables de entorno:
   ```
   ANDROID_HOME=C:\Users\[USER]\AppData\Local\Android\Sdk
   ```

### Error: "Java not found"
1. Instala Java JDK 11+
2. Configura JAVA_HOME

### Error en Build
```bash
# Limpiar y rebuild
cd android
./gradlew clean
cd ..
npm run android:build
```

### Capacitor no encontrado
```bash
npm install -g @capacitor/cli
npx cap doctor
```

## 📱 Información de la App

### Detalles Técnicos
- **Nombre:** Elecciones Colombia 2026
- **ID:** com.agapaibro.elecciones2026
- **Versión:** 1.0.0
- **Min SDK:** Android 6.0 (API 23)
- **Target SDK:** Android 13 (API 33)

### Contacto
- **Desarrollador:** AgapaiApp
- **Email:** agapaibro@gmail.com
- **Categoría:** Noticias y Revistas

## 🎉 Después de Publicar

### Monitoreo
1. Verifica en Play Store Console:
   - Errores de instalación
   - Calificaciones
   - Comentarios
2. Configura Google Analytics (opcional)

### Próximas Versiones
1. Recoger feedback de usuarios
2. Actualizar datos electorales
3. Agregar nuevas funcionalidades
4. Optimizar rendimiento

## 📞 Soporte

Si encuentras problemas:

1. **Revisa los logs:** `npx cap doctor`
2. **Consulta documentación:** [Capacitor Docs](https://capacitorjs.com/docs)
3. **Problemas específicos:** Busca en Stack Overflow
4. **Issues de Capacitor:** [GitHub Issues](https://github.com/ionic-team/capacitor/issues)

## 🔒 Seguridad

### Keystore (Importante)
- **NO** subas el archivo `elecciones2026.keystore` a Git
- **GUARDA** una copia segura del keystore
- **SIN KEYSTORE** no podrás actualizar la app

### Passwords
- Guarda las contraseñas del keystore
- Usa contraseñas seguras para producción

## ✅ Checklist Final

- [ ] ✅ Scripts configurados
- [ ] ✅ Capacitor instalado
- [ ] ✅ Proyecto Android creado
- [ ] ✅ AAB generado
- [ ] 🔄 Iconos personalizados (pendiente)
- [ ] 🔄 Screenshots tomados (pendiente)
- [ ] 🔄 App subida a Play Store (pendiente)
- [ ] 🔄 Información completada (pendiente)
- [ ] 🔄 Prueba interna publicada (pendiente)

---

## 🚀 ¡A PUBLICAR!

Tu app está **LISTA** para Play Store. Solo necesitas:

1. **Ejecutar:** `node deploy-to-playstore.js`
2. **Generar iconos** personalizados
3. **Subir AAB** a Play Store Console
4. **Completar información** usando `play-store-info.md`

**¡Tu aplicación electoral estará en Play Store en menos de una hora!** 🎉
