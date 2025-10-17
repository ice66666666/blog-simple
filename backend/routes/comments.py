from flask import Blueprint, jsonify, request
from database import db
from models.user import User
from services.comment_service import CommentService
from config.permissions import COMMENT_PERMISSIONS

comments_bp = Blueprint("comments", __name__)

#Obtener todos los comentarios de un post
@comments_bp.get("/post/<int:post_id>")
def get_comments_by_post(post_id: int):
    try:
        comments = CommentService.get_comments_by_post(post_id)
        return jsonify(comments=comments), 200
    except Exception as e:
        return jsonify(error="Error al obtener comentarios"), 500

#Crear un nuevo comentario en un post
@comments_bp.post("/post/<int:post_id>")
@COMMENT_PERMISSIONS['create']
def create_comment(current_user: User, post_id: int):
    try:
        comment = CommentService.create_comment(request.get_json() or {}, post_id, current_user)
        return jsonify(comment=comment), 201
    except ValueError as e:
        return jsonify(error=str(e)), 400
    except Exception as e:
        db.session.rollback()
        return jsonify(error="Error interno del servidor al crear el comentario"), 500

#Actualizar un comentario
@comments_bp.put("/<int:comment_id>")
@COMMENT_PERMISSIONS['update']
def update_comment(current_user: User, resource):
    try:
        comment = CommentService.update_comment(resource, request.get_json() or {})
        return jsonify(comment=comment), 200
    except ValueError as e:
        return jsonify(error=str(e)), 400
    except Exception as e:
        db.session.rollback()
        return jsonify(error="Error interno del servidor al actualizar el comentario"), 500

#Eliminar un comentario
@comments_bp.delete("/<int:comment_id>")
@COMMENT_PERMISSIONS['delete']
def delete_comment(current_user: User, resource):
    try:
        CommentService.delete_comment(resource)
        return "", 204
    except Exception as e:
        db.session.rollback()
        return jsonify(error="Error interno del servidor al eliminar el comentario"), 500
