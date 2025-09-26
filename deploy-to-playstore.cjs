#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const readline = require('readline');

console.log('🚀 DEPLOY COMPLETO A PLAY STORE - Elecciones Colombia 2026\n');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
}

function runCommand(command, description) {
  return new Promise((resolve, reject) => {
    console.log(`\n📦 ${description}...`);
    exec(command, { cwd: __dirname }, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr && !stderr.includes('Warning')) {
        console.log(`⚠️  ${stderr}`);
      }
      console.log(`✅ ${description} completado`);
      if (stdout) {
        console.log(stdout.split('\n').slice(-3).join('\n')); // Mostrar últimas 3 líneas
      }
      resolve(stdout);
    });
  });
}

function createChecklist() {
  const checklist = `
# ✅ CHECKLIST PARA PLAY STORE - Elecciones Colombia 2026

## 🔧 Preparación Técnica
- [ ] Instalar dependencias (npm install)
- [ ] Configurar Capacitor
- [ ] Generar proyecto Android
- [ ] Crear iconos y splash screens
- [ ] Configurar keystore para firma
- [ ] Generar APK y AAB

## 📱 Assets para Play Store
- [ ] Icono de app 512x512px
- [ ] Screenshots (mínimo 2, máximo 8)
- [ ] Banner promocional 1024x500px
- [ ] Descripción corta (max 80 caracteres)
- [ ] Descripción completa
- [ ] Palabras clave

## 🏪 Configuración en Play Store Console
- [ ] Crear aplicación en Play Store Console
- [ ] Subir AAB (Android App Bundle)
- [ ] Configurar información de la app
- [ ] Establecer clasificación de contenido
- [ ] Configurar política de privacidad
- [ ] Crear versión de prueba interna
- [ ] Agregar testers para prueba interna
- [ ] Publicar versión de prueba

## 📋 Información Requerida
- Nombre: Elecciones Colombia 2026
- ID: com.agapaibro.elecciones2026
- Categoría: Noticias y Revistas
- Clasificación: Para todas las edades
- Contacto: agapaibro@gmail.com

## 🎯 Notas de Versión (es-419)
"🗳️ ¡Bienvenido a Elecciones Colombia 2026!

Esta es la versión inicial de tu app definitiva para seguir las elecciones presidenciales.

✨ Características incluidas:
• Análisis en tiempo real de intención de voto
• Perfiles completos de candidatos presidenciales  
• Mapas regionales interactivos
• Noticias electorales actualizadas
• Comparación entre candidatos
• Predicciones basadas en datos históricos"

## 🚀 Después del Deploy
- [ ] Monitorear métricas en Play Store Console
- [ ] Recoger feedback de usuarios beta
- [ ] Planificar siguientes versiones
- [ ] Configurar analytics (opcional)
`;

  fs.writeFileSync('./PLAY_STORE_CHECKLIST.md', checklist);
  console.log('📋 Checklist creado: PLAY_STORE_CHECKLIST.md');
}

async function deployToPlayStore() {
  try {
    console.log('Este script te guiará paso a paso para subir tu app a Play Store.\n');
    
    const continuar = await question('¿Estás listo para comenzar? (y/n): ');
    if (continuar.toLowerCase() !== 'y') {
      console.log('👋 ¡Hasta luego! Ejecuta el script cuando estés listo.');
      rl.close();
      return;
    }

    console.log('\n🎯 PASO 1: Preparación del proyecto\n');
    
    // 1. Instalar dependencias
    await runCommand('npm install', 'Instalando dependencias');
    
    // 2. Configurar iconos
    console.log('\n🎨 PASO 2: Configurando recursos gráficos\n');
    await runCommand('node generate-icons.js', 'Generando estructura de iconos');
    
    console.log('\n⚠️  IMPORTANTE: Necesitas generar iconos antes de continuar.');
    console.log('1. Ve a android-resources/ y revisa los archivos SVG base');
    console.log('2. Usa https://romannurik.github.io/AndroidAssetStudio/ para generar iconos');
    console.log('3. Coloca los PNG en las carpetas correspondientes');
    console.log('4. Ejecuta: node copy-resources.js');
    
    const iconosListos = await question('\n¿Has generado y copiado los iconos? (y/n): ');
    if (iconosListos.toLowerCase() === 'y') {
      try {
        await runCommand('node copy-resources.js', 'Copiando recursos al proyecto Android');
      } catch (error) {
        console.log('⚠️  No se pudieron copiar recursos automáticamente');
      }
    }
    
    // 3. Configurar Android
    console.log('\n📱 PASO 3: Configurando proyecto Android\n');
    await runCommand('node android-setup.js', 'Configurando proyecto Android');
    
    // 4. Generar builds
    console.log('\n🏗️  PASO 4: Generando archivos para Play Store\n');
    await runCommand('node build-release.js', 'Generando APK y AAB');
    
    // 5. Verificar archivos generados
    console.log('\n📦 PASO 5: Verificando archivos generados\n');
    
    const aabPath = './android/app/build/outputs/bundle/release/app-release.aab';
    const apkPath = './android/app/build/outputs/apk/release/app-release.apk';
    
    if (fs.existsSync(aabPath)) {
      console.log(`✅ AAB generado: ${aabPath}`);
      console.log('📤 ¡Este es el archivo que debes subir a Play Store!');
    } else {
      console.log('❌ No se encontró el AAB. Revisa los errores anteriores.');
    }
    
    if (fs.existsSync(apkPath)) {
      console.log(`✅ APK generado: ${apkPath}`);
      console.log('📲 Puedes usar este APK para pruebas locales');
    }
    
    // 6. Crear checklist y información
    console.log('\n📋 PASO 6: Creando documentación\n');
    createChecklist();
    
    console.log('\n🎉 ¡PROCESO COMPLETADO!\n');
    console.log('📂 Archivos importantes generados:');
    console.log('• PLAY_STORE_CHECKLIST.md - Lista de verificación');
    console.log('• play-store-info.md - Información completa para Play Store');
    console.log('• android/app/build/outputs/bundle/release/app-release.aab - ¡SUBE ESTE ARCHIVO!');
    
    console.log('\n🚀 PRÓXIMOS PASOS EN PLAY STORE CONSOLE:');
    console.log('1. Ve a https://play.google.com/console/');
    console.log('2. Crea una nueva aplicación');
    console.log('3. Sube el archivo app-release.aab');
    console.log('4. Completa la información usando play-store-info.md');
    console.log('5. Crea una versión de prueba interna');
    console.log('6. Publica la versión de prueba');
    
    console.log('\n📧 Información de contacto para Play Store:');
    console.log('• Nombre: Elecciones Colombia 2026');
    console.log('• ID: com.agapaibro.elecciones2026');
    console.log('• Desarrollador: AgapaiApp');
    console.log('• Correo: agapaibro@gmail.com');
    
    console.log('\n💡 CONSEJOS FINALES:');
    console.log('• Revisa play-store-info.md para descripciones y palabras clave');
    console.log('• Genera screenshots de la app funcionando');
    console.log('• Crea una política de privacidad básica');
    console.log('• Configura la clasificación "Para todas las edades"');
    
    const abrirInfo = await question('\n¿Quieres abrir la información de Play Store ahora? (y/n): ');
    if (abrirInfo.toLowerCase() === 'y') {
      console.log('📖 Abriendo play-store-info.md...');
    }
    
  } catch (error) {
    console.error('\n❌ Error durante el proceso:', error.message);
    console.log('\n🔧 Pasos para resolver:');
    console.log('1. Verifica que tienes Node.js instalado');
    console.log('2. Verifica que tienes Java JDK instalado');
    console.log('3. Instala Android Studio y configura el SDK');
    console.log('4. Ejecuta: npx cap doctor para diagnosticar');
    console.log('5. Si persisten los errores, ejecuta cada script por separado');
  } finally {
    rl.close();
  }
}

// Ejecutar script
deployToPlayStore();
