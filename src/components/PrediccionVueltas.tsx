import React from 'react';
import { Trophy, Swords, AlertTriangle, Calendar, TrendingUp } from 'lucide-react';
import { calculateAverages } from '../data/pollAverages';

const PrediccionVueltas: React.FC = () => {
	const averages = calculateAverages();
	const lider = averages[0];
	const segundo = averages[1];
	const tercero = averages[2];

	return (
		<div className="container mx-auto px-6 lg:px-12 py-20">
			<header className="text-center mb-16 max-w-4xl mx-auto">
				<div className="inline-flex items-center space-x-2 bg-red-50 px-4 py-2 rounded-full border border-red-100 mb-6">
					<span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
					<span className="text-sm font-medium text-red-700">Predicción a 30 días — Actualizado 1 May 2026</span>
				</div>
				<h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
					¿Quién va a ganar?
				</h2>
				<p className="text-xl text-gray-600 leading-relaxed">
					Basado en el promedio de Invamer, AtlasIntel/Semana, Guarumo y GAD3 (abril 2026). En Colombia se necesita
					<strong> 50% + 1 voto </strong>
					para ganar en primera vuelta. Hoy ningún candidato está cerca de ese umbral.
				</p>
			</header>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
				{/* PRIMERA VUELTA */}
				<article className="relative bg-gradient-to-br from-purple-50 to-white rounded-3xl p-10 border-2 border-purple-200 shadow-xl shadow-purple-500/10">
					<div className="absolute -top-4 left-10 bg-purple-600 text-white px-4 py-1.5 rounded-full text-sm font-bold tracking-wide">
						1ª VUELTA · 31 MAYO
					</div>

					<div className="flex items-center space-x-3 mb-6 mt-2">
						<Trophy className="h-8 w-8 text-purple-600" />
						<h3 className="text-3xl font-bold text-gray-900">Gana {lider.candidato}</h3>
					</div>

					<p className="text-lg text-gray-700 leading-relaxed mb-6">
						<strong>{lider.candidato}</strong> queda primero con aproximadamente
						<strong className="text-purple-600"> {lider.promedio.toFixed(1)}% </strong>
						del voto. <strong>No alcanza el 50%+1</strong> que exige la Constitución, así que
						<strong className="text-red-600"> habrá segunda vuelta el 21 de junio</strong>.
					</p>

					<div className="bg-white rounded-2xl p-6 border border-purple-100 mb-6">
						<div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Top 3 promedio Abr 2026</div>
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-3">
									<span className="w-7 h-7 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
									<span className="font-semibold text-gray-900">{lider.candidato}</span>
								</div>
								<span className="text-2xl font-bold text-purple-600">{lider.promedio.toFixed(1)}%</span>
							</div>
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-3">
									<span className="w-7 h-7 bg-gray-300 text-gray-700 rounded-full flex items-center justify-center text-sm font-bold">2</span>
									<span className="font-semibold text-gray-900">{segundo.candidato}</span>
								</div>
								<span className="text-xl font-bold text-gray-700">{segundo.promedio.toFixed(1)}%</span>
							</div>
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-3">
									<span className="w-7 h-7 bg-amber-200 text-amber-800 rounded-full flex items-center justify-center text-sm font-bold">3</span>
									<span className="font-semibold text-gray-900">{tercero.candidato}</span>
								</div>
								<span className="text-xl font-bold text-gray-700">{tercero.promedio.toFixed(1)}%</span>
							</div>
						</div>
					</div>

					<div className="flex items-start space-x-3 text-sm text-gray-600">
						<TrendingUp className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
						<p>
							Cepeda subió de 35% (mar) a 39% promedio (abr). El crecimiento se acelera entre jóvenes 20-30 y se mantiene en Caribe, Pacífico y Bogotá.
						</p>
					</div>
				</article>

				{/* SEGUNDA VUELTA */}
				<article className="relative bg-gradient-to-br from-orange-50 to-white rounded-3xl p-10 border-2 border-orange-200 shadow-xl shadow-orange-500/10">
					<div className="absolute -top-4 left-10 bg-orange-600 text-white px-4 py-1.5 rounded-full text-sm font-bold tracking-wide">
						2ª VUELTA · 21 JUNIO
					</div>

					<div className="flex items-center space-x-3 mb-6 mt-2">
						<Swords className="h-8 w-8 text-orange-600" />
						<h3 className="text-3xl font-bold text-gray-900">Escenario abierto</h3>
					</div>

					<p className="text-lg text-gray-700 leading-relaxed mb-6">
						La segunda vuelta es <strong>abierta y se decide por quién pase de segundo</strong>. Hay dos lecturas que conviven:
					</p>

					<div className="space-y-4 mb-6">
						<div className="bg-white rounded-2xl p-5 border border-orange-100">
							<div className="flex items-center justify-between mb-2">
								<span className="font-bold text-gray-900">Si pasa Valencia</span>
								<span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full font-semibold">Atlas / Guarumo</span>
							</div>
							<div className="text-2xl font-bold text-orange-600">Valencia 47-49% vs Cepeda 41-42%</div>
							<p className="text-sm text-gray-600 mt-2">Valencia derrota a Cepeda según AtlasIntel y Guarumo. GAD3 da el escenario contrario (Cepeda 44-37).</p>
						</div>

						<div className="bg-white rounded-2xl p-5 border border-orange-100">
							<div className="flex items-center justify-between mb-2">
								<span className="font-bold text-gray-900">Si pasa De la Espriella</span>
								<span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full font-semibold">Atlas / Guarumo</span>
							</div>
							<div className="text-2xl font-bold text-orange-600">Espriella 48% vs Cepeda 42%</div>
							<p className="text-sm text-gray-600 mt-2">De la Espriella gana ajustado en Atlas. Empata en Guarumo. GAD3 da Cepeda 46-35.</p>
						</div>
					</div>

					<div className="flex items-start space-x-3 text-sm text-gray-700 bg-orange-100/50 rounded-xl p-4">
						<AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
						<p>
							<strong>Veredicto:</strong> 2 de 4 encuestadoras (Atlas, Guarumo) muestran que <strong>la derecha unida derrota a Cepeda</strong>. Las otras 2 (Invamer, GAD3) sostienen a Cepeda. La elección se decide por <strong>quién pase de segundo el 31 de mayo</strong>.
						</p>
					</div>
				</article>
			</div>

			{/* Lo que ha terminado pasando */}
			<div className="mt-16 bg-gray-900 rounded-3xl p-10 lg:p-14 text-white">
				<div className="flex items-center space-x-3 mb-8">
					<Calendar className="h-8 w-8 text-purple-400" />
					<h3 className="text-3xl font-bold">Lo que ha terminado pasando</h3>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div>
						<div className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-2">8 marzo 2026</div>
						<div className="text-lg font-bold mb-2">Consultas interpartidistas</div>
						<p className="text-gray-400 text-sm">Valencia arrasa la Gran Consulta con 3M+ votos. López gana centro. Barreras gana izquierda alternativa. Tres nuevos candidatos oficiales.</p>
					</div>
					<div>
						<div className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-2">15-18 marzo 2026</div>
						<div className="text-lg font-bold mb-2">Definición de fórmulas vice</div>
						<p className="text-gray-400 text-sm">Cepeda-Quilcué (voto social/indígena), Valencia-Oviedo (centro/tecnocracia), De la Espriella-Restrepo (moderación económica).</p>
					</div>
					<div>
						<div className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-2">15 abril 2026</div>
						<div className="text-lg font-bold mb-2">Tarjetón cerrado</div>
						<p className="text-gray-400 text-sm">Registraduría confirma 9 candidatos en tarjetón final. Cepeda, Valencia y De la Espriella encabezan según orden de inscripción.</p>
					</div>
					<div>
						<div className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-2">24 abril 2026</div>
						<div className="text-lg font-bold mb-2">Debate Caracol-RCN</div>
						<p className="text-gray-400 text-sm">Cruce tenso entre Cepeda, Valencia y De la Espriella sobre seguridad y economía. Fajardo y López intentan recuperar centro.</p>
					</div>
					<div>
						<div className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-2">26-30 abril 2026</div>
						<div className="text-lg font-bold mb-2">Encuestas reordenan el tablero</div>
						<p className="text-gray-400 text-sm">Invamer da 44.3% a Cepeda. Atlas y Guarumo confirman que la derecha (Valencia o Espriella) puede ganar 2da vuelta.</p>
					</div>
					<div>
						<div className="text-sm font-semibold text-yellow-400 uppercase tracking-wider mb-2">25 mayo 2026</div>
						<div className="text-lg font-bold mb-2">Inicia veda · Próximamente</div>
						<p className="text-gray-400 text-sm">Última semana antes de primera vuelta. No se pueden publicar más encuestas. Solo tracking interno de campañas.</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PrediccionVueltas;
