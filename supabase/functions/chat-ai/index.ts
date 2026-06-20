import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ESTADO_URL = 'https://eleccionescolombia.org/ia/estado.json';

// Inyecta el estado vivo del panel /ia para que el chat sea coherente con él.
async function grounding(): Promise<string> {
  try {
    const r = await fetch(`${ESTADO_URL}?t=${Date.now()}`);
    if (!r.ok) return '';
    const e = await r.json();
    const cs = (e.candidatos || [])
      .map((x: any) => `- ${x.nombre} (${x.partido}): ${x.probabilidad}% de ganar, encuesta ${x.encuesta_pct}%, 1ª vuelta ${x.primera_vuelta_pct}%, momentum "${x.momentum_label}". Fortalezas: ${(x.fortalezas || []).join('; ')}. Debilidades: ${(x.debilidades || []).join('; ')}.`)
      .join('\n');
    return `\n\n=== ESTADO EN VIVO DEL PANEL (ciclo ${e.meta?.ciclo}, fase ${e.meta?.fase}) ===
Veredicto: ${e.veredicto?.favorito} es el favorito con ${e.veredicto?.probabilidad}% (confianza ${e.veredicto?.confianza}).
${e.veredicto?.titular}
${e.veredicto?.resumen}
${cs}
Usa estos datos como tu fuente principal y mantente COHERENTE con el panel. La elección (segunda vuelta) es el 21 de junio de 2026.`;
  } catch {
    return '';
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  try {
    const { messages, systemContext } = await req.json();
    if (!messages || !Array.isArray(messages)) throw new Error('Mensajes inválidos');

    const BRAIN_URL = Deno.env.get('BRAIN_URL');
    const BRAIN_SECRET = Deno.env.get('BRAIN_SECRET');
    if (!BRAIN_URL || !BRAIN_SECRET) throw new Error('Asistente no configurado');

    const system = `${systemContext || 'Eres el asistente de Pulso Electoral IA.'}

REGLAS:
- Responde ÚNICAMENTE sobre las elecciones presidenciales de Colombia 2026 (segunda vuelta: Iván Cepeda vs Abelardo de la Espriella, 21 de junio). Si preguntan otra cosa, redirige con amabilidad al tema electoral.
- Español de Colombia, claro, directo y analítico. Usa Markdown. Sé concreto: cifras, fechas, fuentes. No inventes datos.${await grounding()}`;

    const upstream = await fetch(`${BRAIN_URL.replace(/\/$/, '')}/chat`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'authorization': `Bearer ${BRAIN_SECRET}` },
      body: JSON.stringify({ messages, system }),
    });

    if (!upstream.ok || !upstream.body) {
      const t = await upstream.text().catch(() => '');
      throw new Error(`Brain error ${upstream.status}: ${t.slice(0, 200)}`);
    }

    return new Response(upstream.body, {
      headers: {
        ...cors,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message || 'Error desconocido' }), {
      status: 500,
      headers: { ...cors, 'Content-Type': 'application/json' },
    });
  }
});
