# **Desplegar la Aplicación Django My-DevOps-Shopping**

![Captura de pantalla del sitio web](https://user-images.githubusercontent.com/23288656/182156472-9d88340d-b471-4462-bb16-e2dc0301aacc.png)

# **Requisitos Previos para Construir y Desplegar la Aplicación Django en AWS EC2**

1. **Sistema Operativo**: Linux-Ubuntu (también disponible en Windows y Mac).

2. **Instalar IDE**: Visual Studio Code (puedes usar cualquier editor de código de tu elección). Enlace de descarga: [Visual Studio Code](https://code.visualstudio.com/download)

3. **Instalar Python**: [Descargar Python](https://www.python.org/downloads/)

4. **Instalar Django**: [Descargar Django](https://www.djangoproject.com/download/)

5. **Herramienta Backend**: DB Browser para SQLite. [Descargar DB Browser](https://sqlitebrowser.org/dl/)

6. **Herramienta Frontend**: Bootstrap. [Documentación de Bootstrap](https://getbootstrap.com/docs/5.2/getting-started/introduction/)

# **Pasos para Ejecutar el Sitio Web My-DevOps-Shopping en tu Máquina Local**

Para obtener este repositorio, ejecuta el siguiente comando en tu terminal habilitado para git:

**Paso 1:**
```bash
$ git clone -b devops-shopping https://github.com/roxsross/devops-static-web.git
```

**Paso 2:**
```bash
  python manage.py makemigrations
```
Esto creará todos los archivos de migración (migraciones de base de datos) necesarios para ejecutar esta aplicación.

**Paso 3:**
Ahora, para aplicar estas migraciones, ejecuta el siguiente comando:
```bash
$ python manage.py migrate
```

**Paso 4:**
Un último paso y nuestro sitio web de ecommerce Shopping Mart estará en vivo. Necesitamos crear un usuario administrador para ejecutar esta aplicación. En la terminal, escribe el siguiente comando y proporciona nombre de usuario, contraseña y correo electrónico para el usuario administrador:
```bash
$ python manage.py createsuperuser
```

**Paso 5:**
Ahora hagamos que la aplicación esté en vivo. Solo necesitamos iniciar el servidor ahora y luego podremos comenzar a usar nuestro simple ecommerce Shopping Mart. Inicia el servidor con el siguiente comando:
```bash
$ python manage.py runserver
```

**Paso 6:**
Una vez que el servidor esté en funcionamiento, dirígete a [http://127.0.0.1:8000/products/](http://127.0.0.1:8000/products/) para ver la aplicación. ¿Fue bastante simple, verdad?

![Captura de pantalla del sitio web](https://user-images.githubusercontent.com/23288656/182156472-9d88340d-b471-4462-bb16-e2dc0301aacc.png)

