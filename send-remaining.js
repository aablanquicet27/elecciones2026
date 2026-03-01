// Send remaining 114 emails
const fs = require('fs');
const RESEND_API_KEY = 're_aNrmCTNf_7NgbHcikHtXKXHqDHHvHk8Pn';

const emailHtml = fs.readFileSync('/tmp/elecciones2026/send-email.js', 'utf8')
  .match(/const emailHtml = `([\s\S]*?)`;/)[1];

async function main() {
  const emails = fs.readFileSync('/tmp/elecciones2026/remaining-emails.txt', 'utf8')
    .trim().split('\n').filter(e => e);
  
  console.log(`📧 Enviando a ${emails.length} emails restantes...`);
  
  const batches = [];
  for (let i = 0; i < emails.length; i += 100) {
    batches.push(emails.slice(i, i + 100));
  }

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
      console.log(`✅ ${batch.length} emails enviados`);
    } else {
      console.error(`❌ Error:`, JSON.stringify(result));
    }
  }
  console.log('DONE');
}

main().catch(console.error);
