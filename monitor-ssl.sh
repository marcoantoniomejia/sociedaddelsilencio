#!/bin/bash
# Script para monitorear el estado del certificado SSL

PROJECT_ID="ss322-blog-prod-210625"
CERT_NAME="www-ss322-ssl-cert-v2"

echo "=========================================="
echo "Monitoreando Certificado SSL"
echo "=========================================="
echo ""

while true; do
    clear
    echo "🔍 Estado del Certificado SSL: $CERT_NAME"
    echo "⏰ $(date '+%Y-%m-%d %H:%M:%S')"
    echo ""
    
    # Obtener estado
    gcloud compute ssl-certificates describe $CERT_NAME \
        --global \
        --project=$PROJECT_ID \
        --format="yaml(managed.domainStatus,managed.status)" 2>/dev/null
    
    echo ""
    echo "=========================================="
    echo "Presiona Ctrl+C para detener el monitoreo"
    echo "Próxima verificación en 60 segundos..."
    echo "=========================================="
    
    sleep 60
done
