# Etapa 1: Construcción de la aplicación
FROM node:18 AS builder

# Crear directorio de trabajo
WORKDIR /usr/src/app

# Copiar archivos necesarios
COPY package*.json ./
RUN npm install

# Copiar el resto del código
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa 2: Servir la aplicación con Nginx
FROM nginx:alpine

# Copiar los archivos construidos al servidor Nginx
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# Exponer el puerto del frontend
EXPOSE 80

# Comando por defecto para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]