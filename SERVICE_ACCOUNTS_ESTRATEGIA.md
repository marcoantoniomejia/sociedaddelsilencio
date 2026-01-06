# 🔐 Estrategia de Service Accounts - Repositorio Privado

## 📊 Service Accounts Existentes

### 1. Compute Default Service Account

```
785229525031-compute@developer.gserviceaccount.com
```

**Roles:**

- Artifact Registry Writer
- Cloud Build Editor
- Cloud Build Service Agent
- Cloud Run Developer
- Compute Storage Admin
- Logs Writer
- Service Account User
- Storage Admin
- Storage Object Admin
- Viewer

**Uso:** Service Account default de GCP, se usa para múltiples servicios.

---

### 2. Cloud Build Service Account

```
cloud-build-785229525031@ss322-blog-prod-210625.iam.gserviceaccount.com
```

**Roles:**

- Artifact Registry Writer
- Cloud Build Editor
- Cloud Build Service Agent
- Cloud Run Developer
- Service Account User
- Storage Admin
- Storage Object Admin
- Viewer

**Uso:** Específica para CI/CD con GitHub Actions (despliega el frontend público).

---

## ✅ Estrategia Recomendada: Separación de Responsabilidades

### Arquitectura de Service Accounts

```
┌─────────────────────────────────────────────────────────────┐
│                     GitHub Actions                          │
│                    (CI/CD Pipeline)                         │
└──────────────────────┬──────────────────────────────────────┘
                       │ usa
                       ↓
┌─────────────────────────────────────────────────────────────┐
│  cloud-build-785229525031@...iam.gserviceaccount.com       │
│  Roles: Build, Deploy, Artifact Registry                   │
│  Propósito: Construir y desplegar servicios                │
└──────────────────────┬──────────────────────────────────────┘
                       │ despliega
                       ↓
┌─────────────────────────────────────────────────────────────┐
│              Cloud Run: repo-privado                        │
│                 (Runtime Container)                         │
└──────────────────────┬──────────────────────────────────────┘
                       │ corre con
                       ↓
┌─────────────────────────────────────────────────────────────┐
│  backend-sa@ss322-blog-prod-210625.iam.gserviceaccount.com │
│  Roles: Storage Object Admin, Token Creator                │
│  Propósito: SOLO acceder a Cloud Storage                   │
└──────────────────────┬──────────────────────────────────────┘
                       │ accede a
                       ↓
┌─────────────────────────────────────────────────────────────┐
│           Cloud Storage: repo-logia                         │
│              (Archivos PDF)                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Service Accounts a Crear/Configurar

### 1. Crear: backend-sa (NUEVA)

**Propósito:** Service Account específica para que Cloud Run del backend acceda a Cloud Storage.

**Permisos mínimos necesarios:**

- `roles/storage.objectAdmin` - Para leer/escribir archivos en `repo-logia`
- `roles/iam.serviceAccountTokenCreator` - Para generar Signed URLs

**Comando:**

```bash
gcloud iam service-accounts create backend-sa \
  --display-name="Backend Privado - Repositorio Documentos" \
  --project=ss322-blog-prod-210625

gcloud projects add-iam-policy-binding ss322-blog-prod-210625 \
  --member="serviceAccount:backend-sa@ss322-blog-prod-210625.iam.gserviceaccount.com" \
  --role="roles/storage.objectAdmin"

gcloud projects add-iam-policy-binding ss322-blog-prod-210625 \
  --member="serviceAccount:backend-sa@ss322-blog-prod-210625.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountTokenCreator"
```

---

### 2. Configurar: cloud-build SA (EXISTENTE)

**Propósito:** Permitir que Cloud Build pueda desplegar Cloud Run usando `backend-sa`.

**Permiso adicional necesario:**

- Permitir que Cloud Build actúe como `backend-sa`

**Comando:**

```bash
gcloud iam service-accounts add-iam-policy-binding \
  backend-sa@ss322-blog-prod-210625.iam.gserviceaccount.com \
  --member="serviceAccount:cloud-build-785229525031@ss322-blog-prod-210625.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser" \
  --project=ss322-blog-prod-210625
```

---

## 📋 Comparación de Opciones

| Aspecto           | Opción A: Crear backend-sa       | Opción B: Usar cloud-build SA             | Opción C: Usar compute SA      |
| :---------------- | :------------------------------- | :---------------------------------------- | :----------------------------- |
| **Seguridad**     | ✅ Excelente (mínimo privilegio) | ⚠️ Buena (más permisos de los necesarios) | ❌ Pobre (demasiados permisos) |
| **Auditoría**     | ✅ Fácil (SA específica)         | ⚠️ Media (mezclada con CI/CD)             | ❌ Difícil (mezclada con todo) |
| **Mantenimiento** | ✅ Fácil (propósito único)       | ⚠️ Media                                  | ❌ Difícil                     |
| **Complejidad**   | ⚠️ Requiere crear nueva SA       | ✅ Solo añadir permiso                    | ✅ Solo usar existente         |
| **Costo**         | ✅ Gratis                        | ✅ Gratis                                 | ✅ Gratis                      |
| **Recomendación** | ✅ **RECOMENDADO**               | ⚠️ Aceptable                              | ❌ No recomendado              |

---

## 🔒 Principio de Mínimo Privilegio

### ¿Por qué crear backend-sa?

1. **Seguridad:** Si la aplicación es comprometida, el atacante solo tiene acceso a Cloud Storage, no a todo el proyecto.

2. **Auditoría:** Los logs mostrarán claramente qué acciones fueron hechas por el backend vs CI/CD.

3. **Compliance:** Mejores prácticas de seguridad para aplicaciones que manejan datos sensibles.

4. **Flexibilidad:** Si en el futuro necesitas cambiar permisos, solo afectas al backend, no al CI/CD.

---

## 🚀 Plan de Implementación

### Paso 1: Crear backend-sa

```bash
export PROJECT_ID="ss322-blog-prod-210625"

gcloud iam service-accounts create backend-sa \
  --display-name="Backend Privado - Repositorio Documentos" \
  --project=$PROJECT_ID
```

### Paso 2: Dar permisos mínimos

```bash
# Storage
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:backend-sa@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/storage.objectAdmin"

# Token Creator (para Signed URLs)
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:backend-sa@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountTokenCreator"
```

### Paso 3: Permitir que Cloud Build use backend-sa

```bash
gcloud iam service-accounts add-iam-policy-binding \
  backend-sa@${PROJECT_ID}.iam.gserviceaccount.com \
  --member="serviceAccount:cloud-build-785229525031@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser" \
  --project=$PROJECT_ID
```

### Paso 4: Usar en Cloud Run

```bash
gcloud run deploy repo-privado \
  --service-account backend-sa@${PROJECT_ID}.iam.gserviceaccount.com \
  ...
```

---

## ✅ Verificación

### Verificar que backend-sa existe

```bash
gcloud iam service-accounts describe backend-sa@ss322-blog-prod-210625.iam.gserviceaccount.com \
  --project=ss322-blog-prod-210625
```

### Verificar permisos de backend-sa

```bash
gcloud projects get-iam-policy ss322-blog-prod-210625 \
  --flatten="bindings[].members" \
  --filter="bindings.members:backend-sa@ss322-blog-prod-210625.iam.gserviceaccount.com"
```

### Verificar que Cloud Build puede usar backend-sa

```bash
gcloud iam service-accounts get-iam-policy \
  backend-sa@ss322-blog-prod-210625.iam.gserviceaccount.com \
  --project=ss322-blog-prod-210625
```

---

## 📝 Resumen

**Recomendación Final:**

- ✅ **Crear `backend-sa`** para Cloud Run del backend (Runtime)
- ✅ **Usar `cloud-build-...` existente** para GitHub Actions (CI/CD)
- ✅ **NO usar `compute` SA** (demasiados permisos)

**Beneficios:**

- Seguridad mejorada (mínimo privilegio)
- Auditoría clara
- Fácil mantenimiento
- Cumple con mejores prácticas de GCP

---

¿Listo para crear `backend-sa`?
