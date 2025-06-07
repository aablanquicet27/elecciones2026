import React from 'react';
import { getComparisonData } from '../utils/csvParser';

const ComparisonChart: React.FC = () => {
  const data = getComparisonData();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        Evolución del Espectro Político: 2022 vs 2026
      </h3>
      
      <div className="space-y-6">
        {data.map((item) => (
          <div key={item.tendencia} className="group">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                {item.tendencia}
              </span>
              <div className="flex items-center space-x-4 text-sm">
                <span className="text-blue-600 font-semibold">
                  2022: {item.porcentaje2022}%
                </span>
                <span className="text-green-600 font-semibold">
                  2026: {item.porcentaje2026}%
                </span>
                <span className={`font-bold ${
                  item.porcentaje2026 > item.porcentaje2022 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {item.porcentaje2026 > item.porcentaje2022 ? '+' : ''}
                  {(item.porcentaje2026 - item.porcentaje2022).toFixed(1)}%
                </span>
              </div>
            </div>
            
            <div className="relative">
              <div className="flex space-x-2">
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">2022</div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-1000 ease-out"
                      style={{ width: `${(item.porcentaje2022 / 50) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">2026</div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all duration-1000 ease-out"
                      style={{ width: `${(item.porcentaje2026 / 50) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          <p className="mb-2">
            <strong>Principales cambios:</strong>
          </p>
          <ul className="space-y-1 text-xs">
            <li>• La izquierda experimentó una caída drástica de -20.3 puntos</li>
            <li>• La derecha registró crecimiento de +3.8 puntos</li>
            <li>• Los indecisos aumentaron significativamente (+19.1 puntos)</li>
            <li>• El centro mantuvo relativa estabilidad (-2.6 puntos)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ComparisonChart;