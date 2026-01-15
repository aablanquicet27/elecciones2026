import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { Candidate } from '../types/election';
import { getCandidateImage } from '../utils/candidateImages';

interface CandidateGridProps {
  candidates: Candidate[];
}

const CandidateGrid: React.FC<CandidateGridProps> = ({ candidates }) => {
  const getImage = (name: string) => getCandidateImage(name, 200);

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'Izquierda': return 'bg-red-50 text-red-700 border-red-100';
      case 'Centro': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Derecha': return 'bg-green-50 text-green-700 border-green-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  const getBalanceColor = (balance: number) => {
    if (balance > 0) return 'text-green-600';
    if (balance < -10) return 'text-red-600';
    return 'text-amber-600';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {candidates.map((candidate, index) => {
        const balance = candidate.Favorabilidad - candidate.Desfavorabilidad;
        const slug = candidate.Candidato.toLowerCase().replace(/\s+/g, '-');
        
        return (
          <article 
            key={candidate.Candidato}
            className="group bg-white rounded-2xl border border-purple-100 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-200 transition-all duration-500 hover:-translate-y-1 overflow-hidden"
          >
            {/* Header with photo */}
            <div className="relative p-8 pb-0">
              {/* Ranking Badge */}
              <div className="absolute top-6 left-6 z-10">
                <span className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg shadow-lg">
                  {index + 1}
                </span>
              </div>

              {/* Candidate Photo */}
              <div className="flex justify-center">
                <img
                  src={getImage(candidate.Candidato)}
                  alt={`Foto de ${candidate.Candidato}, candidato presidencial Colombia 2026`}
                  className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="p-8 pt-6">
              {/* Name and Voting Intention */}
              <div className="text-center mb-6">
                <h3 className="candidate-name text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                  {candidate.Candidato}
                </h3>
                <div className="percentage-large mb-3">
                  {candidate.Intención_Voto_Porcentaje}%
                </div>
                <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold border ${getTrendColor(candidate.Tendencia_Política)}`}>
                  {candidate.Tendencia_Política}
                </span>
              </div>

              {/* Current Position */}
              <div className="text-center mb-6">
                <p className="text-gray-700 font-medium">{candidate.Cargo_Actual}</p>
                <p className="text-gray-500 text-sm mt-1">{candidate.Partido_Movimiento}</p>
              </div>

              {/* Favorability Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-t border-b border-gray-100">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-lg font-bold text-green-600">
                      {candidate.Favorabilidad}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Favorab.</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <TrendingDown className="h-4 w-4 text-red-600" />
                    <span className="text-lg font-bold text-red-600">
                      {candidate.Desfavorabilidad}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Desfavorab.</div>
                </div>
                <div className="text-center">
                  <span className={`text-lg font-bold ${getBalanceColor(balance)}`}>
                    {balance > 0 ? '+' : ''}{balance}
                  </span>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Balance</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${Math.min(candidate.Intención_Voto_Porcentaje * 3.5, 100)}%` }}
                    role="progressbar"
                    aria-valuenow={candidate.Intención_Voto_Porcentaje}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  ></div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="flex justify-between items-center text-sm text-gray-500 mb-6">
                <span>{candidate.Edad} años</span>
                <span>{candidate.Generación}</span>
              </div>

              {/* Action Button */}
              <Link
                to={`/candidato/${slug}`}
                className="w-full bg-gray-900 text-white py-4 px-6 rounded-xl hover:bg-purple-600 transition-all duration-300 flex items-center justify-center space-x-2 group-hover:shadow-lg font-semibold text-lg"
                aria-label={`Ver perfil completo de ${candidate.Candidato}`}
              >
                <span>Ver Perfil</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default CandidateGrid;