import { useEffect, useMemo, useState } from 'react';
import { RefreshCw, Landmark, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

// ---------- Tipos ----------
interface BoletinCand {
  id: string; nombre: string; partido?: string; color?: string; votos: number; pct: number;
}
interface Boletin {
  meta: {
    estado: 'esperando' | 'en_vivo' | 'final';
    boletin?: string;
    generado: string;
    fuente_actualizacion?: string;
    proxima_actualizacion?: string;
    cadencia_min?: number;
    cierre_urnas?: string;
    fuente?: string;
    fuente_url?: string;
  };
  escrutinio?: { pct_mesas: number; mesas_informadas: number; mesas_total: number; total_votos: number };
  candidatos?: BoletinCand[];
  otros?: { blancos: number; nulos: number; no_marcados: number };
}

const COL: Record<string, string> = { delaespriella: '#4C8DFF', cepeda: '#FF4D6D' };
const mono = "'Space Mono',monospace";
const disp = "'Space Grotesk',sans-serif";
const apellido = (n: string) => n.split(' ').slice(-1)[0];
const nf = new Intl.NumberFormat('es-CO');
const pct1 = (n: number) => `${(Math.round(n * 10) / 10).toLocaleString('es-CO')}%`;

function relativo(iso: string): string {
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (!iso || Number.isNaN(m)) return '';
  if (m < 1) return 'ahora'; if (m < 60) return `hace ${m}m`;
  const h = Math.floor(m / 60); return h < 24 ? `hace ${h}h` : `hace ${Math.floor(h / 24)}d`;
}

// cuenta regresiva al cierre de urnas
function faltaCierre(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso).getTime() - Date.now();
  if (d <= 0) return '';
  const h = Math.floor(d / 3600000), m = Math.floor((d % 3600000) / 60000);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default function BoletinPanel() {
  const [b, setB] = useState<Boletin | null>(null);
  const [err, setErr] = useState(false);
  const [cargada, setCargada] = useState(Date.now());
  const [, tick] = useState(0);

  const cargar = async () => {
    try {
      const r = await fetch(`/ia/boletin.json?t=${Date.now()}`, { cache: 'no-store' });
      if (!r.ok) throw new Error();
      setB(await r.json()); setErr(false); setCargada(Date.now());
    } catch { setErr(true); }
  };
  useEffect(() => {
    cargar();
    const a = setInterval(cargar, 30000);      // el preconteo se mueve rápido: refresco 30s
    const t = setInterval(() => tick((x) => x + 1), 1000);
    return () => { clearInterval(a); clearInterval(t); };
  }, []);

  const estado = b?.meta.estado ?? 'esperando';
  const enVivo = estado === 'en_vivo' || estado === 'final';

  const cands = useMemo(() => {
    const cs = (b?.candidatos ?? []).map((c) => ({ ...c, color: c.color || COL[c.id] || '#94A3B8' }));
    return cs.sort((a, c) => c.votos - a.votos);
  }, [b]);

  // si nunca cargó y falló, igual mostramos el estado de espera (es jornada electoral)
  const cierre = b?.meta.cierre_urnas ?? '2026-06-21T16:00:00-05:00';
  const falta = faltaCierre(cierre);

  return (
    <section className="mt-2 mb-12 fade-up">
      {/* encabezado del panel */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <Landmark className="w-4 h-4 text-slate-400" />
          <h2 className="text-lg font-bold tracking-tight" style={{ fontFamily: disp }}>Boletín oficial en vivo</h2>
        </div>
        <div className="flex items-center gap-2" style={{ fontFamily: mono }}>
          <span className={`live-dot w-2 h-2 rounded-full`} style={{ backgroundColor: enVivo ? '#34D399' : '#FBBF24' }} />
          <span className="text-[10px] font-bold tracking-[0.22em]" style={{ color: enVivo ? '#34D399' : '#FBBF24' }}>
            {estado === 'final' ? 'PRECONTEO FINAL' : enVivo ? 'PRECONTEO EN CURSO' : 'EN ESPERA'}
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-white/8 overflow-hidden" style={{ backgroundColor: '#10131c' }}>
        <div className="h-1 w-full flex">
          <div className="flex-1" style={{ background: COL.delaespriella }} />
          <div className="flex-1" style={{ background: COL.cepeda }} />
        </div>

        {/* ====== ESTADO: ESPERANDO ====== */}
        {!enVivo && (
          <div className="p-6 sm:p-8 text-center">
            <div className="mx-auto mb-4 w-12 h-12 rounded-full grid place-items-center border border-white/10" style={{ backgroundColor: '#0E111A' }}>
              <Clock className="w-5 h-5 text-[#FBBF24]" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold" style={{ fontFamily: disp }}>
              {falta ? 'Aún no hay boletín de la Registraduría' : 'Esperando el primer boletín'}
            </h3>
            <p className="mt-2 text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              {falta
                ? 'Las urnas siguen abiertas. Apenas cierren y la Registraduría publique el preconteo, aquí verás los votos reales actualizándose solos.'
                : 'Las urnas ya cerraron. El primer boletín del preconteo aparece en minutos; este panel se actualiza solo cada pocos minutos.'}
            </p>
            <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 text-[11px]" style={{ fontFamily: mono, color: '#FBBF24' }}>
              <span className="live-dot w-1.5 h-1.5 rounded-full bg-[#FBBF24]" />
              {falta ? `CIERRE DE URNAS EN ${falta}` : 'EN ESCRUTINIO · PRIMER BOLETÍN EN MINUTOS'}
            </div>
            {/* esqueleto de barra para anticipar el gráfico */}
            <div className="mt-7 max-w-md mx-auto">
              <div className="flex justify-between text-[11px] text-slate-500 mb-1.5" style={{ fontFamily: mono }}>
                <span>{apellido(cands[0]?.nombre || 'De la Espriella')}</span>
                <span>{apellido(cands[1]?.nombre || 'Cepeda')}</span>
              </div>
              <div className="flex h-3.5 rounded-full overflow-hidden ring-1 ring-white/10" style={{ backgroundColor: '#11141d' }}>
                <div className="h-full w-1/2 opacity-30" style={{ background: COL.delaespriella }} />
                <div className="h-full w-1/2 opacity-30" style={{ background: COL.cepeda }} />
              </div>
            </div>
          </div>
        )}

        {/* ====== ESTADO: EN VIVO / FINAL ====== */}
        {enVivo && b && (
          <div className="p-5 sm:p-6">
            {/* progreso del escrutinio */}
            <div className="flex items-end justify-between gap-3 mb-2">
              <div>
                <div className="text-[10px] tracking-[0.22em] text-slate-500" style={{ fontFamily: mono }}>MESAS ESCRUTADAS</div>
                <div className="leading-none font-bold tabular-nums" style={{ fontFamily: disp, fontSize: 'clamp(1.8rem,6vw,2.6rem)' }}>
                  {pct1(b.escrutinio?.pct_mesas ?? 0)}
                </div>
              </div>
              <div className="text-right text-[11px] text-slate-400" style={{ fontFamily: mono }}>
                {nf.format(b.escrutinio?.mesas_informadas ?? 0)} / {nf.format(b.escrutinio?.mesas_total ?? 0)} mesas<br />
                <span className="text-slate-500">{nf.format(b.escrutinio?.total_votos ?? 0)} votos</span>
              </div>
            </div>
            <div className="h-2 rounded-full overflow-hidden ring-1 ring-white/10 mb-6" style={{ backgroundColor: '#11141d' }}>
              <div className="duel-seg h-full" style={{ width: `${Math.min(100, b.escrutinio?.pct_mesas ?? 0)}%`, background: 'linear-gradient(90deg,#34D399,#22D3EE)' }} />
            </div>

            {/* votos por candidato */}
            <div className="flex items-end justify-between gap-3 mb-2.5">
              {cands.slice(0, 2).map((c, i) => (
                <div key={c.id} className={i === 1 ? 'text-right' : ''}>
                  <div className="text-sm text-slate-400 truncate" style={{ fontFamily: mono }}>{apellido(c.nombre)}</div>
                  <div className="leading-none font-bold tabular-nums" style={{ fontFamily: disp, color: c.color, fontSize: 'clamp(1.7rem,6vw,2.6rem)' }}>
                    {pct1(c.pct)}
                  </div>
                  <div className="text-[11px] text-slate-500 tabular-nums" style={{ fontFamily: mono }}>{nf.format(c.votos)} votos</div>
                </div>
              ))}
            </div>
            {/* barra de reparto entre los dos */}
            {(() => {
              const a = cands[0]?.votos ?? 0, d = cands[1]?.votos ?? 0;
              const tot = a + d || 1;
              const wa = (a / tot) * 100;
              return (
                <div className="relative">
                  <div className="flex h-5 rounded-full overflow-hidden ring-1 ring-white/10" style={{ backgroundColor: '#11141d' }}>
                    <div className="duel-seg h-full" style={{ width: `${wa}%`, background: `linear-gradient(90deg,${cands[0]?.color}99,${cands[0]?.color})` }} />
                    <div className="duel-seg h-full" style={{ width: `${100 - wa}%`, background: `linear-gradient(90deg,${cands[1]?.color},${cands[1]?.color}99)` }} />
                  </div>
                  <div className="duel-knob absolute -top-1 -bottom-1 w-[2px] bg-white shadow-[0_0_12px_rgba(255,255,255,.7)]" style={{ left: `${wa}%` }} />
                </div>
              );
            })()}

            {/* otros votos */}
            {b.otros && (b.otros.blancos || b.otros.nulos || b.otros.no_marcados) ? (
              <div className="mt-5 flex flex-wrap gap-2 text-[11px]" style={{ fontFamily: mono }}>
                <span className="px-2.5 py-1 rounded-md border border-white/10 text-slate-300">EN BLANCO <b className="text-white">{nf.format(b.otros.blancos)}</b></span>
                <span className="px-2.5 py-1 rounded-md border border-white/10 text-slate-300">NULOS <b className="text-white">{nf.format(b.otros.nulos)}</b></span>
                {b.otros.no_marcados ? <span className="px-2.5 py-1 rounded-md border border-white/10 text-slate-300">NO MARCADOS <b className="text-white">{nf.format(b.otros.no_marcados)}</b></span> : null}
              </div>
            ) : null}

            {estado === 'final' && (
              <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-[#34D399]/25 bg-[#34D399]/[0.06] px-4 py-3">
                <CheckCircle2 className="mt-0.5 w-4 h-4 text-[#34D399] shrink-0" />
                <p className="text-sm text-emerald-100/90">
                  <span className="text-[#34D399] font-semibold" style={{ fontFamily: mono }}>PRECONTEO FINAL · </span>
                  {apellido(cands[0]?.nombre || '')} encabeza el preconteo con {pct1(cands[0]?.pct ?? 0)}. El resultado oficial lo declara el escrutinio.
                </p>
              </div>
            )}
          </div>
        )}

        {/* pie del panel */}
        <div className="px-5 sm:px-6 py-3 border-t border-white/8 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[10px] text-slate-500" style={{ fontFamily: mono }}>
          <span className="flex items-center gap-2">
            {b?.meta.boletin && b.meta.boletin !== '0' ? <span>BOLETÍN {b.meta.boletin}</span> : <span>REGISTRADURÍA</span>}
            {b?.meta.fuente_actualizacion ? <span className="text-slate-600">· {b.meta.fuente_actualizacion}</span> : null}
          </span>
          <button onClick={cargar} className="flex items-center gap-1.5 text-slate-500 hover:text-white transition-colors">
            <RefreshCw className="w-3 h-3" /> {err ? 'reintentar' : relativo(new Date(cargada).toISOString()) || 'actualizar'}
          </button>
        </div>
      </div>

      <p className="mt-2 px-1 text-[10px] text-slate-600 leading-relaxed flex items-start gap-1.5">
        <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
        Datos del <span className="text-slate-500">preconteo</span> de la Registraduría Nacional (carácter informativo, no vinculante). El resultado que define la elección es el escrutinio oficial.
      </p>
    </section>
  );
}
