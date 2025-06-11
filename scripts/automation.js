import { scrapePollData } from './scraper.js';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

async function runPythonAnalysis() {
  return new Promise((resolve, reject) => {
    console.log('🐍 Ejecutando análisis de Python...');
    
    const pythonProcess = spawn('python', ['scripts/real_time_analysis.py'], {
      stdio: 'pipe',
      cwd: process.cwd()
    });
    
    let output = '';
    let error = '';
    
    pythonProcess.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      console.log(text.trim());
    });
    
    pythonProcess.stderr.on('data', (data) => {
      error += data.toString();
    });
    
    pythonProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Análisis de Python completado exitosamente');
        resolve({ success: true, output });
      } else {
        console.error('❌ Error en análisis de Python:', error);
        reject(new Error(`Python process exited with code ${code}: ${error}`));
      }
    });
  });
}

async function getVisualizationPaths() {
  const visualizationsDir = path.join(process.cwd(), 'visualizations');
  const expectedFiles = [
    'intencion_voto_real_2026.png',
    'tendencias_politicas_real_2026.png',
    'evolucion_historica_real_2026.png',
    'comparacion_encuestadoras_real_2026.png'
  ];
  
  const availableFiles = [];
  
  for (const file of expectedFiles) {
    const filePath = path.join(visualizationsDir, file);
    if (fs.existsSync(filePath)) {
      availableFiles.push({
        name: file,
        path: filePath,
        relativePath: `visualizations/${file}`,
        lastModified: fs.statSync(filePath).mtime
      });
    }
  }
  
  return availableFiles;
}

async function getLatestData() {
  const dataFile = path.join(process.cwd(), 'scripts', 'real_time_data.json');
  
  if (fs.existsSync(dataFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
      return data;
    } catch (error) {
      console.error('Error leyendo datos:', error);
      return null;
    }
  }
  
  return null;
}

async function fullUpdate() {
  try {
    console.log('🚀 Iniciando actualización completa...');
    
    // 1. Scraper de datos
    console.log('📡 Paso 1: Scraping de datos...');
    const pollData = await scrapePollData();
    
    // 2. Análisis con Python
    console.log('📊 Paso 2: Análisis y visualizaciones...');
    await runPythonAnalysis();
    
    // 3. Obtener rutas de visualizaciones
    console.log('🖼️  Paso 3: Verificando visualizaciones...');
    const visualizations = await getVisualizationPaths();
    
    // 4. Preparar respuesta
    const result = {
      success: true,
      timestamp: new Date().toISOString(),
      data: pollData,
      visualizations: visualizations,
      summary: {
        totalPolls: pollData.voting_intention.length,
        latestPoll: pollData.voting_intention[0],
        visualizationsGenerated: visualizations.length
      }
    };
    
    console.log('✅ Actualización completa exitosa!');
    console.log(`📊 ${result.summary.totalPolls} encuestas procesadas`);
    console.log(`🖼️  ${result.summary.visualizationsGenerated} visualizaciones generadas`);
    
    return result;
    
  } catch (error) {
    console.error('💥 Error durante actualización completa:', error);
    throw error;
  }
}

async function quickUpdate() {
  try {
    console.log('⚡ Iniciando actualización rápida...');
    
    // Solo scraping, sin regenerar visualizaciones
    const pollData = await scrapePollData();
    const visualizations = await getVisualizationPaths();
    
    const result = {
      success: true,
      timestamp: new Date().toISOString(),
      data: pollData,
      visualizations: visualizations,
      summary: {
        totalPolls: pollData.voting_intention.length,
        latestPoll: pollData.voting_intention[0],
        visualizationsGenerated: visualizations.length
      }
    };
    
    console.log('⚡ Actualización rápida completada!');
    return result;
    
  } catch (error) {
    console.error('💥 Error durante actualización rápida:', error);
    throw error;
  }
}

// Función para uso desde la web app
async function updateElectionData(mode = 'full') {
  try {
    let result;
    
    if (mode === 'quick') {
      result = await quickUpdate();
    } else {
      result = await fullUpdate();
    }
    
    // Guardar log de la actualización
    const logFile = path.join(process.cwd(), 'logs', 'update_log.json');
    const logEntry = {
      timestamp: result.timestamp,
      mode: mode,
      success: result.success,
      totalPolls: result.summary.totalPolls,
      latestPollDate: result.summary.latestPoll.date,
      visualizationsCount: result.summary.visualizationsGenerated
    };
    
    // Crear directorio de logs si no existe
    const logDir = path.dirname(logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    
    // Leer logs existentes
    let logs = [];
    if (fs.existsSync(logFile)) {
      try {
        logs = JSON.parse(fs.readFileSync(logFile, 'utf8'));
      } catch (e) {
        logs = [];
      }
    }
    
    // Agregar nueva entrada y mantener solo las últimas 100
    logs.unshift(logEntry);
    logs = logs.slice(0, 100);
    
    // Guardar logs actualizados
    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
    
    return result;
    
  } catch (error) {
    console.error('💥 Error en updateElectionData:', error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  const mode = process.argv[2] || 'full';
  
  updateElectionData(mode)
    .then((result) => {
      console.log('\n🎉 Proceso completado:', result.success ? 'ÉXITO' : 'ERROR');
      if (result.success) {
        console.log('📊 Datos actualizados exitosamente');
      } else {
        console.log('❌ Error:', result.error);
      }
      process.exit(result.success ? 0 : 1);
    })
    .catch((error) => {
      console.error('💥 Error fatal:', error);
      process.exit(1);
    });
}

export { updateElectionData, getLatestData, getVisualizationPaths }; 