# 🏭 Mindfactory Challenge

> Aplicación full-stack de blog construida con React, NestJS y PostgreSQL

Una plataforma de blog moderna y lista para producción con autenticación de usuarios, gestión de posts e interacciones en tiempo real. Construida como un desafío técnico que demuestra las mejores prácticas en desarrollo full-stack.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Stack Tecnológico](#-stack-tecnológico)
- [Requisitos Previos](#-requisitos-previos)
- [Inicio Rápido](#-inicio-rápido)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Documentación de la API](#-documentación-de-la-api)

## ✨ Características

- 🔐 **Autenticación y Autorización** - Auth basado en JWT con hash de contraseñas usando bcrypt
- 📝 **Gestión de Posts** - Crear, leer y actualizar posts del blog con paginación
- 👤 **Perfiles de Usuario** - Ver y editar perfiles de usuario
- 💬 **Sistema de Interacciones** - Dar like/unlike y comentar en posts
- 🎨 **UI Moderna** - Diseño responsive con Tailwind CSS y shadcn/ui
- 🔔 **Notificaciones Toast** - Feedback en tiempo real con Sonner
- 🐳 **Listo para Docker** - Containerización completa con Docker Compose
- 🧪 **Testing Completo** - Tests unitarios y E2E con Jest y Vitest (112 tests pasando)
- 📱 **Responsive** - Funciona perfectamente en todos los dispositivos
- 🔒 **Autorización** - Control de permisos para editar posts y perfiles propios

## 🛠️ Stack Tecnológico

### Frontend
- **React 19** - Librería de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y servidor de desarrollo
- **TanStack Query** - Gestión de estado del servidor
- **React Router** - Enrutamiento del lado del cliente
- **Tailwind CSS** - CSS utility-first
- **shadcn/ui** - Librería de componentes
- **Sonner** - Notificaciones toast
- **Vitest** - Testing unitario

### Backend
- **NestJS** - Framework de Node.js
- **TypeScript** - Tipado estático
- **Prisma** - ORM y toolkit de base de datos
- **PostgreSQL** - Base de datos relacional
- **JWT** - Autenticación
- **bcrypt** - Hash de contraseñas
- **Jest** - Framework de testing

### DevOps
- **Docker** - Containerización
- **Docker Compose** - Orquestación multi-contenedor
- **Nginx** - Reverse proxy y servidor de archivos estáticos
- **pnpm** - Gestor de paquetes rápido y eficiente

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Docker** >= 24.x
- **Docker Compose** >= 2.x

## 🚀 Inicio Rápido

```bash
# Clonar el repositorio
git clone <repository-url>
cd mindfactory-challenge

# Crear archivo de entorno
cp .env.example .env

# Iniciar todos los servicios
docker-compose up -d

# Ejecutar migraciones de base de datos
docker exec mindfactory-backend npx prisma migrate deploy
```

### Acceder a la aplicación

- **Frontend**: http://localhost:3000
- **API Backend**: http://localhost:8000
- **Admin de Base de Datos (Adminer)**: http://localhost:8081

## 📁 Estructura del Proyecto

```
mindfactory-challenge/
├── frontend/                 # Aplicación frontend React
│   ├── src/
│   │   ├── api/             # Cliente API y utilidades
│   │   ├── components/      # Componentes React
│   │   │   └── ui/          # Componentes shadcn/ui
│   │   ├── contexts/        # Contextos React (Auth)
│   │   ├── hooks/           # Hooks personalizados de React
│   │   ├── interfaces/      # Interfaces TypeScript
│   │   ├── pages/           # Componentes de página
│   │   ├── providers/       # Provider de React Query
│   │   ├── services/        # Servicios de lógica de negocio
│   │   └── lib/             # Funciones utilitarias
│   ├── Dockerfile           # Configuración del contenedor frontend
│   └── nginx.conf           # Configuración de Nginx
│
├── backend/                  # Aplicación backend NestJS
│   ├── src/
│   │   ├── auth/            # Módulo de autenticación
│   │   ├── users/           # Módulo de usuarios
│   │   ├── posts/           # Módulo de posts
│   │   ├── common/          # Utilidades compartidas
│   │   │   ├── dto/         # Data transfer objects
│   │   │   ├── exceptions/  # Excepciones personalizadas
│   │   │   ├── filters/     # Filtros de excepciones
│   │   │   └── services/    # Servicios compartidos
│   │   └── prisma/          # Módulo Prisma
│   ├── prisma/
│   │   ├── schema.prisma    # Schema de base de datos
│   │   └── migrations/      # Migraciones de base de datos
│   ├── test/                # Tests E2E
│   └── Dockerfile           # Configuración del contenedor backend
│
├── docker-compose.yml        # Orquestación Docker
├── .env                      # Variables de entorno
└── README.md                 # Este archivo
```

## 📚 Documentación de la API

### Autenticación

#### Registrarse
```bash
POST /api/v1/auth/register
Content-Type: application/json

Body:
{
  "name": "string",
  "email": "string",
  "password": "string" (mínimo 6 caracteres)
}

Response: 201 Created
{
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "created_at": "date"
  },
  "access_token": "string"
}
```

#### Iniciar sesión
```bash
POST /api/v1/auth/login
Content-Type: application/json

Body:
{
  "email": "string",
  "password": "string"
}

Response: 200 OK
{
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "created_at": "date"
  },
  "access_token": "string"
}
```

### Usuarios

#### Obtener usuario por ID
```bash
GET /api/v1/users/:id

Response: 200 OK
{
  "id": "string",
  "name": "string",
  "email": "string",
  "created_at": "date"
}
```

#### Actualizar perfil
```bash
PUT /api/v1/users/:id
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "name": "string" (opcional),
  "email": "string" (opcional)
}

Response: 200 OK
{
  "id": "string",
  "name": "string",
  "email": "string",
  "created_at": "date"
}
```

### Posts

#### Obtener todos los posts (paginados)
```bash
GET /api/v1/posts?page=1&page_items=10

Response: 200 OK
{
  "data": [
    {
      "id": "string",
      "title": "string",
      "content": "string",
      "likes_count": number,
      "comments_count": number,
      "is_liked": boolean,
      "user": {
        "id": "string",
        "name": "string"
      },
      "created_at": "date"
    }
  ],
  "meta": {
    "page": number,
    "page_items": number,
    "total": number,
    "total_pages": number
  }
}
```

#### Obtener un post por ID
```bash
GET /api/v1/posts/:id

Response: 200 OK
{
  "id": "string",
  "title": "string",
  "content": "string",
  "likes_count": number,
  "comments_count": number,
  "is_liked": boolean,
  "user": {
    "id": "string",
    "name": "string"
  },
  "created_at": "date"
}
```

#### Crear post
```bash
POST /api/v1/posts
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "title": "string",
  "content": "string"
}

Response: 201 Created
{
  "id": "string",
  "title": "string",
  "content": "string",
  "likes_count": number,
  "comments_count": number,
  "is_liked": boolean,
  "user": {
    "id": "string",
    "name": "string"
  },
  "created_at": "date"
}
```

#### Actualizar post
```bash
PUT /api/v1/posts/:id
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "title": "string" (opcional),
  "content": "string" (opcional)
}

Response: 200 OK
{
  "id": "string",
  "title": "string",
  "content": "string",
  "likes_count": number,
  "comments_count": number,
  "is_liked": boolean,
  "user": {
    "id": "string",
    "name": "string"
  },
  "created_at": "date"
}
```

#### Dar like a un post
```bash
PATCH /api/v1/posts/:id/like
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Like added successfully"
}
```

#### Quitar like de un post
```bash
PATCH /api/v1/posts/:id/unlike
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Like removed successfully"
}
```

## 🐳 Guía para Subir Imágenes a GitHub Container Registry

Esta guía te muestra cómo publicar las imágenes Docker de este proyecto en GitHub Container Registry (ghcr.io).

### Método 1: Manual (Usando Docker CLI)

#### Paso 1: Crear un Personal Access Token (PAT)

1. Ve a GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click en "Generate new token (classic)"
3. Asigna los siguientes permisos:
   - `write:packages` - Para subir imágenes
   - `read:packages` - Para descargar imágenes
   - `delete:packages` - Para eliminar imágenes (opcional)
4. Copia el token generado

#### Paso 2: Autenticarse en GitHub Container Registry

```bash
# Guarda tu token en una variable de entorno
export CR_PAT=TU_TOKEN_AQUI

# Inicia sesión en ghcr.io
echo $CR_PAT | docker login ghcr.io -u TU_USUARIO_GITHUB --password-stdin
```

#### Paso 3: Construir las Imágenes

```bash
# Construir imagen del frontend
docker build -t ghcr.io/TU_USUARIO/mindfactory-frontend:latest ./frontend

# Construir imagen del backend
docker build -t ghcr.io/TU_USUARIO/mindfactory-backend:latest ./backend
```

#### Paso 4: Subir las Imágenes

```bash
# Subir frontend
docker push ghcr.io/TU_USUARIO/mindfactory-frontend:latest

# Subir backend
docker push ghcr.io/TU_USUARIO/mindfactory-backend:latest
```

#### Paso 5: Verificar

Ve a tu perfil de GitHub → Packages para ver tus imágenes publicadas.

#### Paso 6: Hacer las Imágenes Públicas (Opcional)

Por defecto, las imágenes son privadas. Para hacerlas públicas:

1. Ve a tu perfil → Packages
2. Click en el paquete
3. Package settings → Change visibility → Public

### Método 2: Automatizado (Usando GitHub Actions)

#### Paso 1: Crear el Workflow

Crea el archivo `.github/workflows/docker-publish.yml`:

```yaml
name: Publicar Imágenes Docker

on:
  push:
    branches: [ main ]
    tags: [ 'v*' ]
  pull_request:
    branches: [ main ]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME_FRONTEND: ${{ github.repository }}-frontend
  IMAGE_NAME_BACKEND: ${{ github.repository }}-backend

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Login a GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extraer metadata para Frontend
        id: meta-frontend
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME_FRONTEND }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}

      - name: Build y Push Frontend
        uses: docker/build-push-action@v5
        with:
          context: ./frontend
          push: true
          tags: ${{ steps.meta-frontend.outputs.tags }}
          labels: ${{ steps.meta-frontend.outputs.labels }}

      - name: Extraer metadata para Backend
        id: meta-backend
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME_BACKEND }}
          tags: |
            type=ref,event=branch
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}

      - name: Build y Push Backend
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          push: true
          tags: ${{ steps.meta-backend.outputs.tags }}
          labels: ${{ steps.meta-backend.outputs.labels }}
```

#### Paso 2: Commit y Push

```bash
git add .github/workflows/docker-publish.yml
git commit -m "Add GitHub Actions workflow for Docker images"
git push origin main
```

Las imágenes se construirán y publicarán automáticamente en cada push a `main`.

### Usar las Imágenes Publicadas

Una vez publicadas, puedes usar las imágenes en tu `docker-compose.yml`:

```yaml
services:
  mindfactory-nginx:
    image: ghcr.io/TU_USUARIO/mindfactory-frontend:latest
    ports:
      - "3000:80"
    restart: unless-stopped
    container_name: mindfactory-frontend

  mindfactory-backend:
    image: ghcr.io/TU_USUARIO/mindfactory-backend:latest
    container_name: mindfactory-backend
    restart: unless-stopped
    depends_on:
      - mindfactory-db
    env_file: 
      - .env
    ports:
      - "8000:8000"
```

### Descargar Imágenes Públicas

```bash
# No requiere autenticación para imágenes públicas
docker pull ghcr.io/TU_USUARIO/mindfactory-frontend:latest
docker pull ghcr.io/TU_USUARIO/mindfactory-backend:latest
```

### Descargar Imágenes Privadas

```bash
# Requiere autenticación
echo $CR_PAT | docker login ghcr.io -u TU_USUARIO --password-stdin
docker pull ghcr.io/TU_USUARIO/mindfactory-frontend:latest
```

### Versionado de Imágenes

Es recomendable usar tags semánticos:

```bash
# Construir con versión específica
docker build -t ghcr.io/TU_USUARIO/mindfactory-frontend:1.0.0 ./frontend
docker build -t ghcr.io/TU_USUARIO/mindfactory-frontend:latest ./frontend

# Subir ambas versiones
docker push ghcr.io/TU_USUARIO/mindfactory-frontend:1.0.0
docker push ghcr.io/TU_USUARIO/mindfactory-frontend:latest
```

### Recursos Adicionales

- [Documentación oficial de GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [GitHub Actions para Docker](https://docs.github.com/en/actions/publishing-packages/publishing-docker-images)

## 👤 Autor

**Julian Rinaudo**

---

⭐ Desarrollado como parte del desafío técnico de Mindfactory
