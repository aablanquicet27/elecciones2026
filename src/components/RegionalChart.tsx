import React from 'react';
import { getRegionalData } from '../utils/csvParser';

const RegionalChart: React.FC = () => {
  const data = getRegionalData();
  const candidates = ['Bolívar', 'Fajardo', 'Dávila', 'Cabal', 'Vargas'];
  const colors = ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6'];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        Comportamiento Electoral Regional
      </h3>
      
      <div className="space-y-6">
        {data.map((region) => (
          <div key={region.region} className="group">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                {region.region}
              </span>
              <div className="flex items-center space-x-3 text-sm">
                {candidates.map((candidate, index) => (
                  <span key={candidate} className="font-semibold" style={{ color: colors[index] }}>
                    {candidate}: {region[candidate as keyof typeof region]}%
                  </span>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="flex space-x-1">
                {candidates.map((candidate, index) => (
                  <div key={candidate} className="flex-1">
                    <div className="w-full bg-gray-200 rounded h-4 overflow-hidden">
                      <div
                        className="h-full transition-all duration-1000 ease-out"
                        style={{
                          backgroundColor: colors[index],
                          width: `${(region[candidate as keyof typeof region] / 30) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Dinámicas Regionales Clave</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• <strong>Caribe:</strong> Bolívar domina con 25.9%, seguido por Fajardo (20.1%)</li>
              <li>• <strong>Orinoquía:</strong> Dávila lidera con 15.7%, Cabal segunda (12.3%)</li>
              <li>• <strong>Andina:</strong> Mayor competitividad, Fajardo 12.8%, Dávila 12.5%</li>
              <li>• <strong>Pacífica:</strong> Competencia Bolívar-Fajardo (15.8% vs 14.3%)</li>
              <li>• <strong>Amazonía:</strong> Distribución más equilibrada entre candidatos</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Factores Explicativos</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• <strong>Tradición política:</strong> Caribe históricamente progresista</li>
              <li>• <strong>Desarrollo económico:</strong> Orinoquía más conservadora</li>
              <li>• <strong>Urbanización:</strong> Andina con mayor competitividad</li>
              <li>• <strong>Composición étnica:</strong> Pacífica con voto diferenciado</li>
              <li>• <strong>Conectividad:</strong> Amazonía con dinámicas particulares</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
          <h4 className="font-semibold text-green-900 mb-2">Estrategia Electoral Regional</h4>
          <p className="text-sm text-green-800">
            Las diferencias regionales son marcadas: mientras el Caribe favorece la izquierda, 
            la Orinoquía se inclina hacia la derecha. La región Andina emerge como el territorio 
            más competitivo, donde se definirá gran parte del resultado electoral nacional.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegionalChart;