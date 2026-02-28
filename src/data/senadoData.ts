export type RiskLevel = 'limpio' | 'cuestionable' | 'alto_riesgo';
export type Tendency = 'izquierda' | 'centro' | 'derecha' | 'centro-izquierda' | 'centro-derecha';
export type ListType = 'preferente' | 'no preferente';

export interface PartyData {
  id: string;
  name: string;
  coalitionMembers?: string;
  listType: ListType;
  tendency: string;
  riskLevel: RiskLevel;
  questionedCount?: number;
  description: string;
  cuestionados: string[];
}

export const senadoParties: PartyData[] = [
  {
    id: 'partido-de-la-u',
    name: 'Partido de la U',
    listType: 'preferente',
    tendency: 'Centro-derecha pragmático',
    riskLevel: 'alto_riesgo',
    description: 'Partido creado para apoyar a Uribe, luego se alineó con Santos. Ha sido gobierno con todos.',
    cuestionados: [
      'José Alfredo Gnecco (clan familiar, presunta compra de votos)',
      'Wilmer Carrillo (investigado por corrupción en Norte de Santander)',
      'Antonio Correa (juicio en Corte Suprema por exigencia de coimas)',
      'Julio Elías Chagüi (salpicado UNGRD)',
      'Jhony Besaile y Julio Elías Vidal (hermanos de condenados por escándalo Fonade - los "Ñoños")'
    ]
  },
  {
    id: 'fuerza-ciudadana',
    name: 'Coalición Fuerza Ciudadana',
    coalitionMembers: 'Comunes (ex-FARC), sectores M-19, Voz Pública',
    listType: 'preferente',
    tendency: 'Izquierda',
    riskLevel: 'cuestionable',
    description: 'Partido surgido del Acuerdo de Paz 2016.',
    cuestionados: [
      'Alexánder Angulo (señalado como enlace en escándalo UNGRD)'
    ]
  },
  {
    id: 'centro-democratico',
    name: 'Centro Democrático',
    listType: 'preferente',
    tendency: 'Derecha, uribismo',
    riskLevel: 'cuestionable',
    description: 'Busca reafirmarse como principal oposición y recuperar terreno. Cabeza de lista: Andrés Forero.',
    cuestionados: [
      'José Vicente Carreño (señalamientos de vínculos paramilitares)'
    ]
  },
  {
    id: 'pacto-historico',
    name: 'Pacto Histórico',
    coalitionMembers: 'Colombia Humana + Pacto Histórico',
    listType: 'preferente',
    tendency: 'Izquierda, petrismo',
    riskLevel: 'cuestionable',
    description: 'Sin el impulso presidencial de 2022, enfrenta una prueba electoral más compleja.',
    cuestionados: [
      'Conexión con escándalo UNGRD a través de varios congresistas del gobierno'
    ]
  },
  {
    id: 'partido-conservador',
    name: 'Partido Conservador',
    listType: 'preferente',
    tendency: 'Centro-derecha tradicional',
    riskLevel: 'alto_riesgo',
    description: 'Busca mantener su base tradicional mientras enfrenta múltiples investigaciones.',
    cuestionados: [
      'Wadith Manzur (salpicado UNGRD)',
      'David Barguil (proceso por tráfico de influencias, cabeza de lista)',
      'Daniel Restrepo (heredero político de Carlos Trujillo)',
      'Miguel Ángel Barreto (escándalo Ocad-Paz)',
      'Juan Loreto Gómez (UNGRD)'
    ]
  },
  {
    id: 'verde-oxigeno',
    name: 'Partido Verde Oxígeno',
    listType: 'preferente',
    tendency: 'Centro',
    riskLevel: 'limpio',
    description: 'Busca recuperar visibilidad, reto de competir con coaliciones grandes.',
    cuestionados: []
  },
  {
    id: 'gsc-patriotas',
    name: 'GSC Patriotas',
    listType: 'no preferente',
    tendency: 'Derecha populista',
    riskLevel: 'limpio',
    description: 'Lista cerrada (curules por orden de tarjetón).',
    cuestionados: []
  },
  {
    id: 'con-toda-por-colombia',
    name: 'GSC Con Toda por Colombia',
    coalitionMembers: 'Lista de Oviedo',
    listType: 'no preferente',
    tendency: 'Centro independiente',
    riskLevel: 'limpio',
    description: 'Cabeza: Juan Daniel Oviedo (ex-director DANE). Lista cerrada.',
    cuestionados: []
  },
  {
    id: 'cambio-radical-alma',
    name: 'Coalición Cambio Radical – ALMA',
    coalitionMembers: 'Cambio Radical + Colombia Justa Libres + ADA + Liga de Gobernantes Anticorrupción',
    listType: 'preferente',
    tendency: 'Centro-derecha',
    riskLevel: 'alto_riesgo',
    description: 'Alianza estratégica de la derecha y sectores religiosos.',
    cuestionados: [
      'César Lorduy (denunciado por presunta violencia sexual, investigaciones como magistrado CNE)',
      'Didier Lobo (investigación enriquecimiento ilícito)',
      'Édgar de Jesús Díaz Contreras (enriquecimiento ilícito)'
    ]
  },
  {
    id: 'alianza-por-colombia',
    name: 'Alianza por Colombia',
    coalitionMembers: 'Alianza Verde + En Marcha + ASI + Colombia Renaciente + Partido Demócrata',
    listType: 'preferente',
    tendency: 'Centro-izquierda progresista',
    riskLevel: 'cuestionable',
    description: 'Coalición de centro e izquierda moderada.',
    cuestionados: [
      'Berenice Bedoya (UNGRD)',
      'Jairo Alberto Castellanos (UNGRD)',
      'Néstor Daniel García Colorado (escándalo "Papá Pitufo")',
      'Jorge "Davo" Pastrana (aliado de los Ñoños)'
    ]
  },
  {
    id: 'creemos-colombia',
    name: 'Creemos Colombia',
    listType: 'preferente',
    tendency: 'Centro',
    riskLevel: 'limpio',
    description: 'Fuerza política de centro buscando consolidación nacional.',
    cuestionados: []
  },
  {
    id: 'salvacion-nacional',
    name: 'Movimiento Salvación Nacional',
    listType: 'preferente',
    tendency: 'Derecha nacionalista',
    riskLevel: 'limpio',
    description: 'Derecha conservadora ideológica.',
    cuestionados: []
  },
  {
    id: 'colombia-segura',
    name: 'Colombia Segura y Próspera',
    listType: 'no preferente',
    tendency: 'Centro-derecha técnico',
    riskLevel: 'limpio',
    description: 'Movimiento de enfoque tecnocrático y seguridad.',
    cuestionados: []
  },
  {
    id: 'ahora-colombia',
    name: 'Coalición ¡Ahora Colombia!',
    coalitionMembers: 'MIRA + Nuevo Liberalismo + Dignidad y Compromiso',
    listType: 'preferente',
    tendency: 'Centro',
    riskLevel: 'limpio',
    description: 'Nota: Jota Pe Hernández (senador popular) descartó candidatura presidencial para ir al Senado aquí.',
    cuestionados: []
  },
  {
    id: 'frente-amplio-unitario',
    name: 'Frente Amplio Unitario',
    coalitionMembers: 'Esperanza Democrática + MAIS + La Fuerza de La Paz + Partido del Trabajo',
    listType: 'preferente',
    tendency: 'Izquierda',
    riskLevel: 'alto_riesgo',
    description: 'Coalición armada por Roy Barreras. Considerada de muy alto riesgo.',
    cuestionados: [
      'Martha Peralta Epieyú (engranaje UNGRD según Fiscalía)',
      'Milena Flórez (esposa de Musa Besaile, condenado por corrupción)',
      'Édgar \'Pote\' Gómez (redes clientelares)',
      'Máximo Noriega (salpicado caso Nicolás Petro)',
      'Gorky Muñoz (sanciones Procuraduría)'
    ]
  },
  {
    id: 'partido-liberal',
    name: 'Partido Liberal',
    listType: 'preferente',
    tendency: 'Centro-izquierda tradicional',
    riskLevel: 'alto_riesgo',
    description: 'Partido tradicional con fuerte presencia regional pero múltiples escándalos recientes.',
    cuestionados: [
      'Andrés Calle (expresidente Cámara, vinculado UNGRD)',
      'Richard Aguilar (juicio por corrupción como gobernador de Santander)',
      'Camilo Torres (sobrino de megacontratista del gobierno)',
      'Yesid Pulgar (hermano de Eduardo Pulgar, condenado por soborno a juez)'
    ]
  }
];

export const senadoStats = {
  curules: 103,
  partidos: 16,
  aspirantes: 3144,
  cuestionados: 195,
  abstencion2022: '53%',
  cuestionadosSenado: 78
};
