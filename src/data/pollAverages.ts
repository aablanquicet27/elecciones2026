export interface PollData {
  encuestadora: string;
  fecha: string;
  muestra: number;
  margenError: string;
  url: string;
  resultados: Record<string, number>;
}

export interface CandidateAverage {
  candidato: string;
  partido: string;
  promedio: number;
  encuestas: { encuestadora: string; porcentaje: number }[];
  tendencia: 'up' | 'down' | 'stable';
}

// === ENCUESTAS PRE-CONSULTAS (Febrero 2026) — Histórico ===
export const encuestasHistorico: PollData[] = [
  {
    encuestadora: 'Invamer',
    fecha: '11-22 Feb 2026',
    muestra: 2375,
    margenError: '±2.26%',
    url: 'https://www.infobae.com/colombia/2026/02/26/estos-son-los-candidatos-que-lideran-intencion-de-voto-en-consultas-interpartidistas-segun-nueva-encuesta-invamer/',
    resultados: {
      'Iván Cepeda': 37.1,
      'Abelardo de la Espriella': 18.9,
      'Claudia López': 11.7,
      'Paloma Valencia': 10.0,
      'Sergio Fajardo': 6.6,
      'Vicky Dávila': 0,
      'Juan Daniel Oviedo': 0.9,
      'Roy Barreras': 1.8,
    }
  },
  {
    encuestadora: 'AtlasIntel',
    fecha: '19-25 Feb 2026',
    muestra: 6468,
    margenError: '±1.0%',
    url: 'https://www.infobae.com/colombia/2026/02/28/encuesta-de-atlasintel-revelo-una-baja-intencion-de-voto-para-la-consulta-del-8-de-marzo-ivan-cepeda-y-abelardo-de-la-espriella-puntean-sin-participar/',
    resultados: {
      'Iván Cepeda': 34.0,
      'Abelardo de la Espriella': 31.9,
      'Claudia López': 1.8,
      'Paloma Valencia': 4.3,
      'Sergio Fajardo': 6.3,
      'Vicky Dávila': 1.9,
      'Juan Daniel Oviedo': 0.6,
      'Roy Barreras': 1.5,
    }
  },
  {
    encuestadora: 'Guarumo/EcoAnalítica',
    fecha: '19-25 Feb 2026',
    muestra: 3867,
    margenError: '±2.0%',
    url: 'https://cambiocolombia.com/elecciones-colombia-2026/articulo/2026/2/elecciones-presidenciales-2026-asi-han-sido-los-resultados-de-las-encuestas-mas-recientes/',
    resultados: {
      'Iván Cepeda': 31.7,
      'Abelardo de la Espriella': 22.6,
      'Claudia López': 5.0,
      'Paloma Valencia': 10.0,
      'Sergio Fajardo': 3.6,
      'Vicky Dávila': 2.7,
      'Juan Daniel Oviedo': 1.0,
      'Roy Barreras': 1.1,
    }
  },
  {
    encuestadora: 'GAD3',
    fecha: '16-23 Feb 2026',
    muestra: 2108,
    margenError: '±2.5%',
    url: 'https://es.wikipedia.org/wiki/Anexo:Sondeos_de_intenci%C3%B3n_de_voto_para_las_elecciones_presidenciales_de_Colombia_de_2026',
    resultados: {
      'Iván Cepeda': 34.0,
      'Abelardo de la Espriella': 26.0,
      'Claudia López': 3.0,
      'Paloma Valencia': 4.0,
      'Sergio Fajardo': 2.0,
      'Vicky Dávila': 2.0,
      'Juan Daniel Oviedo': 0.2,
      'Roy Barreras': 1.0,
    }
  }
];

// === ENCUESTAS POST-CONSULTAS (Marzo 2026) — Datos actuales ===
export const encuestasRecientes: PollData[] = [
  {
    encuestadora: 'GAD3/RCN',
    fecha: '16-18 Mar 2026',
    muestra: 1200,
    margenError: '±3.0%',
    url: 'https://www.riotimesonline.com/colombia-election-poll-cepeda-espriella-valencia-2026/',
    resultados: {
      'Iván Cepeda': 35.0,
      'Paloma Valencia': 16.0,
      'Abelardo de la Espriella': 21.0,
      'Claudia López': 3.5,
      'Sergio Fajardo': 3.5,
      'Santiago Botero': 1.2,
      'Miguel Uribe Londoño': 1.0,
      'Roy Barreras': 0.5,
    }
  },
  {
    encuestadora: 'CNC/Cambio',
    fecha: '17-21 Mar 2026',
    muestra: 2157,
    margenError: '±3.0%',
    url: 'https://colombiaone.com/2026/03/22/poll-valencia-surges-past-delaespriella/',
    resultados: {
      'Iván Cepeda': 34.5,
      'Paloma Valencia': 22.2,
      'Abelardo de la Espriella': 15.4,
      'Claudia López': 3.7,
      'Sergio Fajardo': 3.6,
      'Santiago Botero': 1.3,
      'Miguel Uribe Londoño': 1.0,
      'Roy Barreras': 0.5,
    }
  }
];

// Function to calculate averages from current polls
export function calculateAverages(): CandidateAverage[] {
  const candidates = Object.keys(encuestasRecientes[0].resultados);
  
  return candidates.map(candidato => {
    const encuestas = encuestasRecientes.map(e => ({
      encuestadora: e.encuestadora,
      porcentaje: e.resultados[candidato] || 0
    }));
    
    const promedio = encuestas.reduce((sum, e) => sum + e.porcentaje, 0) / encuestas.length;
    
    const partidos: Record<string, string> = {
      'Iván Cepeda': 'Pacto Histórico',
      'Paloma Valencia': 'Centro Democrático (Gran Consulta por Colombia)',
      'Abelardo de la Espriella': 'Defensores de la Patria',
      'Claudia López': 'Consulta por Soluciones',
      'Sergio Fajardo': 'Dignidad y Compromiso',
      'Santiago Botero': 'Independiente',
      'Miguel Uribe Londoño': 'Centro Democrático',
      'Roy Barreras': 'Frente Amplio Unitario',
    };

    // Determine trend based on comparison with historical data
    const historicoAvg = encuestasHistorico.reduce((sum, e) => sum + (e.resultados[candidato] || 0), 0) / encuestasHistorico.length;
    let tendencia: 'up' | 'down' | 'stable' = 'stable';
    if (promedio > historicoAvg + 2) tendencia = 'up';
    else if (promedio < historicoAvg - 2) tendencia = 'down';
    
    return {
      candidato,
      partido: partidos[candidato] || '',
      promedio: Math.round(promedio * 10) / 10,
      encuestas,
      tendencia
    };
  }).sort((a, b) => b.promedio - a.promedio);
}

// === ESCENARIOS SEGUNDA VUELTA (CNC, Marzo 2026) ===
export const escenariosSegundaVuelta = [
  { candidato1: 'Iván Cepeda', porcentaje1: 43.3, candidato2: 'Paloma Valencia', porcentaje2: 42.9, nota: 'Empate técnico' },
  { candidato1: 'Iván Cepeda', porcentaje1: 48.1, candidato2: 'Abelardo de la Espriella', porcentaje2: 35.5, nota: '' },
  { candidato1: 'Iván Cepeda', porcentaje1: 47.3, candidato2: 'Claudia López', porcentaje2: 26.6, nota: '' },
  { candidato1: 'Iván Cepeda', porcentaje1: 47.3, candidato2: 'Sergio Fajardo', porcentaje2: 31.6, nota: '' },
];

// === FÓRMULAS VICEPRESIDENCIALES ===
export const formulasVicepresidenciales = {
  'Iván Cepeda': 'Aida Quilcué',
  'Paloma Valencia': 'Juan Daniel Oviedo',
};
