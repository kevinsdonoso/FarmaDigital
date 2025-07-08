# 🧪 FarmaDigitalBackend

Backend del sistema FarmaDigital desarrollado con **ASP.NET Core (.NET 8)** y **PostgreSQL**.  
Incluye autenticación, modelos de usuarios y configuración segura mediante variables de entorno y contenedores Docker.

---

## 📑 Índice

- [📁 Requisitos](#-requisitos)
- [📦 Restaurar dependencias](#-restaurar-dependencias)
- [🚀 Opciones de ejecución](#-opciones-de-ejecución)
  - [🐳 Opción 1: Ejecutar con Docker (recomendado)](#-opción-1-ejecutar-con-docker-recomendado)
  - [🖥️ Opción 2: Ejecutar localmente (sin Docker)](#-opción-2-ejecutar-localmente-sin-docker)
- [🔄 Migraciones Entity Framework Core](#-migraciones-entity-framework-core)
- [📁 Estructura del Proyecto](#-estructura-del-proyecto)
- [🐙 Gitignore](#-gitignore)
- [📄 Licencia](#-licencia)

---

## 📁 Requisitos

- [.NET 8 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)
- [PostgreSQL 16](https://www.postgresql.org/download/) *(solo para ejecución local sin Docker)*
- [Docker y Docker Compose](https://www.docker.com/)
- *(Opcional)* [pgAdmin](https://www.pgadmin.org/) para administrar la base de datos

---

## 📦 Restaurar dependencias

Antes de ejecutar migraciones o correr el proyecto, asegúrate de restaurar los paquetes NuGet:

```bash
dotnet restore
```

- Si usas Docker, este comando se ejecuta automáticamente durante el build.
- Si ejecutas localmente, debes correrlo manualmente en la raíz del proyecto.

---

## 🚀 Opciones de ejecución

### 🐳 Opción 1: Ejecutar con Docker (recomendado)

> **ℹ️ Importante:**  
> Todos los comandos Docker deben ejecutarse desde el directorio `backend`, donde está tu archivo `docker-compose.yml`.

1. Renombra el archivo `.env.example` a `.env` y configura las variables:

    ```env
    POSTGRES_USER=farmadigital_user
    POSTGRES_PASSWORD=FarmaSeguro2025!
    POSTGRES_DB=FarmaDigitalDB

    PGADMIN_DEFAULT_EMAIL=admin@farma.com
    PGADMIN_DEFAULT_PASSWORD=admin123

    ASPNETCORE_ENVIRONMENT=Docker
    DOTNET_CONNECTION_STRING=Host=postgres;Port=5432;Database=FarmaDigitalDB;Username=${POSTGRES_USER};Password=${POSTGRES_PASSWORD}
    ```

2. Construye y levanta el entorno (desde `backend/`):

    ```bash
    docker-compose build
    docker-compose up
    ```

3. Accede a:
   - **Backend API:** [http://localhost:8080](http://localhost:8080)
   - **pgAdmin:** [http://localhost:5050](http://localhost:5050)

> **🛠️ Nota:**  
> Si necesitas ejecutar comandos dentro del contenedor (por ejemplo, aplicar migraciones manualmente), usa:
> ```bash
> docker-compose exec <servicio> dotnet ef database update --project FarmaDigitalBackend --startup-project FarmaDigitalBackend
> ```
> Donde `<servicio>` es el nombre del servicio definido en tu `docker-compose.yml` (por ejemplo, `api` o `backend`).  
> Puedes ver los nombres de los servicios ejecutando:
> ```bash
> docker-compose ps
> ```

---

### 🖥️ Opción 2: Ejecutar localmente (sin Docker)

1. Asegúrate de que PostgreSQL esté ejecutándose localmente y crea una base de datos llamada `FarmaDigitalDB`.

2. En el archivo `appsettings.Development.json` configura tu cadena de conexión local:

    ```json
    {
      "ConnectionStrings": {
        "DefaultConnection": "Host=localhost;Port=5432;Database=FarmaDigitalDB;Username=farmadigital_user;Password=FarmaSeguro2025!"
      }
    }
    ```

3. Ejecuta las migraciones (si no están aplicadas):

    ```bash
    dotnet ef database update --project FarmaDigitalBackend --startup-project FarmaDigitalBackend
    ```

4. Corre la aplicación desde Visual Studio o con el siguiente comando:

    ```bash
    dotnet run --project FarmaDigitalBackend
    ```

---

## 🔄 Migraciones Entity Framework Core

- **Crear nueva migración:**
    ```bash
    dotnet ef migrations add NombreDeLaMigracion --project FarmaDigitalBackend --startup-project FarmaDigitalBackend
    ```

- **Aplicar migración a la base:**
    ```bash
    dotnet ef database update --project FarmaDigitalBackend --startup-project FarmaDigitalBackend
    ```

- **Generar script SQL de migración:**
    ```bash
    dotnet ef migrations script --project FarmaDigitalBackend --startup-project FarmaDigitalBackend > script.sql
    ```

---

## 📁 Estructura del Proyecto

```text
FarmaDigital/
└── backend/
    ├── FarmaDigitalBackend/
    │   └── FarmaDigitalBackend/
    │       ├── Controllers/
    │       ├── Models/
    │       ├── Data/
    │       ├── Migrations/
    │       ├── Program.cs
    │       ├── appsettings.json
    │       └── FarmaDigitalBackend.csproj
    ├── docker-compose.yml
    └── .env
```

---

## 🐙 Gitignore

```gitignore
bin/
obj/
.vs/
*.user
node_modules/
.next/
.env
.vscode/
```

---

## 📄 Licencia

Este proyecto está bajo la licencia [MIT](LICENSE).
