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
    { region: 'Caribe', Cepeda: 22.5, Espriella: 32.8, Fajardo: 8.2, Valencia: 5.8, Pinzón: 4.5, Otros: 26.2 },
    { region: 'Andina', Cepeda: 27.8, Espriella: 26.5, Fajardo: 10.5, Valencia: 5.2, Pinzón: 5.8, Otros: 24.2 },
    { region: 'Pacífica', Cepeda: 28.2, Espriella: 24.5, Fajardo: 9.8, Valencia: 4.8, Pinzón: 5.2, Otros: 27.5 },
    { region: 'Orinoquía', Cepeda: 23.5, Espriella: 31.2, Fajardo: 8.5, Valencia: 6.2, Pinzón: 5.5, Otros: 25.1 },
    { region: 'Amazonía', Cepeda: 26.8, Espriella: 25.5, Fajardo: 9.2, Valencia: 4.5, Pinzón: 4.8, Otros: 29.2 }
  ];
};

export const getDemographicData = () => {
  return [
    { ageGroup: 'Jóvenes 18-24', Cepeda: 28.5, Espriella: 22.2, Fajardo: 11.5, Valencia: 6.2, Pinzón: 5.8, Otros: 25.8 },
    { ageGroup: 'Adultos 25-34', Cepeda: 27.2, Espriella: 24.5, Fajardo: 10.2, Valencia: 5.8, Pinzón: 5.5, Otros: 26.8 },
    { ageGroup: 'Adultos 35-44', Cepeda: 26.5, Espriella: 27.8, Fajardo: 9.5, Valencia: 5.2, Pinzón: 5.2, Otros: 25.8 },
    { ageGroup: 'Adultos 45-54', Cepeda: 25.2, Espriella: 29.5, Fajardo: 9.2, Valencia: 4.8, Pinzón: 4.9, Otros: 26.4 },
    { ageGroup: 'Adultos Mayores 55+', Cepeda: 24.5, Espriella: 31.2, Fajardo: 8.5, Valencia: 4.5, Pinzón: 4.5, Otros: 26.8 }
  ];
};

export const getSocialMediaData = () => {
  return [
    { candidate: 'Iván Cepeda', twitter: 850000, instagram: 420000, facebook: 680000, total: 1950000 },
    { candidate: 'Vicky Dávila', twitter: 1400000, instagram: 1300000, facebook: 920400, total: 3620400 },
    { candidate: 'Claudia López', twitter: 1200000, instagram: 1000000, facebook: 1300000, total: 3500000 },
    { candidate: 'Gustavo Bolívar', twitter: 950000, instagram: 500000, facebook: 500000, total: 1950000 },
    { candidate: 'Sergio Fajardo', twitter: 830000, instagram: 300000, facebook: 780000, total: 1910000 },
    { candidate: 'Daniel Quintero', twitter: 800000, instagram: 352100, facebook: 350000, total: 1502100 },
    { candidate: 'María F. Cabal', twitter: 760000, instagram: 309900, facebook: 280000, total: 1349900 },
    { candidate: 'Germán Vargas', twitter: 380000, instagram: 180000, facebook: 450000, total: 1010000 },
    { candidate: 'Abelardo de la Espriella', twitter: 320000, instagram: 250000, facebook: 380000, total: 950000 }
  ];
};

export const getComparisonData = () => {
  return [
    { tendencia: 'Izquierda', porcentaje2022: 40.3, porcentaje2026: 27.1 },
    { tendencia: 'Centro', porcentaje2022: 28.2, porcentaje2026: 24.7 },
    { tendencia: 'Derecha', porcentaje2022: 28.5, porcentaje2026: 34.0 },
    { tendencia: 'Otros/Indecisos', porcentaje2022: 3.0, porcentaje2026: 14.0 }
  ];
};

export const getScenarioData = () => {
  return [
    { 
      scenario: 'De la Espriella vs. Cepeda', 
      candidate1: 'Espriella', 
      percentage1: 44.2, 
      candidate2: 'Cepeda', 
      percentage2: 34.9, 
      undecided: 20.9,
      probability: 55
    },
    { 
      scenario: 'Fajardo vs. Cepeda', 
      candidate1: 'Fajardo', 
      percentage1: 39.6, 
      candidate2: 'Cepeda', 
      percentage2: 32.1, 
      undecided: 28.3,
      probability: 15
    },
    { 
      scenario: 'Valencia vs. Cepeda', 
      candidate1: 'Valencia', 
      percentage1: 38.2, 
      candidate2: 'Cepeda', 
      percentage2: 35.8, 
      undecided: 26.0,
      probability: 10
    },
    { 
      scenario: 'De la Espriella vs. Fajardo', 
      candidate1: 'Espriella', 
      percentage1: 37.9, 
      candidate2: 'Fajardo', 
      percentage2: 23.2, 
      undecided: 38.9,
      probability: 12
    },
    { 
      scenario: 'De la Espriella vs. Valencia', 
      candidate1: 'Espriella', 
      percentage1: 40.5, 
      candidate2: 'Valencia', 
      percentage2: 35.2, 
      undecided: 24.3,
      probability: 5
    },
    { 
      scenario: 'Cepeda vs. Pinzón', 
      candidate1: 'Cepeda', 
      percentage1: 36.4, 
      candidate2: 'Pinzón', 
      percentage2: 31.9, 
      undecided: 31.7,
      probability: 3
    }
  ];
};

export const getFavorabilityData = () => {
  return [
    { candidate: 'Abelardo de la Espriella', favorabilidad: 44.2, desfavorabilidad: 37.8, balance: 6.4 },
    { candidate: 'Iván Cepeda', favorabilidad: 39.6, desfavorabilidad: 43.2, balance: -3.6 },
    { candidate: 'Paloma Valencia', favorabilidad: 38.2, desfavorabilidad: 34.5, balance: 3.7 },
    { candidate: 'Sergio Fajardo', favorabilidad: 37.9, desfavorabilidad: 35.1, balance: 2.8 },
    { candidate: 'Juan Carlos Pinzón', favorabilidad: 36.4, desfavorabilidad: 31.8, balance: 4.6 },
    { candidate: 'Roy Barreras', favorabilidad: 32.1, desfavorabilidad: 38.9, balance: -6.8 },
    { candidate: 'Aníbal Gaviria', favorabilidad: 31.5, desfavorabilidad: 32.8, balance: -1.3 },
    { candidate: 'Juan Daniel Oviedo', favorabilidad: 30.9, desfavorabilidad: 33.2, balance: -2.3 },
    { candidate: 'Vicky Dávila', favorabilidad: 28.7, desfavorabilidad: 45.2, balance: -16.5 },
    { candidate: 'Enrique Peñalosa', favorabilidad: 25.3, desfavorabilidad: 48.1, balance: -22.8 },
    { candidate: 'Claudia López', favorabilidad: 24.5, desfavorabilidad: 51.2, balance: -26.7 },
    { candidate: 'Mauricio Cárdenas', favorabilidad: 22.8, desfavorabilidad: 38.2, balance: -15.4 },
    { candidate: 'Juan Manuel Galán', favorabilidad: 21.4, desfavorabilidad: 35.7, balance: -14.3 },
    { candidate: 'David Luna', favorabilidad: 19.2, desfavorabilidad: 41.3, balance: -22.1 },
    { candidate: 'Daniel Quintero', favorabilidad: 18.3, desfavorabilidad: 52.1, balance: -33.8 },
    { candidate: 'Juan Fernando Cristo', favorabilidad: 16.8, desfavorabilidad: 43.5, balance: -26.7 }
  ];
};

export const getElectoralInsights = () => {
  return {
    fragmentacion: {
      title: "Carrera Electoral Reñida - Enero 2026",
      description: "Abelardo de la Espriella lidera con 28.0%, seguido por Iván Cepeda con 26.5%",
      impact: "Margen técnico de empate entre los dos líderes",
      percentage: "28.0% vs 26.5%"
    },
    recomposicion: {
      title: "Reconfiguración del Mapa Político",
      description: "Derecha recupera terreno con De la Espriella al frente",
      impact: "Centro fortalecido con Fajardo (9.4%) y nuevos competidores",
      change: "+9.8 puntos para De la Espriella desde diciembre"
    },
    volatilidad: {
      title: "Volatilidad Electoral Moderada",
      description: "14.0% de indecisos (Ninguno, Blanco, NS/NR)",
      impact: "Definición electoral clara con margen para cambios",
      uncertainty: "14.0%"
    },
    digital: {
      title: "Factor Digital Determinante",
      description: "Presencia en redes sociales como diferenciador clave",
      leaders: ["Vicky Dávila", "Claudia López", "Iván Cepeda"],
      impact: "Nuevas dinámicas de comunicación política digital"
    },
    regional: {
      title: "Dinámicas Regionales Diferenciadas",
      description: "Comportamiento electoral heterogéneo por regiones",
      highlights: {
        caribe: "Espriella fortalecido en su región de origen (Atlántico)",
        andina: "Competencia cerrada entre Cepeda y Espriella",
        orinoquia: "Derecha mantiene ventaja en regiones tradicionales"
      }
    },
    generacional: {
      title: "Polarización Generacional",
      description: "Diferencias marcadas por grupos etarios",
      trends: {
        jovenes: "Cepeda mantiene ventaja en votantes jóvenes",
        mayores: "Espriella lidera en electores mayores de 50 años"
      }
    }
  };
};
