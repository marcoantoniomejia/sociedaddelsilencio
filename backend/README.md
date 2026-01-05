# Backend - Sistema de Gestión Documental

## R∴L∴S∴ Sociedad del Silencio 322

Backend serverless Zero Trust para la gestión de documentos de la Logia, protegido por Google Identity-Aware Proxy (IAP).

## 🏗️ Arquitectura

- **Runtime:** Node.js 18 (Distroless)
- **Framework:** Express.js
- **Seguridad:** IAP + JWT Validation
- **Almacenamiento:** Google Cloud Storage
- **Despliegue:** Cloud Run

## 🚀 Desarrollo Local

### Prerrequisitos

1. Node.js 18+
2. gcloud CLI autenticado
3. Acceso al bucket `repo-logia`

### Instalación

```bash
cd backend
npm install
```

### Configuración

Copiar `.env.example` a `.env` y configurar:

```bash
cp .env.example .env
```

Editar `.env` con tus valores:

```env
GCP_PROJECT_ID=tu-proyecto-id
GCP_PROJECT_NUMBER=123456789
BACKEND_SERVICE_ID=repo-logia-backend-svc
BUCKET_NAME=repo-logia
ADMIN_EMAILS=admin@sociedaddelsilencio.org,tu-email@gmail.com
NODE_ENV=development
DEV_USER_EMAIL=dev@localhost
```

### Autenticación Local

```bash
gcloud auth application-default login
```

### Ejecutar

```bash
npm start
# o para desarrollo con auto-reload:
npm run dev
```

El servidor estará disponible en `http://localhost:8080`

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── server.js              # Punto de entrada
│   ├── config/
│   │   └── index.js           # Configuración centralizada
│   ├── middleware/
│   │   ├── verifyIAP.js       # Validación JWT de IAP
│   │   └── requireAdmin.js    # Control RBAC
│   ├── services/
│   │   └── StorageService.js  # Lógica de GCS
│   └── controllers/
│       └── filesController.js # Endpoints API
├── public/
│   └── repositorio.html       # UI del repositorio
├── Dockerfile                 # Imagen Distroless
├── package.json
└── README_INFRA.md           # Guía de infraestructura
```

## 🔐 Seguridad

### Principio Zero Trust

1. **Perímetro (IAP):** Google valida la identidad del usuario
2. **Aplicación (JWT):** El backend verifica criptográficamente el token
3. **Datos (IAM):** Service Account con permisos mínimos

### Flujo de Autenticación

```
Usuario → Load Balancer → IAP → Cloud Run → verifyIAP() → Controller
```

## 📡 API Endpoints

### Públicos (Requieren IAP)

- `GET /health` - Health check
- `GET /` - Sirve `repositorio.html`

### Protegidos (Requieren IAP + JWT)

- `GET /api/me` - Información del usuario
- `GET /api/files` - Lista archivos con Signed URLs
- `POST /api/upload` - Sube archivo (Solo Admin)
- `DELETE /api/files/:name` - Borra archivo (Solo Admin)

## 🐳 Docker

### Build Local

```bash
docker build -t repo-backend .
```

### Run Local

```bash
docker run -p 8080:8080 \
  -e GCP_PROJECT_ID=tu-proyecto \
  -e BUCKET_NAME=repo-logia \
  -v ~/.config/gcloud:/root/.config/gcloud \
  repo-backend
```

## 🚀 Despliegue

### Manual

Ver `README_INFRA.md` para comandos detallados.

### Automático (GitHub Actions)

El workflow `.github/workflows/deploy-backend.yml` se ejecuta automáticamente al hacer push a `main` con cambios en `backend/`.

**Secrets requeridos:**

- `GCP_PROJECT_ID`
- `GCP_PROJECT_NUMBER`
- `GCP_WORKLOAD_IDENTITY_PROVIDER`
- `GCP_SERVICE_ACCOUNT`
- `BACKEND_SERVICE_ID`
- `ADMIN_EMAILS`

## 🧪 Testing

### Probar Localmente (Sin IAP)

El middleware `verifyIAP` permite bypass en modo desarrollo:

```bash
NODE_ENV=development npm start
```

### Probar con IAP (Producción)

Acceder a través del Load Balancer:

```
https://sociedaddelsilencio322.org/privado/repositorio.html
```

## 📊 Monitoreo

### Ver Logs

```bash
gcloud run services logs read repo-privado \
  --region=us-central1 \
  --limit=100
```

### Logs en Tiempo Real

```bash
gcloud run services logs tail repo-privado \
  --region=us-central1
```

## 🔧 Troubleshooting

### Error: "No IAP JWT found"

- Verificar que estás accediendo a través del Load Balancer
- Verificar que IAP esté habilitado en el Backend Service

### Error: "Invalid IAP token"

- Verificar `PROJECT_NUMBER` y `BACKEND_SERVICE_ID` en variables de entorno
- Revisar logs del servicio

### Archivos no se suben

- Verificar permisos del Service Account sobre el bucket
- Revisar tamaño del archivo (máx 10MB)
- Verificar que sea un PDF

## 📚 Referencias

- [Cloud Run Docs](https://cloud.google.com/run/docs)
- [IAP Docs](https://cloud.google.com/iap/docs)
- [Cloud Storage Signed URLs](https://cloud.google.com/storage/docs/access-control/signed-urls)

## 👥 Soporte

Para problemas o preguntas, contactar al administrador de la Logia.
