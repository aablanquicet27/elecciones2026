import React, { useState } from 'react';
import { Candidate } from '../types/election';
import { ChevronUp, ChevronDown, Search, Filter } from 'lucide-react';

interface CandidateTableProps {
  candidates: Candidate[];
}

type SortField = keyof Candidate;
type SortDirection = 'asc' | 'desc';

const CandidateTable: React.FC<CandidateTableProps> = ({ candidates }) => {
  const [sortField, setSortField] = useState<SortField>('Intención_Voto_Porcentaje');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTrend, setFilterTrend] = useState<string>('');

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredAndSortedCandidates = candidates
    .filter(candidate => 
      candidate.Candidato.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterTrend === '' || candidate.Tendencia_Política === filterTrend)
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();
      
      if (sortDirection === 'asc') {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />;
  };

  const getTrendBadgeColor = (trend: string) => {
    switch (trend) {
      case 'Izquierda': return 'bg-red-100 text-red-800';
      case 'Centro': return 'bg-blue-100 text-blue-800';
      case 'Derecha': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const uniqueTrends = [...new Set(candidates.map(c => c.Tendencia_Política))];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Tabla Completa de Candidatos
        </h3>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar candidato..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={filterTrend}
              onChange={(e) => setFilterTrend(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="">Todas las tendencias</option>
              {uniqueTrends.map(trend => (
                <option key={trend} value={trend}>{trend}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('Ranking')}
              >
                <div className="flex items-center space-x-1">
                  <span>Ranking</span>
                  <SortIcon field="Ranking" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('Candidato')}
              >
                <div className="flex items-center space-x-1">
                  <span>Candidato</span>
                  <SortIcon field="Candidato" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('Intención_Voto_Porcentaje')}
              >
                <div className="flex items-center space-x-1">
                  <span>Intención (%)</span>
                  <SortIcon field="Intención_Voto_Porcentaje" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('Tendencia_Política')}
              >
                <div className="flex items-center space-x-1">
                  <span>Tendencia</span>
                  <SortIcon field="Tendencia_Política" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('Favorabilidad')}
              >
                <div className="flex items-center space-x-1">
                  <span>Favorab.</span>
                  <SortIcon field="Favorabilidad" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('Partido_Movimiento')}
              >
                <div className="flex items-center space-x-1">
                  <span>Partido</span>
                  <SortIcon field="Partido_Movimiento" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('Edad')}
              >
                <div className="flex items-center space-x-1">
                  <span>Edad</span>
                  <SortIcon field="Edad" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedCandidates.map((candidate, index) => (
              <tr key={candidate.Candidato} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">
                    #{candidate.Ranking}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {candidate.Candidato}
                    </div>
                    <div className="text-sm text-gray-500">
                      {candidate.Cargo_Actual}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-bold text-gray-900">
                    {candidate.Intención_Voto_Porcentaje}%
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTrendBadgeColor(candidate.Tendencia_Política)}`}>
                    {candidate.Tendencia_Política}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-green-600 font-medium">
                      +{candidate.Favorabilidad}%
                    </span>
                    <span className="text-sm text-red-600 font-medium">
                      -{candidate.Desfavorabilidad}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">
                    {candidate.Partido_Movimiento}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      {candidate.Edad}
                    </span>
                    <div className="text-xs text-gray-500">
                      {candidate.Generación}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <p className="text-sm text-gray-700">
          Mostrando {filteredAndSortedCandidates.length} de {candidates.length} candidatos
        </p>
      </div>
    </div>
  );
};

export default CandidateTable;