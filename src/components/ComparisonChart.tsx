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
                <span className={`font-bold text-lg ${
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

      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Principales Cambios</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• <strong>Izquierda:</strong> Caída de -10.6 puntos (40.3% → 29.7%)</li>
                              <li>• <strong>Otros/Indecisos:</strong> Reducción de -11.3 puntos (21.0% → 9.7%)</li>
                <li>• <strong>Derecha:</strong> Crecimiento significativo de +7.7 puntos (28.5% → 36.2%)</li>
                <li>• <strong>Centro:</strong> Reducción de -3.8 puntos (28.2% → 24.4%)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Factores Explicativos</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• <strong>Desgaste gubernamental:</strong> Evaluación del gobierno Petro</li>
              <li>• <strong>Fragmentación política:</strong> Ruptura de coaliciones tradicionales</li>
              <li>• <strong>Nuevos liderazgos:</strong> Emergencia de figuras independientes</li>
              <li>• <strong>Desconfianza institucional:</strong> Aumento significativo de indecisos</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg">
          <h4 className="font-semibold text-red-900 mb-2">Recomposición del Mapa Político</h4>
          <p className="text-sm text-red-800">
            La transformación más significativa es el colapso del bloque de izquierda (-17.3 puntos) 
            y el aumento exponencial de indecisos (+18.0 puntos), evidenciando una crisis de 
            representación política y alta volatilidad electoral que caracterizará las elecciones 2026.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComparisonChart;