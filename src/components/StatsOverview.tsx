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
      description: "Lidera con ventaja clara"
    },
    {
      title: "Total Candidatos",
      value: candidates.length.toString(),
      subtitle: "Aspirantes confirmados",
      icon: Users,
      description: "Mayor fragmentación histórica"
    },
    {
      title: "Indecisos",
      value: `${undecided.toFixed(0)}%`,
      subtitle: "Del electorado",
      icon: AlertTriangle,
      description: "Factor determinante"
    },
    {
      title: "Muestra",
      value: "3,000",
      subtitle: "Personas encuestadas",
      icon: BarChart3,
      description: "Margen de error ±1.8%"
    },
    {
      title: "Período",
      value: "Enero",
      subtitle: "2026",
      icon: Calendar,
      description: "Datos Atlas Intel"
    },
    {
      title: "Regiones",
      value: "5",
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
          Los datos más relevantes del proceso electoral presidencial Colombia 2026
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
            Factores que definen el panorama político actual
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="text-center p-6 rounded-2xl bg-purple-50/50">
            <div className="bg-purple-100 p-4 rounded-2xl w-fit mx-auto mb-4">
              <Target className="h-8 w-8 text-purple-600" />
            </div>
            <h4 className="font-bold text-xl text-gray-900 mb-3">
              Empate Técnico Histórico
            </h4>
            <p className="text-gray-600">
              De la Espriella y Cepeda separados por apenas 1.5 puntos,
              la competencia más reñida en décadas.
            </p>
          </div>

          <div className="text-center p-6 rounded-2xl bg-purple-50/50">
            <div className="bg-purple-100 p-4 rounded-2xl w-fit mx-auto mb-4">
              <TrendingUp className="h-7 w-7 text-purple-600" />
            </div>
            <h4 className="font-bold text-xl text-gray-900 mb-3">
              Reconfiguración Política
            </h4>
            <p className="text-gray-600">
              La derecha recupera terreno significativo mientras el centro
              gana protagonismo con Fajardo al 9.4%.
            </p>
          </div>

          <div className="text-center p-6 rounded-2xl bg-purple-50/50">
            <div className="bg-purple-100 p-4 rounded-2xl w-fit mx-auto mb-4">
              <AlertTriangle className="h-7 w-7 text-purple-600" />
            </div>
            <h4 className="font-bold text-xl text-gray-900 mb-3">
              Alta Volatilidad
            </h4>
            <p className="text-gray-600">
              El alto porcentaje de indecisos convierte las campañas electorales 
              en factor determinante del resultado.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;