import React from 'react';
import { getRegionalData } from '../utils/csvParser';

const RegionalChart: React.FC = () => {
  const data = getRegionalData();

  const cepedaRegions = data.filter(r => r.lider.includes('Cepeda'));
  const espriellaRegions = data.filter(r => r.lider.includes('Espriella'));

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        Comportamiento Electoral Regional
      </h3>

      <div className="space-y-4">
        {data.map((region) => (
          <div key={region.region} className="group">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                {region.region}
              </span>
              <div className="flex items-center space-x-2">
                <span
                  className="inline-block w-3 h-3 rounded-full"
                  style={{ backgroundColor: region.color }}
                ></span>
                <span className="font-semibold text-sm" style={{ color: region.color }}>
                  {region.lider.split(' ').pop()}
                </span>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  backgroundColor: region.color,
                  width: '100%'
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center space-x-6">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: '#ef4444' }}></span>
          <span className="text-sm text-gray-700 font-medium">Cepeda ({cepedaRegions.length} regiones)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: '#22c55e' }}></span>
          <span className="text-sm text-gray-700 font-medium">Espriella ({espriellaRegions.length} regiones)</span>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Dinámicas Regionales Clave</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• <strong>Espriella domina 5 de 7 regiones:</strong> Bogotá, Centro-Oriente, Eje Cafetero, Llanos y Amazonía</li>
              <li>• <strong>Cepeda lidera 2 regiones:</strong> Caribe y Pacífica, zonas con tradición progresista</li>
              <li>• <strong>Bogotá:</strong> Espriella consolida apoyo en la capital</li>
              <li>• <strong>Caribe:</strong> Cepeda mantiene liderazgo en la costa atlántica</li>
              <li>• <strong>Pacífica:</strong> Cepeda con apoyo de movimientos sociales y étnicos</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Factores Explicativos</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• <strong>Tradición política:</strong> Caribe y Pacífica históricamente progresistas</li>
              <li>• <strong>Sector empresarial:</strong> Centro-Oriente y Bogotá inclinados a la derecha</li>
              <li>• <strong>Eje Cafetero:</strong> Región tradicionalmente conservadora</li>
              <li>• <strong>Llanos:</strong> Influencia del sector agropecuario</li>
              <li>• <strong>Amazonía:</strong> Dinámicas particulares con preferencia por propuestas de orden</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-2">Estrategia Electoral Regional</h4>
          <p className="text-sm text-green-800">
            Espriella domina la mayoría del mapa electoral con 5 de 7 regiones, consolidando su ventaja
            en zonas urbanas y conservadoras. Cepeda retiene Caribe y Pacífica, regiones con fuerte
            tradición de izquierda. La batalla regional será clave para definir el resultado nacional.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegionalChart;
