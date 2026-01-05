#!/bin/bash
# Script para obtener valores pendientes de GCP
# Ejecutar: bash get-gcp-values.sh

set -e

PROJECT_ID="ss322-blog-prod-210625"
PROJECT_NUMBER="785229525031"

echo "=========================================="
echo "Obteniendo valores de GCP"
echo "=========================================="
echo ""

echo "📌 Project ID: $PROJECT_ID"
echo ""

# Obtener PROJECT_NUMBER
echo "🔢 PROJECT_NUMBER obtenido:"
echo "   PROJECT_NUMBER: $PROJECT_NUMBER"
echo ""

# Verificar si el bucket existe
echo "🪣 Verificando bucket repo-logia..."
gsutil ls gs://repo-logia/ >/dev/null 2>&1 && echo "   ✅ Bucket repo-logia existe" || echo "   ⚠️  Bucket repo-logia NO existe (créalo con: gsutil mb gs://repo-logia/)"
echo ""

# Verificar si el servicio Cloud Run existe
echo "☁️  Verificando servicio Cloud Run repo-privado..."
gcloud run services describe repo-privado --region=us-central1 --project=$PROJECT_ID >/dev/null 2>&1 && echo "   ✅ Servicio repo-privado existe" || echo "   ⚠️  Servicio repo-privado NO existe (se creará en el primer despliegue)"
echo ""

# Intentar obtener BACKEND_SERVICE_ID
echo "🔐 Intentando obtener BACKEND_SERVICE_ID..."
BACKEND_SERVICE_ID=$(gcloud compute backend-services describe repo-logia-backend-svc --global --format="value(id)" --project=$PROJECT_ID 2>/dev/null || echo "PENDIENTE")
if [ "$BACKEND_SERVICE_ID" = "PENDIENTE" ]; then
    echo "   ⚠️  Backend Service 'repo-logia-backend-svc' NO existe aún"
    echo "   📝 Se creará durante la configuración de infraestructura"
else
    echo "   ✅ BACKEND_SERVICE_ID: $BACKEND_SERVICE_ID"
fi
echo ""

echo "=========================================="
echo "Resumen de Valores"
echo "=========================================="
echo ""
echo "Copia estos valores a tu archivo .env:"
echo ""
echo "GCP_PROJECT_ID=$PROJECT_ID"
echo "GCP_PROJECT_NUMBER=$PROJECT_NUMBER"
echo "BACKEND_SERVICE_ID=$BACKEND_SERVICE_ID"
echo "BUCKET_NAME=repo-logia"
echo "ADMIN_EMAILS=admin@marcomejia.cloud"
echo "NODE_ENV=development"
echo "DEV_USER_EMAIL=admin@marcomejia.cloud"
echo ""

# Crear archivo .env si no existe
if [ ! -f "backend/.env" ]; then
    echo "📝 Creando archivo backend/.env..."
    cat > backend/.env <<EOF
# Variables de entorno - Generadas automáticamente
GCP_PROJECT_ID=$PROJECT_ID
GCP_PROJECT_NUMBER=$PROJECT_NUMBER
BACKEND_SERVICE_ID=$BACKEND_SERVICE_ID
BUCKET_NAME=repo-logia
ADMIN_EMAILS=admin@marcomejia.cloud
NODE_ENV=development
DEV_USER_EMAIL=admin@marcomejia.cloud
PORT=8080
EOF
    echo "   ✅ Archivo backend/.env creado"
else
    echo "   ℹ️  Archivo backend/.env ya existe (no se sobrescribió)"
fi
echo ""

echo "=========================================="
echo "Próximos Pasos"
echo "=========================================="
echo ""
echo "1. Si PROJECT_NUMBER es 'ERROR', autentícate con:"
echo "   gcloud auth login"
echo ""
echo "2. Si el bucket no existe, créalo con:"
echo "   gsutil mb -l us-central1 gs://repo-logia/"
echo ""
echo "3. Configura los secrets en GitHub Actions:"
echo "   - GCP_PROJECT_NUMBER: $PROJECT_NUMBER"
echo "   - ADMIN_EMAILS: admin@marcomejia.cloud"
echo ""
echo "4. Sigue la guía en PROXIMOS_PASOS.md para el despliegue"
echo ""
