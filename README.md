# R.·.L.·.S.·. Sociedad del Silencio #322

## Descripción

Este repositorio contiene el código fuente del sitio web oficial de la Respetable Logia Simbólica "Sociedad del Silencio #322". El sitio está diseñado para ser una página estática informativa, construida con HTML, CSS y JavaScript, y desplegada en Google Cloud Platform (GCP) utilizando un flujo de CI/CD con GitHub Actions.

### Sistema de Gestión Documental (Backend)

Además del sitio web público, este repositorio incluye un **sistema privado de gestión de documentos** protegido por Google Identity-Aware Proxy (IAP). Este sistema permite a los miembros autenticados de la Logia:

- 📥 **Descargar** documentos PDF del repositorio
- 📤 **Subir** nuevos documentos (Solo Administradores)
- 🗑️ **Eliminar** documentos (Solo Administradores)

**Características de Seguridad:**

- 🔐 Autenticación mediante cuentas Gmail autorizadas
- 🛡️ Arquitectura Zero Trust con validación JWT
- ☁️ 100% Serverless (Cloud Run + Cloud Storage)
- 🔒 Acceso controlado por roles (Admin/Usuario)

Para más información sobre el backend, consulta [`backend/README.md`](backend/README.md).

## Tabla de Contenidos

1.  [Características Principales](#características-principales)
2.  [Arquitectura de Despliegue](#arquitectura-de-despliegue)
3.  [Modificación del Sitio Web](#modificación-del-sitio-web)
4.  [Configuración de GitHub Actions](#configuración-de-github-actions)
5.  [Despliegue en GCP (Paso a Paso)](#despliegue-en-gcp-paso-a-paso)
6.  [Estructura del Proyecto](#estructura-del-proyecto)
7.  [Cómo Contribuir](#cómo-contribuir)
8.  [Licencia](#licencia)

## Características Principales

- **Sitio Web Estático**: Construido con HTML, CSS y JavaScript puros para un rendimiento óptimo y simplicidad.
- **Diseño Responsivo**: Adaptable a diferentes tamaños de pantalla (móvil, tablet, escritorio).
- **CI/CD Automatizado**: Despliegue automático a Cloud Run cada vez que se fusiona un cambio a la rama `main`.
- **Infraestructura como Código (IaC) implícita**: La configuración del despliegue está definida en el workflow de GitHub Actions.
- **Seguridad**: Protegido con Google Cloud Armor (WAF) y un certificado SSL gestionado por Google.

## Arquitectura de Despliegue

El proyecto se despliega en Google Cloud Platform con la siguiente arquitectura:

| Componente            | Propósito                                                 |
| :-------------------- | :-------------------------------------------------------- |
| **GitHub**            | Repositorio de código fuente y ejecución de CI/CD.        |
| **GitHub Actions**    | Orquestador del proceso de build y deploy.                |
| **Cloud Build**       | Construye la imagen Docker del sitio web.                 |
| **Artifact Registry** | Almacena la imagen Docker generada.                       |
| **Cloud Run**         | Ejecuta el contenedor del sitio web de forma serverless.  |
| **Load Balancer**     | Proporciona una IP externa y distribuye el tráfico.       |
| **Cloud Armor**       | Web Application Firewall para proteger contra ataques.    |
| **Google SSL**        | Proporciona un certificado SSL/TLS gratuito y gestionado. |
| **Cloud DNS**         | Gestiona los registros DNS del dominio.                   |

## Modificación del Sitio Web

Para realizar cambios en el contenido o diseño del sitio, sigue estos pasos:

1.  **Clona el repositorio:**

    ```bash
    git clone https://github.com/marcoantoniomejia/sociedaddelsilencio.git
    cd sociedaddelsilencio
    ```

2.  **Crea una nueva rama:**

    ```bash
    git checkout -b feature/mi-nueva-funcionalidad
    ```

3.  **Realiza los cambios:**
    Modifica los archivos HTML, CSS o JavaScript en el directorio `src/`.

4.  **Prueba los cambios localmente:**
    Puedes abrir los archivos `*.html` directamente en tu navegador para previsualizar los cambios.

5.  **Confirma y sube los cambios:**

    ```bash
    git add .
    git commit -m "feat: Añade nueva sección de historia"
    git push origin feature/mi-nueva-funcionalidad
    ```

6.  **Crea un Pull Request:**
    Abre un Pull Request en GitHub desde tu rama hacia `main`. Una vez aprobado y fusionado, los cambios se desplegarán automáticamente.

## Configuración de GitHub Actions

El archivo `.github/workflows/deploy-to-cloudrun.yaml` contiene la configuración para el despliegue automático. Para que funcione correctamente, el workflow utiliza **Workload Identity Federation** para autenticarse de forma segura con Google Cloud.

Necesitas configurar los siguientes secretos en tu repositorio de GitHub:

| Secreto                          | Descripción                                                        | Ejemplo                                 |
| :------------------------------- | :----------------------------------------------------------------- | :-------------------------------------- |
| `GCP_PROJECT_ID`                 | El ID de tu proyecto de Google Cloud.                              | `sociedad-del-silencio-322`             |
| `GCP_REGION`                     | La región donde se desplegarán los recursos.                       | `us-central1`                           |
| `ARTIFACT_REGISTRY_REPO`         | El nombre de tu repositorio en Artifact Registry.                  | `sociedaddelsilencio-repo`              |
| `GCP_WORKLOAD_IDENTITY_PROVIDER` | El identificador del proveedor de Workload Identity.               | `projects/123.../providers/my-provider` |
| `GCP_SERVICE_ACCOUNT`            | El email de la cuenta de servicio de GCP que usará GitHub Actions. | `github-actions@...gserviceaccount.com` |

### Permisos de la Cuenta de Servicio

La cuenta de servicio (`GCP_SERVICE_ACCOUNT`) necesita los siguientes roles de IAM en tu proyecto de GCP:

- **Cloud Build Editor**: Para poder construir imágenes.
- **Artifact Registry Writer**: Para poder subir imágenes al registro.
- **Cloud Run Developer**: Para poder desplegar nuevas revisiones del servicio.
- **Service Account User**: Para permitir que Cloud Build actúe en nombre de la cuenta de servicio.
- **Workload Identity User**: Para permitir que GitHub Actions se autentique y obtenga un token de acceso para esta cuenta de servicio.

## Despliegue en GCP (Paso a Paso)

A continuación, se detallan los pasos para configurar la infraestructura en GCP desde cero.

### 5.1. Crear Proyecto y Habilitar APIs

| Paso                       | Comando de `gcloud`                                                                                                          |
| :------------------------- | :--------------------------------------------------------------------------------------------------------------------------- |
| 1. Crear un nuevo proyecto | `gcloud projects create SOCIEDAD_DEL_SILENCIO_PROJECT_ID`                                                                    |
| 2. Configurar el proyecto  | `gcloud config set project SOCIEDAD_DEL_SILENCIO_PROJECT_ID`                                                                 |
| 3. Habilitar APIs          | `gcloud services enable run.googleapis.com artifactregistry.googleapis.com cloudbuild.googleapis.com compute.googleapis.com` |

### 5.2. Configurar Artifact Registry

Cree un repositorio en Artifact Registry para almacenar las imágenes de contenedor Docker.

| Paso                 | Comando de `gcloud`                                                                                               |
| :------------------- | :---------------------------------------------------------------------------------------------------------------- |
| 1. Crear repositorio | `gcloud artifacts repositories create sociedaddelsilencio-repo --repository-format=docker --location=us-central1` |

### 5.3. Desplegar Cloud Run (Inicialmente)

Aunque el despliegue será automático, es una buena práctica hacer un despliegue inicial manual o tener el servicio creado.

| Paso                  | Comando de `gcloud`                                                                                                                                                                                         |
| :-------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Desplegar servicio | `gcloud run deploy www-ss322 --image=us-central1-docker.pkg.dev/SOCIEDAD_DEL_SILENCIO_PROJECT_ID/sociedaddelsilencio-repo/www-ss322:latest --platform=managed --region=us-central1 --allow-unauthenticated` |

### 5.4. Configurar el Balanceador de Carga y SSL

| Paso              | Descripción                                                                                                                                                                     |
| :---------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1. Reservar IP    | Ve a `VPC Network > External IP addresses` y reserva una nueva IP estática.                                                                                                     |
| 2. Crear Backend  | Ve a `Network Services > Load balancing`, crea un nuevo `HTTP(S) Load Balancer`. Como backend, selecciona `Serverless NEG` y asócialo a tu servicio de Cloud Run (`www-ss322`). |
| 3. Crear Frontend | En la configuración del frontend, selecciona el protocolo `HTTPS`, asigna la IP estática que reservaste y crea un nuevo certificado SSL gestionado por Google para tu dominio.  |
| 4. Finalizar      | Revisa y crea el balanceador de carga.                                                                                                                                          |

### 5.5. Configurar Cloud Armor

| Paso                  | Descripción                                                                            |
| :-------------------- | :------------------------------------------------------------------------------------- |
| 1. Crear Política     | Ve a `Network Security > Cloud Armor`, crea una nueva política de seguridad.           |
| 2. Añadir Reglas      | Añade reglas preconfiguradas (ej. para mitigar inyecciones SQL, XSS) o personalizadas. |
| 3. Asociar al Backend | Asocia la política de seguridad al servicio de backend de tu balanceador de carga.     |

## Estructura del Proyecto

```
.
├── .dockerignore
├── Dockerfile
├── GEMINI.md
├── README.md
├── .git/
├── .github/
│   └── workflows/
│       └── deploy-to-cloudrun.yaml
└── src/
    ├── blog.html
    ├── contacto-candidatos.html
    ├── filantropia.html
    ├── index.html
    ├── principios.html
    ├── quienes-somos.html
    └── assets/
        ├── css/
        │   └── style.css
        ├── images/
        │   ├── logoSS322-new01.png
        │   └── LogoSS322.jpeg
        └── js/
            └── main.js
```

## Cómo Contribuir

Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

1.  Haz un Fork del proyecto.
2.  Crea una nueva rama (`git checkout -b feature/nueva-caracteristica`).
3.  Realiza tus cambios y haz commit (`git commit -m 'feat: Añade nueva característica'`).
4.  Empuja la rama (`git push origin feature/nueva-caracteristica`).
5.  Abre un Pull Request.

## Licencia

Distribuido bajo la Licencia MIT. Ver `LICENSE` para más información.
