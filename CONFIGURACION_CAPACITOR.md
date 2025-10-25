# Configuración de Capacitor para Elecciones Colombia 2026

## 📱 Descripción

Este documento explica cómo configurar tu aplicación móvil de Capacitor para que cargue correctamente el sitio web **https://www.eleccionescolombia.org/** en lugar de mostrar un lienzo en blanco.

---

## ✅ Cambios Realizados

### 1. Archivo `capacitor.config.ts` (Configuración Principal)

El archivo `capacitor.config.ts` ha sido modificado para cargar tu sitio web en producción. La configuración clave es:

```typescript
server: {
  url: 'https://www.eleccionescolombia.org',
  cleartext: false,
  androidScheme: 'https'
}
```

**Explicación de los parámetros:**

- **`url`**: Apunta directamente a tu sitio web en producción. La app cargará este sitio en lugar de archivos locales.
- **`cleartext`**: Establecido en `false` para asegurar que solo se usen conexiones HTTPS seguras.
- **`androidScheme`**: Configurado como `https` para mantener consistencia con el protocolo web.

### 2. Archivo `capacitor.config.local.ts` (Configuración Alternativa)

Se ha creado un archivo adicional `capacitor.config.local.ts` que mantiene la configuración original para desarrollo local (usando archivos del directorio `dist`). Esto te permite alternar entre ambos modos según necesites.

### 3. Permisos de Android

El archivo `android/app/src/main/AndroidManifest.xml` ya incluye el permiso necesario para acceder a internet:

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

---

## 🚀 Cómo Compilar y Ejecutar la App

### Opción A: Usar la Configuración Web (Producción)

Esta es la configuración actual por defecto que carga tu sitio web.

```bash
# 1. Sincronizar cambios con Android
npx cap sync android

# 2. Abrir el proyecto en Android Studio
npx cap open android

# 3. En Android Studio, haz clic en "Run" (▶️) para instalar y ejecutar la app
```

### Opción B: Usar la Configuración Local (Desarrollo)

Si necesitas trabajar con archivos locales durante el desarrollo:

```bash
# 1. Renombrar los archivos de configuración
mv capacitor.config.ts capacitor.config.web.ts
mv capacitor.config.local.ts capacitor.config.ts

# 2. Compilar el proyecto
npm run build

# 3. Sincronizar y abrir
npx cap sync android
npx cap open android
```

Para volver a la configuración web, simplemente invierte el proceso:

```bash
mv capacitor.config.ts capacitor.config.local.ts
mv capacitor.config.web.ts capacitor.config.ts
npx cap sync android
```

---

## 🔧 Scripts Útiles del Proyecto

Tu `package.json` incluye varios scripts útiles para trabajar con Android:

```bash
# Compilar y sincronizar con Android
npm run android:build

# Compilar, sincronizar y ejecutar en dispositivo/emulador
npm run android:dev

# Generar APK de release
npm run android:release

# Generar Android App Bundle (AAB) para Play Store
npm run android:bundle
```

---

## 🌐 Verificación de la Configuración

Para verificar que la configuración está correcta, puedes revisar el archivo `capacitor.config.ts`:

```bash
cat capacitor.config.ts
```

Deberías ver la sección `server` con la URL de tu sitio web:

```typescript
server: {
  url: 'https://www.eleccionescolombia.org',
  cleartext: false,
  androidScheme: 'https'
}
```

---

## ⚠️ Consideraciones Importantes

### 1. **Conexión a Internet Requerida**

Como la app ahora carga contenido desde un servidor web externo, los usuarios necesitarán conexión a internet para usar la aplicación. Asegúrate de que esto esté claro en la descripción de tu app.

### 2. **Rendimiento**

El rendimiento de la app dependerá de:
- La velocidad de conexión del usuario
- El tiempo de respuesta de tu servidor web
- La optimización de tu sitio web (imágenes, scripts, etc.)

### 3. **Modo Offline**

Si deseas que la app funcione sin conexión, considera implementar:
- Service Workers en tu sitio web
- Caché de recursos estáticos
- Progressive Web App (PWA) features

### 4. **Debugging**

Si necesitas depurar la app, puedes habilitar el debugging web en `capacitor.config.ts`:

```typescript
android: {
  allowMixedContent: true,
  captureInput: true,
  webContentsDebuggingEnabled: true  // Cambiar a true
}
```

Luego, puedes usar Chrome DevTools conectándote a `chrome://inspect` desde tu computadora mientras la app está corriendo en el dispositivo.

---

## 🐛 Solución de Problemas

### Problema: La app muestra un lienzo en blanco

**Soluciones:**

1. Verifica que tu sitio web esté accesible desde un navegador móvil
2. Revisa que la URL en `capacitor.config.ts` sea correcta (sin barra final)
3. Asegúrate de haber ejecutado `npx cap sync android` después de modificar la configuración
4. Limpia y reconstruye el proyecto Android:
   ```bash
   cd android
   ./gradlew clean
   cd ..
   npx cap sync android
   ```

### Problema: Error de red o timeout

**Soluciones:**

1. Verifica que el dispositivo/emulador tenga conexión a internet
2. Revisa que tu servidor web esté funcionando correctamente
3. Comprueba que no haya firewalls bloqueando la conexión

### Problema: Contenido mixto (HTTP/HTTPS)

**Soluciones:**

1. Asegúrate de que todos los recursos de tu sitio web usen HTTPS
2. Si necesitas permitir contenido HTTP temporalmente, verifica que `allowMixedContent: true` esté en la configuración

---

## 📝 Próximos Pasos

1. **Probar la app** en un dispositivo físico o emulador
2. **Verificar el rendimiento** y la experiencia de usuario
3. **Optimizar tu sitio web** para dispositivos móviles si es necesario
4. **Considerar implementar PWA** para funcionalidad offline
5. **Preparar para publicación** en Google Play Store usando los scripts incluidos

---

## 📚 Recursos Adicionales

- [Documentación oficial de Capacitor](https://capacitorjs.com/docs)
- [Configuración de Capacitor](https://capacitorjs.com/docs/config)
- [Guía de Android](https://capacitorjs.com/docs/android)
- Archivos del proyecto:
  - `GUIA_PUBLICACION_PLAY_STORE.md`
  - `PUBLICAR_EN_PLAY_STORE.md`
  - `README-PLAY-STORE.md`

---

## 🆘 Soporte

Si encuentras problemas o necesitas ayuda adicional, revisa los archivos de documentación incluidos en el proyecto o consulta la documentación oficial de Capacitor.

