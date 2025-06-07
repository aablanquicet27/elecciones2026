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
    { region: 'Caribe', Bolívar: 25.9, Fajardo: 20.1, Dávila: 12.3, Cabal: 8.1 },
    { region: 'Andina', Bolívar: 10.2, Fajardo: 12.8, Dávila: 12.5, Cabal: 9.3 },
    { region: 'Orinoquía', Bolívar: 8.5, Fajardo: 7.2, Dávila: 15.7, Cabal: 12.3 },
    { region: 'Pacífica', Bolívar: 15.8, Fajardo: 14.3, Dávila: 11.8, Cabal: 9.5 }
  ];
};

export const getDemographicData = () => {
  return [
    { ageGroup: 'Jóvenes 18-24', Bolívar: 18.5, Fajardo: 10.2, Dávila: 8.1 },
    { ageGroup: 'Adultos 25-34', Bolívar: 15.2, Fajardo: 11.5, Dávila: 9.5 },
    { ageGroup: 'Adultos Mayores 55+', Bolívar: 7.3, Fajardo: 10.9, Dávila: 14.2 }
  ];
};

export const getSocialMediaData = () => {
  return [
    { candidate: 'Vicky Dávila', twitter: 1400000, instagram: 1300000, facebook: 920400 },
    { candidate: 'Claudia López', twitter: 850000, instagram: 1000000, facebook: 1300000 },
    { candidate: 'Gustavo Bolívar', twitter: 950000, instagram: 500000, facebook: 500000 },
    { candidate: 'Daniel Quintero', twitter: 800000, instagram: 352100, facebook: 450000 }
  ];
};

export const getComparisonData = () => {
  return [
    { tendencia: 'Izquierda', porcentaje2022: 40.3, porcentaje2026: 20.0 },
    { tendencia: 'Centro', porcentaje2022: 28.2, porcentaje2026: 25.6 },
    { tendencia: 'Derecha', porcentaje2022: 28.5, porcentaje2026: 32.3 },
    { tendencia: 'Otros/Indecisos', porcentaje2022: 3.0, porcentaje2026: 22.1 }
  ];
};

export const getScenarioData = () => {
  return [
    { scenario: 'Bolívar vs. Dávila', candidate1: 'Bolívar', percentage1: 43.5, candidate2: 'Dávila', percentage2: 46.8, undecided: 9.7 },
    { scenario: 'Bolívar vs. Fajardo', candidate1: 'Bolívar', percentage1: 41.2, candidate2: 'Fajardo', percentage2: 48.5, undecided: 10.3 },
    { scenario: 'Fajardo vs. Dávila', candidate1: 'Fajardo', percentage1: 38.6, candidate2: 'Dávila', percentage2: 35.2, undecided: 26.2 }
  ];
};