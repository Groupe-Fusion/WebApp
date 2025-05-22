# Étape 1 : Build de l'application
FROM node:18 AS builder

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json / package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers
COPY . .

# Construire l'application Vite (sortie dans dist/)
RUN npm run build

# Étape 2 : Serveur NGINX pour servir les fichiers statiques
FROM nginx:alpine

# Copier le build dans le dossier nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Supprimer la config par défaut de nginx
RUN rm /etc/nginx/conf.d/default.conf

# Ajouter la configuration nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d

# Exposer le port 80
EXPOSE 80

# Commande pour lancer nginx
CMD ["nginx", "-g", "daemon off;"]
