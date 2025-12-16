# frontend/Dockerfile

# --- ESTÁGIO 1: Build (Usando Node 20 para compatibilidade com Vite novo) ---
# Mudamos de node:18-alpine para node:20.
# Isso resolve o erro "crypto.hash is not a function"
FROM node:20 AS build-stage

WORKDIR /app

# Copia arquivos de dependência
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o resto do código
COPY . .

# Compila o projeto
RUN npm run build

# --- ESTÁGIO 2: Production (Servidor Nginx leve) ---
FROM nginx:alpine AS production-stage

# Copia os arquivos compilados do estágio anterior
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expõe a porta 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]