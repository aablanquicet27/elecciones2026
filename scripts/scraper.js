import FireCrawlApp from '@mendable/firecrawl-js';
import { z } from 'zod';
import fs from 'fs';
import path from 'path';

const app = new FireCrawlApp({apiKey: "fc-2675fea820ed42bcaa712e321964f2db"});

const schema = z.object({
  voting_intention: z.array(z.object({
    date: z.string(),
    pollster: z.string(),
    sample_size: z.number(),
    error_margin: z.string(),
    candidates: z.array(z.object({
      name: z.string(),
      percentage: z.string()
    }))
  }))
});

async function scrapePollData() {
  try {
    console.log('🔍 Iniciando scraping de datos electorales...');
    
    const extractResult = await app.extract([
      "https://es.wikipedia.org/wiki/Anexo:Sondeos_de_intenci%C3%B3n_de_voto_para_las_elecciones_presidenciales_de_Colombia_de_2026"
    ], {
      prompt: "Extract the voting intention table with the specified structure. Ignore candidates with less than 1% support. Only include main names and numbers.",
      schema,
    });

    // Procesar y limpiar los datos
    if (extractResult && extractResult.length > 0) {
      const pollData = extractResult[0];
      
      // Agregar timestamp
      pollData.last_updated = new Date().toISOString();
      pollData.source = "Wikipedia - Sondeos de intención de voto Colombia 2026";
      
      // Guardar los datos en formato JSON para Python
      const outputPath = path.join(process.cwd(), 'scripts', 'real_time_data.json');
      fs.writeFileSync(outputPath, JSON.stringify(pollData, null, 2));
      
      console.log('✅ Datos guardados exitosamente en:', outputPath);
      console.log(`📊 Se encontraron ${pollData.voting_intention.length} encuestas`);
      
      // Mostrar resumen de la encuesta más reciente
      const latestPoll = pollData.voting_intention[0];
      console.log(`\n📈 Encuesta más reciente:`);
      console.log(`   Fecha: ${latestPoll.date}`);
      console.log(`   Encuestadora: ${latestPoll.pollster}`);
      console.log(`   Muestra: ${latestPoll.sample_size} personas`);
      console.log(`   Margen de error: ${latestPoll.error_margin}`);
      console.log(`   Top 5 candidatos:`);
      
      latestPoll.candidates.slice(0, 5).forEach((candidate, index) => {
        console.log(`   ${index + 1}. ${candidate.name}: ${candidate.percentage}`);
      });
      
      return pollData;
    } else {
      throw new Error('No se pudieron extraer datos de la fuente');
    }
    
  } catch (error) {
    console.error('❌ Error durante el scraping:', error.message);
    
    // En caso de error, usar datos de respaldo si existen
    const backupPath = path.join(process.cwd(), 'scripts', 'real_time_data.json');
    if (fs.existsSync(backupPath)) {
      console.log('⚠️  Usando datos de respaldo...');
      const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
      return backupData;
    }
    
    throw error;
  }
}

// Ejecutar el scraping
if (import.meta.url === `file://${process.argv[1]}`) {
  scrapePollData()
    .then(() => {
      console.log('🎉 Scraping completado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error fatal:', error.message);
      process.exit(1);
    });
}

export { scrapePollData }; 