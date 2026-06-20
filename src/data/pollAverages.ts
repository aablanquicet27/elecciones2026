export interface PollData {
	encuestadora: string;
	fecha: string;
	muestra: number;
	margenError: string;
	url: string;
	resultados: Record<string, number>;
}

export interface CandidateAverage {
	candidato: string;
	partido: string;
	promedio: number;
	encuestas: { encuestadora: string; porcentaje: number }[];
	tendencia: 'up' | 'down' | 'stable';
}

export interface ResultadoCandidato {
	candidato: string;
	partido: string;
	votos: number;
	porcentaje: number;
}

// === RESULTADO OFICIAL PRIMERA VUELTA - 31 de mayo de 2026 (Registraduria Nacional) ===
export const resultadoPrimeraVuelta: ResultadoCandidato[] = [
	{ candidato: 'Abelardo de la Espriella', partido: 'Defensores de la Patria', votos: 10361499, porcentaje: 43.75 },
	{ candidato: 'Iván Cepeda', partido: 'Pacto Histórico', votos: 9688361, porcentaje: 40.90 },
	{ candidato: 'Paloma Valencia', partido: 'Centro Democrático', votos: 1639685, porcentaje: 6.92 },
	{ candidato: 'Sergio Fajardo', partido: 'Dignidad y Compromiso', votos: 1009073, porcentaje: 4.26 },
	{ candidato: 'Claudia López', partido: 'Imparables con Claudia', votos: 225517, porcentaje: 0.95 },
	{ candidato: 'Santiago Botero', partido: 'Independiente', votos: 206140, porcentaje: 0.87 },
	{ candidato: 'Mauricio Lizcano', partido: 'Independiente', votos: 53839, porcentaje: 0.23 },
	{ candidato: 'Miguel Uribe Londoño', partido: 'Centro Democrático', votos: 28657, porcentaje: 0.12 },
	{ candidato: 'Sondra Macollins', partido: 'Independiente', votos: 19889, porcentaje: 0.08 },
	{ candidato: 'Roy Barreras', partido: 'La Fuerza', votos: 14108, porcentaje: 0.06 },
	{ candidato: 'Luis Gilberto Murillo', partido: 'Independiente', votos: 13270, porcentaje: 0.06 },
	{ candidato: 'Carlos Caicedo', partido: 'Fuerza Ciudadana', votos: 12694, porcentaje: 0.05 },
	{ candidato: 'Gustavo Matamoros', partido: 'Partido Ecologista', votos: 5627, porcentaje: 0.02 },
];

export const datosPrimeraVuelta = {
	fecha: '31 de mayo de 2026',
	participacion: 57.89,
	votosValidos: 23685329,
	votoBlanco: 406970,
	votoBlancoPct: 1.72,
	votosNulos: 292975,
	totalVotos: 23978304,
	censo: 41421973,
	margen: 'De la Espriella superó a Cepeda por 2,84 puntos (~673.000 votos)',
};

// === ENCUESTAS DE SEGUNDA VUELTA - previas (mayo y comienzos de junio) ===
export const encuestasHistorico: PollData[] = [
	{
		encuestadora: 'AtlasIntel/Semana',
		fecha: '1-2 Jun 2026',
		muestra: 4500,
		margenError: '±2.0%',
		url: 'https://www.lasillavacia.com/en-vivo/atlas-intel-abelardo-se-impondria-por-7-puntos-en-segunda-vuelta/',
		resultados: { 'Abelardo de la Espriella': 52.51, 'Iván Cepeda': 44.47 }
	},
	{
		encuestadora: 'CNC',
		fecha: '15-22 May 2026',
		muestra: 2200,
		margenError: '±2.9%',
		url: 'https://www.valoraanalitik.com/encuesta-cnc-de-la-espriella-crece-con-fuerza-en-intencion-de-voto-y-le-ganaria-a-cepeda-en-segunda-vuelta/',
		resultados: { 'Abelardo de la Espriella': 43.6, 'Iván Cepeda': 40.9 }
	},
	{
		encuestadora: 'AtlasIntel/Semana',
		fecha: '18-21 May 2026',
		muestra: 5000,
		margenError: '±2.0%',
		url: 'https://atlasintel.org/',
		resultados: { 'Abelardo de la Espriella': 50.0, 'Iván Cepeda': 41.3 }
	},
	{
		encuestadora: 'Invamer',
		fecha: '13-20 May 2026',
		muestra: 2224,
		margenError: '±2.44%',
		url: 'https://www.valoraanalitik.com/wp-content/uploads/2026/05/1041912475-Invamer-Colombia-Opina-mayo-2026.pdf',
		resultados: { 'Abelardo de la Espriella': 45.3, 'Iván Cepeda': 52.4 }
	},
	{
		encuestadora: 'Fundación Génesis Crea',
		fecha: '4-11 May 2026',
		muestra: 2000,
		margenError: '±2.5%',
		url: 'https://es.wikipedia.org/wiki/Elecciones_presidenciales_de_Colombia_de_2026',
		resultados: { 'Abelardo de la Espriella': 41.4, 'Iván Cepeda': 46.5 }
	}
];

// === ENCUESTAS DE SEGUNDA VUELTA - mas recientes (junio 2026, post primera vuelta) ===
export const encuestasRecientes: PollData[] = [
	{
		encuestadora: 'CNC',
		fecha: '6-13 Jun 2026',
		muestra: 2200,
		margenError: '±2.9%',
		url: 'https://www.valoraanalitik.com/encuesta-cnc-de-la-espriella-crece-con-fuerza-en-intencion-de-voto-y-le-ganaria-a-cepeda-en-segunda-vuelta/',
		resultados: { 'Abelardo de la Espriella': 48.6, 'Iván Cepeda': 44.7 }
	},
	{
		encuestadora: 'Guarumo/EcoAnalítica',
		fecha: '8-11 Jun 2026',
		muestra: 3736,
		margenError: '±2.0%',
		url: 'https://pluralidadz.com/politica/encuesta-guarumo-junio-2026-de-la-espriella-sube-a-526-y-cepeda-queda-en-45-para-segunda-vuelta/',
		resultados: { 'Abelardo de la Espriella': 52.6, 'Iván Cepeda': 45.0 }
	},
	{
		encuestadora: 'AtlasIntel/Semana',
		fecha: '5-10 Jun 2026',
		muestra: 5500,
		margenError: '±2.0%',
		url: 'https://www.eltiempo.com/politica/elecciones-colombia-2026/encuesta-atlas-intel-abelardo-de-la-espriella-52-2-ivan-cepeda-44-5-para-la-segunda-vuelta-del-21-de-junio-3563538',
		resultados: { 'Abelardo de la Espriella': 52.2, 'Iván Cepeda': 44.5 }
	}
];

// Promedio de las encuestas recientes (ignora ceros)
export function calculateAverages(): CandidateAverage[] {
	const candidates = Object.keys(encuestasRecientes[0].resultados);

	return candidates.map(candidato => {
		const encuestas = encuestasRecientes.map(e => ({
			encuestadora: e.encuestadora,
			porcentaje: e.resultados[candidato] || 0
		}));

		const validEncuestas = encuestas.filter(e => e.porcentaje > 0);
		const promedio = validEncuestas.length > 0
			? validEncuestas.reduce((sum, e) => sum + e.porcentaje, 0) / validEncuestas.length
			: 0;

		const partidos: Record<string, string> = {
			'Abelardo de la Espriella': 'Defensores de la Patria',
			'Iván Cepeda': 'Pacto Histórico',
		};

		const historicoAvg = encuestasHistorico.reduce((sum, e) => sum + (e.resultados[candidato] || 0), 0) / encuestasHistorico.length;
		let tendencia: 'up' | 'down' | 'stable' = 'stable';
		if (promedio > historicoAvg + 2) tendencia = 'up';
		else if (promedio < historicoAvg - 2) tendencia = 'down';

		return {
			candidato,
			partido: partidos[candidato] || '',
			promedio: Math.round(promedio * 10) / 10,
			encuestas,
			tendencia
		};
	}).sort((a, b) => b.promedio - a.promedio);
}

// === PROYECCION DE MERCADOS - Polymarket (19 jun 2026) ===
export const polymarket = {
	espriella: 89,
	cepeda: 11,
	volumen: 'US$38M+',
	actualizado: '19 Jun 2026',
	url: 'https://polymarket.com/event/colombia-presidential-election',
};

// === ESCENARIOS DE SEGUNDA VUELTA (encuestas de junio) ===
export const escenariosSegundaVuelta = [
	{ candidato1: 'Abelardo de la Espriella', porcentaje1: 51.1, candidato2: 'Iván Cepeda', porcentaje2: 44.7, nota: 'Promedio encuestas de junio (CNC, Guarumo, AtlasIntel) — De la Espriella +6.4' },
	{ candidato1: 'Abelardo de la Espriella', porcentaje1: 52.2, candidato2: 'Iván Cepeda', porcentaje2: 44.5, nota: 'AtlasIntel/Semana 5-10 jun — De la Espriella +7.7' },
	{ candidato1: 'Abelardo de la Espriella', porcentaje1: 52.6, candidato2: 'Iván Cepeda', porcentaje2: 45.0, nota: 'Guarumo/EcoAnalítica 8-11 jun — De la Espriella +7.6' },
	{ candidato1: 'Abelardo de la Espriella', porcentaje1: 48.6, candidato2: 'Iván Cepeda', porcentaje2: 44.7, nota: 'CNC 6-13 jun — De la Espriella +3.9 (la más ajustada)' },
];

// === FORMULAS VICEPRESIDENCIALES (finalistas) ===
export const formulasVicepresidenciales = {
	'Abelardo de la Espriella': 'José Manuel Restrepo',
	'Iván Cepeda': 'Aida Quilcué',
};
