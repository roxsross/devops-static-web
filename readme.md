# Repos Simples de practicas by @RoxsRoss
![Banner](https://media.licdn.com/dms/image/v2/D4D16AQF4ND-cC_uxZg/profile-displaybackgroundimage-shrink_350_1400/profile-displaybackgroundimage-shrink_350_1400/0/1731367727725?e=1753920000&v=beta&t=80SZ4IOx4V_VDcCBli7aFjYuMhzMos9SRFq8GnV8zc4)

<p align="center">
    <a href="https://nodejs.org"><img src="https://img.shields.io/badge/Node.js-Backend-green?logo=node.js" alt="Node.js"></a>
    <a href="https://www.gnu.org/software/bash/"><img src="https://img.shields.io/badge/Bash-Shell-blue?logo=gnu-bash" alt="Bash"></a>
    <a href="https://grafana.com"><img src="https://img.shields.io/badge/Grafana-Dashboard-orange?logo=grafana" alt="Grafana"></a>
    <a href="https://prometheus.io"><img src="https://img.shields.io/badge/Prometheus-Monitoring-red?logo=prometheus" alt="Prometheus"></a>
    <a href="https://cucumber.io/"><img src="https://img.shields.io/badge/Cucumber-BDD-43a047?logo=cucumber" alt="Cucumber"></a>
    <a href="https://jestjs.io/"><img src="https://img.shields.io/badge/Coverage-80%25-yellowgreen?logo=jest" alt="Coverage"></a>
</p>

## Descripción de la Aplicación

Esta aplicación es una API RESTful para la gestión de usuarios, diseñada para demostrar buenas prácticas de DevOps, testing y monitoreo.

### Funcionalidad Principal

- **Registro, autenticación, consulta, actualización y eliminación de usuarios.**
- **Base de datos:** SQLite en memoria.
- **Métricas:** Instrumentada para Prometheus.
- **Endpoints de health check y documentación.**

### Endpoints Principales

- **Health Check**
    - `GET /health`: Verifica el estado de la aplicación.
- **Métricas**
    - `GET /metrics`: Expone métricas Prometheus.
- **Documentación**
    - `GET /api`: Información sobre la API y endpoints.
- **Gestión de Usuarios**
    - `POST /api/users`: Crea un usuario (valida email, contraseña y unicidad).
    - `GET /api/users`: Lista usuarios (sin contraseñas) y total.
    - `GET /api/users/:id`: Consulta usuario por ID.
    - `PUT /api/users/:id`: Actualiza username o email.
    - `DELETE /api/users/:id`: Elimina usuario por ID.
- **Autenticación**
    - `POST /api/auth/login`: Autentica usuario y retorna token JWT.

### Validaciones y Seguridad

- Email con formato válido.
- Contraseña de mínimo 8 caracteres.
- Username entre 3 y 50 caracteres.
- Contraseñas nunca expuestas en respuestas.
- Mensajes claros y códigos HTTP apropiados en errores.

### Métricas y Monitoreo

- Total y duración de requests HTTP.
- Operaciones sobre la base de datos.
- Registros y logins de usuarios.
- Integración lista para Prometheus y dashboards en Grafana.

### Testing

- Pruebas unitarias, de integración y de servicio.
- Pruebas BDD con Cucumber (features en español e inglés).
- Pruebas de carga con K6 y reporte HTML.

### Estructura del Proyecto

- Código fuente: `src/`
- Pruebas: `tests/` y `features/`
- Scripts y utilidades: `scripts/`
- Métricas: `metrics.js`
- Configuración de Docker y Makefile

Para más detalles y ejemplos, consulta el endpoint `GET /api` o revisa los archivos en `features/`.