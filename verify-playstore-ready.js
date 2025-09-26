#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 VERIFICANDO PREPARACIÓN PARA PLAY STORE\n');

// Estado de verificación
let allGood = true;
const warnings = [];
const errors = [];

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${description}: ${filePath}`);
    return true;
  } else {
    console.log(`❌ ${description}: ${filePath} (NO ENCONTRADO)`);
    errors.push(`${description}: ${filePath}`);
    allGood = false;
    return false;
  }
}

function checkOptional(filePath, description) {
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${description}: ${filePath}`);
    return true;
  } else {
    console.log(`⚠️  ${description}: ${filePath} (OPCIONAL)`);
    warnings.push(`${description}: ${filePath}`);
    return false;
  }
}

function checkDirectory(dirPath, description) {
  if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
    const files = fs.readdirSync(dirPath);
    console.log(`✅ ${description}: ${dirPath} (${files.length} archivos)`);
    return true;
  } else {
    console.log(`❌ ${description}: ${dirPath} (NO ENCONTRADO)`);
    errors.push(`${description}: ${dirPath}`);
    allGood = false;
    return false;
  }
}

console.log('📋 VERIFICANDO ARCHIVOS ESENCIALES:\n');

// Verificar archivos de configuración
checkFile('./package.json', 'Package.json');
checkFile('./capacitor.config.ts', 'Configuración de Capacitor');
checkFile('./vite.config.ts', 'Configuración de Vite');

console.log('\n📱 VERIFICANDO SCRIPTS DE ANDROID:\n');

// Verificar scripts
checkFile('./android-setup.js', 'Script de configuración Android');
checkFile('./build-release.js', 'Script de build para Play Store');
checkFile('./generate-icons.js', 'Script de generación de iconos');
checkFile('./deploy-to-playstore.js', 'Script maestro de deploy');

console.log('\n📖 VERIFICANDO DOCUMENTACIÓN:\n');

// Verificar documentación
checkFile('./play-store-info.md', 'Información completa para Play Store');
checkFile('./README-PLAY-STORE.md', 'Guía de publicación');

console.log('\n🎨 VERIFICANDO RECURSOS GRÁFICOS:\n');

// Verificar estructura de recursos
checkDirectory('./android-resources', 'Directorio de recursos Android');
checkOptional('./android-resources/icon-base.svg', 'Icono base SVG');
checkOptional('./android-resources/splash-base.svg', 'Splash screen base SVG');

console.log('\n🏗️  VERIFICANDO PROYECTO ANDROID:\n');

// Verificar proyecto Android
const androidExists = checkDirectory('./android', 'Proyecto Android');
if (androidExists) {
  checkFile('./android/app/build.gradle', 'Build.gradle de Android');
  checkOptional('./android/gradle.properties', 'Propiedades de Gradle');
}

console.log('\n📦 VERIFICANDO BUILDS:\n');

// Verificar builds generados
const aabPath = './android/app/build/outputs/bundle/release/app-release.aab';
const apkPath = './android/app/build/outputs/apk/release/app-release.apk';

if (checkOptional(aabPath, 'AAB para Play Store (PRINCIPAL)')) {
  const stats = fs.statSync(aabPath);
  const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`   📊 Tamaño: ${sizeInMB} MB`);
}

if (checkOptional(apkPath, 'APK de release')) {
  const stats = fs.statSync(apkPath);
  const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`   📊 Tamaño: ${sizeInMB} MB`);
}

console.log('\n🔐 VERIFICANDO CONFIGURACIÓN DE FIRMA:\n');

checkOptional('./android/app/elecciones2026.keystore', 'Keystore de desarrollo');
checkOptional('./keystore-config.txt', 'Configuración de keystore');

console.log('\n📊 VERIFICANDO DEPENDENCIAS:\n');

// Verificar package.json para dependencias de Capacitor
try {
  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  
  const capacitorDeps = [
    '@capacitor/core',
    '@capacitor/android',
    '@capacitor/app',
    '@capacitor/cli'
  ];
  
  let capacitorInstalled = 0;
  capacitorDeps.forEach(dep => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      console.log(`✅ Dependencia: ${dep} v${packageJson.dependencies[dep]}`);
      capacitorInstalled++;
    } else if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
      console.log(`✅ Dev Dependencia: ${dep} v${packageJson.devDependencies[dep]}`);
      capacitorInstalled++;
    } else {
      console.log(`❌ Falta dependencia: ${dep}`);
      errors.push(`Dependencia faltante: ${dep}`);
      allGood = false;
    }
  });
  
  console.log(`📈 Dependencias de Capacitor: ${capacitorInstalled}/${capacitorDeps.length}`);
  
} catch (error) {
  console.log('❌ Error leyendo package.json');
  errors.push('Error leyendo package.json');
  allGood = false;
}

console.log('\n' + '='.repeat(60));
console.log('📋 RESUMEN DE VERIFICACIÓN');
console.log('='.repeat(60));

if (allGood && errors.length === 0) {
  console.log('\n🎉 ¡PERFECTO! Tu app está lista para Play Store');
  console.log('\n🚀 Próximos pasos:');
  console.log('1. Ejecuta: node deploy-to-playstore.js');
  console.log('2. Genera iconos personalizados si no los tienes');
  console.log('3. Sube el archivo AAB a Play Store Console');
  console.log('4. Completa la información usando play-store-info.md');
} else {
  console.log('\n⚠️  HAY ALGUNOS PROBLEMAS QUE RESOLVER');
}

if (errors.length > 0) {
  console.log('\n❌ ERRORES CRÍTICOS (deben resolverse):');
  errors.forEach((error, index) => {
    console.log(`   ${index + 1}. ${error}`);
  });
  
  console.log('\n🔧 SOLUCIONES:');
  console.log('• Ejecuta: node android-setup.js (para configurar Android)');
  console.log('• Ejecuta: npm install (para instalar dependencias)');
  console.log('• Ejecuta: node generate-icons.js (para recursos gráficos)');
}

if (warnings.length > 0) {
  console.log('\n⚠️  ADVERTENCIAS (recomendado resolver):');
  warnings.forEach((warning, index) => {
    console.log(`   ${index + 1}. ${warning}`);
  });
  
  console.log('\n💡 RECOMENDACIONES:');
  console.log('• Ejecuta: node build-release.js (para generar AAB)');
  console.log('• Personaliza los iconos en android-resources/');
  console.log('• Configura keystore para firma de producción');
}

console.log('\n📖 AYUDA:');
console.log('• Guía completa: README-PLAY-STORE.md');
console.log('• Información de Play Store: play-store-info.md');
console.log('• Script automático: node deploy-to-playstore.js');

const status = allGood && errors.length === 0 ? 'READY' : 'NEEDS_WORK';
console.log(`\n🏷️  ESTADO: ${status}`);

if (status === 'READY') {
  console.log('\n🎊 ¡TU APP ESTÁ LISTA PARA PLAY STORE! 🎊');
} else {
  console.log('\n🔨 Resuelve los errores y ejecuta este script nuevamente');
}

process.exit(errors.length > 0 ? 1 : 0);
