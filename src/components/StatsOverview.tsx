import React from 'react';
import { TrendingUp, Users, Award, BarChart3, Target, Calendar } from 'lucide-react';
import { Candidate } from '../types/election';

interface StatsOverviewProps {
  candidates: Candidate[];
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ candidates }) => {
  void candidates;

  const stats = [
    {
      title: "Ganó 1ª vuelta",
      value: "43,75%",
      subtitle: "De la Espriella",
      icon: Award,
      description: "Registraduría · 31 de mayo"
    },
    {
      title: "Segunda vuelta",
      value: "21 Jun",
      subtitle: "2026 · balotaje",
      icon: Calendar,
      description: "De la Espriella vs Cepeda"
    },
    {
      title: "Ventaja en sondeos",
      value: "+6.4",
      subtitle: "De la Espriella",
      icon: TrendingUp,
      description: "Promedio encuestas junio"
    },
    {
      title: "Polymarket",
      value: "89%",
      subtitle: "De la Espriella",
      icon: Target,
      description: "Mercados de predicción"
    },
    {
      title: "Participación 1ª v.",
      value: "57,9%",
      subtitle: "23,9M votos",
      icon: Users,
      description: "Censo 41,4M"
    },
    {
      title: "Encuestadoras",
      value: "CNC · Guarumo · Atlas",
      subtitle: "Balotaje junio",
      icon: BarChart3,
      description: "De la Espriella adelante"
    }
  ];

  return (
    <div className="container mx-auto px-6 lg:px-12">
      <header className="text-center mb-20">
        <h2 className="text-gray-900 mb-6">
          La Segunda Vuelta en Cifras
        </h2>
        <p className="text-large max-w-3xl mx-auto">
          Los datos clave del balotaje presidencial del 21 de junio de 2026 entre Abelardo de la Espriella e Iván Cepeda
        </p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-10">
        {stats.map((stat) => (
          <article
            key={stat.title}
            className="text-center group"
          >
            <div className="inline-flex p-5 rounded-2xl bg-purple-50 mb-6 group-hover:bg-purple-100 transition-colors duration-300">
              <stat.icon className="h-8 w-8 text-purple-600" />
            </div>

            <div className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tighter mb-2">
              {stat.value}
            </div>

            <div className="text-base font-medium text-gray-600 mb-1">
              {stat.subtitle}
            </div>

            <p className="text-sm text-gray-500">
              {stat.description}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-20 bg-white rounded-[2rem] p-10 lg:p-14 border border-purple-100 shadow-lg shadow-purple-500/5">
        <header className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-3">
            Contexto del Balotaje 2026
          </h3>
          <p className="text-lg text-gray-600">
            Lo que dejaron la primera vuelta y las encuestas de junio
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="text-center p-6 rounded-2xl bg-purple-50/50">
            <div className="bg-purple-100 p-4 rounded-2xl w-fit mx-auto mb-4">
              <Target className="h-8 w-8 text-purple-600" />
            </div>
            <h4 className="font-bold text-xl text-gray-900 mb-3">
              Resultado de la primera vuelta
            </h4>
            <p className="text-gray-600">
              De la Espriella obtuvo 43,75% y superó a Cepeda (40,9%) por unos 673.000 votos. Valencia quedó tercera con 6,9% y Fajardo cuarto con 4,3%.
            </p>
          </div>

          <div className="text-center p-6 rounded-2xl bg-purple-50/50">
            <div className="bg-purple-100 p-4 rounded-2xl w-fit mx-auto mb-4">
              <TrendingUp className="h-7 w-7 text-purple-600" />
            </div>
            <h4 className="font-bold text-xl text-gray-900 mb-3">
              De la Espriella, favorito
            </h4>
            <p className="text-gray-600">
              Las encuestas de junio lo dan arriba: AtlasIntel 52,2-44,5; Guarumo 52,6-45; CNC 48,6-44,7. Polymarket le asigna ~89% de probabilidad.
            </p>
          </div>

          <div className="text-center p-6 rounded-2xl bg-purple-50/50">
            <div className="bg-purple-100 p-4 rounded-2xl w-fit mx-auto mb-4">
              <Users className="h-7 w-7 text-purple-600" />
            </div>
            <h4 className="font-bold text-xl text-gray-900 mb-3">
              La carta de Cepeda
            </h4>
            <p className="text-gray-600">
              Cepeda busca una remontada con la transferencia del voto de Fajardo y López y movilizando a la izquierda. CNC mide la brecha más corta (+3,9).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;
