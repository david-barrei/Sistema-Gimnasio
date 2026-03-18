# 🏋️‍♂️ Systems Gym: Software Full-Stack de Gestión de Gimnasios y POS

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
![Celery](https://img.shields.io/badge/Celery-37814A?style=for-the-badge&logo=celery&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)

Una aplicación Full-Stack moderna orientada a la producción y diseñada para gestionar centros de acondicionamiento físico. Cuenta con un robusto sistema de **Punto de Venta (POS)**, estricto **control de Caja Registradora**, seguimiento de suscripciones con recordatorios de correo electrónico en segundo plano automatizados y un **Dashboard** analítico visualmente atractivo.



## 🌟 Características Principales

*   🚀 **Dashboard Moderno**: Métricas de negocio en tiempo real utilizando `recharts` para gráficos visuales, conteo de usuarios activos y registro de ventas diarias.
*   🛒 **Punto de Venta Interactivo (POS)**: Una interfaz de ventas dinámica en pantalla dividida que bloquea el sistema e impide vender si el cajero no ha abierto explícitamente una sesión de caja.
*   💰 **Control de Caja (Cash Register)**: Control estricto del conteo de efectivo diario, rastreando automáticamente ingresos, proyecciones del saldo esperado y reportando discrepancias al momento del cierre de turno.
*   👥 **Gestión de Clientes y Suscripciones**: CRUD (Crear, Leer, Actualizar, Borrar) completo de miembros del gimnasio, verificando el estado de sus mensualidades.
*   📦 **Sistema de Inventario**: Administración del catálogo de productos, precios unitarios y reducción de stock automatizada cada vez que se hace un cobro en el POS.
*   🔐 **Autenticación por Tokens**: Acceso a la API totalmente protegido mediante Tokens JWT/REST, bloqueando rutas en React si no se está logueado.
*   ⏰ **Correos Automatizados (Celery & Redis)**: Trabajadores (Workers) en segundo plano que revisan las bases de datos cada 24 horas y envían emails de recordatorio a los clientes 3 días antes de que se les venza el plan.
*   🐋 **Entorno Dockerizado**: Configuración local ultrarrápida que levanta Django, Postgres, Redis, Celery, Celery-Beat y Vite utilizando tan solo un comando en consola.
*   🎨 **Hermoso Diseño de UI/UX**: Estética limpia y minimalista combinada con una cuadrícula Bootstrap responsiva, variables CSS corporativas e integración atractiva de `react-icons`.

## 🚀 Inicio Rápido con Docker (Recomendado)

La manera más sencilla de levantar el proyecto en tu máquina es usando Docker Compose. Este comando orquestará automáticamente por detrás la base de datos, el caché de Redis, el Backend de Python, los trabajadores en segundo plano y el servidor de Frontend.

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/systems-gym.git
    cd systems-gym
    ```

2.  **Configurar credenciales (Secrets):**
    Asegúrate de contar con un archivo `secrets.json` en la carpeta principal del proyecto conteniendo los parámetros y credenciales base de la base de datos.

3.  **Encender los contenedores:**
    ```bash
    docker-compose up --build
    ```
    *Este comando preparará todas las imágenes, correrá las migraciones de Django y prenderá los 5 servicios.*

4.  **Crear un usuario Administrador local:**
    Abre otra pequeña pestaña en tu terminal y ejecuta:
    ```bash
    docker-compose exec web python manage.py createsuperuser
    ```

5.  **Acceder al Sistema:**
    *   **Sitio Web para Usuarios (Frontend UI):** `http://localhost:5173`
    *   **Backend API y Panel Admin:** `http://localhost:8000/admin`

---

## 🛠️ Instalación Manual (Sin Docker)

Si prefieres correr todas las herramientas a mano localmente sin contenedores:

### Instalación de Backend (Python/Django)
```bash
# 1. Crear y activar tu Entorno Virtual
python -m venv env
source env/bin/activate  # En Windows usa: env\Scripts\activate

# 2. Instalar los Requerimientos
pip install -r requirements.txt

# 3. Aplicar las Migraciones a la Base de Datos
python manage.py migrate

# 4. Iniciar el servidor local
python manage.py runserver
```

### Instalación de Frontend (React)
```bash
cd frontend

# 1. Bajar las dependencias de Node
npm install

# 2. Arrancar el servidor Vite de desarrollo
npm run dev
```
*(Nota: Para que el sistema automatizado de emails funcione, debes instalar también un ejecutable local de **Redis** e iniciar el servidor de Celery abriendo una tercera consola y ejecutando `celery -A gym worker -l info`).*

---

## 📁 Estructura del Proyecto

```text
├── frontend/             # Aplicación de Frontend creada con React + Vite
│   ├── src/
│   │   ├── components/   # UI reutilizable como la barra lateral (Sidebar) y el Menú
│   │   ├── pages/        # Vistas principales (Dashboard, POS, Clientes, Caja)
│   │   ├── services/     # Puentes Axios API (authService, saleService...)
│   │   └── index.css     # Paletas de color globales
├── gym/                  # Núcleo y Ajustes globales (Settings) de Django
│   ├── settings.py       # Configuración DB, Celery Schedule e integraciones
│   ├── urls.py           # Enrutamiento maestro
│   └── celery.py         # Inicialización de la librería de colas Celery
├── sales/                # Módulo y Aplicación de Reglas de Negocio
│   ├── models.py         # Esquemas de Modelo (Producto, Venta, SesiónCaja)
│   └── views.py          # Lógica para cobros en POS e inteligencia del Dashboard
├── users/                # Módulo de Autenticación y Administración de Miembros
│   ├── models.py         # Tablas personalizadas de usuarios (AbstractBaseUser)
│   └── tasks.py          # Tareas Programadas Celery para envío de correos
├── docker-compose.yml    # Receta maestra de orquestación de Docker
└── requirements.txt      # Paquetes y librerías dependencia del entorno Python
```

## 💻 Stack Tecnológico Utilizado

*   **Frontend**: React 18, Vite, React Router DOM, Axios, Recharts, Bootstrap 5.
*   **Backend**: Python, Django 5.x, Django REST Framework (DRF).
*   **Base de Datos**: PostgreSQL 15.
*   **Mensajería / Caché**: Servidor Redis 7.
*   **Tareas Automáticas en 2do Plano**: Celery + `django-celery-beat`.
*   **Autenticación**: DRF Token Authentication.
*   **Despliegue (Deploy)**: Entorno local construido sobre Docker & Docker Compose.

---

> Construido aplicando fuertemente principios de Arquitectura Limpia, priorizando una clara separación lógica entre un Backend como Interfaz ReST y una aplicación de cliente moderna e interactiva.

**Licencia:** MIT
