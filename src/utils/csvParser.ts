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
    { region: 'Centro-Oriente', lider: 'Paloma Valencia', color: '#8b5cf6' },
    { region: 'Eje Cafetero', lider: 'Paloma Valencia', color: '#8b5cf6' },
    { region: 'Llanos', lider: 'Abelardo de la Espriella', color: '#f97316' },
    { region: 'Amazonía', lider: 'Iván Cepeda', color: '#ef4444' }
  ];
};

export const getDemographicData = () => {
  return [
    { ageGroup: 'Jóvenes 18-24', lider: 'Iván Cepeda', color: '#ef4444' },
    { ageGroup: 'Adultos 25-34', lider: 'Iván Cepeda', color: '#ef4444' },
    { ageGroup: 'Adultos 35-44', lider: 'Paloma Valencia', color: '#8b5cf6' },
    { ageGroup: 'Adultos 45-59', lider: 'Paloma Valencia', color: '#8b5cf6' },
    { ageGroup: 'Adultos Mayores 60+', lider: 'Abelardo de la Espriella', color: '#f97316' }
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
    { tendencia: 'Izquierda', porcentaje2022: 40.3, porcentaje2026: 35.0 },
    { tendencia: 'Centro-Derecha', porcentaje2022: 28.5, porcentaje2026: 25.9 },
    { tendencia: 'Extrema Derecha', porcentaje2022: 0, porcentaje2026: 15.4 },
    { tendencia: 'Centro', porcentaje2022: 28.2, porcentaje2026: 7.3 },
    { tendencia: 'Otros/Indecisos', porcentaje2022: 3.0, porcentaje2026: 16.4 }
  ];
};

export const getScenarioData = () => {
  return [
    {
      scenario: 'Cepeda vs. Valencia',
      candidate1: 'Cepeda',
      percentage1: 43.3,
      candidate2: 'Valencia',
      percentage2: 42.9,
      undecided: 13.8,
      probability: 40
    },
    {
      scenario: 'Cepeda vs. De la Espriella',
      candidate1: 'Cepeda',
      percentage1: 48.1,
      candidate2: 'Espriella',
      percentage2: 35.5,
      undecided: 16.4,
      probability: 30
    },
    {
      scenario: 'Cepeda vs. López',
      candidate1: 'Cepeda',
      percentage1: 47.3,
      candidate2: 'López',
      percentage2: 26.6,
      undecided: 26.1,
      probability: 10
    },
    {
      scenario: 'Cepeda vs. Fajardo',
      candidate1: 'Cepeda',
      percentage1: 47.3,
      candidate2: 'Fajardo',
      percentage2: 31.6,
      undecided: 21.1,
      probability: 10
    },
    {
      scenario: 'Valencia vs. De la Espriella',
      candidate1: 'Valencia',
      percentage1: 41.2,
      candidate2: 'Espriella',
      percentage2: 38.7,
      undecided: 20.1,
      probability: 10
    }
  ];
};

export const getFavorabilityData = () => {
  return [
    { candidate: 'Iván Cepeda', favorabilidad: 42.0, desfavorabilidad: 43.9, balance: -1.9 },
    { candidate: 'Paloma Valencia', favorabilidad: 38.5, desfavorabilidad: 28.3, balance: 10.2 },
    { candidate: 'Abelardo de la Espriella', favorabilidad: 30.2, desfavorabilidad: 33.6, balance: -3.4 },
    { candidate: 'Claudia López', favorabilidad: 28.1, desfavorabilidad: 45.2, balance: -17.1 },
    { candidate: 'Sergio Fajardo', favorabilidad: 25.8, desfavorabilidad: 30.5, balance: -4.7 },
    { candidate: 'Roy Barreras', favorabilidad: 12.3, desfavorabilidad: 42.1, balance: -29.8 },
    { candidate: 'Santiago Botero', favorabilidad: 8.5, desfavorabilidad: 15.2, balance: -6.7 }
  ];
};

export const getElectoralInsights = () => {
  return {
    fragmentacion: {
      title: "Carrera a Tres Bandas",
      description: "Cepeda lidera con 34.5%, seguido por Valencia con 22.2% y De la Espriella con 15.4%. Las primarias del 8 de marzo transformaron la contienda en una competencia triangular.",
      impact: "Valencia pasó de 4% a 22.2% en solo dos semanas tras ganar la Gran Consulta",
      percentage: "34.5% · 22.2% · 15.4%"
    },
    recomposicion: {
      title: "Valencia: La Gran Sorpresa",
      description: "Paloma Valencia ganó la Gran Consulta con más de 3 millones de votos y escaló del 5° al 2° lugar. Su fórmula con Juan Daniel Oviedo busca captar el voto de centro.",
      impact: "De 4% pre-primarias a 22.2% post-primarias — el mayor salto de la campaña",
      change: "+18 puntos en 2 semanas"
    },
    volatilidad: {
      title: "Empate Técnico en Segunda Vuelta",
      description: "CNC revela que en balotaje Cepeda vs Valencia sería 43.3% vs 42.9% — un empate técnico dentro del margen de error. La segunda vuelta es completamente abierta.",
      impact: "Solo 0.4 puntos separan a los dos en el escenario más probable",
      uncertainty: "43.3% vs 42.9%"
    },
    digital: {
      title: "Congreso Fragmentado",
      description: "Elecciones del 8 de marzo dejaron un Congreso sin mayorías: Pacto Histórico 25 Senado, Centro Democrático 17 Senado / 32 Cámara, Liberal 31 Cámara.",
      leaders: ["PH: 25 Sen.", "CD: 32 Cám.", "Liberal: 31 Cám."],
      impact: "El próximo presidente necesitará amplias coaliciones para gobernar"
    },
    regional: {
      title: "Cepeda Lidera Nacionalmente",
      description: "Cepeda domina en Caribe, Pacífica y Bogotá. Valencia gana fuerza en Centro-Oriente y Eje Cafetero. De la Espriella compite en Llanos.",
      highlights: {
        caribe: "Cepeda domina Caribe, Pacífica y Bogotá",
        andina: "Valencia sube en Centro-Oriente y Eje Cafetero",
        orinoquia: "De la Espriella mantiene fuerza en Llanos"
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
