#!/bin/bash
# Script para configurar el bucket de MinIO como público
# Ejecutar después de que docker-compose esté corriendo

BUCKET_NAME="${S3_BUCKET:-blog}"
MINIO_USER="${MINIO_ROOT_USER:-minioadmin}"
MINIO_PASSWORD="${MINIO_ROOT_PASSWORD:-minioadmin123}"

echo "🔧 Configurando bucket de MinIO..."
echo "Bucket: ${BUCKET_NAME}"
echo ""

# Ejecutar dentro del contenedor minio_mc o minio
echo "1. Configurando alias..."
docker exec minio_mc mc alias set local http://minio:9000 ${MINIO_USER} ${MINIO_PASSWORD}

echo "2. Verificando si el bucket existe..."
docker exec minio_mc mc ls local/${BUCKET_NAME}

echo "3. Configurando bucket como público (download)..."
docker exec minio_mc mc anonymous set download local/${BUCKET_NAME}

echo "4. Verificando configuración..."
docker exec minio_mc mc anonymous get local/${BUCKET_NAME}

echo ""
echo "✅ Proceso completado!"
echo "El bucket '${BUCKET_NAME}' debería estar configurado como público ahora."

