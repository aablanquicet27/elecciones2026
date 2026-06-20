import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity, TrendingUp, TrendingDown, Minus, CheckCircle2, AlertTriangle,
  Zap, Clock, RefreshCw, ArrowLeft, Radio, ShieldQuestionIcon, Sparkles, Flame
} from 'lucide-react';

// ---------- Tipos ----------
interface Candidato {
  id: string;
  nombre: string;
  partido: string;
  color: string;
  probabilidad: number;
  momentum: 'up' | 'down' | 'steady';
  momentum_label: string;
  encuesta_pct: number;
  primera_vuelta_pct: number;
  fortalezas: string[];
  debilidades: string[];
  riesgos: string[];
  catalizadores: string[];
}
interface Indicador { fuente: string; detalle: string; favorece: string; }
interface EventoTL { ts: string; fecha_label: string; tipo: string; titulo: string; detalle: string; fuente?: string; }
interface PuntoHist { ts: string; [key: string]: number | string; }
interface Fuente { nombre: string; url: string; }
interface Estado {
  meta: {
    version: number; ciclo: number; generado: string; proxima_actualizacion: string;
    cadencia_min: number; evento: string; fecha_eleccion: string; fase: string; modelo: string;
  };
  veredicto: {
    favorito: string; favorito_id: string; probabilidad: number; confianza: string;
    titular: string; resumen: string; que_cambio: string;
  };
  candidatos: Candidato[];
  indicadores: Indicador[];
  timeline: EventoTL[];
  historico: PuntoHist[];
  fuentes: Fuente[];
}

// ---------- Helpers ----------
function tiempoRelativo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'hace segundos';
  if (min < 60) return `hace ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `hace ${h} h`;
  return `hace ${Math.floor(h / 24)} d`;
}

const MomentumIcon = ({ m }: { m: Candidato['momentum'] }) =>
  m === 'up' ? <TrendingUp className="w-4 h-4" /> :
  m === 'down' ? <TrendingDown className="w-4 h-4" /> :
  <Minus className="w-4 h-4" />;

const faseLabel: Record<string, string> = {
  vispera: 'Víspera', jornada: 'Jornada electoral', conteo: 'Conteo en vivo', cierre: 'Cierre',
};

const tipoEvento: Record<string, { color: string; icon: JSX.Element }> = {
  clave: { color: 'bg-purple-600', icon: <Zap className="w-3.5 h-3.5" /> },
  hito: { color: 'bg-indigo-500', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  evento: { color: 'bg-blue-500', icon: <Activity className="w-3.5 h-3.5" /> },
  alerta: { color: 'bg-amber-500', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  contexto: { color: 'bg-gray-400', icon: <Clock className="w-3.5 h-3.5" /> },
};

// ---------- Página ----------
export default function IAPage() {
  const [estado, setEstado] = useState<Estado | null>(null);
  const [error, setError] = useState(false);
  const [ultimaCarga, setUltimaCarga] = useState<number>(Date.now());
  const [, setTick] = useState(0);

  const cargar = async () => {
    try {
      const res = await fetch(`/ia/estado.json?t=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('no-data');
      const data: Estado = await res.json();
      setEstado(data);
      setError(false);
      setUltimaCarga(Date.now());
    } catch {
      setError(true);
    }
  };

  useEffect(() => {
    cargar();
    const poll = setInterval(cargar, 60000);          // refresca datos cada 60s
    const clock = setInterval(() => setTick((t) => t + 1), 1000); // reloj para tiempos relativos
    return () => { clearInterval(poll); clearInterval(clock); };
  }, []);

  const cuentaRegresiva = useMemo(() => {
    if (!estado) return '';
    const obj = new Date(estado.meta.fecha_eleccion + 'T08:00:00-05:00').getTime();
    const diff = obj - Date.now();
    if (diff <= 0) return 'En jornada';
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return `${h}h ${m}m`;
  }, [estado, ultimaCarga]);

  if (error && !estado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center px-6">
        <div className="text-center text-white/90">
          <Radio className="w-10 h-10 mx-auto mb-4 opacity-70" />
          <p className="text-lg">El Pulso está calibrando. Vuelve en un momento.</p>
        </div>
      </div>
    );
  }
  if (!estado) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-white mx-auto mb-5" />
          <p className="text-white text-lg">Cargando el Pulso…</p>
        </div>
      </div>
    );
  }

  const fav = estado.candidatos.find((c) => c.id === estado.veredicto.favorito_id) ?? estado.candidatos[0];
  const otro = estado.candidatos.find((c) => c.id !== fav.id) ?? estado.candidatos[1];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Top bar */}
      <header className="sticky top-0 z-30 nav-premium">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-1.5 text-gray-600 hover:text-purple-700 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Inicio
          </Link>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600" />
            </span>
            <span className="text-xs font-bold tracking-widest text-red-600">EN VIVO</span>
          </div>
          <button onClick={cargar} className="flex items-center gap-1.5 text-gray-500 hover:text-purple-700 text-xs">
            <RefreshCw className="w-3.5 h-3.5" /> {tiempoRelativo(new Date(ultimaCarga).toISOString())}
          </button>
        </div>
      </header>

      {/* Hero / Veredicto */}
      <section className="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">
          <div className="flex items-center gap-2 mb-4 text-purple-200/90 text-sm">
            <Sparkles className="w-4 h-4" />
            <span className="font-semibold">Pulso Electoral IA</span>
            <span className="opacity-50">·</span>
            <span>{estado.meta.evento}</span>
          </div>

          <div className="grid md:grid-cols-[1.3fr_1fr] gap-8 items-center">
            <div>
              <p className="text-purple-200 text-sm uppercase tracking-widest mb-2">Veredicto del modelo</p>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight mb-3">
                {estado.veredicto.titular}
              </h1>
              <p className="text-purple-100/90 text-base md:text-lg leading-relaxed max-w-2xl">
                {estado.veredicto.resumen}
              </p>
              <div className="mt-5 flex flex-wrap gap-2 text-sm">
                <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur">
                  Confianza: <strong>{estado.veredicto.confianza}</strong>
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Faltan {cuentaRegresiva}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur">
                  {faseLabel[estado.meta.fase] ?? estado.meta.fase}
                </span>
              </div>
            </div>

            {/* Probabilidad */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/15">
              <p className="text-purple-200 text-xs uppercase tracking-widest mb-1">Probabilidad de ganar</p>
              <div className="flex items-end justify-between mb-1">
                <span className="text-lg font-semibold">{fav.nombre.split(' ').slice(-2).join(' ')}</span>
                <span className="text-5xl font-bold tracking-tighter">{fav.probabilidad}%</span>
              </div>
              <div className="w-full h-3 rounded-full overflow-hidden bg-white/15 flex mt-3">
                <div className="h-full" style={{ width: `${fav.probabilidad}%`, backgroundColor: fav.color }} />
                <div className="h-full" style={{ width: `${otro.probabilidad}%`, backgroundColor: otro.color }} />
              </div>
              <div className="flex justify-between mt-2 text-sm text-purple-100/90">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: fav.color }} />
                  {fav.nombre.split(' ').slice(-1)} {fav.probabilidad}%
                </span>
                <span className="flex items-center gap-1.5">
                  {otro.nombre.split(' ').slice(-1)} {otro.probabilidad}%
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: otro.color }} />
                </span>
              </div>
            </div>
          </div>

          {estado.veredicto.que_cambio && (
            <div className="mt-6 flex items-start gap-2 text-purple-100/90 text-sm bg-white/5 rounded-2xl px-4 py-3 border border-white/10">
              <Flame className="w-4 h-4 mt-0.5 shrink-0 text-amber-300" />
              <span><strong className="text-white">Qué cambió:</strong> {estado.veredicto.que_cambio}</span>
            </div>
          )}
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-12">
        {/* Señales */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-600" /> Señales que estamos leyendo
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {estado.indicadores.map((ind, i) => {
              const c = estado.candidatos.find((x) => x.id === ind.favorece);
              return (
                <div key={i} className="card-premium p-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-semibold text-gray-900">{ind.fuente}</span>
                    <span className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: c ? c.color : '#9ca3af' }} />
                  </div>
                  <p className="text-sm text-gray-600 leading-snug">{ind.detalle}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Balance por candidato */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-4 flex items-center gap-2">
            <ShieldQuestionIcon className="w-5 h-5 text-purple-600" /> Balance por candidato
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            {estado.candidatos.map((c) => (
              <div key={c.id} className="card-premium p-6 hover:translate-y-0">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{c.nombre}</h3>
                    <p className="text-sm text-gray-500">{c.partido}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold tracking-tighter" style={{ color: c.color }}>{c.probabilidad}%</div>
                    <div className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full mt-1"
                      style={{ backgroundColor: `${c.color}15`, color: c.color }}>
                      <MomentumIcon m={c.momentum} /> {c.momentum_label}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mb-4 text-sm text-gray-600">
                  <span>Encuesta: <strong className="text-gray-900">{c.encuesta_pct}%</strong></span>
                  <span>1ª vuelta: <strong className="text-gray-900">{c.primera_vuelta_pct}%</strong></span>
                </div>

                <Bloque titulo="Fortalezas" items={c.fortalezas} icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />} />
                <Bloque titulo="Debilidades" items={c.debilidades} icon={<TrendingDown className="w-4 h-4 text-rose-600" />} />
                <Bloque titulo="Riesgos" items={c.riesgos} icon={<AlertTriangle className="w-4 h-4 text-amber-600" />} />
                <Bloque titulo="Catalizadores" items={c.catalizadores} icon={<Zap className="w-4 h-4 text-purple-600" />} />
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-600" /> Línea de tiempo
          </h2>
          <div className="card-premium p-6">
            <ol className="relative border-l-2 border-purple-100 ml-2">
              {estado.timeline.map((e, i) => {
                const t = tipoEvento[e.tipo] ?? tipoEvento.evento;
                return (
                  <li key={i} className="mb-5 ml-5 last:mb-0">
                    <span className={`absolute -left-[9px] flex items-center justify-center w-4 h-4 rounded-full text-white ${t.color}`}>
                      {t.icon}
                    </span>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{e.fecha_label}</span>
                      <span className="text-sm font-semibold text-gray-900">{e.titulo}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-snug">
                      {e.detalle}
                      {e.fuente ? <span className="text-gray-400"> · {e.fuente}</span> : null}
                    </p>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* Pie / fuentes */}
        <section className="border-t border-gray-100 pt-6 text-sm text-gray-500 space-y-2">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <strong className="text-gray-700">Fuentes:</strong>
            {estado.fuentes.map((f, i) => (
              <a key={i} href={f.url} target="_blank" rel="noopener noreferrer"
                className="text-purple-600 hover:underline">{f.nombre}</a>
            ))}
          </p>
          <p>
            Análisis generado por IA ({estado.meta.modelo}). Actualización automática cada {estado.meta.cadencia_min} min ·
            ciclo #{estado.meta.ciclo} · {estado.meta.evento}.
          </p>
          <p className="text-xs text-gray-400">
            Este es un análisis probabilístico con fines informativos, no una predicción oficial ni una boca de urna.
            Los resultados oficiales los entrega la Registraduría Nacional.
          </p>
        </section>
      </main>
    </div>
  );
}

function Bloque({ titulo, items, icon }: { titulo: string; items: string[]; icon: JSX.Element }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex items-center gap-1.5 mb-1.5">
        {icon}
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{titulo}</span>
      </div>
      <ul className="space-y-1 pl-0.5">
        {items.map((t, i) => (
          <li key={i} className="text-sm text-gray-700 leading-snug flex gap-2">
            <span className="text-gray-300 mt-1.5 w-1 h-1 rounded-full bg-gray-300 shrink-0" />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
