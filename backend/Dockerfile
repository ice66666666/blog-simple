FROM python:3.11-slim

# Establecer directorio de trabajo
WORKDIR /app

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements.txt primero (para cache de Docker)
COPY requirements.txt .

# Instalar dependencias de Python
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el resto del código
COPY . .

# Copiar entrypoint al directorio de trabajo (/app) y darle permisos
# MODIFICACIÓN CLAVE: Copia el entrypoint.sh a la ubicación donde será ejecutado.
COPY entrypoint.sh .
RUN sed -i 's/\r$//' entrypoint.sh
RUN chmod +x entrypoint.sh

# Exponer el puerto 5000
EXPOSE 5000

# Usar entrypoint para inicializar DB y arrancar la app
# MODIFICACIÓN CLAVE: Ejecuta el script desde la ruta absoluta /app/entrypoint.sh
ENTRYPOINT ["/app/entrypoint.sh"]