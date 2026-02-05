import React, { useState } from 'react';
import { TrendingUp, TrendingDown, BarChart3, PieChart } from 'lucide-react';
import { Candidate } from '../types/election';

interface TrendAnalysisProps {
  candidates: Candidate[];
}

const TrendAnalysis: React.FC<TrendAnalysisProps> = ({ candidates }) => {
  const [activeView, setActiveView] = useState<'current' | 'comparison'>('current');

  // Calculate current trends
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
           trend === 'Derecha' ? '#22c55e' : '#6b7280'
  })).sort((a, b) => b.percentage - a.percentage);

  // Comparison data 2022 vs 2026
  const comparisonData = [
    { trend: 'Izquierda', 2022: 40.3, 2026: 20.0, change: -20.3 },
    { trend: 'Centro', 2022: 28.2, 2026: 25.6, change: -2.6 },
    { trend: 'Derecha', 2022: 28.5, 2026: 32.3, change: 3.8 },
    { trend: 'Otros/Indecisos', 2022: 3.0, 2026: 22.1, change: 19.1 }
  ];

  const maxPercentage = Math.max(...trendData.map(t => t.percentage));

  return (
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Análisis de Tendencias Políticas
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Evolución del espectro político colombiano y distribución actual de preferencias electorales
        </p>
      </div>

      {/* Toggle Buttons */}
      <div className="flex justify-center mb-12">
        <div className="bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveView('current')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              activeView === 'current'
                ? 'bg-white text-teal-600 shadow-md'
                : 'text-gray-600 hover:text-teal-600'
            }`}
          >
            <div className="flex items-center space-x-2">
              <PieChart className="h-4 w-4" />
              <span>Panorama Actual 2026</span>
            </div>
          </button>
          <button
            onClick={() => setActiveView('comparison')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              activeView === 'comparison'
                ? 'bg-white text-teal-600 shadow-md'
                : 'text-gray-600 hover:text-teal-600'
            }`}
          >
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Comparación 2022 vs 2026</span>
            </div>
          </button>
        </div>
      </div>

      {/* Current View */}
      {activeView === 'current' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              Distribución por Tendencia Política
            </h3>
            
            <div className="space-y-6">
              {trendData.map((item) => (
                <div key={item.trend} className="group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="font-semibold text-gray-900 group-hover:text-teal-600 transition-colors">
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

          {/* Analysis */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 border border-red-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-red-600 p-2 rounded-full">
                  <TrendingDown className="h-5 w-5 text-white" />
                </div>
                <h4 className="text-lg font-bold text-gray-900">Izquierda</h4>
              </div>
              <div className="text-3xl font-bold text-red-600 mb-2">20.0%</div>
              <p className="text-sm text-gray-700 mb-3">
                Con Gustavo Bolívar en tercer lugar (10.5%), la izquierda experimenta 
                una fragmentación significativa tras el gobierno Petro.
              </p>
              <div className="text-xs text-red-600 font-semibold">
                Caída de -20.3 puntos vs 2022
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-blue-600 p-2 rounded-full">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <h4 className="text-lg font-bold text-gray-900">Centro</h4>
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2">25.6%</div>
              <p className="text-sm text-gray-700 mb-3">
                Sergio Fajardo emerge como líder del centro, posicionándose 
                como alternativa moderada con mejor favorabilidad.
              </p>
              <div className="text-xs text-blue-600 font-semibold">
                Estabilidad relativa (-2.6 puntos)
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-green-600 p-2 rounded-full">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <h4 className="text-lg font-bold text-gray-900">Derecha</h4>
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">32.3%</div>
              <p className="text-sm text-gray-700 mb-3">
                Fragmentada entre múltiples candidatos, con Vicky Dávila 
                como figura emergente y fuerte presencia digital.
              </p>
              <div className="text-xs text-green-600 font-semibold">
                Crecimiento de +3.8 puntos
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comparison View */}
      {activeView === 'comparison' && (
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Evolución del Espectro Político: 2022 vs 2026
          </h3>
          
          <div className="space-y-8">
            {comparisonData.map((item) => (
              <div key={item.trend} className="group">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-gray-900 text-lg group-hover:text-teal-600 transition-colors">
                    {item.trend}
                  </span>
                  <div className="flex items-center space-x-6 text-sm">
                    <span className="text-teal-600 font-semibold">
                      2022: {item[2022]}%
                    </span>
                    <span className="text-teal-600 font-semibold">
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
                          className="h-full bg-teal-500 transition-all duration-1000 ease-out"
                          style={{ width: `${(item[2022] / 50) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 mb-2">2026</div>
                      <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                        <div
                          className="h-full bg-teal-500 transition-all duration-1000 ease-out"
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
                  <li>• La izquierda experimentó la mayor caída (-20.3 puntos)</li>
                  <li>• Los indecisos aumentaron dramáticamente (+19.1 puntos)</li>
                  <li>• La derecha registró crecimiento moderado (+3.8 puntos)</li>
                  <li>• El centro mantuvo relativa estabilidad (-2.6 puntos)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Factores Explicativos</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Desgaste del gobierno Petro</li>
                  <li>• Fragmentación de coaliciones</li>
                  <li>• Emergencia de nuevos liderazgos</li>
                  <li>• Alta volatilidad electoral</li>
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