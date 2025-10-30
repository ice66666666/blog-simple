import os
import uuid
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from database import db
from models import Image
from s3_client import get_s3
from urllib.parse import urlparse, urlunparse

uploads_bp = Blueprint("uploads", __name__)

BUCKET = os.getenv("S3_BUCKET", "blog")

@uploads_bp.post("/")
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "file is required"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "empty filename"}), 400

    filename = secure_filename(file.filename)
    ext = os.path.splitext(filename)[1].lower()
    key = f"uploads/{uuid.uuid4().hex}{ext}"

    try:
        s3 = get_s3()
        content_type = file.mimetype or "application/octet-stream"
        data = file.read()
        size = len(data)

        # MinIO: el bucket ya está configurado como público en docker-compose, no necesitamos ACL
        s3.put_object(
            Bucket=BUCKET,
            Key=key,
            Body=data,
            ContentType=content_type,
        )
    except Exception as e:
        return jsonify({"error": f"Error subiendo archivo: {str(e)}"}), 500

    # URL pública (con bucket público) o URL accesible desde el navegador
    # Preferimos S3_PUBLIC_ENDPOINT. Si no existe, derivamos de S3_ENDPOINT y forzamos hostname "localhost"
    endpoint = (
        os.getenv("S3_PUBLIC_ENDPOINT")
        or os.getenv("S3_ENDPOINT")
        or "http://localhost:9000"
    ).rstrip("/")

    if not os.getenv("S3_PUBLIC_ENDPOINT"):
        try:
            u = urlparse(endpoint)
            host = u.hostname or "localhost"
            port = u.port
            # Si el host no es localhost/127.0.0.1, lo reemplazamos por localhost para el navegador
            if host not in ("localhost", "127.0.0.1"):
                netloc = f"localhost:{port}" if port else "localhost"
                endpoint = urlunparse((u.scheme, netloc, "", "", "", ""))
        except Exception:
            # En caso de error en el parseo, mantener endpoint como esté
            pass
    # Para MinIO con estilo path: http://host:9000/bucket/key
    url = f"{endpoint}/{BUCKET}/{key}"

    try:
        img = Image(key=key, url=url, content_type=content_type, size=size)
        db.session.add(img)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        # Intentar eliminar el objeto de S3 si la BD falla
        try:
            s3.delete_object(Bucket=BUCKET, Key=key)
        except:
            pass
        return jsonify({"error": f"Error guardando en base de datos: {str(e)}"}), 500

    return jsonify({"id": img.id, "key": key, "url": url}), 201


@uploads_bp.get("/")
def list_uploads():
    images = Image.query.order_by(Image.created_at.desc()).limit(100).all()
    return jsonify([img.to_dict() for img in images]), 200