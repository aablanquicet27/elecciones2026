import React from 'react';
import { Trophy, Swords, TrendingUp, BarChart4, Flag } from 'lucide-react';
import { calculateAverages, resultadoPrimeraVuelta, datosPrimeraVuelta, polymarket } from '../data/pollAverages';

const PrediccionVueltas: React.FC = () => {
	const averages = calculateAverages();
	const favorito = averages[0];
	const retador = averages[1];
	const ventaja = (favorito.promedio - retador.promedio).toFixed(1);
	const primero = resultadoPrimeraVuelta[0];
	const segundo = resultadoPrimeraVuelta[1];

	return (
		<div className="container mx-auto px-6 lg:px-12 py-20">
			<header className="text-center mb-16 max-w-4xl mx-auto">
				<div className="inline-flex items-center space-x-2 bg-orange-50 px-4 py-2 rounded-full border border-orange-100 mb-6">
					<span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
					<span className="text-sm font-medium text-orange-700">Segunda vuelta · domingo 21 de junio de 2026</span>
				</div>
				<h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
					¿Quién va a ganar la segunda vuelta?
				</h2>
				<p className="text-xl text-gray-600 leading-relaxed">
					Tras la primera vuelta del 31 de mayo, la Presidencia se define entre <strong>Abelardo de la Espriella</strong> e <strong>Iván Cepeda</strong>. El promedio de las encuestas de junio da ventaja a De la Espriella; los mercados de predicción también.
				</p>
			</header>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
				<article className="relative bg-gradient-to-br from-purple-50 to-white rounded-3xl p-10 border-2 border-purple-200 shadow-xl shadow-purple-500/10">
					<div className="absolute -top-4 left-10 bg-purple-600 text-white px-4 py-1.5 rounded-full text-sm font-bold tracking-wide">
						RESULTADO · 1ª VUELTA 31 MAY
					</div>

					<div className="flex items-center space-x-3 mb-6 mt-2">
						<Trophy className="h-8 w-8 text-purple-600" />
						<h3 className="text-3xl font-bold text-gray-900">Ganó De la Espriella</h3>
					</div>

					<p className="text-lg text-gray-700 leading-relaxed mb-6">
						<strong>{primero.candidato}</strong> quedó primero con
						<strong className="text-purple-600"> {primero.porcentaje}% </strong>
						({primero.votos.toLocaleString('es-CO')} votos), seguido por <strong>{segundo.candidato}</strong> con <strong>{segundo.porcentaje}%</strong>. Como nadie superó el 50%+1,
						<strong className="text-orange-600"> ambos pasan al balotaje del 21 de junio</strong>.
					</p>

					<div className="bg-white rounded-2xl p-6 border border-purple-100 mb-6">
						<div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Resultado oficial (Registraduría)</div>
						<div className="space-y-3">
							{resultadoPrimeraVuelta.slice(0, 4).map((r, i) => (
								<div key={r.candidato} className="flex items-center justify-between">
									<div className="flex items-center space-x-3">
										<span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${i === 0 ? 'bg-purple-600 text-white' : i === 1 ? 'bg-gray-300 text-gray-700' : 'bg-amber-200 text-amber-800'}`}>{i + 1}</span>
										<span className="font-semibold text-gray-900">{r.candidato}</span>
									</div>
									<span className={`text-xl font-bold ${i === 0 ? 'text-purple-600' : 'text-gray-700'}`}>{r.porcentaje}%</span>
								</div>
							))}
						</div>
					</div>

					<div className="flex items-start space-x-3 text-sm text-gray-600">
						<TrendingUp className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
						<p>{datosPrimeraVuelta.margen}. Participación del {datosPrimeraVuelta.participacion}% ({datosPrimeraVuelta.totalVotos.toLocaleString('es-CO')} votos).</p>
					</div>
				</article>

				<article className="relative bg-gradient-to-br from-orange-50 to-white rounded-3xl p-10 border-2 border-orange-200 shadow-xl shadow-orange-500/10">
					<div className="absolute -top-4 left-10 bg-orange-600 text-white px-4 py-1.5 rounded-full text-sm font-bold tracking-wide">
						PROYECCIÓN · 2ª VUELTA 21 JUN
					</div>

					<div className="flex items-center space-x-3 mb-6 mt-2">
						<Swords className="h-8 w-8 text-orange-600" />
						<h3 className="text-3xl font-bold text-gray-900">De la Espriella favorito</h3>
					</div>

					<p className="text-lg text-gray-700 leading-relaxed mb-6">
						El promedio de las encuestas de junio da a <strong>De la Espriella ~{favorito.promedio.toFixed(1)}%</strong> frente a <strong>Cepeda ~{retador.promedio.toFixed(1)}%</strong>, una ventaja de <strong className="text-orange-600">+{ventaja} puntos</strong>. CNC la mide más ajustada (+3,9).
					</p>

					<div className="space-y-4 mb-6">
						<div className="bg-white rounded-2xl p-5 border border-orange-100">
							<div className="flex items-center justify-between mb-2">
								<span className="font-bold text-gray-900">Promedio encuestas (junio)</span>
								<span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full font-semibold">CNC · Guarumo · AtlasIntel</span>
							</div>
							<div className="text-2xl font-bold text-orange-600">De la Espriella {favorito.promedio.toFixed(1)}% vs Cepeda {retador.promedio.toFixed(1)}%</div>
						</div>

						<div className="bg-white rounded-2xl p-5 border border-orange-100">
							<div className="flex items-center justify-between mb-2">
								<span className="font-bold text-gray-900">Mercados de predicción</span>
								<span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full font-semibold">Polymarket</span>
							</div>
							<div className="text-2xl font-bold text-orange-600">De la Espriella {polymarket.espriella}% · Cepeda {polymarket.cepeda}%</div>
							<p className="text-sm text-gray-600 mt-2">Probabilidad de ganar la Presidencia según apuestas reales ({polymarket.volumen} negociados).</p>
						</div>
					</div>

					<div className="flex items-start space-x-3 text-sm text-gray-700 bg-orange-100/50 rounded-xl p-4">
						<BarChart4 className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
						<p>
							<strong>Veredicto:</strong> todas las encuestas de junio y los mercados apuntan a De la Espriella. Cepeda apuesta a una remontada con la transferencia del voto de Fajardo y López y la movilización de la izquierda.
						</p>
					</div>
				</article>
			</div>

			<div className="mt-16 bg-gray-900 rounded-3xl p-10 lg:p-14 text-white">
				<div className="flex items-center space-x-3 mb-8">
					<Flag className="h-8 w-8 text-orange-400" />
					<h3 className="text-3xl font-bold">Camino al balotaje</h3>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div>
						<div className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-2">31 mayo 2026</div>
						<div className="text-lg font-bold mb-2">Primera vuelta</div>
						<p className="text-gray-400 text-sm">De la Espriella 43,75% y Cepeda 40,9% pasan al balotaje. Valencia (6,9%) y Fajardo (4,3%) quedan fuera. Petro cuestionó el preconteo.</p>
					</div>
					<div>
						<div className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-2">Junio 2026</div>
						<div className="text-lg font-bold mb-2">Encuestas de balotaje</div>
						<p className="text-gray-400 text-sm">AtlasIntel (52,2-44,5), Guarumo (52,6-45) y CNC (48,6-44,7) coinciden: De la Espriella adelante. Trump respaldó a De la Espriella.</p>
					</div>
					<div>
						<div className="text-sm font-semibold text-orange-400 uppercase tracking-wider mb-2">21 junio 2026</div>
						<div className="text-lg font-bold mb-2">Segunda vuelta</div>
						<p className="text-gray-400 text-sm">Los colombianos eligen presidente para 2026-2030. Posesión el 7 de agosto.</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PrediccionVueltas;
