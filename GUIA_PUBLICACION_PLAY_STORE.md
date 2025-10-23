# 📱 Guía Completa: Publicar Elecciones Colombia 2026 en Google Play Store

## 🎯 Resumen

Esta guía te ayudará a compilar tu aplicación Android y publicarla en Google Play Store. He preparado todo el proyecto para que solo necesites seguir estos pasos.

---

## 📋 OPCIÓN 1: Compilar Localmente (RECOMENDADO)

### Requisitos Previos

1. **Android Studio** instalado en tu computadora
   - Descarga desde: https://developer.android.com/studio
   
2. **Node.js** (v16 o superior)
   - Descarga desde: https://nodejs.org/

3. **Git** para clonar el repositorio
   - Descarga desde: https://git-scm.com/

### Paso 1: Preparar el Proyecto

```bash
# Clonar el repositorio
git clone https://github.com/aablanquicet27/elecciones2026.git
cd elecciones2026

# Instalar dependencias
npm install

# Compilar la aplicación web
npm run build

# Sincronizar con Capacitor
npx cap sync android
```

### Paso 2: Abrir en Android Studio

```bash
# Abrir el proyecto Android
npx cap open android
```

Esto abrirá Android Studio automáticamente con el proyecto configurado.

### Paso 3: Generar el AAB Firmado

1. En Android Studio, ve a **Build** → **Generate Signed Bundle / APK**
2. Selecciona **Android App Bundle**
3. Crea un nuevo keystore o usa uno existente:
   - **Keystore path**: Elige una ubicación segura
   - **Password**: `3152426362aA?` (o la que prefieras)
   - **Alias**: `elecciones2026`
   - **Key password**: `3152426362aA?`
   - **Validity**: 25 años
   - **Certificate info**:
     - First and Last Name: `AgapaiApp`
     - Organization: `AgapaiApp`
     - City: `Bogotá`
     - State: `Cundinamarca`
     - Country Code: `CO`

4. Click **Next** y selecciona **release**
5. Click **Finish**

El archivo AAB se generará en:
```
android/app/release/app-release.aab
```

---

## 📋 OPCIÓN 2: Usar GitHub Actions (Automático)

### Configurar GitHub Actions

He creado un workflow que compila automáticamente tu app cada vez que haces push.

1. Ve a tu repositorio en GitHub
2. Click en **Settings** → **Secrets and variables** → **Actions**
3. Agrega estos secrets:

```
KEYSTORE_BASE64: (contenido del keystore en base64)
KEYSTORE_PASSWORD: 3152426362aA?
KEY_ALIAS: elecciones2026
KEY_PASSWORD: 3152426362aA?
```

4. Haz push a tu repositorio:
```bash
git add .
git commit -m "Configurar build automático"
git push
```

5. Ve a **Actions** en GitHub y descarga el AAB generado

---

## 🚀 Publicar en Google Play Console

### Paso 1: Acceder a Google Play Console

1. Ve a https://play.google.com/console/
2. Inicia sesión con: `ablanquicetb@gmail.com`

### Paso 2: Crear la Aplicación

1. Click en **Crear aplicación**
2. Completa los datos:
   - **Nombre**: Elecciones Colombia 2026
   - **Idioma predeterminado**: Español (Latinoamérica)
   - **Tipo**: Aplicación
   - **Gratis o de pago**: Gratis

### Paso 3: Completar Información de la Aplicación

#### Ficha de Play Store

**Descripción corta** (80 caracteres máximo):
```
Análisis electoral en tiempo real para las elecciones presidenciales 2026
```

**Descripción completa**:
```
🗳️ Elecciones Colombia 2026 - Tu fuente definitiva de información electoral

Mantente informado sobre las elecciones presidenciales de Colombia 2026 con nuestra aplicación de análisis electoral en tiempo real.

📊 CARACTERÍSTICAS PRINCIPALES:

• Análisis en tiempo real de intención de voto
• Perfiles completos de todos los candidatos presidenciales
• Mapas regionales interactivos con tendencias por departamento
• Noticias electorales actualizadas constantemente
• Comparación directa entre candidatos
• Predicciones basadas en datos históricos y encuestas
• Visualizaciones interactivas de tendencias políticas

📈 DATOS CONFIABLES:

Nuestra aplicación recopila y analiza datos de las principales encuestadoras del país:
- Invamer
- CNC
- Guarumo/EcoAnalítica
- Y más...

🎯 PARA QUIÉN ES ESTA APP:

• Ciudadanos interesados en política colombiana
• Periodistas y analistas políticos
• Estudiantes de ciencias políticas
• Cualquier persona que quiera estar informada sobre las elecciones

🔔 MANTENTE ACTUALIZADO:

Recibe información actualizada sobre:
- Encuestas de intención de voto
- Debates presidenciales
- Propuestas de candidatos
- Análisis de tendencias políticas
- Noticias electorales relevantes

📱 INTERFAZ INTUITIVA:

Diseño moderno y fácil de usar que te permite:
- Navegar rápidamente entre candidatos
- Comparar propuestas
- Ver mapas de tendencias regionales
- Acceder a noticias en tiempo real

¡Descarga ahora y participa de una democracia informada!

---

Desarrollada por AgapaiApp
Contacto: agapaibro@gmail.com

Esta aplicación es independiente y no está afiliada a ningún partido político o candidato.
```

**Categoría de la aplicación**:
- Categoría: Noticias y revistas

**Correo electrónico de contacto**:
```
agapaibro@gmail.com
```

#### Recursos Gráficos

Necesitas preparar:

1. **Icono de la aplicación** (512 x 512 px, PNG)
   - Ya generado en: `/home/ubuntu/elecciones-android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_playstore.png`

2. **Gráfico de funciones** (1024 x 500 px, PNG o JPG)
   - Imagen destacada que se muestra en la parte superior de tu ficha

3. **Capturas de pantalla del teléfono** (mínimo 2, máximo 8)
   - Tamaño: 16:9 o 9:16
   - Resolución mínima: 320 px
   - Resolución máxima: 3840 px

### Paso 4: Configurar Clasificación de Contenido

1. Ve a **Clasificación de contenido**
2. Completa el cuestionario:
   - **Categoría**: Noticias
   - **¿Contiene violencia?**: No
   - **¿Contenido sexual?**: No
   - **¿Lenguaje ofensivo?**: No

### Paso 5: Seleccionar Países

1. Ve a **Países y regiones**
2. Selecciona:
   - Colombia (principal)
   - Puedes agregar más países de habla hispana si deseas

### Paso 6: Subir el AAB

1. Ve a **Versiones** → **Producción**
2. Click en **Crear nueva versión**
3. Sube el archivo `app-release.aab`
4. Completa:
   - **Nombre de la versión**: `1.0.0`
   - **Notas de la versión** (en español):

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

5. Click en **Guardar** y luego **Revisar versión**

### Paso 7: Política de Privacidad

Necesitas una URL pública con tu política de privacidad. Aquí tienes un ejemplo básico:

```
POLÍTICA DE PRIVACIDAD - ELECCIONES COLOMBIA 2026

Última actualización: [FECHA]

1. INFORMACIÓN QUE RECOPILAMOS
Esta aplicación no recopila información personal de los usuarios.

2. USO DE LA INFORMACIÓN
La aplicación muestra información pública sobre candidatos y encuestas electorales.

3. DATOS DE TERCEROS
Los datos electorales provienen de fuentes públicas y encuestadoras reconocidas.

4. SEGURIDAD
Nos comprometemos a proteger la información de nuestros usuarios.

5. CONTACTO
Para preguntas sobre esta política: agapaibro@gmail.com
```

Puedes publicar esto en:
- GitHub Pages
- Un documento de Google Docs (público)
- Tu propio sitio web

### Paso 8: Enviar a Revisión

1. Revisa que todo esté completo
2. Click en **Enviar a revisión**
3. Google revisará tu app (puede tomar de 1 a 7 días)

---

## ⚠️ IMPORTANTE: Guardar el Keystore

**MUY IMPORTANTE**: El archivo keystore es único y necesario para todas las actualizaciones futuras.

1. **Guarda una copia segura** del archivo `elecciones2026.keystore`
2. **Anota las contraseñas**:
   - Keystore password: `3152426362aA?`
   - Key password: `3152426362aA?`
   - Alias: `elecciones2026`

3. **Ubicaciones recomendadas**:
   - USB externa
   - Google Drive (privado)
   - Servicio de almacenamiento en la nube

**Si pierdes el keystore, NO podrás actualizar la app nunca más.**

---

## 📊 Información Técnica de la App

- **Package Name**: `com.agapaibro.elecciones2026`
- **Version Code**: 1
- **Version Name**: 1.0.0
- **Min SDK**: Android 6.0 (API 23)
- **Target SDK**: Android 13 (API 33)
- **Tamaño aproximado**: 2-5 MB

---

## 🔧 Solución de Problemas

### Error: "SDK not found"
```bash
# En Android Studio, ve a:
File → Project Structure → SDK Location
# Y configura la ubicación del Android SDK
```

### Error: "Gradle sync failed"
```bash
# Limpia el proyecto
./gradlew clean

# O en Android Studio:
Build → Clean Project
Build → Rebuild Project
```

### Error al firmar el AAB
- Verifica que las contraseñas sean correctas
- Asegúrate de que el keystore existe en la ubicación especificada

---

## 📞 Soporte

Si tienes problemas:

1. **Documentación de Capacitor**: https://capacitorjs.com/docs
2. **Documentación de Android**: https://developer.android.com/docs
3. **Google Play Console Help**: https://support.google.com/googleplay/android-developer

---

## ✅ Checklist de Publicación

- [ ] Proyecto compilado exitosamente
- [ ] AAB generado y firmado
- [ ] Keystore guardado en lugar seguro
- [ ] Cuenta de Google Play Console activa
- [ ] Aplicación creada en Play Console
- [ ] Descripción y textos completados
- [ ] Iconos y capturas de pantalla subidos
- [ ] Clasificación de contenido completada
- [ ] Política de privacidad publicada
- [ ] AAB subido a Play Console
- [ ] Versión enviada a revisión

---

## 🎉 ¡Listo!

Una vez que Google apruebe tu aplicación (generalmente 1-3 días), estará disponible en Google Play Store para que millones de colombianos puedan descargarla.

**¡Felicitaciones por publicar tu primera app en Play Store!** 🚀

