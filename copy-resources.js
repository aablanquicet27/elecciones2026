#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Función para copiar archivos
function copyFile(source, destination) {
  if (fs.existsSync(source)) {
    const destDir = path.dirname(destination);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(source, destination);
    console.log(`✅ Copiado: ${source} → ${destination}`);
  } else {
    console.log(`❌ No encontrado: ${source}`);
  }
}

// Copiar iconos
function copyIcons() {
  const androidPath = './android/app/src/main/res';
  
  if (!fs.existsSync(androidPath)) {
    console.log('❌ Carpeta Android no encontrada. Ejecuta primero android-setup.js');
    return;
  }
  
  const iconSizes = ['mdpi', 'hdpi', 'xhdpi', 'xxhdpi', 'xxxhdpi'];
  
  iconSizes.forEach(size => {
    copyFile(
      `./android-resources/mipmap-${size}/ic_launcher.png`,
      `${androidPath}/mipmap-${size}/ic_launcher.png`
    );
    copyFile(
      `./android-resources/mipmap-${size}/ic_launcher.png`,
      `${androidPath}/mipmap-${size}/ic_launcher_round.png`
    );
  });
  
  // Copiar splash screens
  iconSizes.forEach(size => {
    copyFile(
      `./android-resources/drawable-${size}/splash.png`,
      `${androidPath}/drawable-${size}/splash.png`
    );
  });
  
  console.log('🎉 Recursos copiados al proyecto Android');
}

copyIcons();