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
    { region: 'Caribe', Uribe: 12.1, Dávila: 11.8, Bolívar: 14.2, Fajardo: 9.5, Quintero: 8.9, Otros: 43.5 },
    { region: 'Andina', Uribe: 15.2, Dávila: 11.2, Bolívar: 9.8, Fajardo: 10.1, Quintero: 7.8, Otros: 45.9 },
    { region: 'Pacífica', Uribe: 11.8, Dávila: 9.9, Bolívar: 12.5, Fajardo: 8.7, Quintero: 9.2, Otros: 47.9 },
    { region: 'Orinoquía', Uribe: 16.3, Dávila: 13.8, Bolívar: 6.2, Fajardo: 7.5, Quintero: 6.1, Otros: 50.1 },
    { region: 'Amazonía', Uribe: 13.9, Dávila: 10.7, Bolívar: 8.1, Fajardo: 8.8, Quintero: 7.5, Otros: 51.0 }
  ];
};

export const getDemographicData = () => {
  return [
    { ageGroup: 'Jóvenes 18-24', Uribe: 16.8, Dávila: 9.2, Bolívar: 12.1, Fajardo: 8.5, Quintero: 10.2, Otros: 43.2 },
    { ageGroup: 'Adultos 25-34', Uribe: 15.1, Dávila: 10.8, Bolívar: 11.5, Fajardo: 9.1, Quintero: 8.9, Otros: 44.6 },
    { ageGroup: 'Adultos 35-44', Uribe: 14.2, Dávila: 12.1, Bolívar: 10.2, Fajardo: 8.8, Quintero: 7.5, Otros: 47.2 },
    { ageGroup: 'Adultos 45-54', Uribe: 12.9, Dávila: 12.8, Bolívar: 9.8, Fajardo: 8.2, Quintero: 6.8, Otros: 49.5 },
    { ageGroup: 'Adultos Mayores 55+', Uribe: 11.5, Dávila: 13.2, Bolívar: 8.9, Fajardo: 7.8, Quintero: 6.1, Otros: 52.5 }
  ];
};

export const getSocialMediaData = () => {
  return [
    { candidate: 'Vicky Dávila', twitter: 1400000, instagram: 1300000, facebook: 920400, total: 3620400 },
    { candidate: 'Claudia López', twitter: 1200000, instagram: 1000000, facebook: 1300000, total: 3500000 },
    { candidate: 'Gustavo Bolívar', twitter: 950000, instagram: 500000, facebook: 500000, total: 1950000 },
    { candidate: 'Sergio Fajardo', twitter: 830000, instagram: 300000, facebook: 780000, total: 1910000 },
    { candidate: 'Daniel Quintero', twitter: 800000, instagram: 352100, facebook: 350000, total: 1502100 },
    { candidate: 'María F. Cabal', twitter: 760000, instagram: 309900, facebook: 280000, total: 1349900 },
    { candidate: 'Germán Vargas', twitter: 380000, instagram: 180000, facebook: 450000, total: 1010000 },
    { candidate: 'María J. Pizarro', twitter: 500000, instagram: 270000, facebook: 250000, total: 1020000 }
  ];
};

export const getComparisonData = () => {
  return [
    { tendencia: 'Izquierda', porcentaje2022: 40.3, porcentaje2026: 29.7 },
    { tendencia: 'Centro', porcentaje2022: 28.2, porcentaje2026: 24.4 },
    { tendencia: 'Derecha', porcentaje2022: 28.5, porcentaje2026: 36.2 },
    { tendencia: 'Otros/Indecisos', porcentaje2022: 3.0, porcentaje2026: 9.7 }
  ];
};

export const getScenarioData = () => {
  return [
    { 
      scenario: 'Uribe vs. Dávila', 
      candidate1: 'Uribe', 
      percentage1: 47.2, 
      candidate2: 'Dávila', 
      percentage2: 42.1, 
      undecided: 10.7,
      probability: 28
    },
    { 
      scenario: 'Uribe vs. Bolívar', 
      candidate1: 'Uribe', 
      percentage1: 49.3, 
      candidate2: 'Bolívar', 
      percentage2: 38.9, 
      undecided: 11.8,
      probability: 22
    },
    { 
      scenario: 'Uribe vs. Fajardo', 
      candidate1: 'Uribe', 
      percentage1: 44.5, 
      candidate2: 'Fajardo', 
      percentage2: 42.8, 
      undecided: 12.7,
      probability: 20
    },
    { 
      scenario: 'Dávila vs. Bolívar', 
      candidate1: 'Dávila', 
      percentage1: 45.2, 
      candidate2: 'Bolívar', 
      percentage2: 41.5, 
      undecided: 13.3,
      probability: 18
    },
    { 
      scenario: 'Fajardo vs. Bolívar', 
      candidate1: 'Fajardo', 
      percentage1: 46.8, 
      candidate2: 'Bolívar', 
      percentage2: 39.2, 
      undecided: 14.0,
      probability: 12
    }
  ];
};

export const getFavorabilityData = () => {
  return [
    { candidate: 'Juan Manuel Galán', favorabilidad: 40, desfavorabilidad: 28, balance: 12 },
    { candidate: 'Sergio Fajardo', favorabilidad: 42, desfavorabilidad: 32, balance: 10 },
    { candidate: 'Alejandro Gaviria', favorabilidad: 35, desfavorabilidad: 38, balance: -3 },
    { candidate: 'Vicky Dávila', favorabilidad: 38, desfavorabilidad: 44, balance: -6 },
    { candidate: 'Miguel Uribe Turbay', favorabilidad: 32, desfavorabilidad: 40, balance: -8 },
    { candidate: 'Gustavo Bolívar', favorabilidad: 34, desfavorabilidad: 48, balance: -14 },
    { candidate: 'Claudia López', favorabilidad: 31, desfavorabilidad: 45, balance: -14 },
    { candidate: 'Daniel Quintero', favorabilidad: 23, desfavorabilidad: 58, balance: -35 },
    { candidate: 'Germán Vargas', favorabilidad: 29, desfavorabilidad: 54, balance: -25 },
    { candidate: 'María F. Cabal', favorabilidad: 27, desfavorabilidad: 56, balance: -29 }
  ];
};

export const getElectoralInsights = () => {
  return {
    fragmentacion: {
      title: "Fragmentación Sin Precedentes",
      description: "Ningún candidato supera el 15% de intención de voto",
      impact: "Mayor fragmentación electoral en la historia reciente de Colombia",
      percentage: "12.6%"
    },
    recomposicion: {
      title: "Recomposición del Mapa Político",
      description: "Caída drástica de la izquierda del 40.3% al 23%",
      impact: "Debilitamiento del petrismo y fortalecimiento relativo de la derecha",
      change: "-17.3 puntos"
    },
    volatilidad: {
      title: "Alta Volatilidad Electoral",
      description: "21% de indecisos y otros candidatos",
      impact: "Factores coyunturales serán determinantes",
      uncertainty: "21.0%"
    },
    digital: {
      title: "Factor Digital Determinante",
      description: "Presencia en redes sociales como diferenciador",
      leaders: ["Vicky Dávila", "Claudia López"],
      impact: "Nuevas dinámicas de comunicación política"
    },
    regional: {
      title: "Dinámicas Regionales Diferenciadas",
      description: "Comportamiento electoral heterogéneo por regiones",
      highlights: {
        caribe: "Bolívar domina con 25.9%",
        andina: "Mayor competitividad",
        orinoquia: "Dávila lidera con 15.7%"
      }
    },
    generacional: {
      title: "Polarización Generacional",
      description: "Diferencias marcadas por grupos etarios",
      trends: {
        jovenes: "Bolívar 18.5% en 18-24 años",
        mayores: "Dávila 14.2% en 55+ años"
      }
    }
  };
};