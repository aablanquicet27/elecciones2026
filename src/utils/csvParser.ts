import { Candidate } from '../types/election';

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
    { region: 'Caribe', Cepeda: 18.2, Espriella: 16.5, Cabal: 10.1, Bolívar: 12.8, Fajardo: 7.2, Otros: 35.2 },
    { region: 'Andina', Cepeda: 21.5, Espriella: 13.8, Cabal: 11.8, Bolívar: 10.5, Fajardo: 8.9, Otros: 33.5 },
    { region: 'Pacífica', Cepeda: 22.8, Espriella: 12.2, Cabal: 9.5, Bolívar: 13.2, Fajardo: 6.8, Otros: 35.5 },
    { region: 'Orinoquía', Cepeda: 16.5, Espriella: 17.2, Cabal: 13.5, Bolívar: 8.1, Fajardo: 6.5, Otros: 38.2 },
    { region: 'Amazonía', Cepeda: 19.8, Espriella: 11.5, Cabal: 8.8, Bolívar: 11.2, Fajardo: 7.5, Otros: 41.2 }
  ];
};

export const getDemographicData = () => {
  return [
    { ageGroup: 'Jóvenes 18-24', Cepeda: 24.5, Espriella: 11.2, Cabal: 8.5, Bolívar: 14.2, Quintero: 12.5, Otros: 29.1 },
    { ageGroup: 'Adultos 25-34', Cepeda: 22.8, Espriella: 13.5, Cabal: 10.2, Bolívar: 12.5, Quintero: 11.2, Otros: 29.8 },
    { ageGroup: 'Adultos 35-44', Cepeda: 20.5, Espriella: 14.8, Cabal: 11.5, Bolívar: 11.2, Quintero: 10.5, Otros: 31.5 },
    { ageGroup: 'Adultos 45-54', Cepeda: 19.2, Espriella: 15.5, Cabal: 12.2, Bolívar: 10.5, Quintero: 9.2, Otros: 33.4 },
    { ageGroup: 'Adultos Mayores 55+', Cepeda: 18.5, Espriella: 16.2, Cabal: 13.5, Bolívar: 9.2, Quintero: 7.8, Otros: 34.8 }
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
    { tendencia: 'Izquierda', porcentaje2022: 40.3, porcentaje2026: 52.7 },
    { tendencia: 'Centro', porcentaje2022: 28.2, porcentaje2026: 28.9 },
    { tendencia: 'Derecha', porcentaje2022: 28.5, porcentaje2026: 50.4 },
    { tendencia: 'Otros/Indecisos', porcentaje2022: 3.0, porcentaje2026: 18.5 }
  ];
};

export const getScenarioData = () => {
  return [
    { 
      scenario: 'Cepeda vs. Espriella', 
      candidate1: 'Cepeda', 
      percentage1: 48.5, 
      candidate2: 'Espriella', 
      percentage2: 42.8, 
      undecided: 8.7,
      probability: 35
    },
    { 
      scenario: 'Cepeda vs. Cabal', 
      candidate1: 'Cepeda', 
      percentage1: 49.2, 
      candidate2: 'Cabal', 
      percentage2: 41.5, 
      undecided: 9.3,
      probability: 25
    },
    { 
      scenario: 'Cepeda vs. Fajardo', 
      candidate1: 'Cepeda', 
      percentage1: 46.8, 
      candidate2: 'Fajardo', 
      percentage2: 44.2, 
      undecided: 9.0,
      probability: 18
    },
    { 
      scenario: 'Espriella vs. Fajardo', 
      candidate1: 'Espriella', 
      percentage1: 45.5, 
      candidate2: 'Fajardo', 
      percentage2: 43.8, 
      undecided: 10.7,
      probability: 15
    },
    { 
      scenario: 'Cepeda vs. Bolívar', 
      candidate1: 'Cepeda', 
      percentage1: 51.2, 
      candidate2: 'Bolívar', 
      percentage2: 38.5, 
      undecided: 10.3,
      probability: 7
    }
  ];
};

export const getFavorabilityData = () => {
  return [
    { candidate: 'Iván Cepeda', favorabilidad: 42, desfavorabilidad: 38, balance: 4 },
    { candidate: 'Sergio Fajardo', favorabilidad: 42, desfavorabilidad: 32, balance: 10 },
    { candidate: 'Juan Manuel Galán', favorabilidad: 40, desfavorabilidad: 28, balance: 12 },
    { candidate: 'Abelardo de la Espriella', favorabilidad: 38, desfavorabilidad: 44, balance: -6 },
    { candidate: 'Vicky Dávila', favorabilidad: 38, desfavorabilidad: 44, balance: -6 },
    { candidate: 'Francia Márquez', favorabilidad: 36, desfavorabilidad: 45, balance: -9 },
    { candidate: 'María F. Cabal', favorabilidad: 35, desfavorabilidad: 56, balance: -21 },
    { candidate: 'Alejandro Gaviria', favorabilidad: 35, desfavorabilidad: 38, balance: -3 },
    { candidate: 'Gustavo Bolívar', favorabilidad: 34, desfavorabilidad: 48, balance: -14 },
    { candidate: 'Claudia López', favorabilidad: 31, desfavorabilidad: 45, balance: -14 },
    { candidate: 'Paloma Valencia', favorabilidad: 30, desfavorabilidad: 48, balance: -18 },
    { candidate: 'Germán Vargas', favorabilidad: 29, desfavorabilidad: 54, balance: -25 },
    { candidate: 'Susana Muhamad', favorabilidad: 28, desfavorabilidad: 42, balance: -14 },
    { candidate: 'Daniel Quintero', favorabilidad: 23, desfavorabilidad: 58, balance: -35 }
  ];
};

export const getElectoralInsights = () => {
  return {
    fragmentacion: {
      title: "Nueva Reconfiguración Electoral",
      description: "Iván Cepeda lidera con 20.9% de intención de voto",
      impact: "Mayor consolidación en la izquierda con liderazgo claro",
      percentage: "20.9%"
    },
    recomposicion: {
      title: "Recomposición del Mapa Político",
      description: "Fortalecimiento de la izquierda y fragmentación de la derecha",
      impact: "Izquierda suma 52.7%, derecha fragmentada en múltiples candidatos",
      change: "+12.4 puntos izquierda"
    },
    volatilidad: {
      title: "Alta Indecisión Electoral",
      description: "18.5% de indecisos marca el panorama",
      impact: "Factores coyunturales serán determinantes en los próximos meses",
      uncertainty: "18.5%"
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
        caribe: "Cepeda lidera con 18.2%, Espriella con 16.5%",
        andina: "Cepeda domina con 21.5%",
        orinoquia: "Espriella lidera con 17.2%"
      }
    },
    generacional: {
      title: "Polarización Generacional",
      description: "Diferencias marcadas por grupos etarios",
      trends: {
        jovenes: "Cepeda 24.5% en 18-24 años, Bolívar 14.2%",
        mayores: "Espriella 16.2% en 55+ años, Cabal 13.5%"
      }
    }
  };
};
