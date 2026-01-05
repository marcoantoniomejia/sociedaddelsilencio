# 🔐 Guía de Configuración de Secrets - GitHub Actions

## 📋 Secrets Necesarios para el Backend

Para que el workflow `.github/workflows/deploy-backend.yml` funcione correctamente, necesitas configurar los siguientes secrets en GitHub.

---

## 🆕 Secrets NUEVOS (Para el Backend)

Estos secrets son específicos para el backend y necesitas añadirlos:

### 1. GCP_PROJECT_NUMBER

**Valor:**

```
785229525031
```

**Descripción:** Número único del proyecto de GCP (diferente del Project ID).

**Uso:** Necesario para la validación de JWT de IAP.

---

### 2. BACKEND_SERVICE_ID

**Valor:**

```
5566688539698479625
```

**Descripción:** ID numérico del Backend Service en el Load Balancer.

**Uso:** Necesario para la validación de JWT de IAP (audience).

---

### 3. ADMIN_EMAILS

**Valor:**

```
admin@marcomejia.cloud
```

**Descripción:** Email(s) de los administradores separados por comas.

**Uso:** Define qué usuarios tienen permisos de administrador (upload/delete).

**Nota:** Si añades más admins en el futuro, usa formato: `admin1@example.com,admin2@example.com`

---

## ✅ Secrets EXISTENTES (Del Frontend)

Estos secrets ya deberían existir del despliegue del frontend. Verifica que estén configurados:

### 4. GCP_PROJECT_ID

**Valor esperado:**

```
ss322-blog-prod-210625
```

**Descripción:** ID del proyecto de GCP.

---

### 5. GCP_WORKLOAD_IDENTITY_PROVIDER

**Valor esperado:**

```
projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/POOL_NAME/providers/PROVIDER_NAME
```

**Descripción:** Identificador del proveedor de Workload Identity Federation.

**Cómo obtenerlo (si no lo tienes):**

```bash
gcloud iam workload-identity-pools providers list \
  --workload-identity-pool=POOL_NAME \
  --location=global \
  --project=ss322-blog-prod-210625
```

---

### 6. GCP_SERVICE_ACCOUNT

**Valor esperado:**

```
cloud-build-785229525031@ss322-blog-prod-210625.iam.gserviceaccount.com
```

**Descripción:** Email de la Service Account que usa GitHub Actions para desplegar.

---

## 📝 Cómo Añadir Secrets en GitHub

### Paso 1: Ir a la Configuración del Repositorio

1. Abre tu repositorio en GitHub
2. Ve a: **Settings** → **Secrets and variables** → **Actions**
3. O usa este enlace directo:
   ```
   https://github.com/marcoantoniomejia/sociedaddelsilencio/settings/secrets/actions
   ```

### Paso 2: Añadir Cada Secret

Para cada secret nuevo:

1. Click en **"New repository secret"**
2. **Name:** Nombre del secret (ej: `GCP_PROJECT_NUMBER`)
3. **Secret:** Valor del secret (ej: `785229525031`)
4. Click en **"Add secret"**

---

## ✅ Checklist de Secrets

Marca cada secret después de añadirlo:

### Secrets Nuevos (Backend)

- [ ] `GCP_PROJECT_NUMBER` = `785229525031`
- [ ] `BACKEND_SERVICE_ID` = `5566688539698479625`
- [ ] `ADMIN_EMAILS` = `admin@marcomejia.cloud`

### Secrets Existentes (Frontend)

- [ ] `GCP_PROJECT_ID` = `ss322-blog-prod-210625`
- [ ] `GCP_WORKLOAD_IDENTITY_PROVIDER` = (verificar que existe)
- [ ] `GCP_SERVICE_ACCOUNT` = (verificar que existe)

---

## 🧪 Verificar Secrets

Una vez que hayas añadido todos los secrets, puedes verificar que existen (sin ver sus valores) en:

```
https://github.com/marcoantoniomejia/sociedaddelsilencio/settings/secrets/actions
```

Deberías ver una lista con todos los secrets configurados.

---

## 🚀 Probar el Workflow

Una vez que todos los secrets estén configurados, puedes probar el despliegue automático:

### Opción 1: Hacer un Cambio Pequeño

```bash
cd backend
echo "# Test deployment" >> README.md
git add README.md
git commit -m "test: trigger backend deployment"
git push origin main
```

### Opción 2: Ejecutar Manualmente (Si está configurado)

Si el workflow tiene `workflow_dispatch`, puedes ejecutarlo manualmente desde:

```
https://github.com/marcoantoniomejia/sociedaddelsilencio/actions
```

---

## 📊 Monitorear el Despliegue

Después de hacer push, puedes ver el progreso en:

```
https://github.com/marcoantoniomejia/sociedaddelsilencio/actions
```

Deberías ver:

1. ✅ Checkout Repository
2. ✅ Authenticate to Google Cloud
3. ✅ Build and Push Backend Image
4. ✅ Deploy to Cloud Run
5. ✅ Deployment Summary

---

## 🔍 Troubleshooting

### Error: "Secret not found"

- Verifica que el nombre del secret sea exactamente como está en el workflow
- Los nombres son case-sensitive

### Error: "Authentication failed"

- Verifica que `GCP_WORKLOAD_IDENTITY_PROVIDER` y `GCP_SERVICE_ACCOUNT` estén correctos
- Verifica que la Service Account tenga los permisos necesarios

### Error: "Permission denied"

- Verifica que la Service Account tenga los roles:
  - Cloud Build Editor
  - Cloud Run Developer
  - Artifact Registry Writer
  - Service Account User

---

## 📝 Resumen de Valores

Para tu referencia rápida:

| Secret Name                      | Valor                    |
| :------------------------------- | :----------------------- |
| `GCP_PROJECT_ID`                 | `ss322-blog-prod-210625` |
| `GCP_PROJECT_NUMBER`             | `785229525031`           |
| `BACKEND_SERVICE_ID`             | `5566688539698479625`    |
| `ADMIN_EMAILS`                   | `admin@marcomejia.cloud` |
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | (del frontend existente) |
| `GCP_SERVICE_ACCOUNT`            | (del frontend existente) |

---

## ✅ Siguiente Paso

Después de configurar todos los secrets:

1. ✅ Verificar que todos los secrets estén en GitHub
2. ✅ Hacer un commit de prueba al backend
3. ✅ Verificar que el workflow se ejecute correctamente
4. ✅ Verificar que Cloud Run se actualice

¡Listo para CI/CD automático! 🎉
