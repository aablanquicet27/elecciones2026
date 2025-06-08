import React, { useState } from 'react';
import { MapPin, TrendingUp, Users, BarChart3 } from 'lucide-react';

const RegionalMap: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const regionalData = [
    {
      region: 'Caribe',
      leader: 'Gustavo Bolívar',
      percentage: 25.9,
      description: 'Fuerte liderazgo de la izquierda en la costa atlántica',
      candidates: [
        { name: 'Gustavo Bolívar', percentage: 25.9, color: '#ef4444' },
        { name: 'Sergio Fajardo', percentage: 20.1, color: '#3b82f6' },
        { name: 'Vicky Dávila', percentage: 12.3, color: '#22c55e' },
        { name: 'María F. Cabal', percentage: 8.1, color: '#f59e0b' }
      ],
      insights: [
        'Mayor concentración de voto de izquierda',
        'Tradición política progresista',
        'Influencia de líderes locales'
      ]
    },
    {
      region: 'Andina',
      leader: 'Sergio Fajardo',
      percentage: 12.8,
      description: 'Región más competitiva con distribución equilibrada',
      candidates: [
        { name: 'Sergio Fajardo', percentage: 12.8, color: '#3b82f6' },
        { name: 'Vicky Dávila', percentage: 12.5, color: '#22c55e' },
        { name: 'Gustavo Bolívar', percentage: 10.2, color: '#ef4444' },
        { name: 'María F. Cabal', percentage: 9.3, color: '#f59e0b' }
      ],
      insights: [
        'Mayor competitividad electoral',
        'Voto más fragmentado',
        'Influencia urbana significativa'
      ]
    },
    {
      region: 'Orinoquía',
      leader: 'Vicky Dávila',
      percentage: 15.7,
      description: 'Preferencia por candidatos de derecha',
      candidates: [
        { name: 'Vicky Dávila', percentage: 15.7, color: '#22c55e' },
        { name: 'María F. Cabal', percentage: 12.3, color: '#f59e0b' },
        { name: 'Gustavo Bolívar', percentage: 8.5, color: '#ef4444' },
        { name: 'Sergio Fajardo', percentage: 7.2, color: '#3b82f6' }
      ],
      insights: [
        'Inclinación hacia la derecha',
        'Influencia del sector agropecuario',
        'Menor presencia de izquierda'
      ]
    },
    {
      region: 'Pacífica',
      leader: 'Gustavo Bolívar',
      percentage: 15.8,
      description: 'Competencia entre izquierda y centro',
      candidates: [
        { name: 'Gustavo Bolívar', percentage: 15.8, color: '#ef4444' },
        { name: 'Sergio Fajardo', percentage: 14.3, color: '#3b82f6' },
        { name: 'Vicky Dávila', percentage: 11.8, color: '#22c55e' },
        { name: 'María F. Cabal', percentage: 9.5, color: '#f59e0b' }
      ],
      insights: [
        'Competencia izquierda-centro',
        'Influencia de temas sociales',
        'Voto étnico significativo'
      ]
    }
  ];

  return (
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-white mb-4">
          Comportamiento Electoral Regional
        </h2>
        <p className="text-xl text-purple-100 max-w-3xl mx-auto">
          Análisis del voto por regiones y dinámicas territoriales específicas
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Regional Cards */}
        <div className="space-y-6">
          {regionalData.map((region) => (
            <div
              key={region.region}
              className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                selectedRegion === region.region ? 'ring-2 ring-purple-400 bg-white/20' : ''
              }`}
              onClick={() => setSelectedRegion(selectedRegion === region.region ? null : region.region)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-full">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {region.region}
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">
                    {region.percentage}%
                  </div>
                  <div className="text-sm text-purple-200">
                    {region.leader}
                  </div>
                </div>
              </div>

              <p className="text-purple-100 mb-4">
                {region.description}
              </p>

              {/* Candidates Bar */}
              <div className="space-y-2">
                {region.candidates.map((candidate) => (
                  <div key={candidate.name} className="flex items-center space-x-3">
                    <div className="w-24 text-xs text-white">
                      {candidate.name.split(' ')[0]} {candidate.name.split(' ')[1]?.[0]}.
                    </div>
                    <div className="flex-1 bg-white/20 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-1000"
                        style={{
                          width: `${(candidate.percentage / 30) * 100}%`,
                          backgroundColor: candidate.color
                        }}
                      ></div>
                    </div>
                    <div className="text-xs text-white font-semibold w-12 text-right">
                      {candidate.percentage}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Analysis */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          {selectedRegion ? (
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">
                Análisis Detallado: {selectedRegion}
              </h3>
              
              {(() => {
                const region = regionalData.find(r => r.region === selectedRegion);
                if (!region) return null;
                
                return (
                  <div className="space-y-6">
                    {/* Leader Info */}
                    <div className="bg-white/10 rounded-xl p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="bg-purple-500 p-2 rounded-full">
                          <TrendingUp className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-white font-semibold">Líder Regional</span>
                      </div>
                      <div className="text-xl font-bold text-white mb-1">
                        {region.leader}
                      </div>
                      <div className="text-purple-200">
                        {region.percentage}% de intención de voto
                      </div>
                    </div>

                    {/* Insights */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">
                        Factores Clave
                      </h4>
                      <ul className="space-y-2">
                        {region.insights.map((insight, index) => (
                          <li key={index} className="flex items-start space-x-2 text-purple-100">
                            <span className="text-purple-400 mt-1">•</span>
                            <span>{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Competition Level */}
                    <div className="bg-white/10 rounded-xl p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="bg-purple-500 p-2 rounded-full">
                          <BarChart3 className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-white font-semibold">Nivel de Competencia</span>
                      </div>
                      <div className="text-purple-200">
                        {region.region === 'Andina' ? 'Muy Alta - Distribución equilibrada' :
                         region.region === 'Caribe' ? 'Baja - Liderazgo claro' :
                         region.region === 'Orinoquía' ? 'Media - Preferencia definida' :
                         'Media-Alta - Competencia bipolar'}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          ) : (
            <div className="text-center">
              <div className="bg-white/20 p-4 rounded-full w-fit mx-auto mb-6">
                <MapPin className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Selecciona una Región
              </h3>
              <p className="text-purple-100 mb-6">
                Haz clic en cualquier región para ver el análisis detallado 
                del comportamiento electoral y factores determinantes.
              </p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-white font-semibold">Más Competitiva</div>
                  <div className="text-purple-200">Región Andina</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-white font-semibold">Liderazgo Claro</div>
                  <div className="text-purple-200">Región Caribe</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegionalMap;