# frontend/Dockerfile (dev)
FROM node:18-alpine

WORKDIR /app

# Copiamos manifests si existen (package.json es obligatorio)
COPY package.json ./
# Copiamos lock si existe; si no existe, no falla
COPY package-lock.json* ./

# Si hay package-lock.json -> npm ci
# Si NO hay -> npm install
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# El código se montará por volumes desde el host
EXPOSE 3000
CMD ["npm", "start"]
