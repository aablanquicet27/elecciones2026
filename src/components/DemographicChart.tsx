import React from 'react';
import { getDemographicData } from '../utils/csvParser';

const DemographicChart: React.FC = () => {
  const data = getDemographicData();
  const candidates = ['Bolívar', 'Fajardo', 'Dávila', 'Cabal', 'Vargas'];
  const colors = ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6'];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        Análisis Demográfico por Edad
      </h3>
      
      <div className="space-y-6">
        {data.map((ageGroup) => (
          <div key={ageGroup.ageGroup} className="group">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                {ageGroup.ageGroup}
              </span>
              <div className="flex items-center space-x-3 text-sm">
                {candidates.map((candidate, index) => (
                  <span key={candidate} className="font-semibold" style={{ color: colors[index] }}>
                    {candidate}: {ageGroup[candidate as keyof typeof ageGroup]}%
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
                          width: `${(ageGroup[candidate as keyof typeof ageGroup] / 20) * 100}%`
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
            <h4 className="font-semibold text-gray-800 mb-3">Hallazgos Clave por Edad</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• <strong>Jóvenes (18-24):</strong> Bolívar domina con 18.5%</li>
              <li>• <strong>Adultos Mayores (55+):</strong> Dávila lidera con 14.2%</li>
              <li>• <strong>Fajardo:</strong> Mantiene estabilidad en todos los grupos</li>
              <li>• <strong>Polarización generacional:</strong> Diferencias marcadas entre edades</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Implicaciones Electorales</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• <strong>Movilización juvenil:</strong> Clave para candidatos de izquierda</li>
              <li>• <strong>Voto adulto mayor:</strong> Más conservador y estable</li>
              <li>• <strong>Segmento medio:</strong> Mayor competitividad entre candidatos</li>
              <li>• <strong>Estrategias diferenciadas:</strong> Mensajes por grupo etario</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
          <h4 className="font-semibold text-purple-900 mb-2">Análisis Generacional</h4>
          <p className="text-sm text-purple-800">
            La polarización generacional es evidente: los jóvenes favorecen candidatos de izquierda 
            (Bolívar 18.5%), mientras los adultos mayores prefieren opciones de centro-derecha 
            (Dávila 14.2%, Vargas 8.2%). Esta división generacional será determinante en la 
            estrategia de movilización electoral.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DemographicChart;