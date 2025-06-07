import React from 'react';
import { TrendData } from '../types/election';

interface TrendChartProps {
  data: TrendData[];
}

const TrendChart: React.FC<TrendChartProps> = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.porcentaje, 0);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        Distribución por Tendencia Política
      </h3>
      
      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.tendencia} className="group">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                {item.tendencia}
              </span>
              <span className="font-bold text-lg text-gray-900">
                {item.porcentaje}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="h-full transition-all duration-1000 ease-out rounded-full"
                style={{
                  width: `${(item.porcentaje / total) * 100}%`,
                  backgroundColor: item.color
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Total analizado:</span>
            <span className="font-semibold ml-2">{total.toFixed(1)}%</span>
          </div>
          <div>
            <span className="text-gray-600">Indecisos:</span>
            <span className="font-semibold ml-2">{(100 - total).toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendChart;