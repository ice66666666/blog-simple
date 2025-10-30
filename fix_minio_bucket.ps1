# Script PowerShell para configurar el bucket de MinIO como público
# Ejecutar después de que docker-compose esté corriendo

$BUCKET_NAME = if ($env:S3_BUCKET) { $env:S3_BUCKET } else { "blog" }
$MINIO_USER = if ($env:MINIO_ROOT_USER) { $env:MINIO_ROOT_USER } else { "minioadmin" }
$MINIO_PASSWORD = if ($env:MINIO_ROOT_PASSWORD) { $env:MINIO_ROOT_PASSWORD } else { "minioadmin123" }

Write-Host "🔧 Configurando bucket de MinIO..." -ForegroundColor Cyan
Write-Host "Bucket: $BUCKET_NAME"
Write-Host ""

# Ejecutar dentro del contenedor minio_mc
Write-Host "1. Configurando alias..." -ForegroundColor Yellow
docker exec minio_mc mc alias set local http://minio:9000 $MINIO_USER $MINIO_PASSWORD

Write-Host "2. Verificando si el bucket existe..." -ForegroundColor Yellow
docker exec minio_mc mc ls local/$BUCKET_NAME

Write-Host "3. Configurando bucket como público (download)..." -ForegroundColor Yellow
docker exec minio_mc mc anonymous set download local/$BUCKET_NAME

Write-Host "4. Verificando configuración..." -ForegroundColor Yellow
docker exec minio_mc mc anonymous get local/$BUCKET_NAME

Write-Host ""
Write-Host "✅ Proceso completado!" -ForegroundColor Green
Write-Host "El bucket '$BUCKET_NAME' debería estar configurado como público ahora."

