import React from 'react';
import { getFavorabilityData } from '../utils/csvParser';

interface FavorabilityChartProps {
  limit?: number;
}

const FavorabilityChart: React.FC<FavorabilityChartProps> = ({
  limit = 10
}) => {
  const data = getFavorabilityData().slice(0, limit);
  const maxValue = Math.max(
    ...data.map(c => c.desfavorabilidad)
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">
          Rechazo Electoral (Anti-voto)
        </h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Rechazo</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {data.map((candidate) => {
          return (
            <div key={candidate.candidate} className="group">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                  {candidate.candidate}
                </span>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-red-600 font-semibold">
                    {candidate.desfavorabilidad}%
                  </span>
                </div>
              </div>

              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="h-full bg-red-500 transition-all duration-1000 ease-out"
                    style={{
                      width: `${(candidate.desfavorabilidad / maxValue) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}

        <div className="group">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
              Rechazan a ambos
            </span>
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-red-600 font-semibold">
                22.5%
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="h-full bg-red-500 transition-all duration-1000 ease-out"
                style={{
                  width: `${(22.5 / maxValue) * 100}%`
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="mt-0 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-2">Análisis del Rechazo Electoral</h4>
          <p className="text-sm text-green-800">
            Cepeda tiene el mayor rechazo (43.9%) lo que limita su techo electoral. De la Espriella
            en mejor posición con 33.6% de rechazo. Un 22.5% rechaza a ambos candidatos principales.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FavorabilityChart;
