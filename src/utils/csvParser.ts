import { Candidate } from '../types/election';

import candidatosRaw from '../../public/candidatos_presidenciales_2026_completo.csv?raw';

export interface ChatCandidate {
  nombre: string;
  intencionVoto: number;
  tendenciaPolitica: string;
  favorabilidad: number;
  desfavorabilidad: number;
  partido: string;
  region: string;
  profesion: string;
  edad: number;
  ranking: number;
}

export const parseCandidatesData = (): ChatCandidate[] => {
  const lines = candidatosRaw.trim().split('\n');
  return lines.slice(1).map(line => {
    const values = line.split(',');
    return {
      nombre: values[0]?.trim() || '',
      intencionVoto: parseFloat(values[1]) || 0,
      tendenciaPolitica: values[2]?.trim() || '',
      favorabilidad: parseFloat(values[3]) || 0,
      desfavorabilidad: parseFloat(values[4]) || 0,
      partido: values[5]?.trim() || '',
      region: values[6]?.trim() || '',
      profesion: values[7]?.trim() || '',
      edad: parseInt(values[8]) || 0,
      ranking: parseFloat(values[9]) || 0,
    };
  });
};

export const parseCandidateData = (csvText: string): Candidate[] => {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');

  return lines.slice(1).map(line => {
    const values = line.split(',');
    const candidate: any = {};

    headers.forEach((header, index) => {
      const value = values[index];
      if (header === 'Intención_Voto_Porcentaje' || header === 'Favorabilidad' ||
          header === 'Desfavorabilidad' || header === 'Edad' || header === 'Ranking') {
        candidate[header] = parseFloat(value);
      } else {
        candidate[header] = value;
      }
    });

    return candidate as Candidate;
  });
};

export const getTrendData = (candidates: Candidate[]) => {
  const trends = candidates.reduce((acc, candidate) => {
    const trend = candidate.Tendencia_Política;
    if (!acc[trend]) {
      acc[trend] = 0;
    }
    acc[trend] += candidate.Intención_Voto_Porcentaje;
    return acc;
  }, {} as { [key: string]: number });

  const trendColors = {
    'Izquierda': '#ef4444',
    'Centro': '#3b82f6',
    'Derecha': '#22c55e',
    'Centro-Derecha': '#8b5cf6',
    'Centro-Izquierda': '#f59e0b',
    'Extrema Derecha': '#f97316',
    'Otros': '#6b7280'
  };

  return Object.entries(trends).map(([tendencia, porcentaje]) => ({
    tendencia,
    porcentaje: Math.round(porcentaje * 10) / 10,
    color: trendColors[tendencia as keyof typeof trendColors] || '#6b7280'
  }));
};

export const getRegionalData = () => {
  return [
    { region: 'Caribe', lider: 'Iván Cepeda', color: '#ef4444' },
    { region: 'Pacífica', lider: 'Iván Cepeda', color: '#ef4444' },
    { region: 'Bogotá', lider: 'Iván Cepeda', color: '#ef4444' },
    { region: 'Centro-Oriente', lider: 'Abelardo de la Espriella', color: '#22c55e' },
    { region: 'Eje Cafetero', lider: 'Paloma Valencia', color: '#8b5cf6' },
    { region: 'Llanos', lider: 'Abelardo de la Espriella', color: '#22c55e' },
    { region: 'Amazonía', lider: 'Iván Cepeda', color: '#ef4444' }
  ];
};

export const getDemographicData = () => {
  return [
    { ageGroup: 'Jóvenes 18-24', lider: 'Iván Cepeda', color: '#ef4444' },
    { ageGroup: 'Adultos 25-34', lider: 'Iván Cepeda', color: '#ef4444' },
    { ageGroup: 'Adultos 35-44', lider: 'Abelardo de la Espriella', color: '#22c55e' },
    { ageGroup: 'Adultos 45-59', lider: 'Abelardo de la Espriella', color: '#22c55e' },
    { ageGroup: 'Adultos Mayores 60+', lider: 'Paloma Valencia', color: '#8b5cf6' }
  ];
};

export const getSocialMediaData = () => {
  return [
    { candidate: 'Claudia López', twitter: 1200000, instagram: 1000000, facebook: 1300000, total: 3500000 },
    { candidate: 'Iván Cepeda', twitter: 850000, instagram: 420000, facebook: 380000, total: 1650000 },
    { candidate: 'Sergio Fajardo', twitter: 830000, instagram: 300000, facebook: 780000, total: 1910000 },
    { candidate: 'Abelardo de la Espriella', twitter: 520000, instagram: 380000, facebook: 290000, total: 1190000 },
    { candidate: 'Paloma Valencia', twitter: 480000, instagram: 350000, facebook: 310000, total: 1140000 },
    { candidate: 'Miguel Uribe Londoño', twitter: 180000, instagram: 120000, facebook: 95000, total: 395000 }
  ];
};

export const getComparisonData = () => {
  return [
    { tendencia: 'Izquierda', porcentaje2022: 40.3, porcentaje2026: 39.5 },
    { tendencia: 'Derecha', porcentaje2022: 28.5, porcentaje2026: 24.7 },
    { tendencia: 'Centro-Derecha', porcentaje2022: 0, porcentaje2026: 18.3 },
    { tendencia: 'Centro', porcentaje2022: 28.2, porcentaje2026: 9.4 },
    { tendencia: 'Otros/Indecisos', porcentaje2022: 3.0, porcentaje2026: 8.1 }
  ];
};

export const getScenarioData = () => {
  return [
    {
      scenario: 'Valencia vs. Cepeda (AtlasIntel Abr 30)',
      candidate1: 'Valencia',
      percentage1: 49,
      candidate2: 'Cepeda',
      percentage2: 41,
      undecided: 10,
      probability: 25
    },
    {
      scenario: 'De la Espriella vs. Cepeda (AtlasIntel Abr 30)',
      candidate1: 'Espriella',
      percentage1: 48,
      candidate2: 'Cepeda',
      percentage2: 42,
      undecided: 10,
      probability: 25
    },
    {
      scenario: 'Valencia vs. Cepeda (Guarumo Abr)',
      candidate1: 'Valencia',
      percentage1: 45,
      candidate2: 'Cepeda',
      percentage2: 42,
      undecided: 13,
      probability: 15
    },
    {
      scenario: 'Cepeda vs. Valencia (GAD3 Abr)',
      candidate1: 'Cepeda',
      percentage1: 44,
      candidate2: 'Valencia',
      percentage2: 37,
      undecided: 19,
      probability: 15
    },
    {
      scenario: 'Cepeda vs. Espriella (GAD3 Abr)',
      candidate1: 'Cepeda',
      percentage1: 46,
      candidate2: 'Espriella',
      percentage2: 35,
      undecided: 19,
      probability: 15
    },
    {
      scenario: 'Cepeda vs. Valencia (CNC Mar)',
      candidate1: 'Cepeda',
      percentage1: 43.3,
      candidate2: 'Valencia',
      percentage2: 42.9,
      undecided: 13.8,
      probability: 5
    }
  ];
};

export const getFavorabilityData = () => {
  return [
    { candidate: 'Iván Cepeda', favorabilidad: 42.0, desfavorabilidad: 38.0, balance: 4.0 },
    { candidate: 'Paloma Valencia', favorabilidad: 38.0, desfavorabilidad: 36.0, balance: 2.0 },
    { candidate: 'Abelardo de la Espriella', favorabilidad: 35.0, desfavorabilidad: 48.0, balance: -13.0 },
    { candidate: 'Sergio Fajardo', favorabilidad: 42.0, desfavorabilidad: 32.0, balance: 10.0 },
    { candidate: 'Claudia López', favorabilidad: 31.0, desfavorabilidad: 45.0, balance: -14.0 },
    { candidate: 'Roy Barreras', favorabilidad: 18.0, desfavorabilidad: 55.0, balance: -37.0 },
    { candidate: 'Santiago Botero', favorabilidad: 25.0, desfavorabilidad: 30.0, balance: -5.0 }
  ];
};

export const getElectoralInsights = () => {
  return {
    fragmentacion: {
      title: "Tridente en Primera Vuelta",
      description: "Las mediciones de abril ubican a Cepeda primero, con De la Espriella sobrepasando a Valencia por el segundo lugar. El orden de ese 2° puesto define el escenario de balotaje.",
      impact: "El foco estratégico es quién llega a segunda vuelta",
      percentage: "Cepeda 39.1% · Espriella 23.1% · Valencia 18.3%"
    },
    recomposicion: {
      title: "AtlasIntel y Guarumo cambian la lectura del balotaje",
      description: "En escenarios de segunda vuelta, AtlasIntel y Guarumo muestran a la derecha derrotando a Cepeda: Valencia 49 vs 41, Espriella 48 vs 42. Invamer y GAD3 sostienen a Cepeda en el balotaje.",
      impact: "La transferencia de voto anti-gobierno se concentra en el rival de Cepeda",
      change: "2 de 4 encuestadoras dan ganador a la derecha"
    },
    volatilidad: {
      title: "Sin ganador en primera vuelta",
      description: "Cepeda gana primera vuelta con ~39% pero no alcanza el 50%+1 que exige la Constitución. La segunda vuelta del 21 de junio está garantizada.",
      impact: "El balotaje depende de alianzas y participación",
      uncertainty: "39.1% — lejos del 50%+1"
    },
    digital: {
      title: "Congreso Fragmentado",
      description: "Elecciones del 8 de marzo dejaron un Congreso sin mayorías: Pacto Histórico 25 Senado, Centro Democrático 17 Senado / 32 Cámara, Liberal 31 Cámara.",
      leaders: ["PH: 25 Sen.", "CD: 32 Cám.", "Liberal: 31 Cám."],
      impact: "El próximo presidente necesitará amplias coaliciones para gobernar"
    },
    regional: {
      title: "Cepeda mantiene fortaleza territorial",
      description: "Cepeda domina Caribe, Pacífica, Bogotá y Amazonía. De la Espriella crece en Centro-Oriente y Llanos. Valencia mantiene Eje Cafetero.",
      highlights: {
        caribe: "Cepeda domina Caribe, Pacífica y Bogotá",
        andina: "Espriella sube en Centro-Oriente",
        orinoquia: "Espriella mantiene fuerza en Llanos"
      }
    },
    generacional: {
      title: "Fórmulas VP Definen Estrategia",
      description: "Cepeda-Quilcué apunta al voto social e indígena. Valencia-Oviedo busca centro y tecnocracia. De la Espriella-Restrepo moderación económica.",
      trends: {
        jovenes: "Cepeda lidera 18-34 años con mensaje social",
        mayores: "Valencia y Espriella compiten en 45+ años"
      }
    }
  };
};
