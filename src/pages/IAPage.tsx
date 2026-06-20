import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp, TrendingDown, Minus, CheckCircle2, AlertTriangle,
  Zap, ArrowLeft, RefreshCw, ChevronDown,
} from 'lucide-react';

// ---------- Tipos ----------
interface Candidato {
  id: string; nombre: string; partido: string; color: string;
  probabilidad: number; momentum: 'up' | 'down' | 'steady'; momentum_label: string;
  encuesta_pct: number; primera_vuelta_pct: number;
  fortalezas: string[]; debilidades: string[]; riesgos: string[]; catalizadores: string[];
}
interface Indicador { fuente: string; detalle: string; favorece: string; }
interface EventoTL { ts: string; fecha_label: string; tipo: string; titulo: string; detalle: string; fuente?: string; }
interface Fuente { nombre: string; url: string; }
interface Estado {
  meta: { ciclo: number; generado: string; cadencia_min: number; evento: string; fecha_eleccion: string; fase: string; };
  veredicto: { favorito: string; favorito_id: string; probabilidad: number; confianza: string; titular: string; resumen: string; que_cambio: string; };
  candidatos: Candidato[]; indicadores: Indicador[]; timeline: EventoTL[];
  historico: { ts: string; [k: string]: number | string }[]; fuentes: Fuente[];
}

// ---------- Paleta firmada ----------
const COL: Record<string, string> = { delaespriella: '#4C8DFF', cepeda: '#FF4D6D' };
const apellido = (n: string) => n.split(' ').slice(-1)[0];

const faseTxt: Record<string, string> = {
  vispera: 'Víspera', jornada: 'Jornada', conteo: 'Conteo en vivo', cierre: 'Cierre',
};
const evTipo: Record<string, string> = {
  clave: '#A78BFA', hito: '#4C8DFF', evento: '#5EEAD4', alerta: '#FBBF24', contexto: '#64748B',
};

function relativo(iso: string): string {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return 'ahora'; if (m < 60) return `hace ${m}m`;
  const h = Math.floor(m / 60); return h < 24 ? `hace ${h}h` : `hace ${Math.floor(h / 24)}d`;
}

const Mom = ({ m }: { m: Candidato['momentum'] }) =>
  m === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> :
  m === 'down' ? <TrendingDown className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />;

export default function IAPage() {
  const [e, setE] = useState<Estado | null>(null);
  const [err, setErr] = useState(false);
  const [cargada, setCargada] = useState(Date.now());
  const [, tick] = useState(0);

  // fuentes tipográficas solo en esta página
  useEffect(() => {
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&family=Inter:wght@400;500;600&display=swap';
    document.head.appendChild(l);
    return () => { document.head.removeChild(l); };
  }, []);

  const cargar = async () => {
    try {
      const r = await fetch(`/ia/estado.json?t=${Date.now()}`, { cache: 'no-store' });
      if (!r.ok) throw new Error();
      setE(await r.json()); setErr(false); setCargada(Date.now());
    } catch { setErr(true); }
  };
  useEffect(() => {
    cargar();
    const a = setInterval(cargar, 60000);
    const b = setInterval(() => tick((t) => t + 1), 1000);
    return () => { clearInterval(a); clearInterval(b); };
  }, []);

  const cuenta = useMemo(() => {
    if (!e) return '';
    const d = new Date(e.meta.fecha_eleccion + 'T08:00:00-05:00').getTime() - Date.now();
    if (d <= 0) return 'En jornada';
    const h = Math.floor(d / 3600000), m = Math.floor((d % 3600000) / 60000);
    const dd = Math.floor(h / 24);
    return dd > 0 ? `${dd}d ${h % 24}h` : `${h}h ${m}m`;
  }, [e, cargada]);

  const shell = 'min-h-screen text-slate-100 antialiased';
  const bg = { backgroundColor: '#0A0C12', fontFamily: "'Inter',system-ui,sans-serif" } as const;

  if (!e) {
    return (
      <div className={`${shell} flex items-center justify-center`} style={bg}>
        <div className="text-center">
          {err
            ? <p className="text-slate-400" style={{ fontFamily: "'Space Mono',monospace" }}>El Pulso está calibrando. Vuelve en un momento.</p>
            : <>
                <div className="h-10 w-10 mx-auto mb-4 rounded-full border-2 border-slate-700 border-t-[#4C8DFF] animate-spin" />
                <p className="text-slate-400" style={{ fontFamily: "'Space Mono',monospace" }}>Cargando el Pulso…</p>
              </>}
        </div>
      </div>
    );
  }

  const fav = e.candidatos.find((c) => c.id === e.veredicto.favorito_id) ?? e.candidatos[0];
  const izq = e.candidatos.find((c) => c.id === 'delaespriella') ?? e.candidatos[0];
  const der = e.candidatos.find((c) => c.id === 'cepeda') ?? e.candidatos[1];
  const mono = "'Space Mono',monospace";
  const disp = "'Space Grotesk',sans-serif";

  return (
    <div className={shell} style={bg}>
      <style>{`
        @keyframes pulseDot{0%,100%{opacity:1}50%{opacity:.25}}
        .live-dot{animation:pulseDot 1.4s ease-in-out infinite}
        .duel-seg{transition:width .8s cubic-bezier(.22,1,.36,1)}
        .duel-knob{transition:left .8s cubic-bezier(.22,1,.36,1)}
        @media (prefers-reduced-motion:reduce){.live-dot,.duel-seg,.duel-knob{animation:none!important;transition:none!important}}
        .fade-up{animation:fu .5s ease-out both}@keyframes fu{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
      `}</style>

      {/* franja tricolor Colombia */}
      <div className="h-1 w-full flex">
        <div className="flex-[2]" style={{ background: '#FCD116' }} />
        <div className="flex-1" style={{ background: '#003893' }} />
        <div className="flex-1" style={{ background: '#CE1126' }} />
      </div>

      {/* top bar */}
      <header className="sticky top-0 z-30 backdrop-blur-md border-b border-white/5" style={{ backgroundColor: 'rgba(10,12,18,.8)' }}>
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Inicio
          </Link>
          <div className="flex items-center gap-2" style={{ fontFamily: mono }}>
            <span className="live-dot w-2 h-2 rounded-full bg-[#FF4D6D]" />
            <span className="text-[11px] font-bold tracking-[0.25em] text-slate-200">PULSO · EN VIVO</span>
          </div>
          <button onClick={cargar} className="flex items-center gap-1.5 text-slate-500 hover:text-white text-xs transition-colors" style={{ fontFamily: mono }}>
            <RefreshCw className="w-3.5 h-3.5" /> {relativo(new Date(cargada).toISOString())}
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* ===== HERO: EL DUELO ===== */}
        <section className="pt-10 pb-8 fade-up">
          <div className="flex items-center gap-2 mb-6 text-[11px] tracking-[0.25em] text-slate-500" style={{ fontFamily: mono }}>
            <span>SEGUNDA VUELTA</span><span className="text-slate-700">/</span>
            <span>COLOMBIA 2026</span><span className="text-slate-700">/</span>
            <span className="text-[#FBBF24]">{faseTxt[e.meta.fase] ?? e.meta.fase}</span>
            <span className="text-slate-700">/</span>
            <span>FALTAN {cuenta}</span>
          </div>

          {/* nombres + % */}
          <div className="flex items-end justify-between gap-3 mb-3">
            <div className="min-w-0">
              <div className="text-sm sm:text-base text-slate-400 truncate" style={{ fontFamily: mono }}>{apellido(izq.nombre)}</div>
              <div className="leading-none font-bold tabular-nums" style={{ fontFamily: disp, color: COL.delaespriella, fontSize: 'clamp(2.5rem,9vw,4.5rem)' }}>
                {izq.probabilidad}<span className="text-[0.4em] align-top">%</span>
              </div>
            </div>
            <div className="text-right min-w-0">
              <div className="text-sm sm:text-base text-slate-400 truncate" style={{ fontFamily: mono }}>{apellido(der.nombre)}</div>
              <div className="leading-none font-bold tabular-nums" style={{ fontFamily: disp, color: COL.cepeda, fontSize: 'clamp(2.5rem,9vw,4.5rem)' }}>
                {der.probabilidad}<span className="text-[0.4em] align-top">%</span>
              </div>
            </div>
          </div>

          {/* barra balance de poder (firma) */}
          <div className="relative">
            <div className="flex h-5 rounded-full overflow-hidden ring-1 ring-white/10" style={{ backgroundColor: '#11141d' }}>
              <div className="duel-seg h-full" style={{ width: `${izq.probabilidad}%`, background: `linear-gradient(90deg,${COL.delaespriella}99,${COL.delaespriella})` }} />
              <div className="duel-seg h-full" style={{ width: `${der.probabilidad}%`, background: `linear-gradient(90deg,${COL.cepeda},${COL.cepeda}99)` }} />
            </div>
            <div className="duel-knob absolute -top-1 -bottom-1 w-[2px] bg-white shadow-[0_0_12px_rgba(255,255,255,.7)]" style={{ left: `${izq.probabilidad}%` }} />
          </div>
          <div className="flex justify-between mt-2 text-[11px] text-slate-500" style={{ fontFamily: mono }}>
            <span>{izq.partido}</span><span>{der.partido}</span>
          </div>

          {/* veredicto */}
          <h1 className="mt-8 font-semibold tracking-tight leading-[1.1]" style={{ fontFamily: disp, fontSize: 'clamp(1.5rem,4vw,2.4rem)' }}>
            {e.veredicto.titular}
          </h1>
          <p className="mt-3 text-slate-300 leading-relaxed max-w-3xl">{e.veredicto.resumen}</p>
          <div className="mt-4 flex flex-wrap gap-2 text-[11px]" style={{ fontFamily: mono }}>
            <span className="px-2.5 py-1 rounded-md border border-white/10 text-slate-300">FAVORITO: <b className="text-white">{apellido(fav.nombre)}</b></span>
            <span className="px-2.5 py-1 rounded-md border border-white/10 text-slate-300">CONFIANZA: <b className="text-white">{e.veredicto.confianza}</b></span>
          </div>

          {e.veredicto.que_cambio && (
            <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-[#FBBF24]/25 bg-[#FBBF24]/[0.06] px-4 py-3">
              <span className="live-dot mt-1.5 w-2 h-2 rounded-full bg-[#FBBF24] shrink-0" />
              <p className="text-sm text-amber-100/90"><span className="text-[#FBBF24] font-semibold" style={{ fontFamily: mono }}>QUÉ CAMBIÓ · </span>{e.veredicto.que_cambio}</p>
            </div>
          )}
        </section>

        {/* ===== Señales ===== */}
        <Titulo n="01" t="Señales en lectura" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mb-12">
          {e.indicadores.map((i, k) => (
            <div key={k} className="rounded-xl border border-white/8 p-3.5" style={{ backgroundColor: '#10131c' }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold tracking-wide text-slate-300" style={{ fontFamily: mono }}>{i.fuente.toUpperCase()}</span>
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COL[i.favorece] ?? '#64748B' }} />
              </div>
              <p className="text-sm text-slate-400 leading-snug">{i.detalle}</p>
            </div>
          ))}
        </div>

        {/* ===== Balance ===== */}
        <Titulo n="02" t="Balance del duelo" />
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          {[izq, der].map((c) => (
            <div key={c.id} className="rounded-2xl border border-white/8 overflow-hidden" style={{ backgroundColor: '#10131c' }}>
              <div className="h-1" style={{ backgroundColor: COL[c.id] }} />
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold" style={{ fontFamily: disp }}>{c.nombre}</h3>
                    <p className="text-xs text-slate-500" style={{ fontFamily: mono }}>{c.partido}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold tabular-nums" style={{ fontFamily: disp, color: COL[c.id] }}>{c.probabilidad}%</div>
                    <span className="inline-flex items-center gap-1 mt-1 text-[10px] px-2 py-0.5 rounded-full"
                      style={{ fontFamily: mono, backgroundColor: `${COL[c.id]}1f`, color: COL[c.id] }}>
                      <Mom m={c.momentum} />{c.momentum_label}
                    </span>
                  </div>
                </div>
                <div className="flex gap-5 mb-4 text-xs text-slate-400" style={{ fontFamily: mono }}>
                  <span>ENCUESTA <b className="text-slate-100">{c.encuesta_pct}%</b></span>
                  <span>1ª VUELTA <b className="text-slate-100">{c.primera_vuelta_pct}%</b></span>
                </div>
                <Bloque t="Fortalezas" items={c.fortalezas} c="#34D399" icon={<CheckCircle2 className="w-3.5 h-3.5" />} />
                <Bloque t="Debilidades" items={c.debilidades} c="#FB7185" icon={<TrendingDown className="w-3.5 h-3.5" />} />
                <Bloque t="Riesgos" items={c.riesgos} c="#FBBF24" icon={<AlertTriangle className="w-3.5 h-3.5" />} />
                <Bloque t="Catalizadores" items={c.catalizadores} c="#A78BFA" icon={<Zap className="w-3.5 h-3.5" />} />
              </div>
            </div>
          ))}
        </div>

        {/* ===== Timeline ===== */}
        <Titulo n="03" t="Línea de tiempo" />
        <div className="rounded-2xl border border-white/8 p-5 mb-12" style={{ backgroundColor: '#10131c' }}>
          <ol className="relative">
            {e.timeline.map((ev, k) => (
              <li key={k} className="relative pl-7 pb-5 last:pb-0">
                {k < e.timeline.length - 1 && <span className="absolute left-[5px] top-3 bottom-0 w-px bg-white/8" />}
                <span className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full ring-4 ring-[#10131c]" style={{ backgroundColor: evTipo[ev.tipo] ?? '#5EEAD4' }} />
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] tracking-widest text-slate-500" style={{ fontFamily: mono }}>{ev.fecha_label.toUpperCase()}</span>
                  <span className="text-sm font-semibold text-slate-100">{ev.titulo}</span>
                </div>
                <p className="text-sm text-slate-400 leading-snug">
                  {ev.detalle}{ev.fuente ? <span className="text-slate-600" style={{ fontFamily: mono }}> · {ev.fuente}</span> : null}
                </p>
              </li>
            ))}
          </ol>
        </div>

        {/* ===== Footer ===== */}
        <footer className="border-t border-white/8 py-8 text-sm text-slate-500 space-y-3">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-slate-400" style={{ fontFamily: mono }}>FUENTES</span>
            {e.fuentes.map((f, k) => (
              <a key={k} href={f.url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white underline underline-offset-2 transition-colors">{f.nombre}</a>
            ))}
          </p>
          <p style={{ fontFamily: mono }} className="text-xs">
            ANÁLISIS DE IA EN TIEMPO REAL · CICLO #{e.meta.ciclo} · SE ACTUALIZA CADA {e.meta.cadencia_min} MIN
          </p>
          <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
            Estimación probabilística con fines informativos: no es una predicción oficial ni una boca de urna.
            Los resultados oficiales los entrega la Registraduría Nacional del Estado Civil.
          </p>
        </footer>
        <div className="h-6" />
      </main>
    </div>
  );
}

function Titulo({ n, t }: { n: string; t: string }) {
  return (
    <div className="flex items-baseline gap-3 mb-4">
      <span className="text-xs text-slate-600" style={{ fontFamily: "'Space Mono',monospace" }}>{n}</span>
      <h2 className="text-lg font-bold tracking-tight" style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{t}</h2>
      <span className="flex-1 h-px bg-white/8" />
    </div>
  );
}

function Bloque({ t, items, c, icon }: { t: string; items: string[]; c: string; icon: JSX.Element }) {
  const [open, setOpen] = useState(true);
  if (!items || !items.length) return null;
  return (
    <div className="mb-3 last:mb-0">
      <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-1.5 w-full text-left group">
        <span style={{ color: c }}>{icon}</span>
        <span className="text-[10px] font-bold tracking-[0.18em] text-slate-400 group-hover:text-slate-200 transition-colors" style={{ fontFamily: "'Space Mono',monospace" }}>{t.toUpperCase()}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-600 ml-auto transition-transform ${open ? '' : '-rotate-90'}`} />
      </button>
      {open && (
        <ul className="mt-1.5 space-y-1">
          {items.map((x, i) => (
            <li key={i} className="text-sm text-slate-300 leading-snug flex gap-2">
              <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: c }} />
              <span>{x}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
