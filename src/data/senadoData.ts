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
    ]
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
    ]
  },
  {
    id: 'centro-democratico',
    number: 3,
    name: 'Centro Democrático',
    coalition: null,
    listType: 'Preferente',
    tendency: 'Derecha',
    riskLevel: 'medium',
    description: 'Principal partido de oposición, buscando recuperar su influencia legislativa.',
    questionedCandidates: [
      { name: 'José Vicente Carreño', allegation: 'vínculos paramilitares' }
    ]
  },
  {
    id: 'pacto-historico',
    number: 4,
    name: 'Pacto Histórico',
    coalition: ['Pacto Histórico', 'Colombia Humana'],
    listType: 'Preferente',
    tendency: 'Izquierda',
    riskLevel: 'medium',
    description: 'Coalición del actual gobierno. Enfrenta el reto de mantener sus curules en medio del desgaste político.',
    questionedCandidates: [
      { name: 'Martha Peralta', allegation: 'UNGRD, saltó a circunscripción indígena' }
    ]
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
    ]
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
    questionedCandidates: []
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
    questionedCandidates: []
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
    questionedCandidates: []
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
    ]
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
    ]
  },
  {
    id: 'creemos',
    number: 11,
    name: 'Creemos',
    coalition: null,
    listType: 'Preferente',
    tendency: 'Centro-Derecha',
    riskLevel: 'low',
    description: 'Movimiento político originado en Antioquia con miras a la expansión nacional.',
    questionedCandidates: []
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
    questionedCandidates: []
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
    questionedCandidates: []
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
    questionedCandidates: []
  },
  {
    id: 'frente-amplio-unitario',
    number: 15,
    name: 'Frente Amplio Unitario',
    coalition: null,
    listType: 'Preferente',
    tendency: 'Izquierda',
    riskLevel: 'high',
    description: 'Lista armada bajo la influencia de Roy Barreras. Agrupa diversos sectores pero cuenta con altos cuestionamientos.',
    questionedCandidates: [
      { name: 'Roy Barreras', allegation: 'detrás' },
      { name: 'Milena Flórez', allegation: 'esposa Musa Besaile condenado' },
      { name: 'Pote Gómez', allegation: 'clientelismo' },
      { name: 'Máximo Noriega', allegation: 'caso Nicolás Petro' },
      { name: 'Gorky Muñoz', allegation: 'sanciones Procuraduría' }
    ]
  },
  {
    id: 'partido-liberal',
    number: 16,
    name: 'Partido Liberal',
    coalition: null,
    listType: 'Preferente',
    tendency: 'Centro',
    riskLevel: 'medium',
    description: 'Partido histórico con fuerte maquinaria regional pero desgastado por múltiples escándalos recientes.',
    questionedCandidates: [
      { name: 'Richard Aguilar', allegation: 'corrupción gobernador' },
      { name: 'Andrés Calle', allegation: 'UNGRD' },
      { name: 'Yesid Pulgar', allegation: 'hermano Eduardo Pulgar condenado' }
    ]
  }
];

export const senadoStats = {
  curules: 103,
  partidos: 16,
  aspirantes: 3144,
  cuestionados: 195,
  abstencion2022: '53%',
  cuestionadosSenado: 78,
  posiblesInhabilidades: 41
};
