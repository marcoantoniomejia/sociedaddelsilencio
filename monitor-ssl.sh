#!/bin/bash
# Script para monitorear el estado del certificado SSL v3

PROJECT_ID="ss322-blog-prod-210625"
CERT_NAME="www-ss322-ssl-cert-v3" # Actualizado a v3

echo "=========================================="
echo "⏳ Monitoreando Certificado SSL: $CERT_NAME"
echo "=========================================="

while true; do
  STATUS=$(gcloud compute ssl-certificates describe $CERT_NAME \
      --global \
      --project=$PROJECT_ID \
      --format="value(managed.status)" 2>/dev/null)
  
  DOMAINS=$(gcloud compute ssl-certificates describe $CERT_NAME \
      --global \
      --project=$PROJECT_ID \
      --format="yaml(managed.domainStatus)" 2>/dev/null)

  clear
  echo "=========================================="
  echo "📅 Hora: $(date '+%H:%M:%S')"
  echo "🔑 Certificado: $CERT_NAME"
  echo "🚦 Estado Global: $STATUS"
  echo "------------------------------------------"
  echo "$DOMAINS"
  echo "=========================================="
  
  if [ "$STATUS" == "ACTIVE" ]; then
      echo "✅ ¡CERTIFICADO ACTIVO! 🎉"
      echo "Prueba acceder a: https://sociedaddelsilencio322.org/privado/repositorio.html"
      break
  fi

  echo "Esperando 30 segundos..."
  sleep 30
done
