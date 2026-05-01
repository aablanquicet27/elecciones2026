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
      description: "Promedio 4 encuestadoras Abr 2026"
    },
    {
      title: "Candidatos Tarjetón",
      value: "9",
      subtitle: "Confirmados oficial",
      icon: Users,
      description: "Registraduría 15 abril"
    },
    {
      title: "Indecisos",
      value: `${Math.max(0, undecided).toFixed(1)}%`,
      subtitle: "Del electorado",
      icon: AlertTriangle,
      description: "Voto blanco / NS-NR"
    },
    {
      title: "Encuestadoras",
      value: "Invamer · Atlas · Guarumo · GAD3",
      subtitle: "Últimas 4 publicadas",
      icon: BarChart3,
      description: "Abril 2026"
    },
    {
      title: "Primera Vuelta",
      value: "31 May",
      subtitle: "2026 · 30 días",
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
          Los datos más relevantes del proceso electoral presidencial Colombia 2026 — actualizado al 1 de mayo de 2026 con las 4 encuestadoras más recientes
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

            <div className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tighter mb-2">
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
              Cepeda lidera con 39.1% promedio en abril (Invamer 44.3%, Atlas 38%, Guarumo 38%, GAD3 36%). De la Espriella (23.1%) sobrepasa a Valencia (18.3%) y se afirma en el segundo lugar.
            </p>
          </div>

          <div className="text-center p-6 rounded-2xl bg-purple-50/50">
            <div className="bg-purple-100 p-4 rounded-2xl w-fit mx-auto mb-4">
              <TrendingUp className="h-7 w-7 text-purple-600" />
            </div>
            <h4 className="font-bold text-xl text-gray-900 mb-3">
              No Habrá Ganador en Primera
            </h4>
            <p className="text-gray-600">
              Ningún candidato alcanza el 50%+1 que exige la Constitución. La segunda vuelta del 21 de junio está garantizada y se decidirá entre Cepeda y el segundo más votado.
            </p>
          </div>

          <div className="text-center p-6 rounded-2xl bg-purple-50/50">
            <div className="bg-purple-100 p-4 rounded-2xl w-fit mx-auto mb-4">
              <AlertTriangle className="h-7 w-7 text-purple-600" />
            </div>
            <h4 className="font-bold text-xl text-gray-900 mb-3">
              Balotaje Polarizado
            </h4>
            <p className="text-gray-600">
              AtlasIntel y Guarumo muestran a la derecha derrotando a Cepeda (Valencia 49-41, Espriella 48-42). Invamer y GAD3 lo sostienen arriba. Empate técnico real.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;
