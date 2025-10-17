from flask import Blueprint, jsonify, request
from database import db
from models.user import User
from services.post_service import PostService
from config.permissions import POST_PERMISSIONS

posts_bp = Blueprint("posts", __name__)

#Obtener todos los posts
@posts_bp.get("/")
def list_posts():
    try:
        posts = PostService.get_all_posts()
        return jsonify(posts=posts), 200
    except Exception as e:
        return jsonify(error="Error al obtener posts"), 500

#Crear un nuevo post
@posts_bp.post("/")
@POST_PERMISSIONS['create']
def create_post(current_user: User):
    try:
        post = PostService.create_post(request.get_json() or {}, current_user)
        return jsonify(post=post), 201
    except ValueError as e:
        return jsonify(error=str(e)), 400
    except Exception as e:
        db.session.rollback()
        return jsonify(error="Error interno del servidor al crear el post"), 500

#Actualizar un post
@posts_bp.put("/<int:post_id>")
@POST_PERMISSIONS['update']
def update_post(current_user: User, resource):
    try:
        post = PostService.update_post(resource, request.get_json() or {})
        return jsonify(post=post), 200
    except ValueError as e:
        return jsonify(error=str(e)), 400
    except Exception as e:
        db.session.rollback()
        return jsonify(error="Error interno del servidor al actualizar el post"), 500

#Eliminar un post
@posts_bp.delete("/<int:post_id>")
@POST_PERMISSIONS['delete']
def delete_post(current_user: User, resource):
    try:
        PostService.delete_post(resource)
        return "", 204
    except Exception as e:
        db.session.rollback()
        return jsonify(error="Error interno del servidor al eliminar el post"), 500
