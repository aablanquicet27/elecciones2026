import { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, ShieldAlert } from 'lucide-react';

interface CorruptionEntry {
  candidato: string;
  partido: string;
  señalamiento: string;
  severity: 'high' | 'medium';
}

const corruptionData: CorruptionEntry[] = [
  { candidato: 'Alexander Flórez', partido: 'Pacto Histórico', señalamiento: 'Denuncias de maltrato a expareja', severity: 'medium' },
  { candidato: 'Isabel Zuleta', partido: 'Pacto Histórico', señalamiento: 'Permitió presencia de capos del narcotráfico en tarima oficial', severity: 'high' },
  { candidato: 'Julio César González (Matador)', partido: 'Pacto Histórico', señalamiento: 'Denuncias de abuso', severity: 'medium' },
  { candidato: 'Wadith Manzur', partido: 'Conservador', señalamiento: 'Presión para favorecer contratos (UNGRD)', severity: 'high' },
  { candidato: 'Julio Elías Chagüi', partido: 'La U', señalamiento: 'Intermediario caso UNGRD', severity: 'high' },
  { candidato: 'Martha Peralta', partido: 'MAIS', señalamiento: 'Contratos maquinaria La Guajira (UNGRD)', severity: 'high' },
  { candidato: 'Jhony Besaile', partido: 'La U', señalamiento: 'Hermano de condenado, falsedad documental', severity: 'high' },
  { candidato: 'David Barguil', partido: 'Conservador', señalamiento: 'Tráfico de influencias, gestiones DPS', severity: 'high' },
  { candidato: 'Wilmer Carrillo', partido: 'La U', señalamiento: 'Corrupción como secretario de infraestructura', severity: 'high' },
  { candidato: 'José Alfredo Gnecco', partido: 'La U', señalamiento: 'Presunta compra de votos, clan familiar', severity: 'high' },
  { candidato: 'Antonio Correa', partido: 'La U', señalamiento: 'Exigencia de coimas (en juicio Corte Suprema)', severity: 'high' },
  { candidato: 'Richard Aguilar', partido: 'Liberal', señalamiento: 'Corrupción como gobernador de Santander', severity: 'high' },
  { candidato: 'Andrés Calle', partido: 'Liberal', señalamiento: 'Vinculado caso UNGRD', severity: 'high' },
  { candidato: 'Yesid Pulgar', partido: 'Liberal', señalamiento: 'Hermano de Eduardo Pulgar (condenado soborno)', severity: 'medium' },
  { candidato: 'César Lorduy', partido: 'Cambio Radical', señalamiento: 'Caso homicidio 1979 + denuncias CNE', severity: 'high' },
  { candidato: 'Didier Lobo', partido: 'Cambio Radical', señalamiento: 'Enriquecimiento ilícito', severity: 'high' },
  { candidato: 'Berenice Bedoya', partido: 'Alianza por Colombia', señalamiento: 'Escándalo UNGRD', severity: 'high' },
  { candidato: 'Milena Flórez', partido: 'Frente Amplio', señalamiento: 'Esposa de Musa Besaile (condenado corrupción)', severity: 'medium' },
  { candidato: 'Máximo Noriega', partido: 'Frente Amplio', señalamiento: 'Caso Nicolás Petro', severity: 'medium' },
  { candidato: 'José Vicente Carreño', partido: 'Centro Democrático', señalamiento: 'Vínculos paramilitares', severity: 'high' },
  { candidato: 'Alexánder Angulo', partido: 'Fuerza Ciudadana', señalamiento: 'Enlace UNGRD Pinilla-Olmedo', severity: 'high' },
  { candidato: 'Miguel Ángel Barreto', partido: 'Conservador', señalamiento: 'Escándalo Ocad-Paz', severity: 'medium' },
  { candidato: 'Édgar Pote Gómez', partido: 'Frente Amplio', señalamiento: 'Redes clientelares Santander', severity: 'medium' },
];

const partyColors: Record<string, string> = {
  'La U': 'bg-orange-100 text-orange-800',
  'Conservador': 'bg-blue-100 text-blue-800',
  'Liberal': 'bg-red-100 text-red-800',
  'Cambio Radical': 'bg-yellow-100 text-yellow-800',
  'Centro Democrático': 'bg-sky-100 text-sky-800',
  'Pacto Histórico': 'bg-amber-100 text-amber-800',
  'Frente Amplio': 'bg-purple-100 text-purple-800',
  'Fuerza Ciudadana': 'bg-green-100 text-green-800',
  'Alianza por Colombia': 'bg-teal-100 text-teal-800',
  'MAIS': 'bg-emerald-100 text-emerald-800',
};

const CorruptionRow = ({ entry, index }: { entry: CorruptionEntry; index: number }) => {
  const [expanded, setExpanded] = useState(false);
  const partyColor = partyColors[entry.partido] || 'bg-gray-100 text-gray-800';

  return (
    <>
      {/* Mobile card */}
      <div
        className={`md:hidden p-4 rounded-2xl border-l-4 cursor-pointer transition-all ${
          entry.severity === 'high'
            ? 'border-red-500 bg-red-50 hover:bg-red-100'
            : 'border-orange-400 bg-orange-50 hover:bg-orange-100'
        }`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {entry.severity === 'high' ? (
                <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0" />
              )}
              <span className="font-bold text-gray-900 text-sm">{entry.candidato}</span>
            </div>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${partyColor}`}>
              {entry.partido}
            </span>
          </div>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400 shrink-0 mt-1" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 mt-1" />
          )}
        </div>
        {expanded && (
          <p className="mt-3 text-sm text-gray-700 leading-relaxed border-t border-red-200 pt-3">
            {entry.señalamiento}
          </p>
        )}
      </div>

      {/* Desktop table row */}
      <tr
        className={`hidden md:table-row border-b border-gray-100 cursor-pointer transition-colors ${
          entry.severity === 'high'
            ? 'hover:bg-red-50 bg-white'
            : 'hover:bg-orange-50 bg-white'
        } ${index % 2 === 0 ? '' : 'bg-gray-50/40'}`}
        onClick={() => setExpanded(!expanded)}
      >
        <td className="py-4 px-4">
          <div className="flex items-center gap-2">
            {entry.severity === 'high' ? (
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0" />
            )}
            <span className="font-bold text-gray-900">{entry.candidato}</span>
          </div>
        </td>
        <td className="py-4 px-4">
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${partyColor}`}>
            {entry.partido}
          </span>
        </td>
        <td className="py-4 px-4 text-gray-700 text-sm leading-relaxed">{entry.señalamiento}</td>
        <td className="py-4 px-4 text-center">
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400 mx-auto" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400 mx-auto" />
          )}
        </td>
      </tr>
    </>
  );
};

const SenadoCorruptionTable = () => {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? corruptionData : corruptionData.slice(0, 10);

  return (
    <section className="section-premium bg-gradient-to-br from-red-50 via-white to-orange-50">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 bg-red-100 border border-red-200 rounded-2xl px-6 py-3 mb-6">
              <ShieldAlert className="h-6 w-6 text-red-600" />
              <span className="text-red-700 font-bold uppercase tracking-wide text-sm">
                Alerta de Transparencia
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 leading-tight">
              Los nombres que no te muestran<br />
              <span className="text-red-600">en televisión</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Candidatos con señalamientos judiciales, disciplinarios o fiscales activos que están compitiendo por una curul en el Senado.
            </p>
          </div>

          {/* Alert Banner */}
          <div className="bg-red-600 text-white rounded-2xl p-5 mb-8 flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 shrink-0 mt-0.5" />
            <p className="text-sm md:text-base leading-relaxed">
              <strong>Importante:</strong> Esta información proviene de reportes periodísticos, denuncias formales y procesos judiciales activos. Todos se presumen inocentes hasta sentencia en firme. El objetivo es informar, no condenar.
            </p>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-3xl border border-red-100 shadow-xl shadow-red-900/5 overflow-hidden mb-6">
            <table className="w-full">
              <thead>
                <tr className="bg-red-600 text-white">
                  <th className="text-left py-4 px-4 font-bold uppercase tracking-wide text-sm">Candidato</th>
                  <th className="text-left py-4 px-4 font-bold uppercase tracking-wide text-sm">Partido</th>
                  <th className="text-left py-4 px-4 font-bold uppercase tracking-wide text-sm">Señalamiento</th>
                  <th className="text-center py-4 px-4 font-bold uppercase tracking-wide text-sm w-12"></th>
                </tr>
              </thead>
              <tbody>
                {displayed.map((entry, i) => (
                  <CorruptionRow key={entry.candidato} entry={entry} index={i} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3 mb-6">
            {displayed.map((entry, i) => (
              <CorruptionRow key={entry.candidato} entry={entry} index={i} />
            ))}
          </div>

          {/* Show More */}
          {!showAll && (
            <div className="text-center">
              <button
                onClick={() => setShowAll(true)}
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-2xl transition-colors shadow-lg"
              >
                <ChevronDown className="w-5 h-5" />
                Ver los {corruptionData.length - 10} candidatos restantes
              </button>
            </div>
          )}

          {/* Bottom note */}
          <div className="mt-8 bg-orange-50 border border-orange-200 rounded-2xl p-6">
            <p className="text-orange-800 text-sm font-medium text-center">
              Fuente: Investigaciones periodísticas de El Tiempo, Semana, Colombia Check y MOE •{' '}
              <strong>{corruptionData.length} candidatos</strong> con cuestionamientos documentados en esta lista
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SenadoCorruptionTable;
