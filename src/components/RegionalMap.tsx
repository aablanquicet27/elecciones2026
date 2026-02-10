import React, { useState } from 'react';
import { MapPin, TrendingUp, BarChart3 } from 'lucide-react';

const RegionalMap: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const regionalData = [
    {
      region: 'Caribe',
      lider: 'Cepeda',
      color: '#ef4444',
      description: 'Cepeda mantiene liderazgo en la costa atlántica',
      insights: [
        'Tradición política progresista',
        'Influencia de líderes locales de izquierda',
        'Fuerte apoyo entre sectores populares'
      ]
    },
    {
      region: 'Pacífica',
      lider: 'Cepeda',
      color: '#ef4444',
      description: 'Cepeda lidera con apoyo de movimientos sociales',
      insights: [
        'Influencia de temas sociales y étnicos',
        'Voto étnico significativo',
        'Apoyo a propuestas de izquierda'
      ]
    },
    {
      region: 'Bogotá',
      lider: 'Espriella',
      color: '#22c55e',
      description: 'Espriella domina la capital del país',
      insights: [
        'Influencia del electorado urbano',
        'Mayor acceso a información política',
        'Clase media inclinada hacia la derecha'
      ]
    },
    {
      region: 'Centro-Oriente',
      lider: 'Espriella',
      color: '#22c55e',
      description: 'Espriella lidera en la región centro-oriental',
      insights: [
        'Influencia del sector empresarial',
        'Tradición conservadora',
        'Voto urbano-rural equilibrado'
      ]
    },
    {
      region: 'Eje Cafetero',
      lider: 'Espriella',
      color: '#22c55e',
      description: 'Espriella consolida apoyo en el eje cafetero',
      insights: [
        'Región tradicionalmente conservadora',
        'Influencia del sector agroindustrial',
        'Preferencia por candidatos de derecha'
      ]
    },
    {
      region: 'Llanos',
      lider: 'Espriella',
      color: '#22c55e',
      description: 'Espriella lidera en la región llanera',
      insights: [
        'Influencia del sector agropecuario',
        'Inclinación hacia la derecha',
        'Menor presencia de izquierda'
      ]
    },
    {
      region: 'Amazonía',
      lider: 'Espriella',
      color: '#22c55e',
      description: 'Espriella obtiene ventaja en la Amazonía',
      insights: [
        'Dinámicas electorales particulares',
        'Conectividad limitada influye en el voto',
        'Preferencia por propuestas de orden'
      ]
    }
  ];

  const cepedaCount = regionalData.filter(r => r.lider === 'Cepeda').length;
  const espriellaCount = regionalData.filter(r => r.lider === 'Espriella').length;

  return (
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-white mb-4">
          Comportamiento Electoral Regional
        </h2>
        <p className="text-xl text-purple-100 max-w-3xl mx-auto">
          Análisis del liderazgo por regiones: Espriella domina {espriellaCount} de {regionalData.length} regiones
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Regional Cards */}
        <div className="space-y-4">
          {regionalData.map((region) => (
            <div
              key={region.region}
              className={`bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                selectedRegion === region.region ? 'ring-2 ring-purple-400 bg-white/20' : ''
              }`}
              onClick={() => setSelectedRegion(selectedRegion === region.region ? null : region.region)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-full">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {region.region}
                  </h3>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className="inline-block w-3 h-3 rounded-full"
                    style={{ backgroundColor: region.color }}
                  ></span>
                  <span className="text-lg font-semibold text-white">
                    {region.lider}
                  </span>
                </div>
              </div>

              <p className="text-purple-100 mb-3 text-sm">
                {region.description}
              </p>

              {/* Leader Color Bar */}
              <div className="flex items-center space-x-3">
                <div className="flex-1 bg-white/20 rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all duration-1000"
                    style={{
                      width: '100%',
                      backgroundColor: region.color
                    }}
                  ></div>
                </div>
                <span className="text-xs font-semibold text-white whitespace-nowrap">
                  Líder: {region.lider}
                </span>
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
                      <div className="flex items-center space-x-2">
                        <span
                          className="inline-block w-4 h-4 rounded-full"
                          style={{ backgroundColor: region.color }}
                        ></span>
                        <span className="text-xl font-bold text-white">
                          {region.lider}
                        </span>
                      </div>
                      <div className="text-purple-200 mt-1">
                        {region.description}
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
                        <span className="text-white font-semibold">Contexto Regional</span>
                      </div>
                      <div className="text-purple-200">
                        {region.lider === 'Cepeda'
                          ? 'Región con inclinación hacia la izquierda - Cepeda consolida apoyo'
                          : 'Región con inclinación hacia la derecha - Espriella consolida apoyo'}
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
                Espriella domina {espriellaCount} de {regionalData.length} regiones
              </h3>
              <p className="text-purple-100 mb-6">
                Haz clic en cualquier región para ver el análisis detallado
                del comportamiento electoral y factores determinantes.
              </p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="flex items-center justify-center space-x-2 mb-1">
                    <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: '#22c55e' }}></span>
                    <span className="text-white font-semibold">Espriella</span>
                  </div>
                  <div className="text-purple-200">{espriellaCount} regiones</div>
                  <div className="text-purple-300 text-xs mt-1">Bogotá, Centro-Oriente, Eje Cafetero, Llanos, Amazonía</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="flex items-center justify-center space-x-2 mb-1">
                    <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: '#ef4444' }}></span>
                    <span className="text-white font-semibold">Cepeda</span>
                  </div>
                  <div className="text-purple-200">{cepedaCount} regiones</div>
                  <div className="text-purple-300 text-xs mt-1">Caribe, Pacífica</div>
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
