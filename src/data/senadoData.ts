export type RiskLevel = 'low' | 'medium' | 'high';
export type Tendency = 'izquierda' | 'centro' | 'derecha' | 'centro-izquierda' | 'centro-derecha';
export type ListType = 'preferente' | 'no preferente';

export interface PartyData {
  id: string;
  tarjetonNumber: number;
  name: string;
  coalitionMembers?: string;
  listType: ListType;
  tendency: string;
  riskLevel: RiskLevel;
  description: string;
  cuestionados: string[];
}

export const senadoParties: PartyData[] = [
  {
    id: 'partido-de-la-u',
    tarjetonNumber: 1,
    name: 'Partido de la U',
    listType: 'preferente',
    tendency: 'centro-derecha',
    riskLevel: 'high',
    description: 'Partido tradicional que ha sido gobierno con múltiples presidentes. Fuerte estructura regional y clientelista.',
    cuestionados: [
      'José Alfredo Gnecco (compra de votos, clan familiar)',
      'Julio Elías Chagüi (escándalo UNGRD)',
      'Wilmer Carrillo (corrupción como secretario de Norte de Santander)',
      'Antonio Correa (exigencia de coimas)',
      'Jhony Besaile (hermano del condenado Musa Besaile, de los "Ñoños")'
    ]
  },
  {
    id: 'fuerza-ciudadana',
    tarjetonNumber: 2,
    name: 'Coalición Fuerza Ciudadana',
    coalitionMembers: 'Comunes + Fuerza Ciudadana',
    listType: 'preferente',
    tendency: 'izquierda',
    riskLevel: 'medium',
    description: 'Alianza entre el partido surgido del Acuerdo de Paz (ex-FARC) y el movimiento progresista del Magdalena.',
    cuestionados: [
      'Alexánder Angulo (señalado como enlace en escándalo UNGRD entre Sneyder Pinilla y Olmedo López)'
    ]
  },
  {
    id: 'centro-democratico',
    tarjetonNumber: 3,
    name: 'Centro Democrático',
    listType: 'preferente',
    tendency: 'derecha',
    riskLevel: 'medium',
    description: 'Principal partido de oposición (uribismo), buscando recuperar su influencia legislativa.',
    cuestionados: [
      'José Vicente Carreño (señalamientos de vínculos paramilitares)'
    ]
  },
  {
    id: 'pacto-historico',
    tarjetonNumber: 4,
    name: 'Pacto Histórico',
    coalitionMembers: 'Pacto Histórico + Colombia Humana',
    listType: 'preferente',
    tendency: 'izquierda',
    riskLevel: 'medium',
    description: 'Coalición del actual gobierno. Enfrenta el reto de mantener sus curules en medio del desgaste político.',
    cuestionados: [
      'Martha Peralta Epieyú (saltó a curul indígena; señalada como engranaje clave del escándalo UNGRD según la Fiscalía)'
    ]
  },
  {
    id: 'partido-conservador',
    tarjetonNumber: 5,
    name: 'Partido Conservador',
    listType: 'preferente',
    tendency: 'derecha',
    riskLevel: 'high',
    description: 'Fuerza política histórica. Mantiene sólidas bases en las regiones pese a severos cuestionamientos de corrupción.',
    cuestionados: [
      'Wadith Manzur (salpicado en el escándalo UNGRD)',
      'David Barguil (proceso por tráfico de influencias)',
      'Miguel Ángel Barreto (escándalo Ocad-Paz)',
      'Daniel Restrepo (heredero político del polémico clan de Carlos Trujillo)'
    ]
  },
  {
    id: 'verde-oxigeno',
    tarjetonNumber: 6,
    name: 'Partido Verde Oxígeno',
    listType: 'preferente',
    tendency: 'centro',
    riskLevel: 'low',
    description: 'Partido liderado por Íngrid Betancourt. Busca consolidarse como alternativa de centro independiente.',
    cuestionados: []
  },
  {
    id: 'gsc-patriotas',
    tarjetonNumber: 7,
    name: 'GSC Patriotas',
    listType: 'no preferente',
    tendency: 'derecha',
    riskLevel: 'low',
    description: 'Grupo Significativo de Ciudadanos. Lista cerrada, las curules se asignan en el orden inscrito.',
    cuestionados: []
  },
  {
    id: 'con-toda-por-colombia',
    tarjetonNumber: 8,
    name: 'GSC Con Toda Por Colombia',
    listType: 'no preferente',
    tendency: 'centro',
    riskLevel: 'low',
    description: 'Grupo Significativo de Ciudadanos con un enfoque más independiente y técnico.',
    cuestionados: []
  },
  {
    id: 'cambio-radical-alma',
    tarjetonNumber: 9,
    name: 'Coalición Cambio Radical – ALMA',
    coalitionMembers: 'Cambio Radical + Colombia Justa Libres + ADA + Liga de Gobernantes Anticorrupción',
    listType: 'preferente',
    tendency: 'centro-derecha',
    riskLevel: 'medium',
    description: 'Alianza entre Cambio Radical y otros sectores buscando consolidar mayorías legislativas de oposición.',
    cuestionados: [
      'César Lorduy (caso de homicidio en 1979 y denuncias en su contra en el CNE)',
      'Didier Lobo (investigación por enriquecimiento ilícito)',
      'Édgar Díaz Contreras (investigación por enriquecimiento ilícito)'
    ]
  },
  {
    id: 'alianza-por-colombia',
    tarjetonNumber: 10,
    name: 'Alianza por Colombia',
    coalitionMembers: 'Alianza Verde + En Marcha + ASI + Colombia Renaciente + Demócrata',
    listType: 'preferente',
    tendency: 'centro-izquierda',
    riskLevel: 'medium',
    description: 'Gran coalición de centro y centro-izquierda buscando consolidarse como bloque moderado en el Congreso.',
    cuestionados: [
      'Berenice Bedoya (salpicada en escándalo UNGRD)',
      'Jairo Alberto Castellanos (salpicado en escándalo UNGRD)',
      'Néstor Daniel García (escándalo "Papá Pitufo")'
    ]
  },
  {
    id: 'creemos-colombia',
    tarjetonNumber: 11,
    name: 'Creemos Colombia',
    listType: 'preferente',
    tendency: 'centro-derecha',
    riskLevel: 'low',
    description: 'Movimiento político originado en Antioquia con miras a la expansión nacional.',
    cuestionados: []
  },
  {
    id: 'salvacion-nacional',
    tarjetonNumber: 12,
    name: 'Movimiento Salvación Nacional',
    listType: 'preferente',
    tendency: 'derecha',
    riskLevel: 'low',
    description: 'Partido de derecha conservadora, liderado por Enrique Gómez.',
    cuestionados: []
  },
  {
    id: 'colombia-segura',
    tarjetonNumber: 13,
    name: 'Colombia Segura y Prospera',
    listType: 'no preferente',
    tendency: 'centro-derecha',
    riskLevel: 'low',
    description: 'Grupo Significativo de Ciudadanos enfocado en políticas de seguridad ciudadana.',
    cuestionados: []
  },
  {
    id: 'ahora-colombia',
    tarjetonNumber: 14,
    name: 'Coalición ¡Ahora Colombia!',
    coalitionMembers: 'MIRA + Nuevo Liberalismo + Dignidad y Compromiso',
    listType: 'preferente',
    tendency: 'centro',
    riskLevel: 'low',
    description: 'Alianza de centro que une fuerzas tradicionales e independientes para maximizar su representación.',
    cuestionados: []
  },
  {
    id: 'frente-amplio-unitario',
    tarjetonNumber: 15,
    name: 'Frente Amplio Unitario',
    listType: 'preferente',
    tendency: 'izquierda',
    riskLevel: 'high',
    description: 'Lista armada bajo la influencia de Roy Barreras. Agrupa diversos sectores pero cuenta con altos cuestionamientos.',
    cuestionados: [
      'Roy Barreras (arquitecto de la lista, fuertes críticas por alianzas clientelares)',
      'Milena Flórez (esposa de Musa Besaile, condenado por corrupción)',
      'Édgar "Pote" Gómez (cuestionado por redes clientelistas)',
      'Máximo Noriega (salpicado en el escándalo de Nicolás Petro)',
      'Gorky Muñoz (con sanciones de la Procuraduría)',
      'Jorge "Davo" Pastrana (reconocido aliado de los condenados "Ñoños")'
    ]
  },
  {
    id: 'partido-liberal',
    tarjetonNumber: 16,
    name: 'Partido Liberal',
    listType: 'preferente',
    tendency: 'centro',
    riskLevel: 'medium',
    description: 'Partido histórico con fuerte maquinaria regional pero desgastado por múltiples escándalos recientes.',
    cuestionados: [
      'Richard Aguilar (juicio por corrupción durante su etapa como gobernador)',
      'Andrés Calle (vinculado al escándalo de la UNGRD)',
      'Yesid Pulgar (hermano de Eduardo Pulgar, condenado por sobornar a un juez)',
      'Camilo Torres (sobrino de un cuestionado megacontratista)'
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
