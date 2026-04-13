import React from 'react';
import { TrendingUp, Users, Award, BarChart3, AlertTriangle, Target, Calendar, MapPin } from 'lucide-react';
import { Candidate } from '../types/election';

interface StatsOverviewProps {
  candidates: Candidate[];
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ candidates }) => {
  const topCandidate = candidates.reduce((prev, current) => 
    prev.Intención_Voto_Porcentaje > current.Intención_Voto_Porcentaje ? prev : current
  );
  
  const totalIntention = candidates.reduce((sum, c) => sum + c.Intención_Voto_Porcentaje, 0);
  const undecided = 100 - totalIntention;

  const stats = [
    {
      title: "Líder Actual",
      value: `${topCandidate.Intención_Voto_Porcentaje}%`,
      subtitle: topCandidate.Candidato,
      icon: Award,
      description: "Promedio encuestas recientes"
    },
    {
      title: "Total Candidatos",
      value: "14",
      subtitle: "Aspirantes inscritos",
      icon: Users,
      description: "Post-primarias 8 marzo"
    },
    {
      title: "Indecisos",
      value: `${Math.max(0, undecided).toFixed(1)}%`,
      subtitle: "Del electorado",
      icon: AlertTriangle,
      description: "Estimado por suma (%)"
    },
    {
      title: "Encuestadoras",
      value: "CNC · GAD3 · AtlasIntel",
      subtitle: "Últimas disponibles",
      icon: BarChart3,
      description: "Mar–Abr 2026"
    },
    {
      title: "Primera Vuelta",
      value: "31 May",
      subtitle: "2026",
      icon: Calendar,
      description: "Segunda vuelta: 21 Jun"
    },
    {
      title: "Regiones",
      value: "7",
      subtitle: "Analizadas",
      icon: MapPin,
      description: "Cobertura nacional"
    }
  ];

  return (
    <div className="container mx-auto px-6 lg:px-12">
      <header className="text-center mb-20">
        <h2 className="text-gray-900 mb-6">
          Panorama Electoral en Cifras
        </h2>
        <p className="text-large max-w-3xl mx-auto">
          Los datos más relevantes del proceso electoral presidencial Colombia 2026 — actualizado con información de abril
        </p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-10">
        {stats.map((stat) => (
          <article 
            key={stat.title}
            className="text-center group"
          >
            {/* Icon */}
            <div className="inline-flex p-5 rounded-2xl bg-purple-50 mb-6 group-hover:bg-purple-100 transition-colors duration-300">
              <stat.icon className="h-8 w-8 text-purple-600" />
            </div>

            {/* Value */}
            <div className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tighter mb-2">
              {stat.value}
            </div>
            
            {/* Subtitle */}
            <div className="text-base font-medium text-gray-600 mb-1">
              {stat.subtitle}
            </div>
            
            {/* Description */}
            <p className="text-sm text-gray-500">
              {stat.description}
            </p>
          </article>
        ))}
      </div>

      {/* Key Insights */}
      <div className="mt-20 bg-white rounded-[2rem] p-10 lg:p-14 border border-purple-100 shadow-lg shadow-purple-500/5">
        <header className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-3">
            Contexto Electoral 2026
          </h3>
          <p className="text-lg text-gray-600">
            Lo que revelan las mediciones más recientes sobre primera y segunda vuelta
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="text-center p-6 rounded-2xl bg-purple-50/50">
            <div className="bg-purple-100 p-4 rounded-2xl w-fit mx-auto mb-4">
              <Target className="h-8 w-8 text-purple-600" />
            </div>
            <h4 className="font-bold text-xl text-gray-900 mb-3">
              Liderazgo en Primera Vuelta
            </h4>
            <p className="text-gray-600">
              En mediciones recientes, Cepeda se mantiene primero y la disputa por el segundo lugar entre
              De la Espriella y Valencia se vuelve clave para definir el balotaje.
            </p>
          </div>

          <div className="text-center p-6 rounded-2xl bg-purple-50/50">
            <div className="bg-purple-100 p-4 rounded-2xl w-fit mx-auto mb-4">
              <TrendingUp className="h-7 w-7 text-purple-600" />
            </div>
            <h4 className="font-bold text-xl text-gray-900 mb-3">
              Congreso Fragmentado
            </h4>
            <p className="text-gray-600">
              Pacto Histórico ganó 25 curules en Senado, Centro Democrático 32 en Cámara.
              Ningún partido tiene mayoría — el próximo presidente necesitará amplias coaliciones.
            </p>
          </div>

          <div className="text-center p-6 rounded-2xl bg-purple-50/50">
            <div className="bg-purple-100 p-4 rounded-2xl w-fit mx-auto mb-4">
              <AlertTriangle className="h-7 w-7 text-purple-600" />
            </div>
            <h4 className="font-bold text-xl text-gray-900 mb-3">
              Segunda Vuelta Puede Voltear el Resultado
            </h4>
            <p className="text-gray-600">
              En escenarios de segunda vuelta (AtlasIntel/Semana), Cepeda queda por debajo frente a
              De la Espriella y Valencia. La elección se definirá por alianzas y transferencia de voto.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;
