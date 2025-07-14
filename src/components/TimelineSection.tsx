import React from 'react';
import { Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const TimelineSection: React.FC = () => {
  const timelineEvents = [
    {
      date: 'Marzo 2025',
      title: 'Inicio Período Electoral',
      description: 'Apertura oficial del proceso electoral presidencial',
      status: 'completed',
      icon: CheckCircle
    },
    {
      date: 'Julio 2025',
      title: 'Encuestas de Intención',
      description: 'Período de medición actual - 2,122 personas encuestadas',
      status: 'current',
      icon: Clock
    },
    {
      date: 'Agosto 2025',
      title: 'Cierre Inscripciones',
      description: 'Fecha límite para inscripción de candidaturas',
      status: 'upcoming',
      icon: AlertCircle
    },
    {
      date: 'Octubre 2025',
      title: 'Inicio Campaña Oficial',
      description: 'Arranque formal de campañas presidenciales',
      status: 'upcoming',
      icon: Calendar
    },
    {
      date: 'Mayo 2026',
      title: 'Primera Vuelta',
      description: 'Elección presidencial - Primera vuelta',
      status: 'upcoming',
      icon: Calendar
    },
    {
      date: 'Junio 2026',
      title: 'Segunda Vuelta',
      description: 'Balotaje presidencial (si es necesario)',
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
        {/* Timeline Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-600"></div>

        <div className="space-y-12">
          {timelineEvents.map((event, index) => (
            <div key={event.date} className={`flex items-center ${
              index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
            }`}>
              {/* Content */}
              <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-colors">
                  <div className={`text-sm font-semibold mb-2 ${getStatusTextColor(event.status)}`}>
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

              {/* Timeline Node */}
              <div className="relative z-10 flex items-center justify-center w-16 h-16">
                <div className={`w-12 h-12 rounded-full ${getStatusColor(event.status)} flex items-center justify-center`}>
                  <event.icon className="h-6 w-6 text-white" />
                </div>
              </div>

              {/* Spacer */}
              <div className="w-5/12"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Dates Summary */}
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
              Período Actual
            </div>
            <div className="text-purple-400 text-sm">
              Julio 2025
            </div>
            <div className="text-gray-300 text-xs mt-1">
              Medición de intención de voto
            </div>
          </div>

          <div className="text-center">
            <div className="bg-purple-600 p-3 rounded-full w-fit mx-auto mb-3">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
            <div className="text-lg font-bold text-white mb-1">
              Próximo Hito
            </div>
            <div className="text-purple-400 text-sm">
              Agosto 2025
            </div>
            <div className="text-gray-300 text-xs mt-1">
              Cierre de inscripciones
            </div>
          </div>

          <div className="text-center">
            <div className="bg-purple-600 p-3 rounded-full w-fit mx-auto mb-3">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div className="text-lg font-bold text-white mb-1">
              Elecciones
            </div>
            <div className="text-purple-400 text-sm">
              Mayo 2026
            </div>
            <div className="text-gray-300 text-xs mt-1">
              Primera vuelta presidencial
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineSection;