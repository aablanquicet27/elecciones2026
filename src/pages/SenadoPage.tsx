import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp,
  FileText,
  Map,
  TrendingUp,
  Landmark,
  Scale
} from 'lucide-react';
import { senadoParties, senadoStats, PartyData } from '../data/senadoData';
import Footer from '../components/Footer';

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

const PartyCard = ({ party }: { party: PartyData }) => {
  const [expanded, setExpanded] = useState(false);
  const hasCuestionados = party.questionedCandidates && party.questionedCandidates.length > 0;

  return (
    <div className="card-premium overflow-hidden flex flex-col h-full relative">
      <div className="p-6 md:p-8 flex-1 pt-12">
        <div className="absolute top-0 right-0 bg-purple-600 text-white font-black text-2xl w-16 h-16 flex items-center justify-center rounded-bl-3xl shadow-md">
          #{party.number}
        </div>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-bold text-gray-900 leading-tight pr-10">{party.name}</h3>
        </div>
        
        <div className="mb-4">
          <span className={`px-4 py-1.5 rounded-full text-sm font-bold border inline-flex items-center gap-2 ${getRiskColor(party.riskLevel)}`}>
            {getRiskIcon(party.riskLevel)}
            {getRiskLabel(party.riskLevel)}
          </span>
        </div>

        {party.coalition && party.coalition.length > 0 && (
          <p className="text-sm text-gray-500 mb-4 font-medium">
            <span className="text-gray-700">Coalición:</span> {party.coalition.join(' + ')}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mb-6">
          <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium">
            {party.tendency}
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
            Lista {party.listType}
          </span>
        </div>

        <p className="text-gray-600 mb-6">{party.description}</p>
      </div>

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

const SenadoPage = () => {
  const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const filteredParties = senadoParties.filter(party => {
    if (riskFilter === 'all') return true;
    return party.riskLevel === riskFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Premium Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 nav-premium" role="navigation">
        <div className="container mx-auto px-6 lg:px-12 py-5">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-4 group">
              <ArrowLeft className="h-6 w-6 text-gray-500 group-hover:text-purple-600 transition-colors" />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900 tracking-tight leading-tight">Volver a Presidenciales</span>
              </div>
            </Link>
            
            <div className="hidden md:flex items-center space-x-2">
              <img src="/logoagapai.png" alt="Logo" className="h-8 w-8" />
              <span className="font-bold text-gray-900">Colombia 2026</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 bg-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541872703-74c5e44368f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/90 via-purple-900/80 to-purple-900"></div>
        
        <div className="container mx-auto px-6 lg:px-12 relative z-10 text-center">
          <span className="inline-block py-1.5 px-4 rounded-full bg-purple-800/50 border border-purple-500/30 text-purple-200 font-semibold text-sm mb-8 tracking-wider uppercase">
            Elecciones Legislativas • 8 de Marzo 2026
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 tracking-tighter leading-none">
            El 90% de Colombia no vota.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
              El otro 10% elige por todos.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto leading-relaxed mb-12 font-medium">
            8 de marzo decides el futuro. 103 senadores decidirán el rumbo de las reformas, el control político y el futuro del país hasta 2030. Tu voto al Congreso es tan importante como el presidencial.
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-gray-100 relative z-20 -mt-10 mx-6 md:mx-12 rounded-3xl shadow-xl shadow-purple-900/5">
        <div className="container mx-auto px-4 md:px-8 py-8 md:py-10">
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-y-8 gap-x-4">
            <div className="text-center px-2">
              <div className="flex justify-center mb-3 text-purple-600"><Landmark className="h-8 w-8" /></div>
              <div className="text-3xl md:text-4xl font-black text-gray-900 mb-1">{senadoStats.curules}</div>
              <div className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wide">Senadores</div>
            </div>
            <div className="text-center px-2">
              <div className="flex justify-center mb-3 text-purple-600"><Users className="h-8 w-8" /></div>
              <div className="text-3xl md:text-4xl font-black text-gray-900 mb-1">{senadoStats.partidos}</div>
              <div className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wide">Partidos</div>
            </div>
            <div className="text-center px-2">
              <div className="flex justify-center mb-3 text-purple-600"><FileText className="h-8 w-8" /></div>
              <div className="text-3xl md:text-4xl font-black text-gray-900 mb-1">{senadoStats.aspirantes.toLocaleString()}</div>
              <div className="text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wide">Aspirantes</div>
            </div>
            <div className="text-center px-2">
              <div className="flex justify-center mb-3 text-red-500"><AlertTriangle className="h-8 w-8" /></div>
              <div className="text-3xl md:text-4xl font-black text-red-600 mb-1">{senadoStats.cuestionados}</div>
              <div className="text-xs md:text-sm font-semibold text-red-500 uppercase tracking-wide">Cuestionados Totales</div>
            </div>
            <div className="text-center px-2">
              <div className="flex justify-center mb-3 text-red-500"><ShieldAlert className="h-8 w-8" /></div>
              <div className="text-3xl md:text-4xl font-black text-red-600 mb-1">{senadoStats.cuestionadosSenado}</div>
              <div className="text-xs md:text-sm font-semibold text-red-500 uppercase tracking-wide">Cuestionados Senado</div>
            </div>
            <div className="text-center px-2">
              <div className="flex justify-center mb-3 text-orange-500"><Scale className="h-8 w-8" /></div>
              <div className="text-3xl md:text-4xl font-black text-orange-600 mb-1">{senadoStats.posiblesInhabilidades}</div>
              <div className="text-xs md:text-sm font-semibold text-orange-500 uppercase tracking-wide">Posibles Inhabilidades</div>
            </div>
          </div>
        </div>
      </section>

      {/* Corruption Spotlight Section */}
      <section className="section-premium bg-gradient-to-br from-red-50 via-white to-red-50">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-red-100 rounded-2xl">
                <ShieldAlert className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900">Alerta de Corrupción</h2>
            </div>
            
            <p className="text-xl text-gray-700 mb-12 leading-relaxed">
              De los más de 3,000 aspirantes, <strong>195 tienen cuestionamientos</strong> judiciales, disciplinarios o fiscales. Para el Senado específicamente, hay <strong>78 aspirantes cuestionados</strong>. Muchos buscan la reelección tras graves escándalos.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-3xl border border-red-100 shadow-lg shadow-red-900/5">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <Scale className="h-6 w-6 text-red-500" />
                  El Escándalo UNGRD
                </h3>
                <p className="text-gray-600 mb-4">
                  El caso de corrupción más grande del actual gobierno. Congresistas presuntamente intercambiaron votos por contratos millonarios.
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex gap-2"><span>•</span> Dos ministros en prisión preventiva.</li>
                  <li className="flex gap-2"><span>•</span> Expresidentes de Senado y Cámara encarcelados.</li>
                  <li className="flex gap-2"><span>•</span> Múltiples aspirantes en listas actuales están salpicados.</li>
                </ul>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-red-100 shadow-lg shadow-red-900/5">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                  <Map className="h-6 w-6 text-red-500" />
                  La herencia de clanes
                </h3>
                <p className="text-gray-600 mb-4">
                  Los grandes caciques condenados por parapolítica o corrupción (como "Los Ñoños") siguen manteniendo su poder a través de familiares y herederos políticos ubicados en listas con "lista preferente".
                </p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-red-600 bg-red-50 px-4 py-2 rounded-xl">
                  <AlertTriangle className="h-4 w-4" /> 41 aspirantes con posibles inhabilidades
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Party Cards Section */}
      <section className="section-premium bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <header className="text-center mb-12 max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">El Tarjetón del Senado</h2>
            <p className="text-xl text-gray-600">
              Conoce las 16 listas que compiten por las 100 curules nacionales. Revisa quiénes las componen y su nivel de riesgo antes de votar.
            </p>
          </header>

          <div className="flex flex-wrap justify-center gap-2 mb-12">
            <button 
              onClick={() => setRiskFilter('all')}
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all ${riskFilter === 'all' ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
            >
              Todos
            </button>
            <button 
              onClick={() => setRiskFilter('high')}
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all flex items-center gap-2 ${riskFilter === 'high' ? 'bg-red-100 text-red-800 border-red-200 border' : 'bg-white text-gray-600 hover:bg-red-50 border border-gray-200'}`}
            >
              Alto Riesgo
            </button>
            <button 
              onClick={() => setRiskFilter('medium')}
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all flex items-center gap-2 ${riskFilter === 'medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200 border' : 'bg-white text-gray-600 hover:bg-yellow-50 border border-gray-200'}`}
            >
              Medio Riesgo
            </button>
            <button 
              onClick={() => setRiskFilter('low')}
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all flex items-center gap-2 ${riskFilter === 'low' ? 'bg-green-100 text-green-800 border-green-200 border' : 'bg-white text-gray-600 hover:bg-green-50 border border-gray-200'}`}
            >
              Bajo Riesgo
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

      {/* How to Vote Section */}
      <section className="section-premium bg-purple-900 text-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-5xl mx-auto">
            <header className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">¿Cómo votar bien?</h2>
              <p className="text-xl text-purple-200">El 8 de marzo recibirás 2 tarjetones (Senado y Cámara). Así funciona el del Senado:</p>
            </header>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-purple-800/50 p-10 rounded-[2.5rem] border border-purple-500/30 backdrop-blur-sm">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="bg-white text-purple-900 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                  Lista Preferente (Abierta)
                </h3>
                <p className="text-purple-100 mb-6 text-lg">
                  Votas por el partido <strong>Y</strong> por un candidato específico. El tarjetón muestra el logo del partido y números.
                </p>
                <div className="bg-purple-900/80 p-6 rounded-2xl">
                  <p className="font-semibold text-white mb-2">Cómo marcar:</p>
                  <ul className="space-y-3 text-purple-200">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                      <span>Marca el <strong>logo del partido</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                      <span>Marca el <strong>número de tu candidato</strong></span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-purple-800/50 p-10 rounded-[2.5rem] border border-purple-500/30 backdrop-blur-sm">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="bg-white text-purple-900 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                  Lista No Preferente (Cerrada)
                </h3>
                <p className="text-purple-100 mb-6 text-lg">
                  Votas solo por el partido. Las curules se asignan en el orden que el partido definió previamente.
                </p>
                <div className="bg-purple-900/80 p-6 rounded-2xl">
                  <p className="font-semibold text-white mb-2">Cómo marcar:</p>
                  <ul className="space-y-3 text-purple-200">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                      <span>Marca <strong>únicamente el logo</strong> del partido o coalición.</span>
                    </li>
                  </ul>
                  <p className="mt-4 text-sm text-purple-300">
                    * No hay números para elegir candidato individual.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gray-900" aria-label="Llamada a la acción">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-5xl font-black text-white mb-8 tracking-tight">
            Tu voto es tu voz.
          </h2>
          <p className="text-2xl text-gray-400 mb-12 max-w-2xl mx-auto">
            El 8 de marzo no te quedes en casa. Infórmate, analiza y vota a conciencia para el Senado y la Cámara de Representantes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              to="/"
              className="btn-primary inline-flex items-center space-x-3"
            >
              <span>Ver Candidatos Presidenciales</span>
              <TrendingUp className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SenadoPage;
