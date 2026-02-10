import React from 'react';
import { getSocialMediaData } from '../utils/csvParser';

const SocialMediaChart: React.FC = () => {
  const data = getSocialMediaData();

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        Presencia en Redes Sociales
      </h3>
      
      <div className="space-y-6">
        {data.map((candidate) => (
          <div key={candidate.candidate} className="group">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                {candidate.candidate}
              </span>
              <div className="flex items-center space-x-4 text-sm">
                <span className="text-blue-600 font-semibold">
                  Twitter: {formatNumber(candidate.twitter)}
                </span>
                <span className="text-pink-600 font-semibold">
                  Instagram: {formatNumber(candidate.instagram)}
                </span>
                <span className="text-blue-800 font-semibold">
                  Facebook: {formatNumber(candidate.facebook)}
                </span>
                <span className="text-gray-800 font-bold">
                  Total: {formatNumber(candidate.total)}
                </span>
              </div>
            </div>
            
            <div className="relative">
              <div className="flex space-x-2">
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">Twitter</div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-1000 ease-out"
                      style={{ width: `${(candidate.twitter / 1500000) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">Instagram</div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-pink-500 transition-all duration-1000 ease-out"
                      style={{ width: `${(candidate.instagram / 1500000) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">Facebook</div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-blue-800 transition-all duration-1000 ease-out"
                      style={{ width: `${(candidate.facebook / 1500000) * 100}%` }}
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
            <h4 className="font-semibold text-gray-800 mb-3">Liderazgo Digital</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• <strong>Vicky Dávila:</strong> Líder absoluto con 3.6M seguidores totales</li>
              <li>• <strong>Claudia López:</strong> Segunda con 3.5M, fuerte en Facebook</li>
              <li>• <strong>Iván Cepeda:</strong> 1.65M seguidores, fuerte en Twitter</li>
              <li>• <strong>Sergio Fajardo:</strong> 1.91M seguidores, crecimiento sostenido</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Estrategias Digitales</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• <strong>Twitter:</strong> Debate político y noticias en tiempo real</li>
              <li>• <strong>Instagram:</strong> Contenido visual y conexión personal</li>
              <li>• <strong>Facebook:</strong> Alcance masivo y segmentación demográfica</li>
              <li>• <strong>Engagement:</strong> Interacción directa con electores</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Impacto Electoral Digital</h4>
          <p className="text-sm text-blue-800">
            La presencia digital se ha convertido en un factor determinante. Vicky Dávila y 
            Claudia López lideran con estrategias multimedia efectivas, mientras que candidatos 
            tradicionales muestran menor adaptación a las nuevas dinámicas de comunicación política.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaChart;