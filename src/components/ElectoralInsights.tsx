import React from 'react';
import { TrendingDown, Users, AlertTriangle, Smartphone, MapPin, Clock } from 'lucide-react';
import { getElectoralInsights } from '../utils/csvParser';

const ElectoralInsights: React.FC = () => {
  const insights = getElectoralInsights();

  const insightCards = [
    {
      ...insights.fragmentacion,
      icon: TrendingDown,
      color: 'from-purple-500 to-indigo-600',
      bgColor: 'from-purple-50 to-purple-100',
      textColor: 'text-purple-900'
    },
    {
      ...insights.recomposicion,
      icon: Users,
      color: 'from-purple-500 to-indigo-600',
      bgColor: 'from-purple-50 to-purple-100',
      textColor: 'text-purple-900'
    },
    {
      ...insights.volatilidad,
      icon: AlertTriangle,
      color: 'from-purple-500 to-indigo-600',
      bgColor: 'from-purple-50 to-purple-100',
      textColor: 'text-purple-900'
    },
    {
      ...insights.digital,
      icon: Smartphone,
      color: 'from-purple-500 to-indigo-600',
      bgColor: 'from-purple-50 to-purple-100',
      textColor: 'text-purple-900'
    },
    {
      ...insights.regional,
      icon: MapPin,
      color: 'from-purple-500 to-indigo-600',
      bgColor: 'from-purple-50 to-purple-100',
      textColor: 'text-purple-900'
    },
    {
      ...insights.generacional,
      icon: Clock,
      color: 'from-purple-500 to-indigo-600',
      bgColor: 'from-purple-50 to-purple-100',
      textColor: 'text-purple-900'
    }
  ];

  return (
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Hallazgos Principales del Análisis Electoral
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Los factores que transformaron el panorama político tras las primarias del 8 de marzo de 2026
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {insightCards.map((insight, index) => (
          <div 
            key={insight.title}
            className={`group relative bg-gradient-to-br ${insight.bgColor} rounded-2xl p-8 border border-gray-200 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2`}
          >
            {/* Icon */}
            <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${insight.color} mb-6 group-hover:scale-110 transition-transform duration-500`}>
              <insight.icon className="h-8 w-8 text-white" />
            </div>

            {/* Content */}
            <div className="mb-6">
              <h3 className={`text-xl font-bold ${insight.textColor} mb-3`}>
                {insight.title}
              </h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                {insight.description}
              </p>
              <p className="text-sm text-gray-600 italic">
                {insight.impact}
              </p>
            </div>

            {/* Metric */}
            <div className="pt-4 border-t border-gray-300">
              {insight.percentage && (
                <div className="text-center">
                  <div className={`text-3xl font-bold ${insight.textColor}`}>
                    {insight.percentage}
                  </div>
                  <div className="text-sm text-gray-600">Intención de voto top 3</div>
                </div>
              )}
              {insight.change && (
                <div className="text-center">
                  <div className={`text-3xl font-bold ${insight.textColor}`}>
                    {insight.change}
                  </div>
                  <div className="text-sm text-gray-600">Salto de Valencia post-consulta</div>
                </div>
              )}
              {insight.uncertainty && (
                <div className="text-center">
                  <div className={`text-3xl font-bold ${insight.textColor}`}>
                    {insight.uncertainty}
                  </div>
                  <div className="text-sm text-gray-600">Cepeda vs Valencia (2da vuelta)</div>
                </div>
              )}
              {insight.leaders && (
                <div className="text-center">
                  <div className={`text-lg font-bold ${insight.textColor} mb-1`}>
                    {insight.leaders.join(' • ')}
                  </div>
                  <div className="text-sm text-gray-600">Curules ganadas 8 de marzo</div>
                </div>
              )}
              {insight.highlights && (
                <div className="space-y-1 text-sm">
                  <div className={`font-semibold ${insight.textColor}`}>
                    • {insight.highlights.caribe}
                  </div>
                  <div className={`font-semibold ${insight.textColor}`}>
                    • {insight.highlights.andina}
                  </div>
                  <div className={`font-semibold ${insight.textColor}`}>
                    • {insight.highlights.orinoquia}
                  </div>
                </div>
              )}
              {insight.trends && (
                <div className="space-y-1 text-sm">
                  <div className={`font-semibold ${insight.textColor}`}>
                    • {insight.trends.jovenes}
                  </div>
                  <div className={`font-semibold ${insight.textColor}`}>
                    • {insight.trends.mayores}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Summary Section */}
      <div className="mt-16 bg-gradient-to-r from-gray-900 via-purple-900 to-indigo-900 rounded-3xl p-12 text-white">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold mb-4">
            Síntesis del Panorama Electoral Post-Primarias
          </h3>
          <p className="text-xl text-purple-100 max-w-4xl mx-auto">
            Las elecciones del 8 de marzo transformaron la carrera presidencial de una competencia bipolar a una contienda triangular
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-white/10 p-4 rounded-full w-fit mx-auto mb-4">
              <TrendingDown className="h-8 w-8 text-white" />
            </div>
            <h4 className="text-lg font-bold mb-2">Valencia Cambia Todo</h4>
            <p className="text-purple-100 text-sm">
              Paloma Valencia pasó de 4% a 22.2% tras ganar la Gran Consulta con 3M+ votos.
              Su irrupción desplazó a De la Espriella al tercer lugar y abrió un nuevo frente.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-white/10 p-4 rounded-full w-fit mx-auto mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h4 className="text-lg font-bold mb-2">Empate Técnico en Balotaje</h4>
            <p className="text-purple-100 text-sm">
              En segunda vuelta Cepeda vs Valencia sería 43.3% vs 42.9% — 
              la definición más cerrada de la campaña. Todo puede pasar.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-white/10 p-4 rounded-full w-fit mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-white" />
            </div>
            <h4 className="text-lg font-bold mb-2">Gobernar Será el Reto</h4>
            <p className="text-purple-100 text-sm">
              El Congreso quedó fragmentado: PH 25, CD 17 en Senado; CD 32, Liberal 31 en Cámara.
              Ningún presidente tendrá mayoría propia — las coaliciones serán obligatorias.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectoralInsights;
