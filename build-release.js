#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Generando builds para Play Store...\n');

// Función para ejecutar comandos
function runCommand(command, description, cwd = __dirname) {
  return new Promise((resolve, reject) => {
    console.log(`📦 ${description}...`);
    exec(command, { cwd }, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr && !stderr.includes('Warning')) {
        console.log(`⚠️  ${stderr}`);
      }
      console.log(`✅ ${description} completado`);
      resolve(stdout);
    });
  });
}

// Verificar que existe el proyecto Android
function checkAndroidProject() {
  if (!fs.existsSync('./android')) {
    console.log('❌ Proyecto Android no encontrado.');
    console.log('Ejecuta primero: node android-setup.js');
    process.exit(1);
  }
}

// Crear archivo de configuración de keystore
function createKeystoreConfig() {
  const keystoreConfig = `# Configuración de Keystore para firma de APK/AAB
# IMPORTANTE: No subas este archivo a Git por seguridad

# Genera tu keystore con este comando:
# keytool -genkey -v -keystore elecciones2026.keystore -alias elecciones2026 -keyalg RSA -keysize 2048 -validity 10000

# Configuración para gradle (android/gradle.properties)
MYAPP_UPLOAD_STORE_FILE=elecciones2026.keystore
MYAPP_UPLOAD_KEY_ALIAS=elecciones2026
MYAPP_UPLOAD_STORE_PASSWORD=tu_password_keystore
MYAPP_UPLOAD_KEY_PASSWORD=tu_password_key

# Para generar keystore automáticamente (desarrollo):
# keytool -genkey -v -keystore android/app/elecciones2026.keystore -alias elecciones2026 -keyalg RSA -keysize 2048 -validity 10000 -storepass elecciones2026 -keypass elecciones2026 -dname "CN=Elecciones2026, OU=AgapaiApp, O=AgapaiApp, L=Colombia, S=Colombia, C=CO"
`;

  if (!fs.existsSync('./keystore-config.txt')) {
    fs.writeFileSync('./keystore-config.txt', keystoreConfig);
    console.log('📋 Creada configuración de keystore');
  }
}

// Configurar gradle para firma automática
function setupGradleSigning() {
  const gradlePropertiesPath = './android/gradle.properties';
  const buildGradlePath = './android/app/build.gradle';
  
  // Agregar configuración a gradle.properties
  let gradleProperties = '';
  if (fs.existsSync(gradlePropertiesPath)) {
    gradleProperties = fs.readFileSync(gradlePropertiesPath, 'utf8');
  }
  
  if (!gradleProperties.includes('MYAPP_UPLOAD_STORE_FILE')) {
    const keystoreConfig = `
# Configuración de Keystore
MYAPP_UPLOAD_STORE_FILE=elecciones2026.keystore
MYAPP_UPLOAD_KEY_ALIAS=elecciones2026
MYAPP_UPLOAD_STORE_PASSWORD=elecciones2026
MYAPP_UPLOAD_KEY_PASSWORD=elecciones2026
`;
    fs.appendFileSync(gradlePropertiesPath, keystoreConfig);
    console.log('📝 Configuración de keystore agregada a gradle.properties');
  }
  
  // Verificar configuración en build.gradle
  if (fs.existsSync(buildGradlePath)) {
    let buildGradle = fs.readFileSync(buildGradlePath, 'utf8');
    
    if (!buildGradle.includes('signingConfigs')) {
      console.log('⚠️  Se necesita configurar manualmente la firma en build.gradle');
      console.log('📋 Revisa el archivo android/app/build.gradle');
    }
  }
}

// Generar keystore automáticamente para desarrollo
async function generateDevKeystore() {
  const keystorePath = './android/app/elecciones2026.keystore';
  
  if (!fs.existsSync(keystorePath)) {
    console.log('🔐 Generando keystore para desarrollo...');
    
    const keystoreCommand = 'keytool -genkey -v -keystore android/app/elecciones2026.keystore -alias elecciones2026 -keyalg RSA -keysize 2048 -validity 10000 -storepass elecciones2026 -keypass elecciones2026 -dname "CN=Elecciones2026, OU=AgapaiApp, O=AgapaiApp, L=Colombia, S=Colombia, C=CO"';
    
    try {
      await runCommand(keystoreCommand, 'Generando keystore');
    } catch (error) {
      console.log('⚠️  No se pudo generar keystore automáticamente');
      console.log('Genera manualmente con: keytool -genkey -v -keystore android/app/elecciones2026.keystore -alias elecciones2026 -keyalg RSA -keysize 2048 -validity 10000');
    }
  }
}

// Build principal
async function buildForPlayStore() {
  try {
    checkAndroidProject();
    createKeystoreConfig();
    setupGradleSigning();
    await generateDevKeystore();
    
    console.log('\n🏗️  Iniciando build para Play Store...\n');
    
    // 1. Build web
    await runCommand('npm run build', 'Construyendo aplicación web');
    
    // 2. Sync con Android
    await runCommand('npx cap sync android', 'Sincronizando con Android');
    
    // 3. Generar APK Debug (para pruebas)
    console.log('\n📱 Generando APK de debug...');
    await runCommand('./gradlew assembleDebug', 'Generando APK debug', './android');
    
    // 4. Generar APK Release
    console.log('\n📱 Generando APK release...');
    try {
      await runCommand('./gradlew assembleRelease', 'Generando APK release', './android');
    } catch (error) {
      console.log('⚠️  Error en APK release, intentando sin firma...');
      await runCommand('./gradlew assembleRelease -PdisableSigningConfigs', 'Generando APK release sin firma', './android');
    }
    
    // 5. Generar AAB para Play Store
    console.log('\n📦 Generando AAB para Play Store...');
    try {
      await runCommand('./gradlew bundleRelease', 'Generando AAB release', './android');
    } catch (error) {
      console.log('⚠️  Error en AAB release, revisa configuración de firma');
    }
    
    // Mostrar resultados
    console.log('\n🎉 ¡Build completado!');
    console.log('\n📂 Archivos generados:');
    
    const apkDebugPath = './android/app/build/outputs/apk/debug/app-debug.apk';
    const apkReleasePath = './android/app/build/outputs/apk/release/app-release.apk';
    const aabReleasePath = './android/app/build/outputs/bundle/release/app-release.aab';
    
    if (fs.existsSync(apkDebugPath)) {
      console.log(\`✅ APK Debug: \${apkDebugPath}\`);
    }
    if (fs.existsSync(apkReleasePath)) {
      console.log(\`✅ APK Release: \${apkReleasePath}\`);
    }
    if (fs.existsSync(aabReleasePath)) {
      console.log(\`✅ AAB Release: \${aabReleasePath}\`);
      console.log('📤 ¡Sube este AAB a Play Store Console!');
    }
    
    console.log('\n📋 Para Play Store:');
    console.log('1. Sube el archivo .aab al Play Store Console');
    console.log('2. Completa la información de la aplicación');
    console.log('3. Configura las pruebas internas');
    console.log('4. Publica la versión de prueba');
    
  } catch (error) {
    console.error('❌ Error durante el build:', error.message);
    console.log('\n🔧 Posibles soluciones:');
    console.log('1. Verifica que Java JDK esté instalado');
    console.log('2. Verifica que Android SDK esté configurado');
    console.log('3. Ejecuta: npx cap doctor para diagnosticar problemas');
    process.exit(1);
  }
}

// Ejecutar build
buildForPlayStore();
