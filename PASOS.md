# 🔴 Guía Completa: Pokemon DevOps
## Ejecución en Vagrant, Docker CLI y Docker Compose

### 🏗️ **Requisitos Previos**

#### Para todos los métodos:
- Git instalado
- Conexión a Internet estable

#### Para Vagrant:
- [VirtualBox](https://www.virtualbox.org/wiki/Downloads) 7.0+
- [Vagrant](https://www.vagrantup.com/downloads) 2.3+
- Mínimo 4GB RAM libre
- 10GB espacio en disco

#### Para Docker:
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) o Docker Engine
- Docker Compose (incluido en Docker Desktop)
- Mínimo 2GB RAM libre

---

## 🚀 **Método 1: Ejecución con Vagrant**

### **Paso 1: Clonar el Repositorio**
```bash
# Clonar el proyecto
git clone -b devops-pokeops-v1 https://github.com/roxsross/devops-static-web.git
cd devops-static-web

# Verificar archivos necesarios
ls -la
# Deberías ver: Vagrantfile, scripts/, frontend/, backend/
```

### **Paso 2: Iniciar la Máquina Virtual**
```bash
# Levantar y provisionar la VM
vagrant up

# Esto ejecutará automáticamente:
# ✅ Instalación del sistema (Node.js, Python, Nginx)
# ✅ Configuración del backend (FastAPI + virtualenv)
# ✅ Configuración del frontend (React + npm install)
# ✅ Configuración de Nginx como proxy reverso
# ✅ Inicio automático de servicios
```

### **Paso 3: Verificar el Estado**
```bash
# Verificar que la VM está corriendo
vagrant status

# Conectarse a la VM (opcional)
vagrant ssh

# Dentro de la VM, verificar servicios:
sudo systemctl status nginx
ps aux | grep uvicorn
ps aux | grep node
```

### **Paso 4: Acceder a la Aplicación**
```bash
# URLs disponibles:
# 🌐 Aplicación completa: http://192.168.56.10
# 🔌 API Backend: http://192.168.56.10/api/
# 📚 Documentación: http://192.168.56.10/docs
# 🏥 Health Check: http://192.168.56.10/health
```

### **Comandos Útiles para Vagrant**
```bash
# Detener la VM
vagrant halt

# Reiniciar la VM
vagrant reload

# Re-provisionar (ejecutar scripts de nuevo)
vagrant provision

# Destruir la VM completamente
vagrant destroy

# Ver logs del backend
vagrant ssh -c "tail -f /home/vagrant/logs/backend.log"

# Ver logs del frontend
vagrant ssh -c "tail -f /home/vagrant/logs/frontend.log"
```

---

## 🐳 **Método 2: Ejecución con Docker CLI**

### **Paso 1: Preparar el Entorno**
```bash
# Clonar el repositorio
git clone -b devops-pokeops-v1 https://github.com/roxsross/devops-static-web.git
cd devops-static-web

# Crear red personalizada
docker network create pokeops
```

### **Paso 2: Ejecutar el Backend**
```bash
# Ejecutar contenedor del backend
docker run -d \
  --name poke-backend \
  --network pokeops \
  -p 8000:8000 \
  -e PORT=8000 \
  -e HOST=0.0.0.0 \
  -e DEBUG=true \
  roxsross12/pokeops:backend-1.0.0

# Verificar que está corriendo
docker ps
docker logs poke-backend
```

### **Paso 3: Ejecutar el Frontend**
```bash
# Ejecutar contenedor del frontend
docker run -d \
  --name poke-front \
  --network pokeops \
  -p 3000:3000 \
  -e REACT_APP_URL_DEVELOPMENT=http://localhost:8000 \
  roxsross12/pokeops:frontend-1.0.0

# Verificar que está corriendo
docker ps
docker logs poke-front
```

### **Paso 4: Acceder a la Aplicación**
```bash
# URLs disponibles:
# 🌐 Frontend: http://localhost:3000
# 🔌 Backend API: http://localhost:8000/api/
# 📚 Documentación: http://localhost:8000/docs
```

### **Comandos Útiles para Docker CLI**
```bash
# Ver contenedores corriendo
docker ps

# Ver logs en tiempo real
docker logs -f poke-backend
docker logs -f poke-front

# Ejecutar comandos dentro del contenedor
docker exec -it poke-backend bash
docker exec -it poke-front bash

# Detener contenedores
docker stop poke-backend poke-front

# Eliminar contenedores
docker rm poke-backend poke-front

# Limpiar red
docker network rm pokeops
```

---

## 🐳📦 **Método 3: Ejecución con Docker Compose**

### **Paso 1: Preparar el Entorno**
```bash
# Clonar el repositorio
git clone -b devops-pokeops-v1 https://github.com/roxsross/devops-static-web.git
cd devops-static-web

# Verificar que existe compose.yml
ls -la compose.yml
```

### **Paso 2: Ejecutar con Docker Compose**
```bash
# Levantar todos los servicios
docker compose up -d

# Ver el progreso (opcional)
docker compose up

# Verificar servicios corriendo
docker compose ps
```

### **Paso 3: Configurar Hosts (Opcional)**
Para usar los dominios personalizados, agregar al archivo `/etc/hosts` (Linux/Mac) o `C:\Windows\System32\drivers\etc\hosts` (Windows):

```bash
# Agregar estas líneas:
127.0.0.1 pokemon.localhost
127.0.0.1 api.pokemon.localhost
127.0.0.1 portainer.pokemon.localhost
```

### **Paso 4: Acceder a los Servicios**
```bash
# Con dominios personalizados (si configuraste hosts):
# 🌐 Frontend: http://pokemon.localhost
# 🔌 Backend: http://api.pokemon.localhost
# 🐳 Portainer: http://portainer.pokemon.localhost

# Con localhost directo:
# 🌐 Frontend: http://localhost:3000
# 🔌 Backend: http://localhost:8000
# 🐳 Portainer: http://localhost:9000
```

### **Comandos Útiles para Docker Compose**
```bash
# Ver servicios corriendo
docker-compose ps

# Ver logs de todos los servicios
docker-compose logs

# Ver logs de un servicio específico
docker-compose logs backend
docker-compose logs front

# Seguir logs en tiempo real
docker-compose logs -f

# Reiniciar un servicio
docker-compose restart backend

# Escalar un servicio (ejemplo: 3 instancias del backend)
docker-compose up -d --scale backend=3

# Detener todos los servicios
docker-compose stop

# Detener y eliminar contenedores
docker-compose down

# Eliminar todo incluyendo volúmenes
docker-compose down -v

# Forzar recreación de contenedores
docker-compose up -d --force-recreate
```

---

## 🔧 **Solución de Problemas**

### **Problemas Comunes con Vagrant**
```bash
# Error: VM no se puede crear
# Solución: Verificar VirtualBox
vboxmanage --version

# Error: Puertos en uso
# Solución: Cambiar puertos en Vagrantfile
# config.vm.network "forwarded_port", guest: 3000, host: 3001

# Error: Scripts de provisión fallan
# Solución: Re-ejecutar provisión
vagrant provision

# VM muy lenta
# Solución: Aumentar memoria en Vagrantfile
# vb.memory = "4096"
```

### **Problemas Comunes con Docker**
```bash
# Error: Puerto en uso
# Solución: Cambiar puerto
docker run -p 3001:3000 [imagen]

# Error: No puede conectar al backend
# Solución: Verificar network
docker network ls
docker network inspect pokeops

# Error: Imagen no encontrada
# Solución: Descargar imagen
docker pull roxsross12/pokeops:backend-1.0.0
docker pull roxsross12/pokeops:frontend-1.0.0

# Error: Contenedor no inicia
# Solución: Ver logs detallados
docker logs [nombre-contenedor]
```

### **Verificación de Estado**
```bash
# Para cualquier método, verificar conectividad:
curl http://localhost:8000/health
curl http://localhost:3000

# Verificar API específica:
curl http://localhost:8000/api/v1/stats
curl http://localhost:8000/api/v1/all_pokemons
```

---

## 📊 **Comparación de Métodos**

| Característica | Vagrant | Docker CLI | Docker Compose |
|----------------|---------|------------|----------------|
| **Facilidad** | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |
| **Velocidad** | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Recursos** | Alta | Media | Media |
| **Aislamiento** | Completo | Bueno | Bueno |
| **Producción** | No | Sí | Sí |
| **Desarrollo** | Excelente | Bueno | Excelente |

---

## 🎯 **Recomendaciones de Uso**

### **Usa Vagrant cuando:**
- Necesites un entorno completamente aislado
- Quieras simular un servidor completo
- Estés aprendiendo Linux/DevOps
- Tengas suficientes recursos de hardware

### **Usa Docker CLI cuando:**
- Necesites control granular
- Estés debuggeando contenedores específicos
- Quieras entender Docker paso a paso
- Tengas configuraciones complejas

### **Usa Docker Compose cuando:**
- Tengas múltiples servicios (recomendado)
- Quieras un entorno de desarrollo rápido
- Necesites orquestación simple
- Vayas a desplegar en producción

---

## 🚀 **Próximos Pasos**

Una vez que tengas la aplicación corriendo:

1. **Explora la API**: Visita `/docs` para la documentación interactiva
2. **Modifica el código**: Los cambios se reflejan automáticamente
3. **Experimenta con contenedores**: Prueba diferentes configuraciones
4. **Aprende CI/CD**: Implementa pipelines de despliegue
5. **Escala la aplicación**: Prueba con múltiples instancias

---

## 📱 **Soporte y Comunidad**

- **GitHub**: [@roxsross](https://github.com/roxsross)
- **LinkedIn**: [roxsross](https://linkedin.com/in/roxsross)
- **YouTube**: [@295devops](https://youtube.com/@295devops)

---

🎉 **¡Felicidades! Ahora tienes Pokemon DevOps corriendo en tu entorno preferido.**

# 🔴 Guía Completa: Pokemon DevOps
## Ejecución en Vagrant, Docker CLI y Docker Compose

### 🏗️ **Requisitos Previos**

#### Para todos los métodos:
- Git instalado
- Conexión a Internet estable

#### Para Vagrant:
- [VirtualBox](https://www.virtualbox.org/wiki/Downloads) 7.0+
- [Vagrant](https://www.vagrantup.com/downloads) 2.3+
- Mínimo 4GB RAM libre
- 10GB espacio en disco

#### Para Docker:
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) o Docker Engine
- Docker Compose (incluido en Docker Desktop)
- Mínimo 2GB RAM libre

---

## 🚀 **Método 1: Ejecución con Vagrant**

### **Paso 1: Clonar el Repositorio**
```bash
# Clonar el proyecto
git clone -b devops-pokeops https://github.com/roxsross/devops-static-web.git
cd devops-static-web

# Verificar archivos necesarios
ls -la
# Deberías ver: Vagrantfile, scripts/, frontend/, backend/
```

### **Paso 2: Iniciar la Máquina Virtual**
```bash
# Levantar y provisionar la VM
vagrant up

# Esto ejecutará automáticamente:
# ✅ Instalación del sistema (Node.js, Python, Nginx)
# ✅ Configuración del backend (FastAPI + virtualenv)
# ✅ Configuración del frontend (React + npm install)
# ✅ Configuración de Nginx como proxy reverso
# ✅ Inicio automático de servicios
```

### **Paso 3: Verificar el Estado**
```bash
# Verificar que la VM está corriendo
vagrant status

# Conectarse a la VM (opcional)
vagrant ssh

# Dentro de la VM, verificar servicios:
sudo systemctl status nginx
ps aux | grep uvicorn
ps aux | grep node
```

### **Paso 4: Acceder a la Aplicación**
```bash
# URLs disponibles:
# 🌐 Aplicación completa: http://192.168.56.10
# 🔌 API Backend: http://192.168.56.10/api/
# 📚 Documentación: http://192.168.56.10/docs
# 🏥 Health Check: http://192.168.56.10/health
```

### **Comandos Útiles para Vagrant**
```bash
# Detener la VM
vagrant halt

# Reiniciar la VM
vagrant reload

# Re-provisionar (ejecutar scripts de nuevo)
vagrant provision

# Destruir la VM completamente
vagrant destroy

# Ver logs del backend
vagrant ssh -c "tail -f /home/vagrant/logs/backend.log"

# Ver logs del frontend
vagrant ssh -c "tail -f /home/vagrant/logs/frontend.log"
```

---

## 🐳 **Método 2: Ejecución con Docker CLI**

### **Paso 1: Preparar el Entorno**
```bash
# Clonar el repositorio
git clone -b devops-pokeops https://github.com/roxsross/devops-static-web.git
cd devops-static-web

# Crear red personalizada
docker network create pokeops
```

### **Paso 2: Ejecutar el Backend**
```bash
# Ejecutar contenedor del backend
docker run -d \
  --name poke-backend \
  --network pokeops \
  -p 8000:8000 \
  -e PORT=8000 \
  -e HOST=0.0.0.0 \
  -e DEBUG=true \
  roxsross12/pokeops:backend-1.0.0

# Verificar que está corriendo
docker ps
docker logs poke-backend
```

### **Paso 3: Ejecutar el Frontend**
```bash
# Ejecutar contenedor del frontend
docker run -d \
  --name poke-front \
  --network pokeops \
  -p 3000:3000 \
  -e REACT_APP_URL_DEVELOPMENT=http://localhost:8000 \
  roxsross12/pokeops:frontend-1.0.0

# Verificar que está corriendo
docker ps
docker logs poke-front
```

### **Paso 4: Acceder a la Aplicación**
```bash
# URLs disponibles:
# 🌐 Frontend: http://localhost:3000
# 🔌 Backend API: http://localhost:8000/api/
# 📚 Documentación: http://localhost:8000/docs
```

### **Comandos Útiles para Docker CLI**
```bash
# Ver contenedores corriendo
docker ps

# Ver logs en tiempo real
docker logs -f poke-backend
docker logs -f poke-front

# Ejecutar comandos dentro del contenedor
docker exec -it poke-backend bash
docker exec -it poke-front bash

# Detener contenedores
docker stop poke-backend poke-front

# Eliminar contenedores
docker rm poke-backend poke-front

# Limpiar red
docker network rm pokeops
```

---

## 🐳📦 **Método 3: Ejecución con Docker Compose**

### **Paso 1: Preparar el Entorno**
```bash
# Clonar el repositorio
git clone -b devops-pokeops https://github.com/roxsross/devops-static-web.git
cd devops-static-web

# Verificar que existe compose.yml
ls -la compose.yml
```

### **Paso 2: Ejecutar con Docker Compose**
```bash
# Levantar todos los servicios
docker-compose up -d

# Ver el progreso (opcional)
docker-compose up

# Verificar servicios corriendo
docker-compose ps
```

### **Paso 3: Configurar Hosts (Opcional)**
Para usar los dominios personalizados, agregar al archivo `/etc/hosts` (Linux/Mac) o `C:\Windows\System32\drivers\etc\hosts` (Windows):

```bash
# Agregar estas líneas:
127.0.0.1 pokemon.localhost
127.0.0.1 api.pokemon.localhost
127.0.0.1 portainer.pokemon.localhost
```

### **Paso 4: Acceder a los Servicios**
```bash
# Con dominios personalizados (si configuraste hosts):
# 🌐 Frontend: http://pokemon.localhost
# 🔌 Backend: http://api.pokemon.localhost
# 🐳 Portainer: http://portainer.pokemon.localhost

# Con localhost directo:
# 🌐 Frontend: http://localhost:3000
# 🔌 Backend: http://localhost:8000
# 🐳 Portainer: http://localhost:9000
```

### **Comandos Útiles para Docker Compose**
```bash
# Ver servicios corriendo
docker-compose ps

# Ver logs de todos los servicios
docker-compose logs

# Ver logs de un servicio específico
docker-compose logs backend
docker-compose logs front

# Seguir logs en tiempo real
docker-compose logs -f

# Reiniciar un servicio
docker-compose restart backend

# Escalar un servicio (ejemplo: 3 instancias del backend)
docker-compose up -d --scale backend=3

# Detener todos los servicios
docker-compose stop

# Detener y eliminar contenedores
docker-compose down

# Eliminar todo incluyendo volúmenes
docker-compose down -v

# Forzar recreación de contenedores
docker-compose up -d --force-recreate
```

---

## 🔧 **Solución de Problemas**

### **Problemas Comunes con Vagrant**
```bash
# Error: VM no se puede crear
# Solución: Verificar VirtualBox
vboxmanage --version

# Error: Puertos en uso
# Solución: Cambiar puertos en Vagrantfile
# config.vm.network "forwarded_port", guest: 3000, host: 3001

# Error: Scripts de provisión fallan
# Solución: Re-ejecutar provisión
vagrant provision

# VM muy lenta
# Solución: Aumentar memoria en Vagrantfile
# vb.memory = "4096"
```

### **Problemas Comunes con Docker**
```bash
# Error: Puerto en uso
# Solución: Cambiar puerto
docker run -p 3001:3000 [imagen]

# Error: No puede conectar al backend
# Solución: Verificar network
docker network ls
docker network inspect pokeops

# Error: Imagen no encontrada
# Solución: Descargar imagen
docker pull roxsross12/pokeops:backend-1.0.0
docker pull roxsross12/pokeops:frontend-1.0.0

# Error: Contenedor no inicia
# Solución: Ver logs detallados
docker logs [nombre-contenedor]
```

### **Verificación de Estado**
```bash
# Para cualquier método, verificar conectividad:
curl http://localhost:8000/health
curl http://localhost:3000

# Verificar API específica:
curl http://localhost:8000/api/v1/stats
curl http://localhost:8000/api/v1/all_pokemons
```

---

## 📊 **Comparación de Métodos**

| Característica | Vagrant | Docker CLI | Docker Compose |
|----------------|---------|------------|----------------|
| **Facilidad** | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |
| **Velocidad** | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Recursos** | Alta | Media | Media |
| **Aislamiento** | Completo | Bueno | Bueno |
| **Producción** | No | Sí | Sí |
| **Desarrollo** | Excelente | Bueno | Excelente |

---

## 🎯 **Recomendaciones de Uso**

### **Usa Vagrant cuando:**
- Necesites un entorno completamente aislado
- Quieras simular un servidor completo
- Estés aprendiendo Linux/DevOps
- Tengas suficientes recursos de hardware

### **Usa Docker CLI cuando:**
- Necesites control granular
- Estés debuggeando contenedores específicos
- Quieras entender Docker paso a paso
- Tengas configuraciones complejas

### **Usa Docker Compose cuando:**
- Tengas múltiples servicios (recomendado)
- Quieras un entorno de desarrollo rápido
- Necesites orquestación simple
- Vayas a desplegar en producción

---

## 🐳 **Adicional: Gestión Avanzada con Portainer**

### **¿Qué es Portainer?**
Portainer es una interfaz web ligera que permite gestionar entornos Docker de forma visual y sencilla, sin necesidad de usar la línea de comandos constantemente.

### **Método 1: Portainer con Docker CLI**

#### **Instalación Standalone**
```bash
# Crear volumen para datos de Portainer
docker volume create portainer_data

# Ejecutar Portainer
docker run -d \
  --name portainer \
  --restart always \
  -p 9000:9000 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  portainer/portainer-ce:latest

# Acceder a: http://localhost:9000
```

#### **Configuración Inicial**
1. **Primera vez**: Crear usuario administrador
2. **Elegir entorno**: Docker local
3. **Dashboard**: Vista general de contenedores

### **Método 2: Portainer Integrado (Ya incluido en docker-compose.yml)**

El archivo `compose.yml` ya incluye Portainer configurado:

```yaml
portainer:
  image: portainer/portainer-ce:latest
  container_name: portainer
  ports:
    - "9000:9000"
  environment:
    - VIRTUAL_HOST=portainer.pokemon.localhost
    - VIRTUAL_PORT=9000
  volumes:
    - /var/run/docker.sock:/var/run/docker.sock
    - portainer_data:/data
  networks:
    - pokeopsv1
```

### **Acceso a Portainer**
```bash
# Con Docker Compose:
# 🌐 URL directa: http://localhost:9000
# 🌐 URL con proxy: http://portainer.pokemon.localhost (requiere configurar hosts)

# Con Docker CLI:
# 🌐 URL: http://localhost:9000
```

### **🎯 Funcionalidades Principales de Portainer**

#### **1. Dashboard Principal**
- **Vista general**: Contenedores activos/inactivos
- **Uso de recursos**: CPU, RAM, almacenamiento
- **Estadísticas en tiempo real**: Gráficos de rendimiento

#### **2. Gestión de Contenedores**
```bash
# Desde Portainer puedes:
✅ Iniciar/detener contenedores
✅ Ver logs en tiempo real
✅ Acceder a terminal (bash/sh)
✅ Inspeccionar configuración
✅ Monitorear estadísticas
✅ Editar variables de entorno
```

#### **3. Gestión de Imágenes**
```bash
# Funciones disponibles:
✅ Listar todas las imágenes
✅ Eliminar imágenes no utilizadas
✅ Descargar nuevas imágenes
✅ Ver capas e historial
✅ Escanear vulnerabilidades
```

#### **4. Gestión de Redes**
```bash
# Para el proyecto Pokemon:
✅ Ver red 'pokeopsv1'
✅ Inspeccionar conectividad entre contenedores
✅ Crear nuevas redes
✅ Modificar configuraciones de red
```

#### **5. Gestión de Volúmenes**
```bash
# Volúmenes del proyecto:
✅ portainer_data (datos de Portainer)
✅ Ver uso de espacio
✅ Backup/restore de volúmenes
✅ Limpiar volúmenes no utilizados
```

### **🔧 Tareas Comunes con Portainer**

#### **Monitoreo del Proyecto Pokemon**
```bash
# En Portainer:
1. Ve a "Containers"
2. Busca: poke-backend, poke-front, pokemon-nginx-proxy
3. Clic en cada uno para ver:
   - Estado de salud
   - Logs en tiempo real
   - Uso de recursos
   - Variables de entorno
```

#### **Debugging de Problemas**
```bash
# Proceso de troubleshooting:
1. Dashboard → Verificar contenedores activos
2. Container → Logs → Ver errores recientes
3. Container → Console → Acceder a terminal
4. Stats → Verificar uso de recursos
5. Inspect → Revisar configuración
```

#### **Actualizaciones de Imágenes**
```bash
# Actualizar imagen del backend:
1. Images → Buscar 'roxsross12/pokeops:backend-1.0.0'
2. Pull → Descargar nueva versión
3. Containers → Recreate container con nueva imagen
4. Verify → Comprobar que funciona correctamente
```

#### **Gestión de Logs**
```bash
# Ver logs de diferentes servicios:
1. Container → poke-backend → Logs
2. Container → poke-front → Logs  
3. Container → pokemon-nginx-proxy → Logs
4. Filtrar por fecha/nivel de error
5. Descargar logs para análisis
```

### **📊 Portainer Stacks (Docker Compose en UI)**

#### **Importar el Stack Pokemon**
```bash
# En Portainer:
1. Ve a "Stacks"
2. Clic "Add stack"
3. Nombre: "pokemon-devops"
4. Pegar contenido de compose.yml
5. Deploy the stack
6. Gestionar todo desde la interfaz
```

#### **Ventajas de usar Stacks**
```bash
✅ Ver todos los servicios agrupados
✅ Escalar servicios con sliders
✅ Actualizar configuración sin CLI
✅ Ver logs agregados de todo el stack
✅ Gestionar variables de entorno fácilmente
```

### **🚀 Comandos Útiles con Portainer**

#### **Acceso Rápido a Terminales**
```bash
# Desde Portainer Console:
# Backend container:
cd /app && python -c "import main; print('Backend OK')"

# Frontend container:
cd /app && npm list react

# Nginx container:
nginx -t && service nginx status
```

#### **Monitoreo en Tiempo Real**
```bash
# En Portainer Stats:
- CPU usage por contenedor
- Memory usage y límites
- Network I/O
- Block I/O
- PIDs count
```

### **🔐 Seguridad y Mejores Prácticas**

#### **Configuración Segura**
```bash
# Variables de entorno sensibles:
1. Usar "Secrets" en lugar de env vars
2. Configurar HTTPS para Portainer
3. Limitar acceso por IP
4. Usar usuarios con roles específicos
```

#### **Backup de Configuración**
```bash
# Backup del volumen de Portainer:
docker run --rm \
  -v portainer_data:/data \
  -v $(pwd):/backup \
  alpine tar -czf /backup/portainer-backup.tar.gz /data
```

### **📈 Métricas y Alertas**

#### **Configurar Alertas**
```bash
# En Portainer Business (versión paga):
✅ Alertas por uso de CPU/RAM
✅ Notificaciones por contenedor caído
✅ Alertas por espacio en disco
✅ Integración con Slack/Email
```

#### **Métricas Personalizadas**
```bash
# Métricas específicas del proyecto Pokemon:
- Requests por minuto al backend
- Tiempo de respuesta de la API
- Usuarios activos en el frontend
- Errores de conexión a PokeAPI
```

### **🔄 Integración con CI/CD**

#### **Webhooks de Portainer**
```bash
# URL webhook ejemplo:
http://localhost:9000/api/webhooks/[token]

# Uso en GitHub Actions:
- name: Deploy to Portainer
  run: |
    curl -X POST http://portainer.domain.com/api/webhooks/${{ secrets.PORTAINER_WEBHOOK }}
```

### **🎓 Casos de Uso Avanzados**

#### **Multi-Environment Setup**
```bash
# Configurar diferentes entornos:
1. Development: pokemon-dev stack
2. Staging: pokemon-staging stack  
3. Production: pokemon-prod stack
4. Usar diferentes puertos/dominios
```

#### **Monitoring Dashboard Personalizado**
```bash
# Crear vista personalizada:
1. Templates → Custom template
2. Configurar variables específicas
3. Deploy múltiples instancias
4. Gestionar desde un punto central
```

---

## 🚀 **Próximos Pasos**

Una vez que tengas la aplicación corriendo:

1. **Explora la API**: Visita `/docs` para la documentación interactiva
2. **Modifica el código**: Los cambios se reflejan automáticamente
3. **Experimenta con contenedores**: Prueba diferentes configuraciones
4. **Aprende CI/CD**: Implementa pipelines de despliegue
5. **Escala la aplicación**: Prueba con múltiples instancias

---

## 📱 **Soporte y Comunidad**

- **GitHub**: [@roxsross](https://github.com/roxsross)
- **LinkedIn**: [roxsross](https://linkedin.com/in/roxsross)
- **YouTube**: [@295devops](https://youtube.com/@295devops)

---

🎉 **¡Felicidades! Ahora tienes Pokemon DevOps corriendo en tu entorno preferido.**