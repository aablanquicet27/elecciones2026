import { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { senadoParties, PartyData } from '../../data/senadoData';

const getRiskColor = (level: PartyData['riskLevel']) => {
  switch (level) {
    case 'low': return 'bg-green-100 text-green-800 border-green-200';
    case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'high': return 'bg-red-100 text-red-800 border-red-200';
  }
};

const getRiskLabel = (level: PartyData['riskLevel']) => {
  switch (level) {
    case 'low': return 'Bajo Riesgo';
    case 'medium': return 'Medio Riesgo';
    case 'high': return 'Alto Riesgo';
  }
};

const getRiskIcon = (level: PartyData['riskLevel']) => {
  switch (level) {
    case 'low': return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    case 'medium': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    case 'high': return <ShieldAlert className="w-5 h-5 text-red-600" />;
  }
};

const getTendencyColor = (tendency: PartyData['tendency']) => {
  switch (tendency) {
    case 'Izquierda': return 'bg-red-100 text-red-700';
    case 'Centro-Izquierda': return 'bg-orange-100 text-orange-700';
    case 'Centro': return 'bg-yellow-100 text-yellow-700';
    case 'Centro-Derecha': return 'bg-blue-100 text-blue-700';
    case 'Derecha': return 'bg-indigo-100 text-indigo-700';
  }
};

const PartyCard = ({ party }: { party: PartyData }) => {
  const [expanded, setExpanded] = useState(false);
  const hasCuestionados = party.questionedCandidates && party.questionedCandidates.length > 0;

  return (
    <div className="card-premium overflow-hidden flex flex-col h-full relative">
      {/* Tarjetón number badge */}
      <div className="absolute top-0 right-0 bg-purple-600 text-white font-black text-2xl w-16 h-16 flex items-center justify-center rounded-bl-3xl shadow-md z-10">
        #{party.number}
      </div>

      <div className="p-6 md:p-8 flex-1 pt-12">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-bold text-gray-900 leading-tight pr-10">{party.name}</h3>
        </div>

        {/* Risk badge */}
        <div className="mb-4">
          <span className={`px-4 py-1.5 rounded-full text-sm font-bold border inline-flex items-center gap-2 ${getRiskColor(party.riskLevel)}`}>
            {getRiskIcon(party.riskLevel)}
            {getRiskLabel(party.riskLevel)}
          </span>
        </div>

        {/* Coalition */}
        {party.coalition && party.coalition.length > 0 && (
          <p className="text-sm text-gray-500 mb-4 font-medium">
            <span className="text-gray-700">Coalición:</span> {party.coalition.join(' + ')}
          </p>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getTendencyColor(party.tendency)}`}>
            {party.tendency}
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
            Lista {party.listType}
          </span>
          {hasCuestionados && (
            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-bold">
              {party.questionedCandidates.length} cuestionado{party.questionedCandidates.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        <p className="text-gray-600 mb-2">{party.description}</p>
      </div>

      {/* Expandable questioned candidates */}
      {hasCuestionados && (
        <div className="border-t border-gray-100">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
          >
            <span className="font-semibold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Ver candidatos cuestionados ({party.questionedCandidates.length})
            </span>
            {expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>

          {expanded && (
            <div className="px-6 pb-6 pt-2 bg-red-50/30">
              <ul className="space-y-4">
                {party.questionedCandidates.map((c, i) => (
                  <li key={i} className="flex flex-col gap-1 text-sm text-gray-700">
                    <span className="font-bold text-gray-900 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                      {c.name}
                    </span>
                    <span className="pl-3.5 text-gray-600 leading-relaxed">{c.allegation}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const SenadoPartyGrid = () => {
  const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const filteredParties = senadoParties.filter(party => {
    if (riskFilter === 'all') return true;
    return party.riskLevel === riskFilter;
  });

  return (
    <section className="section-premium bg-white">
      <div className="container mx-auto px-6 lg:px-12">
        <header className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">El Tarjetón del Senado</h2>
          <p className="text-xl text-gray-600">
            Conoce las 16 listas que compiten por las 100 curules nacionales más 3 de comunidades indígenas. Revisa quiénes las componen y su nivel de riesgo antes de votar.
          </p>
        </header>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          <button
            onClick={() => setRiskFilter('all')}
            className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all ${riskFilter === 'all' ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
          >
            Todos ({senadoParties.length})
          </button>
          <button
            onClick={() => setRiskFilter('high')}
            className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all flex items-center gap-2 ${riskFilter === 'high' ? 'bg-red-100 text-red-800 border-red-200 border' : 'bg-white text-gray-600 hover:bg-red-50 border border-gray-200'}`}
          >
            <ShieldAlert className="w-4 h-4" />
            Alto Riesgo ({senadoParties.filter(p => p.riskLevel === 'high').length})
          </button>
          <button
            onClick={() => setRiskFilter('medium')}
            className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all flex items-center gap-2 ${riskFilter === 'medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200 border' : 'bg-white text-gray-600 hover:bg-yellow-50 border border-gray-200'}`}
          >
            <AlertTriangle className="w-4 h-4" />
            Medio Riesgo ({senadoParties.filter(p => p.riskLevel === 'medium').length})
          </button>
          <button
            onClick={() => setRiskFilter('low')}
            className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all flex items-center gap-2 ${riskFilter === 'low' ? 'bg-green-100 text-green-800 border-green-200 border' : 'bg-white text-gray-600 hover:bg-green-50 border border-gray-200'}`}
          >
            <CheckCircle2 className="w-4 h-4" />
            Bajo Riesgo ({senadoParties.filter(p => p.riskLevel === 'low').length})
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredParties.map((party) => (
            <PartyCard key={party.id} party={party} />
          ))}
        </div>

        {filteredParties.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No hay partidos que coincidan con este filtro.
          </div>
        )}
      </div>
    </section>
  );
};

export default SenadoPartyGrid;
