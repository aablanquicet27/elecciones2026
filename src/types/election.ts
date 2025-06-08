export interface Candidate {
  Candidato: string;
  Intención_Voto_Porcentaje: number;
  Tendencia_Política: string;
  Favorabilidad: number;
  Desfavorabilidad: number;
  Partido_Movimiento: string;
  Región_Origen: string;
  Cargo_Actual: string;
  Edad: number;
  Ranking: number;
  Generación: string;
  Tipo_Candidatura: string;
}

export interface TrendData {
  tendencia: string;
  porcentaje: number;
  color: string;
}

export interface RegionData {
  region: string;
  candidates: { [key: string]: number };
}

export interface DemographicData {
  ageGroup: string;
  candidates: { [key: string]: number };
}

export interface SocialMediaData {
  candidate: string;
  twitter: number;
  instagram: number;
  facebook: number;
  total: number;
}

export interface ComparisonData {
  tendencia: string;
  porcentaje2022: number;
  porcentaje2026: number;
}

export interface ScenarioData {
  scenario: string;
  candidate1: string;
  percentage1: number;
  candidate2: string;
  percentage2: number;
  undecided: number;
  probability: number;
}

export interface FavorabilityData {
  candidate: string;
  favorabilidad: number;
  desfavorabilidad: number;
  balance: number;
}

export interface ElectoralInsights {
  fragmentacion: {
    title: string;
    description: string;
    impact: string;
    percentage: string;
  };
  recomposicion: {
    title: string;
    description: string;
    impact: string;
    change: string;
  };
  volatilidad: {
    title: string;
    description: string;
    impact: string;
    uncertainty: string;
  };
  digital: {
    title: string;
    description: string;
    leaders: string[];
    impact: string;
  };
  regional: {
    title: string;
    description: string;
    highlights: {
      caribe: string;
      andina: string;
      orinoquia: string;
    };
  };
  generacional: {
    title: string;
    description: string;
    trends: {
      jovenes: string;
      mayores: string;
    };
  };
}