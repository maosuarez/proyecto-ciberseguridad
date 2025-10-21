# ============================
#      Dockerfile V3
# ============================

# Etapa 1: Construcción del proyecto
FROM node:20-alpine AS builder

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el código
COPY . .

# Generar cliente Prisma
RUN npx prisma generate

# Compilar la aplicación (Next.js)
RUN npm run build

# ============================
# Etapa 2: Imagen final (ligera)
# ============================
FROM node:20-alpine AS runner

WORKDIR /app

# Copiar solo lo necesario desde la etapa anterior
COPY --from=builder /app ./

# Exponer el puerto de Next.js
EXPOSE 3000

# Variables de entorno
ENV NODE_ENV=production

# Comando para ejecutar Prisma migrations al iniciar el contenedor
CMD npx prisma migrate deploy && npm start
