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
			description: 'Elección presidencial. Cepeda gana sin alcan