# Usa una imagen base oficial de Node.js
FROM node:18-alpine

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia el archivo package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto de la aplicación en el directorio de trabajo
COPY . .

# Construye la aplicación
RUN npm run build

# Expone el puerto en el que la aplicación estará escuchando
EXPOSE 3000

# Define el comando que se ejecutará al iniciar el contenedor
CMD ["npm", "start"]
