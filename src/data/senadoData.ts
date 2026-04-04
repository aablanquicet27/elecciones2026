export type RiskLevel = 'low' | 'medium' | 'high';
export type Tendency = 'Izquierda' | 'Centro' | 'Derecha' | 'Centro-Izquierda' | 'Centro-Derecha';
export type ListType = 'Preferente' | 'No preferente';

export interface QuestionedCandidate {
  name: string;
  allegation: string;
}

export interface PartyData {
  id: string;
  number: number;
  name: string;
  coalition: string[] | null;
  listType: ListType;
  tendency: Tendency;
  riskLevel: RiskLevel;
  description: string;
  questionedCandidates: QuestionedCandidate[];
  senadoCurules2026?: number;
  camaraCurules2026?: number;
}

export const senadoParties: PartyData[] = [
  {
    id: 'partido-de-la-u',
    number: 1,
    name: 'Partido de la U',
    coalition: null,
    listType: 'Preferente',
    tendency: 'Centro-Derecha',
    riskLevel: 'high',
    description: 'Partido tradicional que ha sido gobierno con múltiples presidentes. Fuerte estructura regional y clientelista.',
    questionedCandidates: [
      { name: 'José Alfredo Gnecco', allegation: 'compra votos' },
      { name: 'Julio Elías Chagüi', allegation: 'UNGRD' },
      { name: 'Wilmer Carrillo', allegation: 'corruption' },
      { name: 'Antonio Correa', allegation: 'coimas' },
      { name: 'Jhony Besaile', allegation: 'hermano Ñoño condenado' }
    ],
    senadoCurules2026: 8,
    camaraCurules2026: 15
  },
  {
    id: 'fuerza-ciudadana',
    number: 2,
    name: 'Fuerza Ciudadana',
    coalition: ['Comunes', 'Fuerza Ciudadana'],
    listType: 'Preferente',
    tendency: 'Izquierda',
    riskLevel: 'medium',
    description: 'Alianza entre el partido surgido del Acuerdo de Paz y el movimiento progresista del Magdalena.',
    questionedCandidates: [
      { name: 'Alexánder Angulo', allegation: 'enlace UNGRD Pinilla-Olmedo' }
    ],
    senadoCurules2026: 3,
    camaraCurules2026: 5
  },
  {
    id: 'centro-democratico',
    number: 3,
    name: 'Centro Democrático',
    coalition: null,
    listType: 'Preferente',
    tendency: 'Centro-Derecha',
    riskLevel: 'high',
    description: 'Principal partido de oposición fundado por Álvaro Uribe. Obtuvo la segunda mayor fuerza en Senado y la primera en Cámara en las elecciones del 8 de marzo 2026.',
    questionedCandidates: [
      { name: 'José Vicente Carreño', allegation: 'Vínculos con grupos paramilitares' }
    ],
    senadoCurules2026: 17,
    camaraCurules2026: 32
  },
  {
    id: 'pacto-historico',
    number: 4,
    name: 'Pacto Histórico',
    coalition: ['Pacto Histórico', 'Colombia Humana'],
    listType: 'Preferente',
    tendency: 'Izquierda',
    riskLevel: 'high',
    description: 'Coalición del gobierno Petro. Mayor fuerza en Senado con 25 curules en las elecciones del 8 de marzo 2026, pero sin mayoría absoluta.',
    questionedCandidates: [
      { name: 'Pedro Flórez', allegation: 'Llamado por Corte Suprema por financiación irregular de campaña' },
      { name: 'Martha Peralta Epieyú', allegation: 'Pieza clave caso UNGRD según Fiscalía, saltó a circunscripción indígena' },
      { name: 'Caso UNGRD', allegation: 'Involucró sobornos a congresistas del Pacto por reformas del gobierno (cupos indicativos)' },
      { name: 'David Racero', allegation: 'Escándalos de corrupción como presidente de la Cámara' },
      { name: 'Gobierno Petro', allegation: 'Vinculado al desvío de dineros UNGRD para pagar cupos indicativos a congresistas' },
      { name: 'Alexander Florez', allegation: 'Denuncias de maltrato a expareja' },
      { name: 'Isabel Zuleta', allegation: 'Permitió presencia de capos en tarima oficial' },
      { name: 'Julio César González', allegation: 'Denuncias de abuso' }
    ],
    senadoCurules2026: 25,
    camaraCurules2026: 29
  },
  {
    id: 'conservador',
    number: 5,
    name: 'Partido Conservador',
    coalition: null,
    listType: 'Preferente',
    tendency: 'Derecha',
    riskLevel: 'high',
    description: 'Fuerza política histórica. Mantiene sólidas bases en las regiones pese a severos cuestionamientos de corrupción.',
    questionedCandidates: [
      { name: 'Wadith Manzur', allegation: 'UNGRD' },
      { name: 'David Barguil', allegation: 'tráfico influencias' },
      { name: 'Miguel Ángel Barreto', allegation: 'Ocad-Paz' },
      { name: 'Daniel Restrepo', allegation: 'clan Trujillo' }
    ],
    senadoCurules2026: 10,
    camaraCurules2026: 18
  },
  {
    id: 'verde-oxigeno',
    number: 6,
    name: 'Verde Oxígeno',
    coalition: null,
    listType: 'Preferente',
    tendency: 'Centro',
    riskLevel: 'low',
    description: 'Partido liderado por Íngrid Betancourt. Busca consolidarse como alternativa de centro independiente.',
    questionedCandidates: [],
    senadoCurules2026: 1,
    camaraCurules2026: 2
  },
  {
    id: 'patriotas',
    number: 7,
    name: 'Patriotas',
    coalition: null,
    listType: 'No preferente',
    tendency: 'Derecha',
    riskLevel: 'low',
    description: 'Grupo Significativo de Ciudadanos. Lista cerrada, las curules se asignan en el orden inscrito.',
    questionedCandidates: [],
    senadoCurules2026: 0,
    camaraCurules2026: 1
  },
  {
    id: 'con-toda',
    number: 8,
    name: 'Con Toda',
    coalition: null,
    listType: 'No preferente',
    tendency: 'Centro',
    riskLevel: 'low',
    description: 'Grupo Significativo de Ciudadanos con un enfoque más independiente y técnico.',
    questionedCandidates: [],
    senadoCurules2026: 0,
    camaraCurules2026: 0
  },
  {
    id: 'cambio-radical',
    number: 9,
    name: 'Cambio Radical-ALMA',
    coalition: ['Cambio Radical', 'Colombia Justa Libres', 'ADA', 'Liga de Gobernantes Anticorrupción'],
    listType: 'Preferente',
    tendency: 'Centro-Derecha',
    riskLevel: 'medium',
    description: 'Alianza entre Cambio Radical y otros sectores buscando consolidar mayorías legislativas de oposición.',
    questionedCandidates: [
      { name: 'César Lorduy', allegation: 'caso homicidio 1979 + CNE' },
      { name: 'Didier Lobo', allegation: 'enriquecimiento' },
      { name: 'Edgar Díaz', allegation: 'enriquecimiento' }
    ],
    senadoCurules2026: 7,
    camaraCurules2026: 14
  },
  {
    id: 'alianza-por-colombia',
    number: 10,
    name: 'Alianza por Colombia',
    coalition: ['Alianza Verde', 'En Marcha', 'ASI', 'Colombia Renaciente', 'Demócrata'],
    listType: 'Preferente',
    tendency: 'Centro-Izquierda',
    riskLevel: 'medium',
    description: 'Gran coalición de centro y centro-izquierda buscando consolidarse como bloque moderado en el Congreso.',
    questionedCandidates: [
      { name: 'Berenice Bedoya', allegation: 'UNGRD' },
      { name: 'Jairo Alberto Castellanos', allegation: 'UNGRD' },
      { name: 'Néstor Daniel García Colorado', allegation: 'Papá Pitufo' }
    ],
    senadoCurules2026: 6,
    camaraCurules2026: 12
  },
  {
    id: 'creemos',
    number: 11,
    name: 'Creemos',
    coalition: null,
    listType: 'Preferente',
    tendency: 'Derecha',
    riskLevel: 'low',
    description: 'Movimiento político originado en Antioquia con miras a la expansión nacional.',
    questionedCandidates: [],
    senadoCurules2026: 2,
    camaraCurules2026: 5
  },
  {
    id: 'salvacion-nacional',
    number: 12,
    name: 'Salvación Nacional',
    coalition: null,
    listType: 'Preferente',
    tendency: 'Derecha',
    riskLevel: 'low',
    description: 'Partido de derecha conservadora, liderado por Enrique Gómez.',
    questionedCandidates: [],
    senadoCurules2026: 1,
    camaraCurules2026: 2
  },
  {
    id: 'colombia-segura',
    number: 13,
    name: 'Colombia Segura y Prospera',
    coalition: null,
    listType: 'No preferente',
    tendency: 'Centro-Derecha',
    riskLevel: 'low',
    description: 'Grupo Significativo de Ciudadanos enfocado en políticas de seguridad ciudadana.',
    questionedCandidates: [],
    senadoCurules2026: 0,
    camaraCurules2026: 0
  },
  {
    id: 'ahora-colombia',
    number: 14,
    name: 'Ahora Colombia',
    coalition: ['MIRA', 'Nuevo Liberalismo', 'Dignidad y Compromiso'],
    listType: 'Preferente',
    tendency: 'Centro',
    riskLevel: 'low',
    description: 'Alianza de centro que une fuerzas tradicionales e independientes para maximizar su representación.',
    questionedCandidates: [],
    senadoCurules2026: 4,
    camaraCurules2026: 8
  },
  {
    id: 'frente-amplio-unitario',
    number: 15,
    name: 'Frente Amplio Unitario',
    coalition: null,
    listType: 'Preferente',
    tendency: 'Centro-Izquierda',
    riskLevel: 'high',
    description: 'Lista armada bajo la influencia de Roy Barreras. Agrupa diversos sectores pero cuenta con altos cuestionamientos.',
    questionedCandidates: [
      { name: 'Roy Barreras', allegation: 'detrás' },
      { name: 'Milena Flórez', allegation: 'esposa Musa Besaile condenado' },
      { name: 'Pote Gómez', allegation: 'clientelismo' },
      { name: 'Máximo Noriega', allegation: 'caso Nicolás Petro' },
      { name: 'Gorky Muñoz', allegation: 'sanciones Procuraduría' }
    ],
    senadoCurules2026: 3,
    camaraCurules2026: 5
  },
  {
    id: 'partido-liberal',
    number: 16,
    name: 'Partido Liberal',
    coalition: null,
    listType: 'Preferente',
    tendency: 'Centro',
    riskLevel: 'medium',
    description: 'Partido histórico con fuerte maquinaria regional. Segunda fuerza en Cámara con 31 curules en las elecciones del 8 de marzo 2026.',
    questionedCandidates: [
      { name: 'Richard Aguilar', allegation: 'corrupción gobernador' },
      { name: 'Andrés Calle', allegation: 'UNGRD' },
      { name: 'Yesid Pulgar', allegation: 'hermano Eduardo Pulgar condenado' }
    ],
    senadoCurules2026: 10,
    camaraCurules2026: 31
  }
];

// Actualizado con resultados reales del 8 de marzo de 2026
export const senadoStats = {
  curules: 103,
  partidos: 16,
  aspirantes: 3144,
  cuestionados: 195,
  abstencion2026: '>50%',
  abstencion2022: '53%',
  cuestionadosSenado: 78,
  posiblesInhabilidades: 41,
  // Resultados legislativos 8 de marzo 2026
  resultados2026: {
    fecha: '8 de marzo de 2026',
    totalSenadoCurules: 103,
    totalCamaraCurules: 183,
    senadoMayorFuerza: 'Pacto Histórico (25 curules)',
    senadoSegundaFuerza: 'Centro Democrático (17 curules)',
    camaraMayorFuerza: 'Centro Democrático (32 curules)',
    camaraSegundaFuerza: 'Partido Liberal (31 curules)',
    camaraTerceraFuerza: 'Pacto Histórico (29 curules)',
    notas: 'Congreso altamente fragmentado. Ningún partido alcanzó mayoría absoluta. El próximo presidente deberá formar coaliciones amplias para gobernar.',
    consultasPresidenciales: {
      derecha: { ganadora: 'Paloma Valencia', consulta: 'Gran Consulta por Colombia', votosCoalicion: 5500000 },
      centro: { ganadora: 'Claudia López', consulta: 'Consulta por Soluciones' },
      izquierda: { ganador: 'Roy Barreras', consulta: 'Consulta de izquierda', nota: 'Cepeda no participó, va directo a primera vuelta' }
    }
  }
};
