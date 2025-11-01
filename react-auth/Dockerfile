# Multi-stage build para React + Nginx
FROM node:18-alpine AS build

# Argumentos de build
ARG NODE_ENV=production
ARG VITE_BETTER_AUTH_URL

# Definir variáveis de ambiente para o build
ENV NODE_ENV=$NODE_ENV
ENV VITE_BETTER_AUTH_URL=$VITE_BETTER_AUTH_URL

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependência
COPY package*.json ./
RUN npm ci --only=production

# Copiar código fonte
COPY . .

# Build da aplicação para produção
RUN npm run build:prod

# Produção com Nginx
FROM nginx:alpine AS production

# Copiar build do React
COPY --from=build /app/dist /usr/share/nginx/html

# Configurar Nginx para SPA (React Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]