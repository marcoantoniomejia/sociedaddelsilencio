# Guía de Configuración de Infraestructura GCP

## Sistema de Gestión Documental - Sociedad del Silencio 322

Esta guía contiene todos los comandos necesarios para configurar la infraestructura en Google Cloud Platform.

---

## 📋 Prerrequisitos

Antes de comenzar, asegúrate de tener:

1. **gcloud CLI** instalado y autenticado
2. **Permisos necesarios** en el proyecto GCP
3. **Variables de entorno** configuradas:

```bash
export PROJECT_ID="ss322-blog-prod-210625"
export PROJECT_NUMBER="785229525031"  # Obtener con: gcloud projects describe $PROJECT_ID --format="value(projectNumber)"
export REGION="us-central1"
export SERVICE_NAME="repo-privado"
```

---

## 🔧 Paso 1: Crear Service Account para Cloud Run

```bash
# Crear Service Account
gcloud iam service-accounts create backend-sa \
  --display-name="Backend Service Account" \
  --project=$PROJECT_ID

# Dar permisos de Storage Object Admin
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:backend-sa@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/storage.objectAdmin"

# Dar permisos de Storage Admin (para generar Signed URLs)
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:backend-sa@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountTokenCreator"
```

---

## 🚀 Paso 2: Desplegar Cloud Run (Primera vez)

```bash
# Construir y subir imagen
cd backend
gcloud builds submit \
  --tag ${REGION}-docker.pkg.dev/${PROJECT_ID}/www-ss322/repo-privado:latest

# Desplegar servicio
gcloud run deploy repo-privado \
  --image ${REGION}-docker.pkg.dev/${PROJECT_ID}/www-ss322/repo-privado:latest \
  --region $REGION \
  --platform managed \
  --no-allow-unauthenticated \
  --ingress internal-and-cloud-load-balancing \
  --service-account backend-sa@${PROJECT_ID}.iam.gserviceaccount.com \
  --set-env-vars "GCP_PROJECT_ID=${PROJECT_ID},GCP_PROJECT_NUMBER=${PROJECT_NUMBER},BUCKET_NAME=repo-logia,NODE_ENV=production" \
  --port 8080 \
  --cpu 1 \
  --memory 512Mi \
  --max-instances 10 \
  --min-instances 0
```

---

## 🌐 Paso 3: Configurar Networking (Serverless NEG)

```bash
# Crear Serverless Network Endpoint Group
gcloud compute network-endpoint-groups create repo-privado-neg \
  --region=$REGION \
  --network-endpoint-type=serverless \
  --cloud-run-service=repo-privado \
  --project=$PROJECT_ID

# Verificar creación
gcloud compute network-endpoint-groups list --project=$PROJECT_ID
```

---

## 🔐 Paso 4: Crear Backend Service con IAP

```bash
# Crear Backend Service
gcloud compute backend-services create repo-privado-backend-svc \
  --global \
  --load-balancing-scheme=EXTERNAL_MANAGED \
  --protocol=HTTPS \
  --project=$PROJECT_ID

# Añadir el NEG al Backend Service
gcloud compute backend-services add-backend repo-privado-backend-svc \
  --global \
  --network-endpoint-group=repo-privado-neg \
  --network-endpoint-group-region=$REGION \
  --project=$PROJECT_ID

# Habilitar Cloud CDN (Opcional - NO recomendado para contenido privado)
# gcloud compute backend-services update repo-privado-backend-svc \
#   --global \
#   --enable-cdn \
#   --project=$PROJECT_ID
```

---

## 🔒 Paso 5: Configurar Identity-Aware Proxy (IAP)

### 5.1 Habilitar IAP

```bash
# Habilitar IAP en el Backend Service
gcloud iap web enable \
  --resource-type=backend-services \
  --service=repo-privado-backend-svc \
  --project=$PROJECT_ID
```

### 5.2 Configurar OAuth Consent Screen

**IMPORTANTE:** Esto debe hacerse desde la consola web la primera vez.

1. Ir a: https://console.cloud.google.com/apis/credentials/consent
2. Configurar:
   - **User Type:** Internal (si usas Google Workspace) o External
   - **App name:** Sociedad del Silencio 322 - Repositorio
   - **User support email:** Tu email
   - **Authorized domains:** sociedaddelsilencio322.org

### 5.3 Dar Acceso a Usuarios

```bash
# Dar acceso a un usuario específico
gcloud iap web add-iam-policy-binding \
  --resource-type=backend-services \
  --service=repo-privado-backend-svc \
  --member='user:miembro@gmail.com' \
  --role='roles/iap.httpsResourceAccessor' \
  --project=$PROJECT_ID

# Dar acceso a múltiples usuarios (ejecutar para cada uno)
for email in admin@sociedaddelsilencio.org miembro1@gmail.com miembro2@gmail.com; do
  gcloud iap web add-iam-policy-binding \
    --resource-type=backend-services \
    --service=repo-privado-backend-svc \
    --member="user:${email}" \
    --role='roles/iap.httpsResourceAccessor' \
    --project=$PROJECT_ID
done
```

---

## 🗺️ Paso 6: Actualizar URL Map del Load Balancer

```bash
# Obtener el URL Map actual
gcloud compute url-maps describe www-ss322-url-map \
  --global \
  --project=$PROJECT_ID

# Crear un Path Matcher para /privado/*
gcloud compute url-maps add-path-matcher www-ss322-url-map \
  --path-matcher-name=privado-matcher \
  --default-service=repo-privado-backend-svc \
  --path-rules="/privado/*=repo-privado-backend-svc" \
  --global \
  --project=$PROJECT_ID

# Actualizar el host rule (si es necesario)
gcloud compute url-maps add-host-rule www-ss322-url-map \
  --hosts="sociedaddelsilencio322.org,www.sociedaddelsilencio322.org" \
  --path-matcher-name=privado-matcher \
  --global \
  --project=$PROJECT_ID
```

**NOTA:** Si el comando anterior falla, edita manualmente el URL Map desde la consola:

1. Ir a: https://console.cloud.google.com/net-services/loadbalancing/list/loadBalancers
2. Click en `www-ss322-url-map`
3. Edit > Host and path rules
4. Añadir regla: `/privado/*` → `repo-privado-backend-svc`

---

## 📊 Paso 7: Obtener IDs necesarios para JWT Validation

```bash
# Obtener PROJECT_NUMBER
gcloud projects describe $PROJECT_ID --format="value(projectNumber)"

# Obtener BACKEND_SERVICE_ID
gcloud compute backend-services describe repo-privado-backend-svc \
  --global \
  --format="value(id)" \
  --project=$PROJECT_ID
```

**Guardar estos valores** y configurarlos como variables de entorno en Cloud Run:

```bash
gcloud run services update repo-privado \
  --region=$REGION \
  --update-env-vars "BACKEND_SERVICE_ID=<ID_OBTENIDO>" \
  --project=$PROJECT_ID
```

---

## ✅ Paso 8: Verificación

### 8.1 Verificar Cloud Run

```bash
# Ver logs del servicio
gcloud run services logs read repo-privado \
  --region=$REGION \
  --project=$PROJECT_ID \
  --limit=50

# Verificar estado
gcloud run services describe repo-privado \
  --region=$REGION \
  --project=$PROJECT_ID
```

### 8.2 Verificar IAP

```bash
# Listar usuarios con acceso
gcloud iap web get-iam-policy \
  --resource-type=backend-services \
  --service=repo-privado-backend-svc \
  --project=$PROJECT_ID
```

### 8.3 Prueba de Acceso

1. Acceder a: `https://sociedaddelsilencio322.org/privado/repositorio.html`
2. Deberías ver la pantalla de login de Google
3. Después de autenticarte, deberías ver el repositorio

---

## 🔄 Comandos de Mantenimiento

### Actualizar el servicio

```bash
# Desplegar nueva versión
gcloud run deploy repo-privado \
  --image ${REGION}-docker.pkg.dev/${PROJECT_ID}/www-ss322/repo-privado:latest \
  --region $REGION \
  --project=$PROJECT_ID
```

### Agregar nuevo usuario

```bash
gcloud iap web add-iam-policy-binding \
  --resource-type=backend-services \
  --service=repo-privado-backend-svc \
  --member='user:nuevo@gmail.com' \
  --role='roles/iap.httpsResourceAccessor' \
  --project=$PROJECT_ID
```

### Remover usuario

```bash
gcloud iap web remove-iam-policy-binding \
  --resource-type=backend-services \
  --service=repo-privado-backend-svc \
  --member='user:usuario@gmail.com' \
  --role='roles/iap.httpsResourceAccessor' \
  --project=$PROJECT_ID
```

### Ver logs en tiempo real

```bash
gcloud run services logs tail repo-privado \
  --region=$REGION \
  --project=$PROJECT_ID
```

---

## 🐛 Troubleshooting

### Error: "No IAP JWT found"

- Verificar que IAP esté habilitado en el Backend Service
- Verificar que el Load Balancer esté ruteando correctamente a `/privado/*`

### Error: "Invalid IAP token"

- Verificar que `PROJECT_NUMBER` y `BACKEND_SERVICE_ID` sean correctos
- Revisar logs: `gcloud run services logs read repo-privado`

### Error 403 al acceder

- Verificar que tu email esté en la lista de usuarios autorizados
- Verificar que tengas el rol `roles/iap.httpsResourceAccessor`

---

## 📚 Referencias

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [IAP Documentation](https://cloud.google.com/iap/docs)
- [Serverless NEG](https://cloud.google.com/load-balancing/docs/negs/serverless-neg-concepts)
