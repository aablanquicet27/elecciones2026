#!/usr/bin/env node

const { exec } = require('child_process');
const path = require('path');

console.log('🚀 Configurando proyecto Android para Play Store...\n');

// Función para ejecutar comandos
function runCommand(command, description) {
  return new Promise((resolve, reject) => {
    console.log(`📦 ${description}...`);
    exec(command, { cwd: __dirname }, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr) {
        console.log(`⚠️  ${stderr}`);
      }
      console.log(`✅ ${description} completado`);
      if (stdout) console.log(stdout);
      resolve(stdout);
    });
  });
}

async function setupAndroid() {
  try {
    // 1. Instalar dependencias
    await runCommand('npm install', 'Instalando dependencias de Capacitor');
    
    // 2. Inicializar Capacitor
    await runCommand('npx cap init "Elecciones Colombia 2026" "com.agapaibro.elecciones2026"', 'Inicializando Capacitor');
    
    // 3. Hacer build del proyecto
    await runCommand('npm run build', 'Construyendo aplicación web');
    
    // 4. Agregar plataforma Android
    await runCommand('npx cap add android', 'Agregando plataforma Android');
    
    // 5. Sincronizar archivos
    await runCommand('npx cap sync android', 'Sincronizando archivos con Android');
    
    console.log('\n🎉 ¡Configuración completada!');
    console.log('\n📋 Próximos pasos:');
    console.log('1. Ejecuta: npm run android:dev (para desarrollo)');
    console.log('2. Ejecuta: npm run android:release (para generar APK)');
    console.log('3. Ejecuta: npm run android:bundle (para generar AAB para Play Store)');
    console.log('\n📱 Los archivos Android están en: ./android/');
    
  } catch (error) {
    console.error('❌ Error durante la configuración:', error.message);
    process.exit(1);
  }
}

setupAndroid();
