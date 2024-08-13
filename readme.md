## Example store

`example` es una aplicación de tienda escrita en PHP nativo y MySQL para ayudarte a aprender los conceptos básicos del desarrollo web. Aprende la manera primitiva de implementar CRUD: Crear, Leer, Actualizar y Eliminar.

## Características

* Autenticación
* CRUD: Crear, Leer, Actualizar y Eliminar elementos de la tienda

## Configuración

* Configura las conexiones a la base de datos en `/server/db_connect.php`, `/transaction/server/db_connect.php` y `/customer/server/db_connect.php`
* Crea la base de datos
* Importa `database.sql` a esa nueva base de datos

## Deploy Pre-Requisites

1. Update

```
sudo apt-get update
```

## Instalación de Git
```
sudo apt install git -y
```

## Deploy and Configure Database

1. Install MariaDB

```
sudo apt install -y mariadb-server
sudo systemctl start mariadb
sudo systemctl enable mariadb
sudo systemctl status mariadb
```

2. Configure Database

```
$ mysql
MariaDB > CREATE DATABASE example_crud;
MariaDB > CREATE USER 'user_crud'@'localhost' IDENTIFIED BY 'pass_crud';
MariaDB > GRANT ALL PRIVILEGES ON *.* TO 'user_crud'@'localhost';
MariaDB > FLUSH PRIVILEGES;
```
3. Agregar datos a la database example_crud
Run sql script
ruta: database

```
mysql < database.sql
```

## Deploy and Configure Web

1. Install required packages

```
sudo apt install apache2 -y
sudo apt install -y php libapache2-mod-php php-mysql php-mbstring php-zip php-gd php-json php-curl 
```

2. Iniciar servidor web Apache

```
sudo systemctl start apache2 
sudo systemctl enable apache2 
sudo systemctl status apache2 
```

3. Validar instalación de php

```
php -v
```

4. Configurar apache para que soporte extensión php

> Con la configuración predeterminada de DirectoryIndex en Apache, un archivo denominado index.html siempre tendrá prioridad sobre un archivo index.php

> Si desea cambiar este comportamiento, deberá editar el archivo /etc/apache2/mods-enabled/dir.conf y modificar el orden en el que el archivo index.php se enumera en la directiva DirectoryIndex:

```
 sudo nano /etc/apache2/mods-enabled/dir.conf
```

```
 <IfModule mod_dir.c>
        DirectoryIndex index.php index.html index.cgi index.pl index.xhtml index.htm
</IfModule>
```

Después de guardar y cerrar el archivo, deberá volver a cargar Apache para que los cambios surtan efecto:

```
 sudo systemctl reload apache2
```

5.- Deben insertar en tiempo de despliegue el pass de la bases de datos,
ya que no es buena practica que este la bases de datos en el codigo.

* Configura las conexiones a la base de datos en `/server/db_connect.php`, `/transaction/server/db_connect.php` y `/customer/server/db_connect.php`

```php
<?php

	/*
	 *	PHP Script to connect to the database
	 *	using mysqli_connect()
	 *
	*/
	// Configure database connection
	$db_host 		=	"localhost";
	$db_name 		=	"example_crud";	
	$db_username 	=	"user_crud";"root"
	$db_password 	=	"pass_crud";if database has no password set 
	$db_connect = mysqli_connect($db_host, $db_username, $db_password, $db_name);
	if( mysqli_connect_errno() )
	{
		die('<br/>Failed to connect to the database. Check database.' . mysqli_connect_error());
	}	
?>
```

6. Codigo de la Aplicación

```
git clone -b crud-php-web https://github.com/roxsross/devops-static-web.git
mv /var/www/html/index.html /var/www/html/index.html.bkp
cp -r devops-static-web/* /var/www/html/
```

6.- Para que tome los cambios

```
 sudo systemctl reload apache2
```

7.- Acceder a la Aplicación

```
 curl localhost
 navegador http://localhost
```