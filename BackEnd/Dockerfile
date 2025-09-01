# Utiliser une image Node.js officielle comme base
FROM node:18-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances du projet
RUN npm install

# Copier le reste des fichiers du backend
COPY . .

# Exposer le port sur lequel le serveur tourne
EXPOSE 3001

# La commande pour démarrer le serveur
CMD [ "npm", "start" ]