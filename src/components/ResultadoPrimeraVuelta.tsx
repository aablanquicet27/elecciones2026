import React from 'react';
import { Flag, Users, FileX2, BarChart3 } from 'lucide-react';
import { resultadoPrimeraVuelta, datosPrimeraVuelta } from '../data/pollAverages';

const ResultadoPrimeraVuelta: React.FC = () => {
	const top = resultadoPrimeraVuelta.slice(0, 8);
	const maxPct = resultadoPrimeraVuelta[0].porcentaje;

	const stats = [
		{ icon: Users, value: `${datosPrimeraVuelta.participacion}%`, label: 'Participación', sub: `${datosPrimeraVuelta.totalVotos.toLocaleString('es-CO')} votos` },
		{ icon: BarChart3, value: '+2,84', label: 'Ventaja De la Espriella', sub: '~673.000 votos' },
		{ icon: FileX2, value: `${datosPrimeraVuelta.votoBlancoPct}%`, label: 'Voto en blanco', sub: datosPrimeraVuelta.votoBlanco.toLocaleString('es-CO') },
		{ icon: Flag, value: '13', label: 'Candidatos', sub: 'Ninguno llegó al 50%+1' },
	];

	return (
		<div className="container mx-auto px-6 lg:px-12 py-10">
			<header className="text-center mb-12 max-w-3xl mx-auto">
				<div className="inline-flex items-center space-x-2 bg-purple-50 px-4 py-2 rounded-full border border-purple-100 mb-6">
					<Flag className="h-4 w-4 text-purple-600" />
					<span className="text-sm font-medium text-purple-700">Resultado oficial · Primera vuelta 31 de mayo de 2026</span>
				</div>
				<h2 className="text-gray-900 mb-4">Así votó Colombia en la primera vuelta</h2>
				<p className="text-large">De la Espriella encabezó con 43,75% y Cepeda con 40,9%. Ninguno alcanzó el 50%+1, así que se enfrentan en el balotaje del 21 de junio.</p>
			</header>

			<div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
				{stats.map((s) => (
					<div key={s.label} className="text-center bg-white rounded-2xl p-6 border border-purple-100 shadow-sm">
						<div className="inline-flex p-3 rounded-xl bg-purple-50 mb-3"><s.icon className="h-6 w-6 text-purple-600" /></div>
						<div className="text-3xl font-bold text-gray-900">{s.value}</div>
						<div className="text-sm font-medium text-gray-600">{s.label}</div>
						<div className="text-xs text-gray-400 mt-1">{s.sub}</div>
					</div>
				))}
			</div>

			<div className="bg-white rounded-[2rem] p-8 lg:p-12 border border-gray-100 shadow-lg shadow-purple-500/5">
				<div className="space-y-5">
					{top.map((r, i) => (
						<div key={r.candidato}>
							<div className="flex items-center justify-between mb-2">
								<div className="flex items-center space-x-3">
									<span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${i === 0 ? 'bg-purple-600 text-white' : i === 1 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}>{i + 1}</span>
									<div>
										<span className="font-semibold text-gray-900">{r.candidato}</span>
										<span className="text-sm text-gray-400 ml-2">{r.partido}</span>
									</div>
								</div>
								<div className="text-right">
									<span className="text-xl font-bold text-gray-900">{r.porcentaje}%</span>
									<span className="text-xs text-gray-400 block">{r.votos.toLocaleString('es-CO')}</span>
								</div>
							</div>
							<div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
								<div className="h-full rounded-full" style={{ width: `${(r.porcentaje / maxPct) * 100}%`, backgroundColor: i === 0 ? '#9333ea' : i === 1 ? '#f97316' : '#cbd5e1' }}></div>
							</div>
						</div>
					))}
				</div>
				<p className="text-sm text-gray-400 mt-8 text-center">Fuente: Registraduría Nacional del Estado Civil — escrutinio del 31 de mayo de 2026.</p>
			</div>
		</div>
	);
};

export default ResultadoPrimeraVuelta;
