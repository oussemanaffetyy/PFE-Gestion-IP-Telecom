# Utiliser une image Node.js officielle comme base
FROM node:18-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances du projet
# Utiliser --legacy-peer-deps si vous avez des conflits de versions mineures
RUN npm install --legacy-peer-deps

# Copier le reste des fichiers du frontend
COPY . .

# Exposer le port du serveur de développement React
EXPOSE 3000

# La commande pour démarrer l'application
CMD [ "npm", "start" ]