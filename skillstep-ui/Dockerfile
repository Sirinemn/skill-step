# ════════════════════
# Étape 1 — BUILD Angular
# ════════════════════
FROM node:20-alpine AS builder

WORKDIR /app

# Copie package.json en premier pour profiter du cache Docker
COPY package*.json ./
RUN npm ci

# Copie le code source et build pour la production
COPY . .
RUN npm run build

# ════════════════════
# Étape 2 — SERVE avec Nginx
# Nginx sert les fichiers statiques Angular
# Image ultra-légère (~25MB)
# ════════════════════
FROM nginx:alpine AS runtime

# Copie le build Angular dans le dossier servi par Nginx
COPY --from=builder /app/dist/skillstep-ui/browser /usr/share/nginx/html

# Config Nginx pour le routing Angular (SPA)
# Sans ça, un refresh sur /dashboard retourne 404
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]