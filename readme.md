# 🔴 Pokemon DevOps - Repositorio del Challeng by @RoxsRoss

![Banner](https://media.licdn.com/dms/image/v2/D4D16AQF4ND-cC_uxZg/profile-displaybackgroundimage-shrink_350_1400/profile-displaybackgroundimage-shrink_350_1400/0/1731367727725?e=1753920000&v=beta&t=80SZ4IOx4V_VDcCBli7aFjYuMhzMos9SRFq8GnV8zc4)

<p align="center">
    <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-Frontend-61DAFB?logo=react" alt="React"></a>
    <a href="https://www.python.org/"><img src="https://img.shields.io/badge/Python-3.11-blue?logo=python" alt="Python"></a>
    <a href="https://fastapi.tiangolo.com/"><img src="https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi" alt="FastAPI"></a>
    <a href="https://www.gnu.org/software/bash/"><img src="https://img.shields.io/badge/Bash-Scripting-4EAA25?logo=gnubash" alt="Bash"></a>
    <a href="https://www.docker.com/"><img src="https://img.shields.io/badge/Docker-Containerization-2496ED?logo=docker" alt="Docker"></a>
</p>

## 🚀 **¿Qué es este proyecto?**

Este repositorio contiene una **aplicación Pokemon completa** desarrollada durante el **90 Days of DevOps Challenge by Roxs**. Es un proyecto práctico que demuestra cómo implementar una arquitectura full-stack moderna usando herramientas DevOps.

![](./docs/1.png)

## 🎯 **Objetivo del Challenge**

El proyecto forma parte del desafío de **90 días de DevOps**, donde cada día se aprende y aplica una nueva tecnología o concepto.


## 🏗️ **Arquitectura de la Aplicación**

### **Frontend (React)**
- **Tecnología**: React 18 con hooks modernos
- **Características**:
  - 🃏 Tarjetas 3D flipables de Pokemon
  - 🔍 Búsqueda en tiempo real con debounce
  - 🎨 Filtros avanzados (tipo, ordenamiento)
  - ✨ Modo Shiny para sprites alternativos
  - 📱 Diseño responsive con gradientes modernos
  - 🎯 Modal detallado con estadísticas completas

### **Backend (FastAPI)**
- **Tecnología**: Python 3.11 + FastAPI + Uvicorn
- **Características**:
  - 🔌 API REST con documentación automática (Swagger)
  - 🐍 Endpoints para Pokemon data desde PokeAPI
  - 💾 Cache inteligente para optimizar requests
  - 🌐 CORS configurado para desarrollo
  - 📊 Manejo robusto de errores
  - 🚀 Respuestas JSON estructuradas


## 📁 **Estructura del Repositorio**

```
pokemon-devops-app/
├── 📄 README.md                 # Este archivo
├── 📂 backend/                 # Aplicación FastAPI
│   ├── main.py                 # Servidor principal
│   ├── requirements.txt        # Dependencias Python
│   └── test_main.py           # Tests unitarios
├── 📂 frontend/                # Aplicación React
│   ├── src/                   # Código fuente
│   │   ├── App.js             # Componente principal
│   │   ├── App.css            # Estilos principales
│   │   └── components/        # Componentes React
│   │       ├── Header.js      # Header con challenge info
│   │       ├── Footer.js      # Footer con redes sociales
│   │       ├── PokeCard.js    # Tarjetas Pokemon 3D
│   │       ├── SearchBar.js   # Búsqueda con debounce
│   │       ├── PokemonModal.js# Modal detallado
│   │       └── ...            # Más componentes
│   ├── public/                # Archivos estáticos
│   └── package.json           # Dependencias Node.js
└── 📂 docs/                   # Documentación adicional
```

## 🚀 **¿Cómo funciona?**

### **1. Inicio**
```bash
git clone -b devops-pokeops https://github.com/roxsross/devops-static-web.git
cd devops-static-web
```

### **2. Ejecución Local**

#### **Backend (FastAPI)**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8080
```

#### **Frontend (React)**
En otra terminal:
```bash
cd frontend
npm install
npm start
```

### **3. URLs de Acceso:**
- **🏠 Aplicación Principal**: `http://localhost:3000/`
- **🔌 API Backend**: `http://localhost:8080/api/`
- **📚 Documentación API**: `http://localhost:8080/docs`
- **🏥 Health Check**: `http://localhost:8080/health`

## 🎨 **Características Destacadas**

### **Frontend Moderno**
- **Tarjetas 3D**: Flip animation con CSS transforms
- **Búsqueda Inteligente**: Debounce + filtros en tiempo real
- **Modo Shiny**: Toggle para sprites alternativos
- **Responsive**: Funciona en desktop, tablet y móvil
- **Footer DevOps**: Contador automático del challenge

### **Backend Robusto**
- **API REST**: Endpoints estructurados y documentados
- **Cache**: Evita requests repetidos a PokeAPI
- **Error Handling**: Respuestas consistentes y útiles
- **Async**: Manejo asíncrono para mejor performance

## 🔧 **Tecnologías Utilizadas**

### **Frontend Stack**
- ⚛️ **React 18** - Framework UI moderno
- 🎨 **CSS3** - Gradientes, animations, flexbox
- 📦 **npm** - Gestión de dependencias
- 🔄 **Create React App** - Tooling y build

### **Backend Stack**
- 🐍 **Python 3.11** - Lenguaje principal
- ⚡ **FastAPI** - Framework web moderno
- 🚀 **Uvicorn** - Servidor ASGI
- 📡 **Requests** - Cliente HTTP
- 🌐 **CORS** - Cross-origin support

### **External APIs**
- 🔴 **PokeAPI** - Datos de Pokemon (https://pokeapi.co)


## 🌟 **Casos de Uso**

### **Para Estudiantes**
- 📚 Aprender arquitecturas full-stack
- 🛠️ Practicar DevOps tools
- 🎯 Portfolio project demostrable
- 🤝 Base para proyectos colaborativos

### **Para Desarrolladores**
- 🚀 Template para nuevos proyectos
- 🔧 Referencia de setup automatizado
- 📖 Ejemplo de documentación
- 🎨 Patrones de UI/UX modernos

### **Para DevOps Engineers**
- 🏗️ Ejemplo de Infrastructure as Code
- 📦 Automatización de environments
- 🌐 Configuración de reverse proxy
- 📊 Patterns de logging y monitoreo

## 🔮 **Próximos Pasos**

Este proyecto es una base sólida para evolucionar hacia:

### **Containerización**
- 🐳 **Docker** - Containerizar backend y frontend
- 🚢 **Docker Compose** - Orquestación local
- ☸️ **Kubernetes** - Orquestación en producción

### **CI/CD Pipeline**
- 🔄 **GitHub Actions** - Automatización de testing
- 🧪 **Testing** - Unit, integration, e2e tests
- 📦 **Build Automation** - Builds automáticos
- 🚀 **Deployment** - Deploy automático

### **Cloud Deployment**
- ☁️ **AWS/Azure/GCP** - Deploy en cloud
- 🌐 **CDN** - Distribución global
- 📊 **Monitoring** - APM y alertas
- 🔒 **Security** - HTTPS, auth, secrets

### **Features Adicionales**
- 🔐 **Authentication** - Login de usuarios
- 💾 **Database** - Persistencia de datos
- 🔍 **Search** - Búsqueda avanzada
- 📱 **PWA** - Progressive Web App

## 🤝 **Contribuir**

Este proyecto es parte del **90 Days of DevOps Challenge**. Si quieres:

- 🐛 **Reportar bugs** - Abre un issue
- 💡 **Sugerir features** - Propón mejoras
- 🔧 **Contribuir código** - Envía un PR
- 📚 **Mejorar docs** - Actualiza documentación

## 📱 **Redes Sociales - Roxs**

Sígueme en el challenge:

- 🐙 **GitHub**: [@roxsross](https://github.com/roxsross)
- 💼 **LinkedIn**: [roxsross](https://linkedin.com/in/roxsross)
- 🐦 **Twitter**: [@roxsross](https://twitter.com/roxsross)
- 📺 **YouTube**: [@roxsross](https://youtube.com/@295devops)
- 📸 **Instagram**: [@roxsross](https://instagram.com/roxsross)

## 🌱 **Filosofía del Challenge**

> *"El mejor momento para plantar un árbol fue hace 20 años. El segundo mejor momento es ahora."*

Este proyecto representa el espíritu del **90 Days of DevOps Challenge**: aprender haciendo, construir proyectos reales, y compartir conocimiento con la comunidad.

---

🚀 **¡Happy DevOps Journey!** - Día X de 90 completado 🎉