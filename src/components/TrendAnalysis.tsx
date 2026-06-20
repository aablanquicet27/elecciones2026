import React, { useState } from 'react';
import { TrendingUp, TrendingDown, BarChart3, PieChart } from 'lucide-react';
import { Candidate } from '../types/election';

interface TrendAnalysisProps {
  candidates: Candidate[];
}

const TrendAnalysis: React.FC<TrendAnalysisProps> = ({ candidates }) => {
  const [activeView, setActiveView] = useState<'current' | 'comparison'>('current');

  const trends = candidates.reduce((acc, candidate) => {
    const trend = candidate.Tendencia_Política;
    if (!acc[trend]) {
      acc[trend] = { count: 0, percentage: 0 };
    }
    acc[trend].count += 1;
    acc[trend].percentage += candidate.Intención_Voto_Porcentaje;
    return acc;
  }, {} as { [key: string]: { count: number; percentage: number } });

  const trendData = Object.entries(trends).map(([trend, data]) => ({
    trend,
    count: data.count,
    percentage: Math.round(data.percentage * 10) / 10,
    color: trend === 'Izquierda' ? '#ef4444' :
           trend === 'Centro' ? '#3b82f6' :
           trend === 'Derecha' ? '#22c55e' :
           trend === 'Centro-Derecha' ? '#8b5cf6' : '#6b7280'
  })).sort((a, b) => b.percentage - a.percentage);

  const comparisonData = [
    { trend: 'Derecha', 2022: 28.5, 2026: 44.0, change: 15.5 },
    { trend: 'Izquierda', 2022: 40.3, 2026: 41.0, change: 0.7 },
    { trend: 'Centro-Derecha', 2022: 0, 2026: 6.9, change: 6.9 },
    { trend: 'Centro', 2022: 28.2, 2026: 6.4, change: -21.8 }
  ];

  const maxPercentage = Math.max(...trendData.map(t => t.percentage));

  return (
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Análisis de Tendencias Políticas
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Distribución del voto en la primera vuelta del 31 de mayo y evolución del espectro político colombiano
        </p>
      </div>

      <div className="flex justify-center mb-12">
        <div className="bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveView('current')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              activeView === 'current'
                ? 'bg-white text-purple-600 shadow-md'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            <div className="flex items-center space-x-2">
              <PieChart className="h-4 w-4" />
              <span>Resultado 1ª vuelta</span>
            </div>
          </button>
          <button
            onClick={() => setActiveView('comparison')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              activeView === 'comparison'
                ? 'bg-white text-purple-600 shadow-md'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Comparación 2022 vs 2026</span>
            </div>
          </button>
        </div>
      </div>

      {activeView === 'current' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              Voto por Tendencia Política (1ª vuelta)
            </h3>

            <div className="space-y-6">
              {trendData.map((item) => (
                <div key={item.trend} className="group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                        {item.trend}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                        {item.count} candidatos
                      </span>
                    </div>
                    <span className="font-bold text-xl text-gray-900">
                      {item.percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                      className="h-full transition-all duration-1000 ease-out rounded-full"
                      style={{
                        width: `${(item.percentage / maxPercentage) * 100}%`,
                        backgroundColor: item.color
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-green-600 p-2 rounded-full">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <h4 className="text-lg font-bold text-gray-900">Derecha</h4>
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">44.0%</div>
              <p className="text-sm text-gray-700 mb-3">
                De la Espriella ganó la primera vuelta con 43,75%. La derecha 'outsider' encabeza por primera vez una presidencial.
              </p>
              <div className="text-xs text-green-600 font-semibold">
                Pasa a segunda vuelta como favorito
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 border border-red-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-red-600 p-2 rounded-full">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <h4 className="text-lg font-bold text-gray-900">Izquierda</h4>
              </div>
              <div className="text-3xl font-bold text-red-600 mb-2">41.0%</div>
              <p className="text-sm text-gray-700 mb-3">
                Cepeda quedó segundo con 40,9% y representa la continuidad del proyecto de Petro. Disputará el balotaje.
              </p>
              <div className="text-xs text-red-600 font-semibold">
                Busca remontar en segunda vuelta
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-blue-600 p-2 rounded-full">
                  <TrendingDown className="h-5 w-5 text-white" />
                </div>
                <h4 className="text-lg font-bold text-gray-900">Centro</h4>
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2">6.4%</div>
              <p className="text-sm text-gray-700 mb-3">
                Fajardo (4,3%) y López (0,95%) no despegaron. El centro colapsó y su voto es clave para el balotaje.
              </p>
              <div className="text-xs text-blue-600 font-semibold">
                Voto en disputa para la 2ª vuelta
              </div>
            </div>
          </div>
        </div>
      )}

      {activeView === 'comparison' && (
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Evolución del Espectro Político: 2022 vs 2026 (1ª vuelta)
          </h3>

          <div className="space-y-8">
            {comparisonData.map((item) => (
              <div key={item.trend} className="group">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-gray-900 text-lg group-hover:text-purple-600 transition-colors">
                    {item.trend}
                  </span>
                  <div className="flex items-center space-x-6 text-sm">
                    <span className="text-purple-600 font-semibold">
                      2022: {item[2022]}%
                    </span>
                    <span className="text-purple-600 font-semibold">
                      2026: {item[2026]}%
                    </span>
                    <span className={`font-bold text-lg ${
                      item.change > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {item.change > 0 ? '+' : ''}{item.change}%
                    </span>
                  </div>
                </div>

                <div className="relative">
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 mb-2">2022</div>
                      <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                        <div
                          className="h-full bg-purple-500 transition-all duration-1000 ease-out"
                          style={{ width: `${(item[2022] / 50) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 mb-2">2026</div>
                      <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                        <div
                          className="h-full bg-purple-500 transition-all duration-1000 ease-out"
                          style={{ width: `${(item[2026] / 50) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Principales Cambios</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• La derecha se dispara (+15.5 puntos) con De la Espriella</li>
                  <li>• El centro se desploma (-21.8 puntos)</li>
                  <li>• La izquierda se mantiene firme alrededor del 41%</li>
                  <li>• Surge una centro-derecha con Valencia (6.9%)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Factores Explicativos</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Desgaste del gobierno Petro</li>
                  <li>• Auge del discurso de seguridad de De la Espriella</li>
                  <li>• Colapso de las candidaturas de centro</li>
                  <li>• Alta polarización izquierda-derecha</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendAnalysis;
