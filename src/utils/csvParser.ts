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
    { region: 'Caribe', Bolívar: 25.9, Fajardo: 20.1, Dávila: 8.4, Cabal: 6.2, Vargas: 7.5, Otros: 31.9 },
    { region: 'Andina', Bolívar: 10.2, Fajardo: 12.8, Dávila: 12.5, Cabal: 8.4, Vargas: 6.2, Otros: 49.9 },
    { region: 'Pacífica', Bolívar: 15.8, Fajardo: 14.3, Dávila: 9.6, Cabal: 4.1, Vargas: 4.5, Otros: 51.7 },
    { region: 'Orinoquía', Bolívar: 5.4, Fajardo: 8.2, Dávila: 15.7, Cabal: 12.3, Vargas: 8.9, Otros: 49.5 },
    { region: 'Amazonía', Bolívar: 8.7, Fajardo: 9.5, Dávila: 11.2, Cabal: 9.8, Vargas: 5.6, Otros: 55.2 }
  ];
};

export const getDemographicData = () => {
  return [
    { ageGroup: 'Jóvenes 18-24', Bolívar: 18.5, Fajardo: 10.2, Dávila: 8.1, Cabal: 3.5, Vargas: 2.8, Otros: 56.9 },
    { ageGroup: 'Adultos 25-34', Bolívar: 15.2, Fajardo: 11.5, Dávila: 9.5, Cabal: 4.2, Vargas: 4.1, Otros: 55.5 },
    { ageGroup: 'Adultos 35-44', Bolívar: 11.7, Fajardo: 12.4, Dávila: 12.8, Cabal: 5.1, Vargas: 5.6, Otros: 52.4 },
    { ageGroup: 'Adultos 45-54', Bolívar: 8.6, Fajardo: 11.8, Dávila: 13.5, Cabal: 6.2, Vargas: 7.3, Otros: 52.6 },
    { ageGroup: 'Adultos Mayores 55+', Bolívar: 7.3, Fajardo: 10.9, Dávila: 14.2, Cabal: 7.4, Vargas: 8.2, Otros: 52.0 }
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
    { tendencia: 'Izquierda', porcentaje2022: 40.3, porcentaje2026: 23.0 },
    { tendencia: 'Centro', porcentaje2022: 28.2, porcentaje2026: 27.0 },
    { tendencia: 'Derecha', porcentaje2022: 28.5, porcentaje2026: 29.0 },
    { tendencia: 'Otros/Indecisos', porcentaje2022: 3.0, porcentaje2026: 21.0 }
  ];
};

export const getScenarioData = () => {
  return [
    { 
      scenario: 'Bolívar vs. Dávila', 
      candidate1: 'Bolívar', 
      percentage1: 43.5, 
      candidate2: 'Dávila', 
      percentage2: 46.8, 
      undecided: 9.7,
      probability: 25
    },
    { 
      scenario: 'Bolívar vs. Fajardo', 
      candidate1: 'Bolívar', 
      percentage1: 41.2, 
      candidate2: 'Fajardo', 
      percentage2: 48.5, 
      undecided: 10.3,
      probability: 20
    },
    { 
      scenario: 'Fajardo vs. Dávila', 
      candidate1: 'Fajardo', 
      percentage1: 38.6, 
      candidate2: 'Dávila', 
      percentage2: 35.2, 
      undecided: 26.2,
      probability: 18
    },
    { 
      scenario: 'Dávila vs. Vargas', 
      candidate1: 'Dávila', 
      percentage1: 37.4, 
      candidate2: 'Vargas', 
      percentage2: 32.6, 
      undecided: 30.0,
      probability: 15
    },
    { 
      scenario: 'Bolívar vs. Cabal', 
      candidate1: 'Bolívar', 
      percentage1: 42.3, 
      candidate2: 'Cabal', 
      percentage2: 44.7, 
      undecided: 13.0,
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
    { candidate: 'Miguel Uribe', favorabilidad: 32, desfavorabilidad: 40, balance: -8 },
    { candidate: 'Gustavo Bolívar', favorabilidad: 34, desfavorabilidad: 48, balance: -14 },
    { candidate: 'Claudia López', favorabilidad: 31, desfavorabilidad: 45, balance: -14 },
    { candidate: 'Germán Vargas', favorabilidad: 29, desfavorabilidad: 54, balance: -25 },
    { candidate: 'María F. Cabal', favorabilidad: 27, desfavorabilidad: 56, balance: -29 },
    { candidate: 'Daniel Quintero', favorabilidad: 23, desfavorabilidad: 58, balance: -35 }
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