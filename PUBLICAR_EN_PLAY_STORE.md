# 🚀 Cómo Publicar en Google Play Store - Guía Rápida

## ✅ Lo que ya está listo

He preparado todo lo necesario para publicar tu app:

1. ✅ **Proyecto Android configurado** con Capacitor
2. ✅ **Iconos generados** en todos los tamaños
3. ✅ **Capturas de pantalla** profesionales
4. ✅ **Gráfico de funciones** para Play Store
5. ✅ **Textos y descripciones** listos para copiar y pegar
6. ✅ **Política de privacidad** en HTML
7. ✅ **GitHub Actions** configurado para compilación automática

---

## 🎯 OPCIÓN 1: Compilar con GitHub Actions (MÁS FÁCIL)

### Paso 1: Activar GitHub Actions

1. Ve a tu repositorio: https://github.com/aablanquicet27/elecciones2026
2. Click en la pestaña **Actions**
3. Si está desactivado, click en "I understand my workflows, go ahead and enable them"

### Paso 2: Ejecutar el Workflow

1. En la pestaña Actions, selecciona **"Build Android AAB"**
2. Click en **"Run workflow"** → **"Run workflow"**
3. Espera 5-10 minutos mientras se compila

### Paso 3: Descargar el AAB

1. Cuando termine, verás un check verde ✅
2. Click en el workflow completado
3. Baja hasta **Artifacts**
4. Descarga **app-release-aab**
5. Descomprime el ZIP, dentro está tu `app-release.aab`

---

## 🎯 OPCIÓN 2: Compilar Localmente

### Requisitos

- Android Studio instalado
- Node.js instalado

### Pasos

```bash
# 1. Clonar el repositorio (si no lo tienes)
git clone https://github.com/aablanquicet27/elecciones2026.git
cd elecciones2026

# 2. Instalar dependencias
npm install

# 3. Compilar la web
npm run build

# 4. Sincronizar con Android
npx cap sync android

# 5. Abrir en Android Studio
npx cap open android
```

En Android Studio:
1. **Build** → **Generate Signed Bundle / APK**
2. Selecciona **Android App Bundle**
3. Crea un keystore nuevo (guarda las contraseñas)
4. Click **Finish**

El AAB estará en: `android/app/release/app-release.aab`

---

## 📱 Publicar en Google Play Console

### Paso 1: Acceder

1. Ve a https://play.google.com/console/
2. Inicia sesión con: `ablanquicetb@gmail.com`

### Paso 2: Crear la App

1. Click **"Crear aplicación"**
2. Completa:
   - **Nombre:** Elecciones Colombia 2026
   - **Idioma:** Español (Latinoamérica)
   - **Tipo:** Aplicación
   - **Gratis/Pago:** Gratis

### Paso 3: Completar Información

#### Descripción Corta
```
Análisis electoral en tiempo real para las elecciones presidenciales 2026
```

#### Descripción Completa
Copia el texto completo desde: `TEXTOS_PLAY_STORE.md`

#### Categoría
```
Noticias y revistas
```

#### Correo de contacto
```
agapaibro@gmail.com
```

### Paso 4: Subir Recursos Gráficos

Todos están en la carpeta `play-store-resources/`:

1. **Icono de la app** (512x512):
   - Sube: `icon_512x512.png`

2. **Gráfico de funciones** (1024x500):
   - Sube: `feature_graphic.png`

3. **Capturas de pantalla**:
   - Sube: `screenshot_1.png`, `screenshot_2.png`, `screenshot_3.png`, `screenshot_4.png`

### Paso 5: Política de Privacidad

1. Primero, activa GitHub Pages:
   - Ve a **Settings** → **Pages**
   - Source: **Deploy from a branch**
   - Branch: **main** → **/ (root)**
   - Click **Save**

2. Tu política estará en:
   ```
   https://aablanquicet27.github.io/elecciones2026/privacy-policy.html
   ```

3. Copia esa URL en Play Console → Política de privacidad

### Paso 6: Clasificación de Contenido

1. Ve a **Clasificación de contenido**
2. Selecciona categoría: **Noticias**
3. Responde todas las preguntas con **NO**
4. Guarda

### Paso 7: Países

1. Ve a **Países y regiones**
2. Selecciona: **Colombia** (mínimo)
3. Puedes agregar más países hispanohablantes

### Paso 8: Subir el AAB

1. Ve a **Versiones** → **Producción** → **Crear nueva versión**
2. Sube el archivo `app-release.aab`
3. Nombre de versión: `1.0.0`
4. Notas de la versión (copia desde `TEXTOS_PLAY_STORE.md`)
5. Click **Guardar** → **Revisar versión** → **Iniciar lanzamiento**

---

## ⏱️ ¿Cuánto tarda?

- **Compilación (GitHub Actions):** 5-10 minutos
- **Completar información en Play Console:** 30-60 minutos
- **Revisión de Google:** 1-7 días

---

## 🆘 Ayuda Rápida

### Si GitHub Actions falla:
- Verifica que Actions esté habilitado en tu repositorio
- Revisa los logs del workflow para ver el error

### Si no puedes compilar localmente:
- Asegúrate de tener Android Studio instalado
- Verifica que Node.js esté instalado: `node --version`

### Si Google rechaza la app:
- Lee el email de rechazo cuidadosamente
- Corrige lo que pidan
- Vuelve a subir una nueva versión

---

## 📞 Contacto

Si tienes problemas, revisa:
- `GUIA_PUBLICACION_PLAY_STORE.md` - Guía completa y detallada
- `TEXTOS_PLAY_STORE.md` - Todos los textos para copiar y pegar

---

## ✅ Checklist Final

- [ ] AAB compilado (GitHub Actions o local)
- [ ] Cuenta de Play Console activa
- [ ] App creada en Play Console
- [ ] Descripción y textos completados
- [ ] Iconos y capturas subidos
- [ ] Política de privacidad publicada en GitHub Pages
- [ ] Clasificación de contenido completada
- [ ] AAB subido
- [ ] Versión enviada a revisión

---

## 🎉 ¡Listo!

Una vez que Google apruebe tu app (1-7 días), estará disponible en Play Store.

**¡Felicitaciones! 🚀**

