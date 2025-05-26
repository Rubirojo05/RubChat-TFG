FROM node:18

# Crear directorio de trabajo
WORKDIR /usr/src/app

# Copiar archivos necesarios
COPY package*.json ./
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto del servidor
EXPOSE 3000

# Comando para iniciar el servidor
CMD ["node", "src/server.js"]