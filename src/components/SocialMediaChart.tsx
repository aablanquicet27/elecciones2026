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

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Líder digital:</span>
            <span className="font-semibold ml-2">Vicky Dávila</span>
          </div>
          <div>
            <span className="text-gray-600">Mayor crecimiento:</span>
            <span className="font-semibold ml-2">Jota Pe Hernández</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaChart;