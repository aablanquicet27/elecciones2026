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
}