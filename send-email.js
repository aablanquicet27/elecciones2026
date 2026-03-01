// Script para enviar email masivo a suscriptores
// Usa Resend API + Supabase para obtener emails

const RESEND_API_KEY = 're_aNrmCTNf_7NgbHcikHtXKXHqDHHvHk8Pn';
const SUPABASE_URL = 'https://gsidmhliqzyntcjwzasg.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzaWRtaGxpcXp5bnRjand6YXNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4MzY3OTksImV4cCI6MjA1ODQxMjc5OX0.RfJthlMKtZJ_DNZuNv_bAv8Acn_e-S_b57xS70ixy0I';

const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f5f5f5; color: #333; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: linear-gradient(135deg, #7c3aed, #4f46e5); padding: 32px 24px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 24px; }
    .header p { color: #e0d4ff; margin: 8px 0 0; font-size: 14px; }
    .content { padding: 32px 24px; }
    .greeting { font-size: 16px; line-height: 1.6; margin-bottom: 24px; }
    .results-title { font-size: 20px; font-weight: bold; margin-bottom: 16px; color: #1a1a2e; }
    .candidate-row { display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
    .rank { font-size: 24px; margin-right: 12px; min-width: 36px; text-align: center; }
    .candidate-info { flex: 1; }
    .candidate-name { font-weight: 600; font-size: 15px; color: #1a1a2e; }
    .candidate-stats { font-size: 13px; color: #666; margin-top: 2px; }
    .bar-container { width: 100%; height: 8px; background: #f0f0f0; border-radius: 4px; margin-top: 4px; }
    .bar { height: 8px; background: linear-gradient(90deg, #7c3aed, #4f46e5); border-radius: 4px; }
    .stats-box { background: #f8f7ff; border: 1px solid #e8e5ff; border-radius: 12px; padding: 20px; margin: 24px 0; text-align: center; }
    .stats-number { font-size: 36px; font-weight: bold; color: #7c3aed; }
    .stats-label { font-size: 13px; color: #666; margin-top: 4px; }
    .cta-section { background: #f8f7ff; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center; }
    .cta-section p { font-size: 15px; line-height: 1.6; color: #444; margin-bottom: 16px; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #7c3aed, #4f46e5); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px; }
    .divider { height: 1px; background: #eee; margin: 24px 0; }
    .footer { padding: 24px; text-align: center; font-size: 12px; color: #999; background: #fafafa; }
    .footer a { color: #7c3aed; text-decoration: none; }
    .agapai { margin-top: 16px; padding-top: 16px; border-top: 1px solid #eee; }
    .agapai-text { font-size: 13px; color: #888; }
    .reply-cta { background: #fff7ed; border: 1px solid #fed7aa; border-radius: 12px; padding: 20px; margin: 24px 0; }
    .reply-cta p { font-size: 14px; line-height: 1.6; color: #92400e; margin: 0; }
    .reply-cta strong { color: #78350f; }
    .senado-teaser { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; margin: 24px 0; }
    .senado-teaser p { font-size: 14px; line-height: 1.6; color: #166534; margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🗳️ Resultados: Encuesta Presidencial 2026</h1>
      <p>eleccionescolombia.org — Análisis electoral con inteligencia artificial</p>
    </div>
    
    <div class="content">
      <div class="greeting">
        ¡Hola! 👋<br><br>
        Hace unas semanas te registraste en <strong>eleccionescolombia.org</strong> y votaste en nuestra encuesta presidencial. Hoy te traemos los resultados — y hay sorpresas.
      </div>

      <div class="stats-box">
        <div class="stats-number">147</div>
        <div class="stats-label">votos registrados de 214 suscriptores</div>
      </div>

      <div class="results-title">📊 Así van las intenciones de voto</div>

      <div class="candidate-row">
        <div class="rank">🥇</div>
        <div class="candidate-info">
          <div class="candidate-name">Sergio Fajardo</div>
          <div class="candidate-stats">48 votos — 32.7%</div>
          <div class="bar-container"><div class="bar" style="width: 100%"></div></div>
        </div>
      </div>

      <div class="candidate-row">
        <div class="rank">🥈</div>
        <div class="candidate-info">
          <div class="candidate-name">Abelardo de la Espriella</div>
          <div class="candidate-stats">40 votos — 27.2%</div>
          <div class="bar-container"><div class="bar" style="width: 83%"></div></div>
        </div>
      </div>

      <div class="candidate-row">
        <div class="rank">🥉</div>
        <div class="candidate-info">
          <div class="candidate-name">Iván Cepeda</div>
          <div class="candidate-stats">12 votos — 8.2%</div>
          <div class="bar-container"><div class="bar" style="width: 25%"></div></div>
        </div>
      </div>

      <div class="candidate-row">
        <div class="rank">⬜</div>
        <div class="candidate-info">
          <div class="candidate-name">Voto en Blanco</div>
          <div class="candidate-stats">10 votos — 6.8%</div>
          <div class="bar-container"><div class="bar" style="width: 21%"></div></div>
        </div>
      </div>

      <div class="candidate-row">
        <div class="rank">5</div>
        <div class="candidate-info">
          <div class="candidate-name">Vicky Dávila</div>
          <div class="candidate-stats">6 votos — 4.1%</div>
          <div class="bar-container"><div class="bar" style="width: 12.5%"></div></div>
        </div>
      </div>

      <div class="candidate-row">
        <div class="rank">6</div>
        <div class="candidate-info">
          <div class="candidate-name">Miguel Uribe Turbay</div>
          <div class="candidate-stats">5 votos — 3.4%</div>
          <div class="bar-container"><div class="bar" style="width: 10%"></div></div>
        </div>
      </div>

      <div class="candidate-row" style="border-bottom: none;">
        <div class="rank">7</div>
        <div class="candidate-info">
          <div class="candidate-name">Otros candidatos</div>
          <div class="candidate-stats">26 votos — 17.7% (Paloma Valencia, Camilo Romero, Vargas Lleras y más)</div>
          <div class="bar-container"><div class="bar" style="width: 54%"></div></div>
        </div>
      </div>

      <div class="divider"></div>

      <div class="senado-teaser">
        <p>🏛️ <strong>¿Ya viste nuestra sección del Senado?</strong><br>
        Investigamos a fondo los candidatos al Senado 2026: partidos, antecedentes, votaciones. Todo en un solo lugar para que votes informado.<br><br>
        👉 <a href="https://eleccionescolombia.org/senado" style="color: #166534; font-weight: bold;">Ver candidatos al Senado →</a></p>
      </div>

      <div class="cta-section">
        <p>¿Todavía no has votado? La encuesta sigue abierta.<br>Tu voto nos ayuda a tener datos más representativos.</p>
        <a href="https://eleccionescolombia.org" class="cta-button">Votar ahora →</a>
      </div>

      <div class="reply-cta">
        <p>💼 <strong>¿Trabajas en una campaña política o consultoría?</strong><br>
        Estamos desarrollando herramientas de análisis electoral con inteligencia artificial — datos regionales, tendencias, perfiles de votantes. Si te interesa, simplemente responde este correo.</p>
      </div>

    </div>

    <div class="footer">
      <p>Recibiste este correo porque te suscribiste en <a href="https://eleccionescolombia.org">eleccionescolombia.org</a></p>
      <div class="agapai">
        <p class="agapai-text">Desarrollado por <a href="https://agapai.com.co"><strong>AGAPAI</strong></a> — Inteligencia artificial aplicada</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

async function getEmails() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/subscriptions?select=email&active=eq.true`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`
    }
  });
  const data = await res.json();
  return data.map(d => d.email);
}

async function sendBatch(emails) {
  // Resend batch API supports up to 100 emails per call
  const batches = [];
  for (let i = 0; i < emails.length; i += 100) {
    batches.push(emails.slice(i, i + 100));
  }

  let sent = 0;
  let errors = 0;

  for (const batch of batches) {
    const payload = batch.map(email => ({
      from: 'EleccionesCol 2026 <encuesta@eleccionescolombia.org>',
      to: [email],
      subject: '🗳️ Resultados: Así va la encuesta presidencial 2026',
      html: emailHtml
    }));

    const res = await fetch('https://api.resend.com/emails/batch', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await res.json();
    
    if (res.ok) {
      sent += batch.length;
      console.log(`✅ Batch enviado: ${batch.length} emails`);
    } else {
      errors += batch.length;
      console.error(`❌ Error en batch:`, JSON.stringify(result));
    }
  }

  console.log(`\n📊 Resumen: ${sent} enviados, ${errors} errores de ${emails.length} total`);
}

async function main() {
  console.log('📧 Obteniendo emails de Supabase...');
  const emails = await getEmails();
  console.log(`📋 ${emails.length} suscriptores encontrados`);
  
  if (process.argv[2] === '--send') {
    console.log('🚀 Enviando emails...');
    await sendBatch(emails);
  } else {
    console.log('\n⚠️  Modo preview. Usa --send para enviar.');
    console.log(`Primeros 5 emails: ${emails.slice(0, 5).join(', ')}`);
  }
}

main().catch(console.error);
