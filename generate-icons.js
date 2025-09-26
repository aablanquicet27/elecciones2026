#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Función para crear directorios si no existen
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Creado directorio: ${dirPath}`);
  }
}

// Crear estructura de directorios para recursos Android
function createAndroidResourceDirs() {
  const androidResPath = './android-resources';
  
  const directories = [
    `${androidResPath}/mipmap-hdpi`,
    `${androidResPath}/mipmap-mdpi`, 
    `${androidResPath}/mipmap-xhdpi`,
    `${androidResPath}/mipmap-xxhdpi`,
    `${androidResPath}/mipmap-xxxhdpi`,
    `${androidResPath}/drawable`,
    `${androidResPath}/drawable-hdpi`,
    `${androidResPath}/drawable-mdpi`,
    `${androidResPath}/drawable-xhdpi`,
    `${androidResPath}/drawable-xxhdpi`,
    `${androidResPath}/drawable-xxxhdpi`,
    `${androidResPath}/values`
  ];
  
  directories.forEach(dir => ensureDirectoryExists(dir));
  
  return androidResPath;
}

// Crear archivo de configuración de iconos
function createIconConfig(resourcePath) {
  const iconSizes = {
    'mipmap-mdpi': { size: '48x48', density: 'mdpi' },
    'mipmap-hdpi': { size: '72x72', density: 'hdpi' },
    'mipmap-xhdpi': { size: '96x96', density: 'xhdpi' },
    'mipmap-xxhdpi': { size: '144x144', density: 'xxhdpi' },
    'mipmap-xxxhdpi': { size: '192x192', density: 'xxxhdpi' }
  };
  
  const splashSizes = {
    'drawable-mdpi': { size: '320x480', density: 'mdpi' },
    'drawable-hdpi': { size: '480x800', density: 'hdpi' },
    'drawable-xhdpi': { size: '720x1280', density: 'xhdpi' },
    'drawable-xxhdpi': { size: '960x1600', density: 'xxhdpi' },
    'drawable-xxxhdpi': { size: '1280x1920', density: 'xxxhdpi' }
  };
  
  const configContent = `# Configuración de Iconos para Android

## Iconos de la aplicación
Los iconos deben ser cuadrados con esquinas redondeadas y seguir las guías de Material Design.

### Tamaños requeridos:
${Object.entries(iconSizes).map(([folder, config]) => 
  `- ${folder}/ic_launcher.png: ${config.size} (${config.density})`
).join('\n')}

### Splash Screens requeridos:
${Object.entries(splashSizes).map(([folder, config]) => 
  `- ${folder}/splash.png: ${config.size} (${config.density})`
).join('\n')}

## Instrucciones:
1. Crea un icono base de 512x512px
2. Usa herramientas como https://romannurik.github.io/AndroidAssetStudio/ para generar todos los tamaños
3. Coloca los archivos en las carpetas correspondientes
4. Ejecuta el script copy-resources.js para copiarlos al proyecto Android

## Colores de la app:
- Color primario: #7C3AED (púrpura)
- Color secundario: #F59E0B (amarillo/dorado)
- Color de fondo: #FFFFFF (blanco)
`;

  fs.writeFileSync(`${resourcePath}/README.md`, configContent);
  console.log('📄 Creado archivo de configuración de iconos');
}

// Crear archivo SVG base para el icono
function createBaseIcon(resourcePath) {
  const iconSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <!-- Fondo con gradiente -->
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#7C3AED;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#A855F7;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#F59E0B;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#FBBF24;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Fondo redondeado -->
  <rect width="512" height="512" rx="96" ry="96" fill="url(#bg)"/>
  
  <!-- Icono de voto/urna -->
  <g transform="translate(128, 128)">
    <!-- Urna -->
    <rect x="48" y="160" width="160" height="120" rx="8" ry="8" fill="white" opacity="0.9"/>
    <rect x="32" y="140" width="192" height="40" rx="20" ry="20" fill="url(#accent)"/>
    
    <!-- Papel de voto -->
    <rect x="80" y="80" width="96" height="80" rx="4" ry="4" fill="white" transform="rotate(-15 128 120)"/>
    
    <!-- Líneas del voto -->
    <rect x="90" y="100" width="60" height="4" rx="2" ry="2" fill="#7C3AED" transform="rotate(-15 128 120)"/>
    <rect x="90" y="110" width="40" height="4" rx="2" ry="2" fill="#7C3AED" transform="rotate(-15 128 120)"/>
    <rect x="90" y="120" width="50" height="4" rx="2" ry="2" fill="#7C3AED" transform="rotate(-15 128 120)"/>
    
    <!-- Check mark -->
    <path d="M 100 140 L 110 150 L 130 120" stroke="url(#accent)" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round" transform="rotate(-15 128 120)"/>
  </g>
  
  <!-- Texto "2026" -->
  <text x="256" y="420" font-family="Arial, sans-serif" font-size="48" font-weight="bold" text-anchor="middle" fill="white">2026</text>
</svg>`;

  fs.writeFileSync(`${resourcePath}/icon-base.svg`, iconSvg);
  console.log('🎨 Creado icono base SVG');
}

// Crear splash screen base
function createBaseSplash(resourcePath) {
  const splashSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1080" height="1920" viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg">
  <!-- Fondo -->
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#7C3AED;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#A855F7;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#7C3AED;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <rect width="1080" height="1920" fill="url(#bgGradient)"/>
  
  <!-- Logo central -->
  <g transform="translate(340, 760)">
    <!-- Círculo de fondo -->
    <circle cx="200" cy="200" r="180" fill="white" opacity="0.1"/>
    <circle cx="200" cy="200" r="150" fill="white" opacity="0.9"/>
    
    <!-- Icono de voto -->
    <g transform="translate(50, 50)">
      <!-- Urna -->
      <rect x="80" y="200" width="240" height="180" rx="12" ry="12" fill="#7C3AED"/>
      <rect x="60" y="170" width="280" height="60" rx="30" ry="30" fill="#F59E0B"/>
      
      <!-- Papel de voto -->
      <rect x="140" y="100" width="140" height="120" rx="6" ry="6" fill="white" transform="rotate(-10 200 160)"/>
      
      <!-- Check mark -->
      <path d="M 170 160 L 190 180 L 230 130" stroke="#F59E0B" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round" transform="rotate(-10 200 160)"/>
    </g>
  </g>
  
  <!-- Título -->
  <text x="540" y="1400" font-family="Arial, sans-serif" font-size="72" font-weight="bold" text-anchor="middle" fill="white">Elecciones</text>
  <text x="540" y="1480" font-family="Arial, sans-serif" font-size="72" font-weight="bold" text-anchor="middle" fill="#FBBF24">Colombia 2026</text>
  
  <!-- Subtítulo -->
  <text x="540" y="1580" font-family="Arial, sans-serif" font-size="36" text-anchor="middle" fill="white" opacity="0.8">Análisis y Predicciones</text>
</svg>`;

  fs.writeFileSync(`${resourcePath}/splash-base.svg`, splashSvg);
  console.log('🖼️ Creado splash screen base SVG');
}

// Crear script para copiar recursos al proyecto Android
function createCopyScript(resourcePath) {
  const copyScript = `#!/usr/bin/env node

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
    console.log(\`✅ Copiado: \${source} → \${destination}\`);
  } else {
    console.log(\`❌ No encontrado: \${source}\`);
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
      \`./android-resources/mipmap-\${size}/ic_launcher.png\`,
      \`\${androidPath}/mipmap-\${size}/ic_launcher.png\`
    );
    copyFile(
      \`./android-resources/mipmap-\${size}/ic_launcher.png\`,
      \`\${androidPath}/mipmap-\${size}/ic_launcher_round.png\`
    );
  });
  
  // Copiar splash screens
  iconSizes.forEach(size => {
    copyFile(
      \`./android-resources/drawable-\${size}/splash.png\`,
      \`\${androidPath}/drawable-\${size}/splash.png\`
    );
  });
  
  console.log('🎉 Recursos copiados al proyecto Android');
}

copyIcons();`;

  fs.writeFileSync(`${resourcePath}/../copy-resources.js`, copyScript);
  fs.chmodSync(`${resourcePath}/../copy-resources.js`, '755');
  console.log('📋 Creado script para copiar recursos');
}

console.log('🎨 Generando estructura de iconos y recursos...\n');

const resourcePath = createAndroidResourceDirs();
createIconConfig(resourcePath);
createBaseIcon(resourcePath);
createBaseSplash(resourcePath);
createCopyScript(resourcePath);

console.log('\n🎉 ¡Estructura de recursos creada!');
console.log('\n📋 Próximos pasos:');
console.log('1. Edita android-resources/icon-base.svg con tu logo');
console.log('2. Usa herramientas online para generar iconos PNG de todos los tamaños');
console.log('3. Coloca los archivos en las carpetas correspondientes');
console.log('4. Ejecuta: node copy-resources.js para copiar al proyecto Android');
console.log('\n🔗 Herramientas recomendadas:');
console.log('- https://romannurik.github.io/AndroidAssetStudio/');
console.log('- https://appicon.co/');
console.log('- https://makeappicon.com/');
