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

export const encuestasRecientes: PollData[] = [
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

// Function to calculate averages
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
      'Abelardo de la Espriella': 'Defensores de la Patria',
      'Claudia López': 'Independiente',
      'Paloma Valencia': 'Centro Democrático',
      'Sergio Fajardo': 'Dignidad y Compromiso',
      'Vicky Dávila': 'Independiente',
      'Juan Daniel Oviedo': 'Independiente',
      'Roy Barreras': 'La Fuerza',
    };
    
    return {
      candidato,
      partido: partidos[candidato] || '',
      promedio: Math.round(promedio * 10) / 10,
      encuestas,
      tendencia: 'stable' as const
    };
  }).sort((a, b) => b.promedio - a.promedio);
}
