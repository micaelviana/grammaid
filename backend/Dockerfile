# ==================================================================
# 1. Estágio de Build - Compila a aplicação
# ==================================================================
FROM node:22-alpine3.22 AS build
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build

# ==================================================================
# 2. Estágio de Produção - Roda a aplicação compilada
# ==================================================================
FROM node:22-alpine3.22 AS production
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json .
# CORREÇÃO: Adicionado '--' antes de omit
RUN npm ci --omit=dev

# Copia apenas os artefatos compilados da etapa de build
COPY --from=build /app/dist ./dist

EXPOSE 6677
CMD [ "npm", "run", "start:prod" ]

# ==================================================================
# 3. Estágio de Desenvolvimento - Roda em modo de desenvolvimento
# ==================================================================
FROM node:22-alpine3.22 AS development
WORKDIR /app
ENV NODE_ENV=development

# CORREÇÃO: Instala TODAS as dependências
COPY package*.json .
RUN npm install

EXPOSE 6677
# O código-fonte será montado via volume, então não copiamos com "COPY . ."
CMD [ "npm", "start"]
