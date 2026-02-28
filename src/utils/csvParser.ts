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
    { region: 'Bogotá', lider: 'Abelardo de la Espriella', color: '#22c55e' },
    { region: 'Centro-Oriente', lider: 'Abelardo de la Espriella', color: '#22c55e' },
    { region: 'Eje Cafetero', lider: 'Abelardo de la Espriella', color: '#22c55e' },
    { region: 'Llanos', lider: 'Abelardo de la Espriella', color: '#22c55e' },
    { region: 'Amazonía', lider: 'Abelardo de la Espriella', color: '#22c55e' }
  ];
};

export const getDemographicData = () => {
  return [
    { ageGroup: 'Jóvenes 18-24', lider: 'Iván Cepeda', color: '#ef4444' },
    { ageGroup: 'Adultos 25-34', lider: 'Iván Cepeda', color: '#ef4444' },
    { ageGroup: 'Adultos 35-44', lider: 'Iván Cepeda', color: '#ef4444' },
    { ageGroup: 'Adultos 45-59', lider: 'Abelardo de la Espriella', color: '#22c55e' },
    { ageGroup: 'Adultos Mayores 60+', lider: 'Abelardo de la Espriella', color: '#22c55e' }
  ];
};

export const getSocialMediaData = () => {
  return [
    { candidate: 'Claudia López', twitter: 1200000, instagram: 1000000, facebook: 1300000, total: 3500000 },
    { candidate: 'Iván Cepeda', twitter: 850000, instagram: 420000, facebook: 380000, total: 1650000 },
    { candidate: 'Sergio Fajardo', twitter: 830000, instagram: 300000, facebook: 780000, total: 1910000 },
    { candidate: 'Abelardo de la Espriella', twitter: 520000, instagram: 380000, facebook: 290000, total: 1190000 },
    { candidate: 'Paloma Valencia', twitter: 320000, instagram: 185000, facebook: 175000, total: 680000 },
    { candidate: 'Miguel Uribe Londoño', twitter: 180000, instagram: 120000, facebook: 95000, total: 395000 }
  ];
};

export const getComparisonData = () => {
  return [
    { tendencia: 'Derecha', porcentaje2022: 28.5, porcentaje2026: 40.0 },
    { tendencia: 'Izquierda', porcentaje2022: 40.3, porcentaje2026: 34.2 },
    { tendencia: 'Centro', porcentaje2022: 28.2, porcentaje2026: 20.2 },
    { tendencia: 'Otros/Indecisos', porcentaje2022: 3.0, porcentaje2026: 5.6 }
  ];
};

export const getScenarioData = () => {
  return [
    {
      scenario: 'De la Espriella vs. Cepeda',
      candidate1: 'Espriella',
      percentage1: 36.8,
      candidate2: 'Cepeda',
      percentage2: 34.6,
      undecided: 28.6,
      probability: 55
    },
    {
      scenario: 'Cepeda vs. Pinzón',
      candidate1: 'Cepeda',
      percentage1: 35.8,
      candidate2: 'Pinzón',
      percentage2: 18.8,
      undecided: 45.4,
      probability: 10
    },
    {
      scenario: 'Cepeda vs. Valencia',
      candidate1: 'Cepeda',
      percentage1: 35.2,
      candidate2: 'Valencia',
      percentage2: 26.9,
      undecided: 37.9,
      probability: 12
    },
    {
      scenario: 'Cepeda vs. Fajardo',
      candidate1: 'Cepeda',
      percentage1: 33.7,
      candidate2: 'Fajardo',
      percentage2: 26.2,
      undecided: 40.1,
      probability: 15
    },
    {
      scenario: 'De la Espriella vs. Fajardo',
      candidate1: 'Espriella',
      percentage1: 31.8,
      candidate2: 'Fajardo',
      percentage2: 21.7,
      undecided: 46.5,
      probability: 8
    }
  ];
};

export const getFavorabilityData = () => {
  return [
    { candidate: 'Iván Cepeda', favorabilidad: 0, desfavorabilidad: 43.9, balance: -43.9 },
    { candidate: 'Abelardo de la Espriella', favorabilidad: 0, desfavorabilidad: 33.6, balance: -33.6 }
  ];
};

export const getElectoralInsights = () => {
  return {
    fragmentacion: {
      title: "Liderazgo de Cepeda - Feb 2026",
      description: "Iván Cepeda lidera con 37.1%, seguido por Abelardo de la Espriella con 18.9%",
      impact: "Diferencia de más de 18 puntos a favor del líder",
      percentage: "37.1% vs 18.9%"
    },
    recomposicion: {
      title: "Centro-Izquierda y Derecha",
      description: "Centro-Izquierda consolida apoyo, mientras la Derecha mantiene un bloque sólido",
      impact: "Claudia López sube al 11.7%, Paloma Valencia al 10.0%",
      change: "Reconfiguración de los bloques tradicionales"
    },
    volatilidad: {
      title: "Indecisos en Descenso",
      description: "Menor porcentaje de indecisos ante polarización",
      impact: "Electorado más definido que en encuestas anteriores",
      uncertainty: "Bajo"
    },
    digital: {
      title: "Factor Digital Determinante",
      description: "Presencia en redes sociales como diferenciador clave",
      leaders: ["Claudia López", "Iván Cepeda", "Sergio Fajardo"],
      impact: "Líderes digitales no coinciden con líderes en intención de voto"
    },
    regional: {
      title: "Cepeda lidera nacionalmente",
      description: "Iván Cepeda domina la mayoría de las regiones, incluyendo Bogotá y el Caribe",
      highlights: {
        caribe: "Cepeda lidera en Caribe y Pacífica",
        andina: "Cepeda y Espriella compiten en la región Andina",
        orinoquia: "Competencia cerrada en Llanos y Amazonía"
      }
    },
    generacional: {
      title: "Polarización Generacional y Económica",
      description: "Cepeda lidera entre jóvenes (18-44) y bajos ingresos; Espriella entre mayores (45+) y altos ingresos",
      trends: {
        jovenes: "Cepeda lidera en votantes de 18 a 44 años",
        mayores: "Espriella domina en electores mayores de 45 años"
      }
    }
  };
};
