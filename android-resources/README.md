# Configuración de Iconos para Android

## Iconos de la aplicación
Los iconos deben ser cuadrados con esquinas redondeadas y seguir las guías de Material Design.

### Tamaños requeridos:
- mipmap-mdpi/ic_launcher.png: 48x48 (mdpi)
- mipmap-hdpi/ic_launcher.png: 72x72 (hdpi)
- mipmap-xhdpi/ic_launcher.png: 96x96 (xhdpi)
- mipmap-xxhdpi/ic_launcher.png: 144x144 (xxhdpi)
- mipmap-xxxhdpi/ic_launcher.png: 192x192 (xxxhdpi)

### Splash Screens requeridos:
- drawable-mdpi/splash.png: 320x480 (mdpi)
- drawable-hdpi/splash.png: 480x800 (hdpi)
- drawable-xhdpi/splash.png: 720x1280 (xhdpi)
- drawable-xxhdpi/splash.png: 960x1600 (xxhdpi)
- drawable-xxxhdpi/splash.png: 1280x1920 (xxxhdpi)

## Instrucciones:
1. Crea un icono base de 512x512px
2. Usa herramientas como https://romannurik.github.io/AndroidAssetStudio/ para generar todos los tamaños
3. Coloca los archivos en las carpetas correspondientes
4. Ejecuta el script copy-resources.js para copiarlos al proyecto Android

## Colores de la app:
- Color primario: #7C3AED (púrpura)
- Color secundario: #F59E0B (amarillo/dorado)
- Color de fondo: #FFFFFF (blanco)
