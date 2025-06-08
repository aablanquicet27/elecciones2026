import React from 'react';
import { Candidate } from '../types/election';
import { TrendingUp, TrendingDown, Users, Award } from 'lucide-react';

interface CandidateCardProps {
  candidate: Candidate;
  rank: number;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, rank }) => {
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

  const balance = candidate.Favorabilidad - candidate.Desfavorabilidad;

  // Placeholder image for candidates
  const getPlaceholderImage = (name: string) => {
    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=120&background=7c3aed&color=ffffff&bold=true`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
      <div className="flex items-start space-x-4">
        {/* Ranking Badge */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
            {rank}
          </div>
        </div>

        {/* Candidate Photo */}
        <div className="flex-shrink-0">
          <img
            src={getPlaceholderImage(candidate.Candidato)}
            alt={candidate.Candidato}
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
          />
        </div>

        {/* Candidate Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-gray-900 truncate">
              {candidate.Candidato}
            </h3>
            <div className="flex items-center space-x-1">
              {rank <= 3 && <Award className="h-4 w-4 text-yellow-500" />}
              <span className="text-2xl font-bold text-purple-600">
                {candidate.Intención_Voto_Porcentaje}%
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{candidate.Cargo_Actual}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTrendColor(candidate.Tendencia_Política)}`}>
                {candidate.Tendencia_Política}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{candidate.Partido_Movimiento}</span>
              <span className="text-gray-500">{candidate.Edad} años</span>
            </div>

            {/* Favorability Metrics */}
            <div className="grid grid-cols-3 gap-2 mt-3">
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

            {/* Progress Bar for Voting Intention */}
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${Math.min(candidate.Intención_Voto_Porcentaje * 8, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;