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
      color: "from-blue-500 to-blue-600",
      description: "Empate técnico con segundo lugar",
      trend: { value: "1.2%", label: "diferencia" }
    },
    {
      title: "Total Candidatos",
      value: candidates.length.toString(),
      subtitle: "Aspirantes confirmados",
      icon: Users,
      color: "from-green-500 to-green-600",
      description: "Mayor fragmentación histórica",
      trend: { value: "32", label: "registrados" }
    },
    {
      title: "Indecisos",
      value: `${undecided.toFixed(1)}%`,
      subtitle: "Del electorado",
      icon: AlertTriangle,
      color: "from-orange-500 to-orange-600",
      description: "Factor determinante",
      trend: { value: "+19.1%", label: "vs 2022" }
    },
    {
      title: "Muestra",
      value: "3,200",
      subtitle: "Personas encuestadas",
      icon: BarChart3,
      color: "from-purple-500 to-purple-600",
      description: "Margen de error ±3.2%",
      trend: { value: "Nacional", label: "cobertura" }
    },
    {
      title: "Período",
      value: "Abr-Jun",
      subtitle: "2025",
      icon: Calendar,
      color: "from-indigo-500 to-indigo-600",
      description: "Datos más recientes",
      trend: { value: "Actualizado", label: "estado" }
    },
    {
      title: "Regiones",
      value: "5",
      subtitle: "Analizadas",
      icon: MapPin,
      color: "from-teal-500 to-teal-600",
      description: "Comportamiento diferenciado",
      trend: { value: "Caribe", label: "más activo" }
    }
  ];

  return (
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Panorama Electoral en Cifras
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Los datos más relevantes del proceso electoral presidencial Colombia 2026
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stats.map((stat, index) => (
          <div 
            key={stat.title}
            className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
            
            <div className="relative p-8">
              {/* Icon */}
              <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${stat.color} mb-6 group-hover:scale-110 transition-transform duration-500`}>
                <stat.icon className="h-8 w-8 text-white" />
              </div>

              {/* Main Content */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  {stat.title}
                </h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-gray-500 mb-3">
                  {stat.subtitle}
                </div>
                <p className="text-sm text-gray-600">
                  {stat.description}
                </p>
              </div>

              {/* Trend */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-sm font-semibold text-blue-600">
                  {stat.trend.value}
                </span>
                <span className="text-xs text-gray-500">
                  {stat.trend.label}
                </span>
              </div>
            </div>

            {/* Hover Effect Border */}
            <div className={`absolute inset-0 border-2 border-transparent group-hover:border-gradient-to-br group-hover:${stat.color} rounded-2xl transition-all duration-500 opacity-0 group-hover:opacity-100`}></div>
          </div>
        ))}
      </div>

      {/* Key Insights */}
      <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-200">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Contexto Electoral 2026
          </h3>
          <p className="text-gray-600">
            Factores que definen el panorama político actual
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-600 p-3 rounded-full w-fit mx-auto mb-4">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Fragmentación Histórica
            </h4>
            <p className="text-sm text-gray-600">
              Ningún candidato supera el 15% de intención de voto, 
              evidenciando la mayor dispersión electoral registrada.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-green-600 p-3 rounded-full w-fit mx-auto mb-4">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Reconfiguración Política
            </h4>
            <p className="text-sm text-gray-600">
              Caída significativa de la izquierda (-20.3 puntos) y 
              crecimiento de indecisos (+19.1 puntos).
            </p>
          </div>

          <div className="text-center">
            <div className="bg-orange-600 p-3 rounded-full w-fit mx-auto mb-4">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Alta Volatilidad
            </h4>
            <p className="text-sm text-gray-600">
              El 22.1% de indecisos convierte las campañas electorales 
              en factor determinante del resultado.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;