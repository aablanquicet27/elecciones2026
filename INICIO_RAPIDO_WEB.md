# 🚀 Inicio Rápido - App Web

## Tu app ahora carga el sitio web en producción

La configuración de Capacitor ha sido modificada para que tu aplicación móvil cargue directamente **https://www.eleccionescolombia.org** en lugar de archivos locales.

---

## ⚡ Pasos para Compilar y Ejecutar

### 1️⃣ Sincronizar Cambios

```bash
npx cap sync android
```

Este comando actualiza el proyecto Android con la nueva configuración.

### 2️⃣ Abrir en Android Studio

```bash
npx cap open android
```

Esto abrirá el proyecto en Android Studio.

### 3️⃣ Ejecutar la App

En Android Studio:
1. Asegúrate de tener un dispositivo conectado o un emulador corriendo
2. Haz clic en el botón **Run** (▶️) en la barra superior
3. La app se instalará y ejecutará automáticamente

---

## 🎯 Alternativa: Script Automatizado

También puedes usar el script incluido:

```bash
./sync-and-build.sh
```

Este script ejecuta la sincronización y te muestra los próximos pasos.

---

## 🔍 Verificar la Configuración

Para confirmar que la configuración está correcta:

```bash
cat capacitor.config.ts | grep -A 4 "server:"
```

Deberías ver:

```typescript
server: {
  url: 'https://www.eleccionescolombia.org',
  cleartext: false,
  androidScheme: 'https'
}
```

---

## 📱 Requisitos

- **Conexión a Internet**: La app necesita internet para cargar el sitio web
- **Android Studio**: Instalado y configurado
- **Dispositivo/Emulador**: Con Android 5.0 (API 21) o superior

---

## 📖 Documentación Completa

Para más detalles, consulta:
- **CONFIGURACION_CAPACITOR.md** - Documentación completa de la configuración
- **GUIA_PUBLICACION_PLAY_STORE.md** - Guía para publicar en Play Store
- **README.md** - Información general del proyecto

---

## 🆘 ¿Problemas?

Si la app muestra un lienzo en blanco:

1. Verifica que tu sitio web esté accesible desde un navegador móvil
2. Asegúrate de haber ejecutado `npx cap sync android`
3. Limpia y reconstruye:
   ```bash
   cd android
   ./gradlew clean
   cd ..
   npx cap sync android
   ```

Consulta **CONFIGURACION_CAPACITOR.md** para más soluciones.

