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

> **✨ Las imágenes Docker están publicadas en GitHub Container Registry para un inicio más rápido**

```bash
# Clonar el repositorio
git clone https://github.com/412228-RINAUDO/mindfactory-challenge.git

# Navegar al directorio
cd mindfactory-challenge

# Iniciar todos los servicios
docker-compose up -d
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

## 👤 Autor

**Julian Rinaudo**

---

⭐ Desarrollado como parte del desafío técnico de Mindfactory
