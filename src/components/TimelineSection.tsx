import React from 'react';
import { Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const TimelineSection: React.FC = () => {
	const timelineEvents = [
		{
			date: '8 marzo 2026',
			title: 'Consultas y legislativas',
			description: 'Valencia gana la Gran Consulta de la derecha; Cepeda arrasa en el Pacto Histórico. Se elige el nuevo Congreso.',
			status: 'completed',
			icon: CheckCircle
		},
		{
			date: '15-18 marzo 2026',
			title: 'Fórmulas vicepresidenciales',
			description: 'Cepeda-Quilcué, Valencia-Oviedo y De la Espriella-Restrepo. Tickets definidos.',
			status: 'completed',
			icon: CheckCircle
		},
		{
			date: 'Abril-Mayo 2026',
			title: 'Campaña de primera vuelta',
			description: 'Debates y encuestas. De la Espriella remonta en la recta final y disputa el primer lugar con Cepeda.',
			status: 'completed',
			icon: CheckCircle
		},
		{
			date: '31 mayo 2026',
			title: 'Primera vuelta',
			description: 'De la Espriella 43,75% y Cepeda 40,9% pasan al balotaje. Nadie alcanza el 50%+1. Participación del 57,9%.',
			status: 'completed',
			icon: CheckCircle
		},
		{
			date: 'Junio 2026',
			title: 'Encuestas de balotaje',
			description: 'AtlasIntel (52,2-44,5), Guarumo (52,6-45) y CNC (48,6-44,7) dan ventaja a De la Espriella. Polymarket: 89%.',
			status: 'current',
			icon: Clock
		},
		{
			date: '21 junio 2026',
			title: 'Segunda vuelta',
			description: 'Balotaje presidencial entre Abelardo de la Espriella e Iván Cepeda. Se define el presidente 2026-2030.',
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
			case 'current': return 'bg-orange-500';
			case 'upcoming': return 'bg-gray-400';
			default: return 'bg-gray-400';
		}
	};

	const getStatusTextColor = (status: string) => {
		switch (status) {
			case 'completed': return 'text-green-400';
			case 'current': return 'text-orange-400';
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
					Fechas clave camino a la segunda vuelta del 21 de junio
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
						<div className="bg-green-600 p-3 rounded-full w-fit mx-auto mb-3">
							<CheckCircle className="h-6 w-6 text-white" />
						</div>
						<div className="text-lg font-bold text-white mb-1">
							Primera vuelta
						</div>
						<div className="text-green-400 text-sm">
							31 Mayo 2026
						</div>
						<div className="text-gray-300 text-xs mt-1">
							De la Espriella 1°, Cepeda 2°
						</div>
					</div>

					<div className="text-center">
						<div className="bg-orange-600 p-3 rounded-full w-fit mx-auto mb-3">
							<Calendar className="h-6 w-6 text-white" />
						</div>
						<div className="text-lg font-bold text-white mb-1">
							Segunda vuelta
						</div>
						<div className="text-orange-400 text-sm">
							21 Junio 2026
						</div>
						<div className="text-gray-300 text-xs mt-1">
							Decisión final
						</div>
					</div>

					<div className="text-center">
						<div className="bg-purple-600 p-3 rounded-full w-fit mx-auto mb-3">
							<AlertCircle className="h-6 w-6 text-white" />
						</div>
						<div className="text-lg font-bold text-white mb-1">
							Posesión
						</div>
						<div className="text-purple-400 text-sm">
							7 Agosto 2026
						</div>
						<div className="text-gray-300 text-xs mt-1">
							Inicio del período 2026-2030
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TimelineSection;
