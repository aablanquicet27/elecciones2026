import React from 'react';
import { Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const TimelineSection: React.FC = () => {
	const timelineEvents = [
		{
			date: 'Feb 2026',
			title: 'Encuestas pre-consultas',
			description: 'Invamer, AtlasIntel, Guarumo y GAD3 marcan el termómetro previo. Cepeda 31-37%, De la Espriella 18-32%.',
			status: 'completed',
			icon: CheckCircle
		},
		{
			date: '8 marzo 2026',
			title: 'Consultas interpartidistas',
			description: 'Valencia arrasa la Gran Consulta con 3M+ votos. López gana centro. Barreras gana izquierda alternativa.',
			status: 'completed',
			icon: CheckCircle
		},
		{
			date: '15-18 marzo 2026',
			title: 'Fórmulas vicepresidenciales',
			description: 'Cepeda-Quilcué, Valencia-Oviedo, De la Espriella-Restrepo. Tickets definidos.',
			status: 'completed',
			icon: CheckCircle
		},
		{
			date: '15 abril 2026',
			title: 'Tarjetón oficial cerrado',
			description: 'Registraduría confirma 9 candidatos en tarjetón final para primera vuelta.',
			status: 'completed',
			icon: CheckCircle
		},
		{
			date: '24 abril 2026',
			title: 'Debate Caracol-RCN',
			description: 'Tenso cruce entre Cepeda, Valencia y De la Espriella sobre seguridad y economía.',
			status: 'completed',
			icon: CheckCircle
		},
		{
			date: 'Abril-Mayo 2026',
			title: 'Encuestas de cierre',
			description: 'Invamer 44.3%, AtlasIntel 38%, Guarumo 38%, GAD3 36%. Cepeda lidera, derecha pelea segundo lugar.',
			status: 'current',
			icon: Clock
		},
		{
			date: '25 mayo 2026',
			title: 'Inicia veda electoral',
			description: 'Última semana antes de primera vuelta. No se publican más encuestas (Ley 996/2005).',
			status: 'upcoming',
			icon: AlertCircle
		},
		{
			date: '31 mayo 2026',
			title: 'Primera vuelta',
			description: 'Elección presidencial. Cepeda gana sin alcanzar el 50%+1 — pasa al balotaje.',
			status: 'upcoming',
			icon: Calendar
		},
		{
			date: '21 junio 2026',
			title: 'Segunda vuelta',
			description: 'Balotaje presidencial. Cepeda contra el segundo más votado (probablemente De la Espriella o Valencia).',
			status: 'upcoming',
			icon: Calendar
		},
		{
			date: '7 agosto 2026',
			title: 'Posesión presidencial',
			description: 'Toma de posesión del nuevo presidente de Colombia para el período 2026-2030.',
			status: 'upcoming',
			icon: Calendar
		}
	];

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'completed': return 'bg-green-500';
			case 'current': return 'bg-purple-500';
			case 'upcoming': return 'bg-gray-400';
			default: return 'bg-gray-400';
		}
	};

	const getStatusTextColor = (status: string) => {
		switch (status) {
			case 'completed': return 'text-green-400';
			case 'current': return 'text-purple-400';
			case 'upcoming': return 'text-gray-400';
			default: return 'text-gray-400';
		}
	};

	return (
		<div className="container mx-auto px-6">
			<div className="text-center mb-16">
				<h2 className="text-4xl font-bold text-white mb-4">
					Cronograma Electoral 2026
				</h2>
				<p className="text-xl text-gray-300 max-w-3xl mx-auto">
					Fechas clave del proceso electoral presidencial colombiano
				</p>
			</div>

			<div className="relative">
				<div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-600"></div>

				<div className="space-y-12">
					{timelineEvents.map((event, index) => {
						const rowClass = index % 2 === 0 ? 'flex-row' : 'flex-row-reverse';
						const contentAlign = index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8';
						const nodeClass = `w-12 h-12 rounded-full ${getStatusColor(event.status)} flex items-center justify-center`;
						const dateClass = `text-sm font-semibold mb-2 ${getStatusTextColor(event.status)}`;

						return (
							<div key={event.date + event.title} className={`flex items-center ${rowClass}`}>
								<div className={`w-5/12 ${contentAlign}`}>
									<div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-colors">
										<div className={dateClass}>
											{event.date}
										</div>
										<h3 className="text-xl font-bold text-white mb-3">
											{event.title}
										</h3>
										<p className="text-gray-300 text-sm">
											{event.description}
										</p>
									</div>
								</div>

								<div className="relative z-10 flex items-center justify-center w-16 h-16">
									<div className={nodeClass}>
										<event.icon className="h-6 w-6 text-white" />
									</div>
								</div>

								<div className="w-5/12"></div>
							</div>
						);
					})}
				</div>
			</div>

			<div className="mt-16 bg-gray-800 rounded-2xl p-8 border border-gray-700">
				<h3 className="text-2xl font-bold text-white mb-6 text-center">
					Fechas Importantes
				</h3>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div className="text-center">
						<div className="bg-purple-600 p-3 rounded-full w-fit mx-auto mb-3">
							<Clock className="h-6 w-6 text-white" />
						</div>
						<div className="text-lg font-bold text-white mb-1">
							Hoy
						</div>
						<div className="text-purple-400 text-sm">
							1 Mayo 2026
						</div>
						<div className="text-gray-300 text-xs mt-1">
							30 días para primera vuelta
						</div>
					</div>

					<div className="text-center">
						<div className="bg-purple-600 p-3 rounded-full w-fit mx-auto mb-3">
							<Calendar className="h-6 w-6 text-white" />
						</div>
						<div className="text-lg font-bold text-white mb-1">
							Primera vuelta
						</div>
						<div className="text-purple-400 text-sm">
							31 Mayo 2026
						</div>
						<div className="text-gray-300 text-xs mt-1">
							No habrá ganador directo
						</div>
					</div>

					<div className="text-center">
						<div className="bg-orange-600 p-3 rounded-full w-fit mx-auto mb-3">
							<Calendar className="h-6 w-6 text-white" />
						</div>
						<div className="text-lg font-bold text-white mb-1">
							Balotaje
						</div>
						<div className="text-orange-400 text-sm">
							21 Junio 2026
						</div>
						<div className="text-gray-300 text-xs mt-1">
							Decisión final
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TimelineSection;
