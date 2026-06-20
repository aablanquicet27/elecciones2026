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

// Mapa territorial de cara a la segunda vuelta (De la Espriella vs Cepeda)
export const getRegionalData = () => {
  return [
    { region: 'Caribe', lider: 'Iván Cepeda', color: '#ef4444' },
    { region: 'Pacífica', lider: 'Iván Cepeda', color: '#ef4444' },
    { region: 'Bogotá', lider: 'Iván Cepeda', color: '#ef4444' },
    { region: 'Amazonía', lider: 'Iván Cepeda', color: '#ef4444' },
    { region: 'Antioquia / Eje Cafetero', lider: 'Abelardo de la Espriella', color: '#22c55e' },
    { region: 'Centro-Oriente', lider: 'Abelardo de la Espriella', color: '#22c55e' },
    { region: 'Llanos / Orinoquía', lider: 'Abelardo de la Espriella', color: '#22c55e' }
  ];
};

export const getDemographicData = () => {
  return [
    { ageGroup: 'Jóvenes 18-24', lider: 'Iván Cepeda', color: '#ef4444' },
    { ageGroup: 'Adultos 25-34', lider: 'Iván Cepeda', color: '#ef4444' },
    { ageGroup: 'Adultos 35-44', lider: 'Abelardo de la Espriella', color: '#22c55e' },
    { ageGroup: 'Adultos 45-59', lider: 'Abelardo de la Espriella', color: '#22c55e' },
    { ageGroup: 'Adultos Mayores 60+', lider: 'Abelardo de la Espriella', color: '#22c55e' }
  ];
};

export const getSocialMediaData = () => {
  return [
    { candidate: 'Iván Cepeda', twitter: 850000, instagram: 520000, facebook: 480000, total: 1850000 },
    { candidate: 'Abelardo de la Espriella', twitter: 720000, instagram: 980000, facebook: 540000, total: 2240000 },
    { candidate: 'Paloma Valencia', twitter: 480000, instagram: 350000, facebook: 310000, total: 1140000 },
    { candidate: 'Sergio Fajardo', twitter: 830000, instagram: 300000, facebook: 780000, total: 1910000 },
    { candidate: 'Claudia López', twitter: 1200000, instagram: 1000000, facebook: 1300000, total: 3500000 }
  ];
};

export const getComparisonData = () => {
  return [
    { tendencia: 'Derecha', porcentaje2022: 28.5, porcentaje2026: 44.0 },
    { tendencia: 'Izquierda', porcentaje2022: 40.3, porcentaje2026: 41.0 },
    { tendencia: 'Centro-Derecha', porcentaje2022: 0, porcentaje2026: 6.9 },
    { tendencia: 'Centro', porcentaje2022: 28.2, porcentaje2026: 6.4 },
    { tendencia: 'Otros/Blanco', porcentaje2022: 3.0, porcentaje2026: 1.7 }
  ];
};

// Escenarios de segunda vuelta segun encuestas de junio 2026
export const getScenarioData = () => {
  return [
    {
      scenario: 'AtlasIntel/Semana (5-10 jun)',
      candidate1: 'De la Espriella',
      percentage1: 52.2,
      candidate2: 'Cepeda',
      percentage2: 44.5,
      undecided: 3.3,
      probability: 35
    },
    {
      scenario: 'Guarumo/EcoAnalítica (8-11 jun)',
      candidate1: 'De la Espriella',
      percentage1: 52.6,
      candidate2: 'Cepeda',
      percentage2: 45.0,
      undecided: 2.4,
      probability: 30
    },
    {
      scenario: 'CNC (6-13 jun)',
      candidate1: 'De la Espriella',
      percentage1: 48.6,
      candidate2: 'Cepeda',
      percentage2: 44.7,
      undecided: 6.7,
      probability: 25
    },
    {
      scenario: 'Remontada de Cepeda',
      candidate1: 'Cepeda',
      percentage1: 50.5,
      candidate2: 'De la Espriella',
      percentage2: 49.5,
      undecided: 0,
      probability: 10
    }
  ];
};

export const getFavorabilityData = () => {
  return [
    { candidate: 'Abelardo de la Espriella', favorabilidad: 47.0, desfavorabilidad: 45.0, balance: 2.0 },
    { candidate: 'Iván Cepeda', favorabilidad: 44.0, desfavorabilidad: 46.0, balance: -2.0 },
    { candidate: 'Paloma Valencia', favorabilidad: 38.0, desfavorabilidad: 40.0, balance: -2.0 },
    { candidate: 'Sergio Fajardo', favorabilidad: 42.0, desfavorabilidad: 34.0, balance: 8.0 },
    { candidate: 'Claudia López', favorabilidad: 31.0, desfavorabilidad: 47.0, balance: -16.0 },
    { candidate: 'Roy Barreras', favorabilidad: 18.0, desfavorabilidad: 55.0, balance: -37.0 }
  ];
};

export const getElectoralInsights = () => {
  return {
    fragmentacion: {
      title: "De la Espriella ganó la primera vuelta",
      description: "El 31 de mayo De la Espriella obtuvo 43,75% y Cepeda 40,9%. Ninguno alcanzó el 50%+1, así que se enfrentan en el balotaje del 21 de junio.",
      impact: "El balotaje define la Presidencia 2026-2030",
      percentage: "Espriella 43,75% · Cepeda 40,9%"
    },
    recomposicion: {
      title: "Las encuestas de junio favorecen a De la Espriella",
      description: "AtlasIntel (52,2 vs 44,5), Guarumo (52,6 vs 45) y CNC (48,6 vs 44,7) coinciden en dar ventaja a De la Espriella en la segunda vuelta.",
      impact: "El voto anti-gobierno se concentra en De la Espriella",
      change: "+6.4 pts"
    },
    volatilidad: {
      title: "Los mercados también lo dan favorito",
      description: "Polymarket asigna ~89% de probabilidad a De la Espriella frente a ~11% de Cepeda, con más de US$38M negociados. Cepeda apuesta a una remontada de última hora.",
      impact: "La participación y la transferencia de voto deciden",
      uncertainty: "89% vs 11%"
    },
    digital: {
      title: "Congreso fragmentado",
      description: "Las elecciones del 8 de marzo dejaron un Congreso sin mayorías: Pacto Histórico 25 Senado, Centro Democrático 17 Senado / 32 Cámara, Liberal 31 Cámara.",
      leaders: ["PH: 25 Sen.", "CD: 32 Cám.", "Liberal: 31 Cám."],
      impact: "El próximo presidente necesitará amplias coaliciones para gobernar"
    },
    regional: {
      title: "Mapa del balotaje",
      description: "Cepeda es fuerte en Caribe, Pacífico, Bogotá y Amazonía. De la Espriella domina Antioquia, Eje Cafetero, Centro-Oriente y Llanos, y hereda buena parte del voto de Valencia.",
      highlights: {
        caribe: "Cepeda: Caribe, Pacífico y Bogotá",
        andina: "De la Espriella: Antioquia y Eje Cafetero",
        orinoquia: "De la Espriella: Centro-Oriente y Llanos"
      }
    },
    generacional: {
      title: "Fórmulas vicepresidenciales",
      description: "De la Espriella-Restrepo (moderación económica) frente a Cepeda-Quilcué (voto social e indígena).",
      trends: {
        jovenes: "Cepeda es más fuerte entre 18-34 años",
        mayores: "De la Espriella domina entre los mayores de 45"
      }
    }
  };
};
