# Guía Rápida: Gestión de Usuarios - Repositorio Privado

## Estado Actual

### Usuarios con Acceso IAP

- ✅ `admin@marcomejia.cloud` (Admin)
- ✅ `marcoantonio.mejialara@gmail.com` (Miembro)

### Configuración

- **ADMIN_EMAILS:** `admin@marcomejia.cloud`
- **OAuth Client ID:** `785229525031-h35p9tht28qddubqrbt70unf50tsd3f0.apps.googleusercontent.com`

---

## Cómo Añadir Usuarios

### Paso 1: Dar Acceso IAP (Obligatorio para TODOS)

```bash
gcloud iap web add-iam-policy-binding \
  --resource-type=backend-services \
  --service=repo-privado-backend-svc \
  --member='user:EMAIL_AQUI@gmail.com' \
  --role='roles/iap.httpsResourceAccessor' \
  --project=ss322-blog-prod-210625
```

### Paso 2: Configurar Rol (Opcional - Solo para Admins)

Si el usuario debe ser **Admin** (puede subir/eliminar archivos):

```bash
# Obtener lista actual de admins
gcloud run services describe repo-privado \
  --region=us-central1 \
  --project=ss322-blog-prod-210625 \
  --format="value(spec.template.spec.containers[0].env)" | grep ADMIN_EMAILS

# Actualizar con nuevo admin (separar emails con comas)
gcloud run services update repo-privado \
  --region=us-central1 \
  --update-env-vars "ADMIN_EMAILS=admin@marcomejia.cloud,nuevo-admin@gmail.com" \
  --project=ss322-blog-prod-210625
```

---

## Diferencias: Admin vs Miembro

| Permiso                | Admin | Miembro |
| :--------------------- | :---- | :------ |
| Acceder al repositorio | ✅    | ✅      |
| Ver lista de archivos  | ✅    | ✅      |
| Descargar archivos     | ✅    | ✅      |
| Subir archivos         | ✅    | ❌      |
| Eliminar archivos      | ✅    | ❌      |
| Ver panel de admin     | ✅    | ❌      |

---

## Verificar Usuarios

```bash
# Ver usuarios con acceso IAP
gcloud iap web get-iam-policy \
  --resource-type=backend-services \
  --service=repo-privado-backend-svc \
  --project=ss322-blog-prod-210625

# Ver admins configurados
gcloud run services describe repo-privado \
  --region=us-central1 \
  --project=ss322-blog-prod-210625 \
  --format="value(spec.template.spec.containers[0].env)" | grep ADMIN_EMAILS
```

---

## Revocar Acceso

```bash
gcloud iap web remove-iam-policy-binding \
  --resource-type=backend-services \
  --service=repo-privado-backend-svc \
  --member='user:EMAIL_AQUI@gmail.com' \
  --role='roles/iap.httpsResourceAccessor' \
  --project=ss322-blog-prod-210625
```
