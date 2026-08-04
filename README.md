# Sistema de Gestión y Búsqueda de ETS

![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

El **Sistema de Exámenes a Título de Suficiencia (ETS)** es un proyecto desarrollado como parte de la unidad de aprendizaje "Tecnologías para el desarrollo de aplicaciones web", impartida por el profesor José Antonio Ortiz Ramírez.

Su objetivo principal es modernizar y facilitar el proceso de consulta y programación de exámenes para la comunidad estudiantil y administrativa, ofreciendo una experiencia de usuario superior en comparación con la plataforma oficial de la institución.

---

## 📸 Interfaz del Proyecto


### Portal de Estudiantes
<img width="1346" height="995" alt="image" src="https://github.com/user-attachments/assets/10b22214-1a77-46af-9116-4d8b572bd81d" />

*Interfaz pública con búsqueda inteligente y carrito de exámenes.*

### Panel de Administración
<img width="1346" height="995" alt="image" src="https://github.com/user-attachments/assets/c43e633e-3109-4129-b951-73ac60c55a43" />

*Panel de control con métricas y gestión de catálogos.*

---

## ✨ Características Principales

Este sistema introduce mejoras sustanciales frente a la alternativa oficial, destacando por las siguientes funcionalidades:

### Portal Estudiantil
- **Búsqueda Inteligente**: Filtrado dinámico por carrera, semestre y materia en tiempo real, implementando un mecanismo de *debounce* para optimizar las peticiones al servidor.
- **Carrito de Exámenes**: Selección de múltiples materias mediante una interfaz interactiva similar a un carrito de compras, lo que permite visualizar los exámenes seleccionados en un panel lateral antes de confirmar.
- **Integración con Calendarios y PDF**: Funcionalidad para exportar el horario final de los exámenes seleccionados en formato **.ICS** (compatible con Google Calendar y Apple Calendar) o generar un documento **PDF** listo para su impresión.
- **Paginación Dinámica**: Renderizado asíncrono para gestionar grandes volúmenes de datos de manera fluida, sin necesidad de recargar la página.

### Panel Administrativo
- **Métricas e Indicadores**: Un panel principal (Dashboard) que muestra estadísticas relevantes sobre los exámenes programados.
- **Gestión de Catálogos (CRUD)**: Interfaz estructurada para la administración eficiente de Carreras, Materias y Profesores, así como la programación de exámenes en turnos matutinos y vespertinos.
- **Seguridad Robusta**: Autenticación mediante sesiones seguras (`HttpOnly`), mitigación de vulnerabilidades CSRF mediante validación de tokens, y sanitización de entrada de datos para prevenir inyecciones SQL y ataques XSS.

## 🛠️ Tecnologías Utilizadas

La arquitectura del proyecto se basa completamente en tecnologías nativas (Vanilla), garantizando alto rendimiento y un control total sobre la aplicación sin depender de librerías de terceros pesadas:

- **Frontend**: 
   **HTML5 & CSS3** (Diseño responsivo utilizando CSS Grid y Flexbox).
   **JavaScript (ES6+)** (Arquitectura modular orientada a objetos, consumo de la Fetch API y manipulación directa del DOM).
- **Backend**:
   **PHP 8+** (Arquitectura RESTful que expone datos en formato JSON).
   **PDO (PHP Data Objects)** (Uso de sentencias preparadas para interacciones seguras y eficientes con la base de datos).
- **Base de Datos**:
   **MySQL 8** (Esquema relacional).
- **Infraestructura**:
   **Docker & Docker Compose** (Contenedorización para asegurar la consistencia entre entornos de desarrollo y producción).

## 🚀 Instalación y Ejecución Local

El proyecto está configurado para un despliegue rápido utilizando contenedores.

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/LunaEMG/sistema_ets.git
   cd sistema_ets
   ```

2. **Levantar los servicios con Docker**:
   ```bash
   docker compose up -d
   ```

3. **Acceder a la aplicación**:
   Navega a `http://localhost/` (o al puerto configurado en el archivo docker-compose) en tu navegador web.
   
### 🔑 Credenciales de Prueba (Administrador)
Para acceder al panel de administración y probar todas las funcionalidades (CRUD, programación de exámenes, dashboard estadístico), puedes utilizar la siguiente cuenta generada por defecto:
- **Correo electrónico**: `admin@escom.ipn.mx`
- **Contraseña**: `admin123`
