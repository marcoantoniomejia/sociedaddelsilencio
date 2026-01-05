# 🎯 Plan de Despliegue Actualizado - Usando Load Balancer Existente

## 📊 Infraestructura Actual (Existente)

| Componente                    | Nombre                    | Estado       |
| :---------------------------- | :------------------------ | :----------- |
| **Load Balancer**             | `www-ss322-url-map`       | ✅ Existente |
| **Frontend IP**               | `136.110.194.82:443`      | ✅ Existente |
| **Backend Service (Público)** | `www-ss322-backend-svc`   | ✅ Existente |
| **NEG (Público)**             | `www-ss322-neg`           | ✅ Existente |
| **Cloud Run (Público)**       | `wwwss322`                | ✅ Existente |
| **DNS**                       | Apunta a `136.110.194.82` | ✅ Existente |

## 🆕 Infraestructura Nueva (A Crear)

| Componente                    | Nombre                     | Ruta         |
| :---------------------------- | :------------------------- | :----------- |
| **Backend Service (Privado)** | `repo-privado-backend-svc` | `/privado/*` |
| **NEG (Privado)**             | `repo-privado-neg`         | -            |
| **Cloud Run (Privado)**       | `repo-privado`             | -            |

## 🏗️ Arquitectura Final

```
Usuario → DNS (sociedaddelsilencio322.org)
    ↓
136.110.194.82:443 (Frontend IP Existente)
    ↓
Load Balancer: www-ss322-url-map (EXISTENTE)
    ├─→ Path: /* (default)
    │   └─→ Backend: www-ss322-backend-svc (EXISTENTE)
    │       └─→ NEG: www-ss322-neg
    │           └─→ Cloud Run: wwwss322 (Frontend Público)
    │
    └─→ Path: /privado/* (NUEVO)
        └─→ Backend: repo-privado-backend-svc (NUEVO + IAP)
            └─→ NEG: repo-privado-neg
                └─→ Cloud Run: repo-privado (Backend Privado)
                    └─→ Cloud Storage: repo-logia
```

---

## 🚀 Pasos de Despliegue

### Paso 1: Configurar Service Accounts

#### 1.1 Crear Service Account para Cloud Run (Runtime)

Esta SA solo tendrá permisos para acceder a Cloud Storage:

```bash
export PROJECT_ID="ss322-blog-prod-210625"

# Crear SA específica para el backend
gcloud iam service-accounts create backend-sa \
  --display-name="Backend Privado - Repositorio Documentos" \
  --project=$PROJECT_ID

# Permiso para leer/escribir en Cloud Storage
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:backend-sa@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/storage.objectAdmin"

# Permiso para generar Signed URLs
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:backend-sa@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountTokenCreator"
```

#### 1.2 Actualizar Service Account de Cloud Build (CI/CD)

Añadir el permiso que falta a la SA existente que usa GitHub Actions:

```bash
# Añadir permiso para que Cloud Build pueda actuar como backend-sa
gcloud iam service-accounts add-iam-policy-binding \
  backend-sa@${PROJECT_ID}.iam.gserviceaccount.com \
  --member="serviceAccount:cloud-build-${PROJECT_ID}@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser" \
  --project=$PROJECT_ID
```

**Nota:** Usaremos la SA existente `cloud-build-785229525031@ss322-blog-prod-210625.iam.gserviceaccount.com` para GitHub Actions (ya tiene todos los permisos necesarios).

---

### Paso 2: Desplegar Cloud Run

```bash
cd backend

# Build de la imagen
gcloud builds submit \
  --tag us-central1-docker.pkg.dev/ss322-blog-prod-210625/www-ss322/repo-privado:latest \
  --project=ss322-blog-prod-210625

# Deploy a Cloud Run
gcloud run deploy repo-privado \
  --image us-central1-docker.pkg.dev/ss322-blog-prod-210625/www-ss322/repo-privado:latest \
  --region us-central1 \
  --platform managed \
  --no-allow-unauthenticated \
  --ingress internal-and-cloud-load-balancing \
  --service-account backend-sa@ss322-blog-prod-210625.iam.gserviceaccount.com \
  --set-env-vars "GCP_PROJECT_ID=ss322-blog-prod-210625,GCP_PROJECT_NUMBER=785229525031,BUCKET_NAME=repo-logia,NODE_ENV=production,ADMIN_EMAILS=admin@marcomejia.cloud,BACKEND_SERVICE_ID=PENDIENTE" \
  --port 8080 \
  --cpu 1 \
  --memory 512Mi \
  --max-instances 10 \
  --min-instances 0 \
  --project=ss322-blog-prod-210625
```

---

### Paso 3: Crear Serverless NEG

```bash
gcloud compute network-endpoint-groups create repo-privado-neg \
  --region=us-central1 \
  --network-endpoint-type=serverless \
  --cloud-run-service=repo-privado \
  --project=ss322-blog-prod-210625

# Verificar
gcloud compute network-endpoint-groups list --project=ss322-blog-prod-210625
```

---

### Paso 4: Crear Backend Service (NUEVO)

```bash
# Crear el Backend Service
gcloud compute backend-services create repo-privado-backend-svc \
  --global \
  --load-balancing-scheme=EXTERNAL_MANAGED \
  --protocol=HTTPS \
  --project=ss322-blog-prod-210625

# Añadir el NEG al Backend Service
gcloud compute backend-services add-backend repo-privado-backend-svc \
  --global \
  --network-endpoint-group=repo-privado-neg \
  --network-endpoint-group-region=us-central1 \
  --project=ss322-blog-prod-210625

# Verificar
gcloud compute backend-services describe repo-privado-backend-svc \
  --global \
  --project=ss322-blog-prod-210625
```

---

### Paso 5: Habilitar IAP en el Backend Service

```bash
# Habilitar IAP
gcloud iap web enable \
  --resource-type=backend-services \
  --service=repo-privado-backend-svc \
  --project=ss322-blog-prod-210625

# Dar acceso al administrador
gcloud iap web add-iam-policy-binding \
  --resource-type=backend-services \
  --service=repo-privado-backend-svc \
  --member='user:admin@marcomejia.cloud' \
  --role='roles/iap.httpsResourceAccessor' \
  --project=ss322-blog-prod-210625
```

---

### Paso 6: Obtener BACKEND_SERVICE_ID

```bash
BACKEND_SERVICE_ID=$(gcloud compute backend-services describe repo-privado-backend-svc \
  --global \
  --format="value(id)" \
  --project=ss322-blog-prod-210625)

echo "BACKEND_SERVICE_ID: $BACKEND_SERVICE_ID"
```

**Guarda este valor para:**

1. Añadirlo como secret `BACKEND_SERVICE_ID` en GitHub
2. Actualizar Cloud Run con este valor

---

### Paso 7: Actualizar Cloud Run con BACKEND_SERVICE_ID

```bash
gcloud run services update repo-privado \
  --region=us-central1 \
  --update-env-vars "BACKEND_SERVICE_ID=${BACKEND_SERVICE_ID}" \
  --project=ss322-blog-prod-210625
```

---

### Paso 8: Actualizar URL Map (CRÍTICO)

**Opción A: Desde la Consola (Recomendado)**

1. Ve a: https://console.cloud.google.com/net-services/loadbalancing/list/loadBalancers
2. Click en `www-ss322-url-map`
3. Click en **"EDIT"**
4. En "Host and path rules":
   - Click en **"Add host and path rule"**
   - **Hosts:** `*` (o tu dominio específico)
   - **Paths:** `/privado/*`
   - **Backend:** `repo-privado-backend-svc`
5. **IMPORTANTE:** Asegúrate de que la regla default (`/*`) siga apuntando a `www-ss322-backend-svc`
6. Click en **"Update"**

**Opción B: Desde gcloud (Avanzado)**

```bash
# Primero, exporta la configuración actual
gcloud compute url-maps export www-ss322-url-map \
  --global \
  --destination=url-map-backup.yaml \
  --project=ss322-blog-prod-210625

# Edita el archivo y añade la nueva regla de path
# Luego importa:
gcloud compute url-maps import www-ss322-url-map \
  --global \
  --source=url-map-updated.yaml \
  --project=ss322-blog-prod-210625
```

---

### Paso 9: Configurar OAuth Consent Screen (Si no existe)

1. Ve a: https://console.cloud.google.com/apis/credentials/consent
2. Configura:
   - **User Type:** External
   - **App name:** Sociedad del Silencio 322 - Repositorio
   - **User support email:** admin@marcomejia.cloud
   - **Authorized domains:** sociedaddelsilencio322.org
3. Guarda

---

## ✅ Verificación

### 1. Verificar que todo está creado

```bash
# Cloud Run
gcloud run services describe repo-privado \
  --region=us-central1 \
  --project=ss322-blog-prod-210625

# NEG
gcloud compute network-endpoint-groups describe repo-privado-neg \
  --region=us-central1 \
  --project=ss322-blog-prod-210625

# Backend Service
gcloud compute backend-services describe repo-privado-backend-svc \
  --global \
  --project=ss322-blog-prod-210625

# IAP
gcloud iap web get-iam-policy \
  --resource-type=backend-services \
  --service=repo-privado-backend-svc \
  --project=ss322-blog-prod-210625
```

### 2. Verificar URL Map

```bash
gcloud compute url-maps describe www-ss322-url-map \
  --global \
  --project=ss322-blog-prod-210625
```

Deberías ver algo como:

```yaml
pathMatchers:
  - defaultService: https://www.googleapis.com/compute/v1/projects/ss322-blog-prod-210625/global/backendServices/www-ss322-backend-svc
    pathRules:
      - paths:
          - /privado/*
        service: https://www.googleapis.com/compute/v1/projects/ss322-blog-prod-210625/global/backendServices/repo-privado-backend-svc
```

### 3. Probar Acceso

1. Abre: `https://sociedaddelsilencio322.org/privado/repositorio.html`
2. Deberías ver la pantalla de login de Google
3. Autentícate con `admin@marcomejia.cloud`
4. Deberías ver el repositorio

---

## 🎯 Checklist Final

- [ ] Service Account creado
- [ ] Cloud Run desplegado
- [ ] Serverless NEG creado
- [ ] Backend Service creado
- [ ] IAP habilitado
- [ ] BACKEND_SERVICE_ID obtenido
- [ ] Cloud Run actualizado con BACKEND_SERVICE_ID
- [ ] URL Map actualizado con regla `/privado/*`
- [ ] OAuth Consent Screen configurado
- [ ] Acceso IAP dado a admin@marcomejia.cloud
- [ ] Prueba de acceso exitosa

---

## 📝 Notas Importantes

1. **NO necesitas crear un nuevo Load Balancer** - Usamos el existente
2. **NO necesitas una nueva IP** - Usamos `136.110.194.82`
3. **NO necesitas cambiar DNS** - Ya apunta a la IP correcta
4. **Solo añadimos una nueva regla de path** al Load Balancer existente

---

## 🆘 Troubleshooting

### Error: "Backend service already exists"

Ya existe, puedes continuar con el siguiente paso.

### Error al acceder a /privado/

1. Verifica que el URL Map tenga la regla `/privado/*`
2. Verifica que IAP esté habilitado
3. Verifica que tu email tenga el rol `iap.httpsResourceAccessor`

### Error: "Invalid IAP token"

1. Verifica que `BACKEND_SERVICE_ID` esté configurado correctamente en Cloud Run
2. Verifica que `PROJECT_NUMBER` sea `785229525031`

---

¿Listo para comenzar con el Paso 1?
