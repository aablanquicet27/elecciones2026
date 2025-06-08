const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const apiKey = "fc-2675fea820ed42bcaa712e321964f2db";
const url = "https://es.wikipedia.org/wiki/Anexo:Sondeos_de_intenci%C3%B3n_de_voto_para_las_elecciones_presidenciales_de_Colombia_de_2026";

const candidateNameMapping = {
    'Davila': 'Vicky Dávila', 'Dávila': 'Vicky Dávila', 'Galán': 'Juan Manuel Galán', 'Fajardo': 'Sergio Fajardo',
    'López': 'Claudia López', 'Cabal': 'María Fernanda Cabal', 'Botero': 'Santiago Botero Jaramillo',
    'Luna': 'David Luna', 'Pizarro': 'María José Pizarro', 'Gaviria': 'Alejandro Gaviria',
    'Quintero': 'Daniel Quintero', 'Vargas': 'Germán Vargas Lleras', 'Bolívar': 'Gustavo Bolívar',
    'Oviedo': 'Juan Daniel Oviedo', 'Uribe': 'Miguel Uribe Turbay', 'Peñalosa': 'Enrique Peñalosa',
    'Caicedo': 'Carlos Eduardo Caicedo', 'Muhamad': 'Susana Muhamad', 'Murillo': 'Luis Gilberto Murillo',
    'Valencia': 'Paloma Valencia', 'Corcho': 'Carolina Corcho', 'Romero': 'Camilo Romero', 'Cepeda': 'Iván Cepeda'
  };
  
  const politicalTendencyMapping = {
    'Vicky Dávila': 'Derecha', 'Juan Manuel Galán': 'Centro', 'Sergio Fajardo': 'Centro',
    'Claudia López': 'Centro', 'María Fernanda Cabal': 'Derecha', 'Santiago Botero Jaramillo': 'Centro',
    'David Luna': 'Derecha', 'María José Pizarro': 'Izquierda', 'Alejandro Gaviria': 'Centro',
    'Daniel Quintero': 'Izquierda', 'Germán Vargas Lleras': 'Derecha', 'Gustavo Bolívar': 'Izquierda',
    'Juan Daniel Oviedo': 'Centro', 'Miguel Uribe Turbay': 'Derecha', 'Enrique Peñalosa': 'Centro',
    'Carlos Eduardo Caicedo': 'Izquierda', 'Susana Muhamad': 'Izquierda', 'Luis Gilberto Murillo': 'Centro',
    'Paloma Valencia': 'Derecha', 'Carolina Corcho': 'Izquierda', 'Camilo Romero': 'Centro', 'Iván Cepeda': 'Izquierda'
  };
  
  const candidateAdditionalData = {
      'Vicky Dávila': { Favorabilidad: 38, Desfavorabilidad: 44, Partido_Movimiento: 'Candidata por firmas', Región_Origen: 'Valle del Cauca', Cargo_Actual: 'Ex-Directora Semana', Edad: 58, Generación: 'Mayor (51-60)', Tipo_Candidatura: 'Por firmas' },
      'Juan Manuel Galán': { Favorabilidad: 40, Desfavorabilidad: 28, Partido_Movimiento: 'Nuevo Liberalismo', Región_Origen: 'Bogotá', Cargo_Actual: 'Ex-Senador', Edad: 61, Generación: 'Senior (>60)', Tipo_Candidatura: 'Por partido' },
      'Sergio Fajardo': { Favorabilidad: 42, Desfavorabilidad: 32, Partido_Movimiento: 'Centro Esperanza', Región_Origen: 'Antioquia', Cargo_Actual: 'Ex-Gobernador de Antioquia', Edad: 67, Generación: 'Senior (>60)', Tipo_Candidatura: 'Por partido' },
      'Claudia López': { Favorabilidad: 31, Desfavorabilidad: 45, Partido_Movimiento: 'Candidata por firmas', Región_Origen: 'Bogotá', Cargo_Actual: 'Ex-Alcaldesa de Bogotá', Edad: 54, Generación: 'Mayor (51-60)', Tipo_Candidatura: 'Por firmas' },
      'María Fernanda Cabal': { Favorabilidad: 27, Desfavorabilidad: 56, Partido_Movimiento: 'Centro Democrático', Región_Origen: 'Valle del Cauca', Cargo_Actual: 'Senadora', Edad: 58, Generación: 'Mayor (51-60)', Tipo_Candidatura: 'Por partido' },
      'Gustavo Bolívar': { Favorabilidad: 34, Desfavorabilidad: 48, Partido_Movimiento: 'Pacto Histórico', Región_Origen: 'Bogotá', Cargo_Actual: 'Ex-director Prosperidad Social', Edad: 63, Generación: 'Senior (>60)', Tipo_Candidatura: 'Por partido' },
      'Germán Vargas Lleras': { Favorabilidad: 29, Desfavorabilidad: 54, Partido_Movimiento: 'Cambio Radical', Región_Origen: 'Cundinamarca', Cargo_Actual: 'Ex-Vicepresidente', Edad: 65, Generación: 'Senior (>60)', Tipo_Candidatura: 'Por partido' },
      'Daniel Quintero': { Favorabilidad: 23, Desfavorabilidad: 58, Partido_Movimiento: 'Candidato por firmas', Región_Origen: 'Antioquia', Cargo_Actual: 'Ex-Alcalde de Medellín', Edad: 44, Generación: 'Adulto (41-50)', Tipo_Candidatura: 'Por firmas' },
      'María José Pizarro': { Favorabilidad: 29, Desfavorabilidad: 41, Partido_Movimiento: 'Peto Histórico', Región_Origen: 'Bogotá', Cargo_Actual: 'Senadora', Edad: 46, Generación: 'Adulto (41-50)', Tipo_Candidatura: 'Por partido' },
      'Miguel Uribe Turbay': { Favorabilidad: 32, Desfavorabilidad: 40, Partido_Movimiento: 'Centro Democrático', Región_Origen: 'Bogotá', Cargo_Actual: 'Senador', Edad: 39, Generación: 'Joven (≤40)', Tipo_Candidatura: 'Por partido' }
    };

function parsePollingTable(markdownContent) {
  const lines = markdownContent.split('\n');
  const candidatePercentages = {};
  
  let inTable = false;
  let candidateColumns = [];
  let tableStarted = false;

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.includes('### 2025')) {
        tableStarted = true;
        continue;
    }
    if (tableStarted && trimmedLine.startsWith('|')) {
        const parts = trimmedLine.split('|').map(p => p.trim()).filter(Boolean);
        if (parts[0] === 'Fecha' && parts[1] === 'Encuestadora') {
            inTable = true;
            candidateColumns = parts.slice(3, -1);
        } else if (inTable && !trimmedLine.includes('---')) {
            const rowData = parts.slice(3, -1);
            candidateColumns.forEach((col, index) => {
                const standardizedName = candidateNameMapping[col.trim()] || col.trim();
                const percentageMatch = rowData[index] ? rowData[index].match(/([\d.,]+)%?/) : null;
                if (standardizedName && percentageMatch) {
                    const percentage = parseFloat(percentageMatch[1].replace(',', '.'));
                    if (!candidatePercentages[standardizedName]) {
                        candidatePercentages[standardizedName] = percentage;
                    }
                }
            });
            if (Object.keys(candidatePercentages).length > 0) break; 
        }
    }
    if (tableStarted && trimmedLine.includes('### 2024')) {
        break;
    }
  }
  return candidatePercentages;
}


async function scrapeAndSaveData() {
    try {
        console.log('Scraping data from Wikipedia...');
        const response = await fetch('https://api.firecrawl.dev/v0/scrape', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({ url })
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`API request failed with status ${response.status}: ${errorBody}`);
        }

        const result = await response.json();

        if (!result.data || !result.data.markdown) {
            console.error('FireCrawl scrape failed:', result);
            throw new Error('Failed to scrape Wikipedia page');
        }

        console.log('Parsing scraped data...');
        const markdownContent = result.data.markdown;
        
        // Debugging: Save markdown to a file
        const markdownPath = path.join(__dirname, '..', 'debug_markdown.md');
        fs.writeFileSync(markdownPath, markdownContent);
        console.log(`Markdown content saved to ${markdownPath}`);

        const candidatePercentages = parsePollingTable(markdownContent);

        // Debugging: Log parsed percentages
        console.log('Parsed candidate percentages:', candidatePercentages);

        if (Object.keys(candidatePercentages).length === 0) {
            throw new Error('Could not parse candidate percentages from the markdown.');
        }

        const sortedCandidates = Object.entries(candidatePercentages)
            .sort(([, a], [, b]) => b - a);

        const candidates = sortedCandidates.map(([name, percentage], index) => {
            const additionalData = candidateAdditionalData[name] || {};
            return {
                Candidato: name,
                Intención_Voto_Porcentaje: percentage,
                Tendencia_Política: politicalTendencyMapping[name] || 'Desconocido',
                Favorabilidad: additionalData.Favorabilidad || 30,
                Desfavorabilidad: additionalData.Desfavorabilidad || 40,
                Partido_Movimiento: additionalData.Partido_Movimiento || 'TBD',
                Región_Origen: additionalData.Región_Origen || 'TBD',
                Cargo_Actual: additionalData.Cargo_Actual || 'TBD',
                Edad: additionalData.Edad || 50,
                Ranking: index + 1,
                Generación: additionalData.Generación || 'Adulto (41-50)',
                Tipo_Candidatura: additionalData.Tipo_Candidatura || 'Por partido',
            };
        });

        const outputPath = path.join(__dirname, '..', 'public', 'election-data.json');
        console.log(`Saving data to ${outputPath}...`);
        fs.writeFileSync(outputPath, JSON.stringify(candidates, null, 2));
        console.log('Data saved successfully!');

    } catch (error) {
        console.error('Error during scraping process:', error);
        process.exit(1);
    }
}

scrapeAndSaveData(); 