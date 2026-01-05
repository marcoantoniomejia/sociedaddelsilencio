# 🎯 Próximos Pasos - Sistema de Gestión Documental

## ✅ Completado (Día 1)

- [x] Estructura del proyecto Node.js creada
- [x] `package.json` con todas las dependencias
- [x] `StorageService` implementado con Signed URLs V4
- [x] Middleware `verifyIAP` para validación JWT
- [x] Middleware `requireAdmin` para RBAC
- [x] Controladores de API completos
- [x] Servidor Express configurado
- [x] Dockerfile optimizado (Distroless)
- [x] Frontend `repositorio.html` con diseño masónico
- [x] Pipeline de GitHub Actions
- [x] Documentación completa (`README_INFRA.md`)

## 📋 Pendiente - Configuración Inicial

### 1. Configurar Variables de Entorno Locales

```bash
cd backend
cp .env.example .env
```

Edita `.env` con tus valores reales:

```env
GCP_PROJECT_ID=ss322-blog-prod-210625
GCP_PROJECT_NUMBER=785229525031
BACKEND_SERVICE_ID=PENDIENTE_OBTENER
BUCKET_NAME=repo-logia
ADMIN_EMAILS=admin@marcomejia.cloud
```

**Obtener PROJECT_NUMBER:**

```bash
gcloud projects describe ss322-blog-prod-210625 --format="value(projectNumber)"
```

### 2. Instalar Dependencias

```bash
cd backend
npm install
```

### 3. Probar Localmente

```bash
# Autenticarte con gcloud
gcloud auth application-default login

# Ejecutar el servidor
npm start
```

Abre `http://localhost:8080/repositorio.html` en tu navegador.

---

## 🚀 Despliegue a Producción

### Paso 1: Configurar Secrets en GitHub

Ve a tu repositorio en GitHub → Settings → Secrets and variables → Actions

Añade los siguientes secrets:

| Secret               | Valor                  | Cómo Obtenerlo                                                                    |
| :------------------- | :--------------------- | :-------------------------------------------------------------------------------- |
| `GCP_PROJECT_NUMBER` | 785229525031           | `gcloud projects describe ss322-blog-prod-210625 --format="value(projectNumber)"` |
| `BACKEND_SERVICE_ID` | Se obtiene después     | Ver README_INFRA.md paso 7                                                        |
| `ADMIN_EMAILS`       | admin@marcomejia.cloud | Emails separados por comas si hay más de uno                                      |

Los otros secrets (`GCP_PROJECT_ID`, `GCP_WORKLOAD_IDENTITY_PROVIDER`, etc.) ya deberían existir del frontend.

### Paso 2: Crear Service Account

```bash
export PROJECT_ID="ss322-blog-prod-210625"

# Crear Service Account
gcloud iam service-accounts create backend-sa \
  --display-name="Backend Service Account" \
  --project=$PROJECT_ID

# Dar permisos
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:backend-sa@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/storage.objectAdmin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:backend-sa@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountTokenCreator"
```

### Paso 3: Desplegar Cloud Run (Primera Vez)

Sigue las instrucciones detalladas en `backend/README_INFRA.md` - Paso 2.

### Paso 4: Configurar Networking

Sigue `backend/README_INFRA.md` - Pasos 3, 4, 5 y 6:

1. Crear Serverless NEG
2. Crear Backend Service
3. Habilitar IAP
4. Actualizar URL Map

### Paso 5: Obtener BACKEND_SERVICE_ID

```bash
gcloud compute backend-services describe repo-privado-backend-svc \
  --global \
  --format="value(id)" \
  --project=$PROJECT_ID
```

Añade este valor como secret `BACKEND_SERVICE_ID` en GitHub.

### Paso 6: Actualizar Cloud Run con Variables

```bash
export BACKEND_SERVICE_ID="valor-obtenido-arriba"
export PROJECT_NUMBER="tu-project-number"

gcloud run services update repo-privado \
  --region=us-central1 \
  --update-env-vars "BACKEND_SERVICE_ID=${BACKEND_SERVICE_ID},GCP_PROJECT_NUMBER=${PROJECT_NUMBER}" \
  --project=$PROJECT_ID
```

### Paso 7: Dar Acceso a Usuarios

```bash
# Para cada miembro de la logia
gcloud iap web add-iam-policy-binding \
  --resource-type=backend-services \
  --service=repo-privado-backend-svc \
  --member='user:miembro@gmail.com' \
  --role='roles/iap.httpsResourceAccessor' \
  --project=$PROJECT_ID
```

---

## 🧪 Verificación

### 1. Verificar Cloud Run

```bash
gcloud run services describe repo-privado \
  --region=us-central1 \
  --project=$PROJECT_ID
```

### 2. Verificar IAP

```bash
gcloud iap web get-iam-policy \
  --resource-type=backend-services \
  --service=repo-privado-backend-svc \
  --project=$PROJECT_ID
```

### 3. Probar Acceso

1. Abre: `https://sociedaddelsilencio322.org/privado/repositorio.html`
2. Deberías ver la pantalla de login de Google
3. Después de autenticarte, deberías ver el repositorio

---

## 📊 Monitoreo

### Ver Logs

```bash
gcloud run services logs read repo-privado \
  --region=us-central1 \
  --limit=50
```

### Logs en Tiempo Real

```bash
gcloud run services logs tail repo-privado --region=us-central1
```

---

## 🔄 Despliegues Futuros

Una vez configurado todo, los despliegues futuros serán automáticos:

1. Haz cambios en la carpeta `backend/`
2. Commit y push a `main`
3. GitHub Actions desplegará automáticamente

---

## 📚 Documentación de Referencia

- [`backend/README.md`](backend/README.md) - Documentación del backend
- [`backend/README_INFRA.md`](backend/README_INFRA.md) - Guía completa de infraestructura
- [Plan de Implementación](../.gemini/antigravity/brain/fb40fe44-31fa-4e10-9215-96046472f6f1/implementation_plan.md) - Plan maestro

---

## ❓ Preguntas Frecuentes

### ¿Cómo añado un nuevo administrador?

1. Añade el email a la variable de entorno `ADMIN_EMAILS` en Cloud Run
2. Redespliega el servicio

### ¿Cómo doy acceso a un nuevo miembro?

Usa el comando de IAP:

```bash
gcloud iap web add-iam-policy-binding \
  --resource-type=backend-services \
  --service=repo-privado-backend-svc \
  --member='user:nuevo@gmail.com' \
  --role='roles/iap.httpsResourceAccessor'
```

### ¿Cómo subo archivos al bucket manualmente?

```bash
gsutil cp documento.pdf gs://repo-logia/
```

---

## 🎉 ¡Listo!

Una vez completados todos los pasos, tendrás un sistema de gestión documental completamente funcional y seguro.
