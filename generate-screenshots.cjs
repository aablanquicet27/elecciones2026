#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('📱 GENERANDO SCREENSHOTS AUTOMÁTICAMENTE PARA PLAY STORE\n');

// Crear directorio para screenshots
const screenshotsDir = './play-store-assets';
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
  console.log('📁 Creado directorio: play-store-assets/');
}

// Función para ejecutar comandos
function runCommand(command, description) {
  return new Promise((resolve, reject) => {
    console.log(`📦 ${description}...`);
    exec(command, { cwd: __dirname, maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
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

// Instalar Puppeteer si no está instalado
async function setupPuppeteer() {
  try {
    require('puppeteer');
    console.log('✅ Puppeteer ya está instalado');
  } catch (error) {
    console.log('📦 Instalando Puppeteer para screenshots...');
    await runCommand('npm install puppeteer --no-save', 'Instalando Puppeteer');
  }
}

// Generar screenshots usando Puppeteer
async function generateScreenshots() {
  try {
    const puppeteer = require('puppeteer');
    
    console.log('🚀 Iniciando navegador...');
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Configurar viewport para tablet 10" (1920x1080 landscape)
    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 2
    });
    
    // Iniciar servidor de desarrollo
    console.log('🌐 Iniciando servidor local...');
    const serverProcess = exec('npm run dev', { cwd: __dirname });
    
    // Esperar a que el servidor esté listo
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    console.log('📸 Tomando screenshots...');
    
    // Screenshot 1: Página principal
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
    await page.screenshot({
      path: path.join(screenshotsDir, '1-home-landscape.png'),
      fullPage: false
    });
    console.log('✅ Screenshot 1: Página principal (landscape)');
    
    // Screenshot 2: Análisis de candidatos
    await page.evaluate(() => {
      const candidatesSection = document.querySelector('[data-testid="candidates"], .candidate-grid, .candidate-table');
      if (candidatesSection) {
        candidatesSection.scrollIntoView();
      }
    });
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: path.join(screenshotsDir, '2-candidates-landscape.png'),
      fullPage: false
    });
    console.log('✅ Screenshot 2: Análisis de candidatos (landscape)');
    
    // Screenshot 3: Gráficos y estadísticas
    await page.evaluate(() => {
      const chartsSection = document.querySelector('[data-testid="charts"], .chart, .stats');
      if (chartsSection) {
        chartsSection.scrollIntoView();
      }
    });
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: path.join(screenshotsDir, '3-charts-landscape.png'),
      fullPage: false
    });
    console.log('✅ Screenshot 3: Gráficos y estadísticas (landscape)');
    
    // Cambiar a portrait mode (1080x1920)
    await page.setViewport({
      width: 1080,
      height: 1920,
      deviceScaleFactor: 2
    });
    
    // Screenshot 4: Vista móvil principal
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
    await page.screenshot({
      path: path.join(screenshotsDir, '4-home-portrait.png'),
      fullPage: false
    });
    console.log('✅ Screenshot 4: Vista principal (portrait)');
    
    // Screenshot 5: Noticias
    await page.evaluate(() => {
      const newsSection = document.querySelector('[data-testid="news"], .news, .noticias');
      if (newsSection) {
        newsSection.scrollIntoView();
      }
    });
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: path.join(screenshotsDir, '5-news-portrait.png'),
      fullPage: false
    });
    console.log('✅ Screenshot 5: Noticias (portrait)');
    
    // Screenshot 6: Mapas regionales
    await page.evaluate(() => {
      const mapSection = document.querySelector('[data-testid="map"], .map, .regional');
      if (mapSection) {
        mapSection.scrollIntoView();
      }
    });
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: path.join(screenshotsDir, '6-maps-portrait.png'),
      fullPage: false
    });
    console.log('✅ Screenshot 6: Mapas regionales (portrait)');
    
    await browser.close();
    
    // Terminar servidor
    serverProcess.kill();
    
    console.log('\n🎉 ¡Screenshots generados exitosamente!');
    
  } catch (error) {
    console.error('❌ Error generando screenshots:', error.message);
    // Generar screenshots de fallback
    await generateFallbackScreenshots();
  }
}

// Generar screenshots de fallback usando plantillas HTML
async function generateFallbackScreenshots() {
  console.log('🔄 Generando screenshots de fallback...');
  
  const screenshots = [
    {
      name: '1-home-tablet.html',
      title: 'Elecciones Colombia 2026',
      subtitle: 'Dashboard Principal',
      content: `
        <div class="feature-grid">
          <div class="feature-card">
            <h3>📊 Análisis en Tiempo Real</h3>
            <p>Intención de voto actualizada</p>
          </div>
          <div class="feature-card">
            <h3>🗳️ Candidatos Presidenciales</h3>
            <p>Perfiles completos y propuestas</p>
          </div>
          <div class="feature-card">
            <h3>📈 Predicciones IA</h3>
            <p>Modelos predictivos avanzados</p>
          </div>
          <div class="feature-card">
            <h3>🗺️ Mapas Regionales</h3>
            <p>Análisis por departamentos</p>
          </div>
        </div>
      `
    },
    {
      name: '2-candidates-tablet.html',
      title: 'Candidatos Presidenciales',
      subtitle: 'Análisis Comparativo',
      content: `
        <div class="candidates-grid">
          <div class="candidate-card">
            <div class="candidate-photo"></div>
            <h4>Candidato 1</h4>
            <div class="progress-bar"><div class="progress" style="width: 35%"></div></div>
            <span>35% intención</span>
          </div>
          <div class="candidate-card">
            <div class="candidate-photo"></div>
            <h4>Candidato 2</h4>
            <div class="progress-bar"><div class="progress" style="width: 28%"></div></div>
            <span>28% intención</span>
          </div>
          <div class="candidate-card">
            <div class="candidate-photo"></div>
            <h4>Candidato 3</h4>
            <div class="progress-bar"><div class="progress" style="width: 22%"></div></div>
            <span>22% intención</span>
          </div>
        </div>
      `
    },
    {
      name: '3-charts-tablet.html',
      title: 'Análisis Electoral',
      subtitle: 'Gráficos y Tendencias',
      content: `
        <div class="charts-container">
          <div class="chart-section">
            <h4>Evolución Histórica</h4>
            <div class="line-chart"></div>
          </div>
          <div class="chart-section">
            <h4>Intención por Regiones</h4>
            <div class="bar-chart">
              <div class="bar" style="height: 70%"></div>
              <div class="bar" style="height: 45%"></div>
              <div class="bar" style="height: 60%"></div>
              <div class="bar" style="height: 35%"></div>
              <div class="bar" style="height: 50%"></div>
            </div>
          </div>
        </div>
      `
    }
  ];
  
  // Generar HTML base para screenshots
  const baseTemplate = (title, subtitle, content, isPortrait = false) => `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', system-ui, sans-serif;
            background: linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #F59E0B 100%);
            color: white;
            height: ${isPortrait ? '1920px' : '1080px'};
            width: ${isPortrait ? '1080px' : '1920px'};
            padding: 60px;
            display: flex;
            flex-direction: column;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
        }
        .header h1 {
            font-size: ${isPortrait ? '48px' : '64px'};
            margin-bottom: 15px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        .header h2 {
            font-size: ${isPortrait ? '24px' : '32px'};
            opacity: 0.9;
            font-weight: normal;
        }
        .content {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .feature-grid {
            display: grid;
            grid-template-columns: ${isPortrait ? '1fr' : 'repeat(2, 1fr)'};
            gap: 30px;
        }
        .feature-card {
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            padding: 40px;
            border-radius: 20px;
            border: 1px solid rgba(255,255,255,0.2);
        }
        .feature-card h3 {
            font-size: 28px;
            margin-bottom: 15px;
        }
        .feature-card p {
            font-size: 18px;
            opacity: 0.9;
        }
        .candidates-grid {
            display: grid;
            grid-template-columns: ${isPortrait ? '1fr' : 'repeat(3, 1fr)'};
            gap: 30px;
        }
        .candidate-card {
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            padding: 30px;
            border-radius: 20px;
            text-align: center;
            border: 1px solid rgba(255,255,255,0.2);
        }
        .candidate-photo {
            width: 80px;
            height: 80px;
            background: rgba(255,255,255,0.3);
            border-radius: 50%;
            margin: 0 auto 20px;
        }
        .progress-bar {
            width: 100%;
            height: 8px;
            background: rgba(255,255,255,0.2);
            border-radius: 4px;
            margin: 15px 0;
            overflow: hidden;
        }
        .progress {
            height: 100%;
            background: #F59E0B;
            border-radius: 4px;
        }
        .charts-container {
            display: grid;
            grid-template-columns: ${isPortrait ? '1fr' : '1fr 1fr'};
            gap: 40px;
        }
        .chart-section {
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            padding: 40px;
            border-radius: 20px;
            border: 1px solid rgba(255,255,255,0.2);
        }
        .line-chart {
            width: 100%;
            height: 200px;
            background: rgba(255,255,255,0.1);
            border-radius: 10px;
            margin-top: 20px;
            position: relative;
        }
        .line-chart::after {
            content: '📈';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 48px;
        }
        .bar-chart {
            display: flex;
            align-items: end;
            height: 200px;
            gap: 15px;
            margin-top: 20px;
        }
        .bar {
            flex: 1;
            background: #F59E0B;
            border-radius: 5px 5px 0 0;
            min-height: 20px;
        }
        .year-badge {
            position: absolute;
            top: 30px;
            right: 30px;
            background: rgba(255,255,255,0.2);
            backdrop-filter: blur(10px);
            padding: 15px 25px;
            border-radius: 25px;
            font-size: 24px;
            font-weight: bold;
            border: 1px solid rgba(255,255,255,0.3);
        }
    </style>
</head>
<body>
    <div class="year-badge">2026</div>
    <div class="header">
        <h1>${title}</h1>
        <h2>${subtitle}</h2>
    </div>
    <div class="content">
        ${content}
    </div>
</body>
</html>`;

  // Generar archivos HTML
  screenshots.forEach((screenshot, index) => {
    const htmlContent = baseTemplate(screenshot.title, screenshot.subtitle, screenshot.content, index % 2 === 1);
    fs.writeFileSync(path.join(screenshotsDir, screenshot.name), htmlContent);
  });
  
  console.log('✅ Screenshots HTML generados en play-store-assets/');
  console.log('\n📋 Para convertir a imágenes:');
  console.log('1. Abre cada archivo HTML en Chrome');
  console.log('2. Presiona F12 → Toggle device toolbar');
  console.log('3. Establece dimensiones: 1920x1080 (landscape) o 1080x1920 (portrait)');
  console.log('4. Toma captura de pantalla completa');
  console.log('5. Guarda como PNG');
}

// Ejecutar generación
async function main() {
  try {
    console.log('🎯 Iniciando generación automática de screenshots...\n');
    
    // Intentar con Puppeteer primero
    await setupPuppeteer();
    await generateScreenshots();
    
  } catch (error) {
    console.log('⚠️  Puppeteer no disponible, generando plantillas HTML...');
    await generateFallbackScreenshots();
  }
  
  console.log('\n🎉 ¡Proceso completado!');
  console.log('\n📂 Archivos generados en: play-store-assets/');
  console.log('\n📱 Especificaciones para Play Store:');
  console.log('✅ Formato: PNG o JPEG');
  console.log('✅ Tamaño: < 8MB cada uno');
  console.log('✅ Dimensiones tablets 10": 1920x1080 o 1080x1920');
  console.log('✅ Relación de aspecto: 16:9 o 9:16');
  console.log('\n🚀 ¡Listo para subir a Play Store!');
}

main().catch(console.error);
