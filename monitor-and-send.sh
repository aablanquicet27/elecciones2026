#!/bin/bash
RESEND_KEY="re_aNrmCTNf_7NgbHcikHtXKXHqDHHvHk8Pn"
DOMAIN_ID="068bf109-3631-44d3-9cfc-f901e278b435"

for i in $(seq 1 30); do
  echo "$(date) — Intento $i: verificando dominio..."
  
  # Trigger verify
  curl -s -X POST "https://api.resend.com/domains/$DOMAIN_ID/verify" \
    -H "Authorization: Bearer $RESEND_KEY" > /dev/null
  
  sleep 10
  
  STATUS=$(curl -s "https://api.resend.com/domains/$DOMAIN_ID" \
    -H "Authorization: Bearer $RESEND_KEY" | jq -r '.status')
  
  echo "Status: $STATUS"
  
  if [ "$STATUS" = "verified" ]; then
    echo "✅ DOMINIO VERIFICADO! Enviando emails..."
    cd /tmp/elecciones2026 && node send-email.js --send
    echo "DONE"
    exit 0
  fi
  
  sleep 50  # ~1 min entre checks
done

echo "❌ Dominio no verificó después de 30 intentos"
exit 1
