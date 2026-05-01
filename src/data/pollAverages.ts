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

// === ENCUESTAS PRE-CONSULTAS (Febrero 2026) — Histórico ===
export const encuestasHistorico: PollData[] = [
	{
		encuestadora: 'Invamer',
		fecha: '11-22 Feb 2026',
		muestra: 2375,
		margenError: '±2.26%',
		url: 'https://www.infobae.com/colombia/2026/02/26/estos-son-los-candidatos-que-lideran-intencion-de-voto-en-consultas-interpartidistas-segun-nueva-encuesta-invamer/',
		resultados: {
			'Iván Cepeda': 37.1,
			'Abelardo de la Espriella': 18.9,
			'Claudia López': 11.7,
			'Paloma Valencia': 10.0,
			'Sergio Fajardo': 6.6,
			'Vicky Dávila': 0,
			'Juan Daniel Oviedo': 0.9,
			'Roy Barreras': 1.8,
		}
	},
	{
		encuestadora: 'AtlasIntel',
		fecha: '19-25 Feb 2026',
		muestra: 6468,
		margenError: '±1.0%',
		url: 'https://www.infobae.com/colombia/2026/02/28/encuesta-de-atlasintel-revelo-una-baja-intencion-de-voto-para-la-consulta-del-8-de-marzo-ivan-cepeda-y-abelardo-de-la-espriella-puntean-sin-participar/',
		resultados: {
			'Iván Cepeda': 34.0,
			'Abelardo de la Espriella': 31.9,
			'Claudia López': 1.8,
			'Paloma Valencia': 4.3,
			'Sergio Fajardo': 6.3,
			'Vicky Dávila': 1.9,
			'Juan Daniel Oviedo': 0.6,
			'Roy Barreras': 1.5,
		}
	},
	{
		encuestadora: 'Guarumo/EcoAnalítica',
		fecha: '19-25 Feb 2026',
		muestra: 3867,
		margenError: '±2.0%',
		url: 'https://cambiocolombia.com/elecciones-colombia-2026/articulo/2026/2/elecciones-presidenciales-2026-asi-han-sido-los-resultados-de-las-encuestas-mas-recientes/',
		resultados: {
			'Iván Cepeda': 31.7,
			'Abelardo de la Espriella': 22.6,
			'Claudia López': 5.0,
			'Paloma Valencia': 10.0,
			'Sergio Fajardo': 3.6,
			'Vicky Dávila': 2.7,
			'Juan Daniel Oviedo': 1.0,
			'Roy Barreras': 1.1,
		}
	},
	{
		encuestadora: 'GAD3',
		fecha: '16-23 Feb 2026',
		muestra: 2108,
		margenError: '±2.5%',
		url: 'https://es.wikipedia.org/wiki/Anexo:Sondeos_de_intenci%C3%B3n_de_voto_para_las_elecciones_presidenciales_de_Colombia_de_2026',
		resultados: {
			'Iván Cepeda': 34.0,
			'Abelardo de la Espriella': 26.0,
			'Claudia López': 3.0,
			'Paloma Valencia': 4.0,
			'Sergio Fajardo': 2.0,
			'Vicky Dávila': 2.0,
			'Juan Daniel Oviedo': 0.2,
			'Roy Barreras': 1.0,
		}
	}
];

// === ENCUESTAS POST-CONSULTAS (Marzo–Mayo 2026) — Datos actuales ===
export const encuestasRecientes: PollData[] = [
	{
		encuestadora: 'Invamer/Caracol',
		fecha: '20-25 Abr 2026',
		muestra: 2400,
		margenError: '±2.5%',
		url: 'https://thecitypaperbogota.com/news/colombia-elections-cepeda-leads-valencia-doubles-in-race-down-to-three/',
		resultados: {
			'Iván Cepeda': 44.3,
			'Abelardo de la Espriella': 17.5,
			'Paloma Valencia': 16.0,
			'Claudia López': 3.0,
			'Sergio Fajardo': 4.0,
			'Santiago Botero': 1.0,
			'Miguel Uribe Londoño': 0.8,
			'Roy Barreras': 0.5,
		}
	},
	{
		encuestadora: 'AtlasIntel/Semana',
		fecha: '24-29 Abr 2026',
		muestra: 3616,
		margenError: '±2.0%',
		url: 'https://www.atlasintel.org/poll/colombia-national-revista-semana-2026-04-30',
		resultados: {
			'Iván Cepeda': 38.0,
			'Abelardo de la Espriella': 29.9,
			'Paloma Valencia': 21.2,
			'Sergio Fajardo': 5.1,
			'Claudia López': 2.0,
			'Santiago Botero': 1.0,
			'Miguel Uribe Londoño': 0.8,
			'Roy Barreras': 0.5,
		}
	},
	{
		encuestadora: 'Guarumo/EcoAnalítica',
		fecha: '22-28 Abr 2026',
		muestra: 3867,
		margenError: '±2.0%',
		url: 'https://www.eltiempo.com/politica/elecciones-colombia-2026/encuesta-de-guarumo-abril-2026-cepeda-38-de-la-espriella-23-9-y-paloma-22-8-en-segunda-valencia-derrota-a-cepeda-y-abelardo-lo-empata-3552136',
		resultados: {
			'Iván Cepeda': 38.0,
			'Abelardo de la Espriella': 23.9,
			'Paloma Valencia': 22.8,
			'Sergio Fajardo': 4.5,
			'Claudia López': 2.5,
			'Santiago Botero': 1.2,
			'Miguel Uribe Londoño': 1.0,
			'Roy Barreras': 0.5,
		}
	},
	{
		encuestadora: 'GAD3/RCN',
		fecha: '20-27 Abr 2026',
		muestra: 1500,
		margenError: '±2.8%',
		url: 'https://www.lasillavacia.com/en-vivo/encuesta-gad3-cepeda-sube-abelardo-se-mantiene-y-paloma-cae/',
		resultados: {
			'Iván Cepeda': 36.0,
			'Abelardo de la Espriella': 21.0,
			'Paloma Valencia': 13.0,
			'Sergio Fajardo': 3.5,
			'Claudia López': 2.5,
			'Santiago Botero': 1.0,
			'Miguel Uribe Londoño': 0.8,
			'Roy Barreras': 0.5,
		}
	}
];

// Function to calculate averages from current polls (ignora ceros para evitar diluir promedios)
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
			'Iván Cepeda': 'Pacto Histórico',
			'Paloma Valencia': 'Centro Democrático (Gran Consulta por Colombia)',
			'Abelardo de la Espriella': 'Defensores de la Patria',
			'Claudia López': 'Consulta por Soluciones',
			'Sergio Fajardo': 'Dignidad y Compromiso',
			'Santiago Botero': 'Independiente',
			'Miguel Uribe Londoño': 'Centro Democrático',
			'Roy Barreras': 'Frente Amplio Unitario',
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

// === ESCENARIOS SEGUNDA VUELTA — Múltiples encuestadoras Mar-Abr 2026 ===
export const escenariosSegundaVuelta = [
	// AtlasIntel/Semana — Abril 30, 2026
	{ candidato1: 'Paloma Valencia', porcentaje1: 49, candidato2: 'Iván Cepeda', porcentaje2: 41, nota: 'AtlasIntel Abr 30 — Valencia gana (MOE ±2%)' },
	{ candidato1: 'Abelardo de la Espriella', porcentaje1: 48, candidato2: 'Iván Cepeda', porcentaje2: 42, nota: 'AtlasIntel Abr 30 — De la Espriella gana (MOE ±2%)' },
	// GAD3/RCN — Abril 2026
	{ candidato1: 'Iván Cepeda', porcentaje1: 44, candidato2: 'Paloma Valencia', porcentaje2: 37, nota: 'GAD3 Abr — Cepeda gana' },
	{ candidato1: 'Iván Cepeda', porcentaje1: 46, candidato2: 'Abelardo de la Espriella', porcentaje2: 35, nota: 'GAD3 Abr — Cepeda gana' },
	// Guarumo — Abril 2026
	{ candidato1: 'Paloma Valencia', porcentaje1: 45, candidato2: 'Iván Cepeda', porcentaje2: 42, nota: 'Guarumo Abr — Valencia derrota a Cepeda' },
	{ candidato1: 'Abelardo de la Espriella', porcentaje1: 43, candidato2: 'Iván Cepeda', porcentaje2: 43, nota: 'Guarumo Abr — Empate técnico' },
	// CNC/Cambio — Marzo 2026
	{ candidato1: 'Iván Cepeda', porcentaje1: 43.3, candidato2: 'Paloma Valencia', porcentaje2: 42.9, nota: 'CNC Mar — Empate técnico' },
	{ candidato1: 'Iván Cepeda', porcentaje1: 48.1, candidato2: 'Abelardo de la Espriella', porcentaje2: 35.5, nota: 'CNC Mar — Cepeda gana' },
];

// === FÓRMULAS VICEPRESIDENCIALES ===
export const formulasVicepresidenciales = {
	'Iván Cepeda': 'Aida Quilcué',
	'Paloma Valencia': 'Juan Daniel Oviedo',
	'Abelardo de la Espriella': 'José Manuel Restrepo',
};
