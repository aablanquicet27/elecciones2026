import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, Users, Award, ExternalLink } from 'lucide-react';
import { Candidate } from '../types/election';

interface CandidateGridProps {
  candidates: Candidate[];
}

const CandidateGrid: React.FC<CandidateGridProps> = ({ candidates }) => {
  const getPlaceholderImage = (name: string) => {
    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=200&background=7c3aed&color=ffffff&bold=true`;
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'Izquierda': return 'bg-red-100 text-red-800 border-red-200';
      case 'Centro': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Derecha': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getBalanceColor = (balance: number) => {
    if (balance > 0) return 'text-green-600';
    if (balance < -10) return 'text-red-600';
    return 'text-orange-600';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {candidates.map((candidate, index) => {
        const balance = candidate.Favorabilidad - candidate.Desfavorabilidad;
        const slug = candidate.Candidato.toLowerCase().replace(/\s+/g, '-');
        
        return (
          <div 
            key={candidate.Candidato}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
          >
            {/* Ranking Badge */}
            <div className="relative">
              <div className="absolute top-4 left-4 z-10">
                <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm shadow-lg">
                  {index + 1}
                </div>
              </div>
              
              {index < 3 && (
                <div className="absolute top-4 right-4 z-10">
                  <Award className="h-6 w-6 text-yellow-500" />
                </div>
              )}

              {/* Candidate Photo */}
              <div className="relative h-48 bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
                <img
                  src={getPlaceholderImage(candidate.Candidato)}
                  alt={candidate.Candidato}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>

            <div className="p-6">
              {/* Name and Voting Intention */}
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                  {candidate.Candidato}
                </h3>
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {candidate.Intención_Voto_Porcentaje}%
                </div>
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getTrendColor(candidate.Tendencia_Política)}`}>
                  {candidate.Tendencia_Política}
                </div>
              </div>

              {/* Current Position */}
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600">{candidate.Cargo_Actual}</p>
                <p className="text-xs text-gray-500">{candidate.Partido_Movimiento}</p>
              </div>

              {/* Favorability Metrics */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span className="text-sm font-semibold text-green-600">
                      {candidate.Favorabilidad}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">Favorab.</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <TrendingDown className="h-3 w-3 text-red-600" />
                    <span className="text-sm font-semibold text-red-600">
                      {candidate.Desfavorabilidad}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">Desfavorab.</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <Users className="h-3 w-3 text-gray-600" />
                    <span className={`text-sm font-semibold ${getBalanceColor(balance)}`}>
                      {balance > 0 ? '+' : ''}{balance}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">Balance</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${Math.min(candidate.Intención_Voto_Porcentaje * 8, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                <span>{candidate.Edad} años</span>
                <span>{candidate.Generación}</span>
              </div>

              {/* Action Button */}
              <Link
                to={`/candidato/${slug}`}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors duration-300 flex items-center justify-center space-x-2 group-hover:shadow-lg"
              >
                <span className="text-sm font-medium">Ver Perfil</span>
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CandidateGrid;