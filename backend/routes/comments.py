from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError
from database import db
from models.comment import Comment
from models.post import Post
from schemas.comment_schema import CommentCreateSchema, CommentOutSchema

comments_bp = Blueprint("comments", __name__)

@comments_bp.get("/post/<int:post_id>")
def get_comments_by_post(post_id: int):
    """Obtener todos los comentarios de un post"""
    comments = Comment.query.filter_by(post_id=post_id).order_by(Comment.created_at.asc()).all()
    return jsonify(comments=CommentOutSchema(many=True).dump(comments)), 200

@comments_bp.post("/post/<int:post_id>")
@jwt_required()
def create_comment(post_id: int):
    """Crear un nuevo comentario en un post"""
    try:
        data = CommentCreateSchema().load(request.get_json() or {})
    except ValidationError as e:
        first_error = list(e.messages.values())[0][0] if e.messages else "Datos del comentario inválidos"
        return jsonify(error=first_error), 400

    # Verificar que el post existe
    post = Post.query.get_or_404(post_id)
    
    try:
        author_id = int(get_jwt_identity())
        comment = Comment(
            content=data["content"],
            author_id=author_id,
            post_id=post_id
        )
        db.session.add(comment)
        db.session.commit()
        return jsonify(comment=CommentOutSchema().dump(comment)), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error al crear comentario: {e}")
        import traceback
        traceback.print_exc()
        return jsonify(error="Error interno del servidor al crear el comentario"), 500

@comments_bp.put("/<int:comment_id>")
@jwt_required()
def update_comment(comment_id: int):
    """Actualizar un comentario"""
    try:
        data = CommentCreateSchema().load(request.get_json() or {})
    except ValidationError as e:
        first_error = list(e.messages.values())[0][0] if e.messages else "Datos del comentario inválidos"
        return jsonify(error=first_error), 400

    requester_id = int(get_jwt_identity())
    comment = Comment.query.get_or_404(comment_id)
    
    if comment.author_id != requester_id:
        return jsonify(error="No tienes permisos para editar este comentario"), 403

    try:
        comment.content = data["content"]
        db.session.commit()
        return jsonify(comment=CommentOutSchema().dump(comment)), 200
    except Exception as e:
        db.session.rollback()
        return jsonify(error="Error interno del servidor al actualizar el comentario"), 500

@comments_bp.delete("/<int:comment_id>")
@jwt_required()
def delete_comment(comment_id: int):
    """Eliminar un comentario"""
    requester_id = int(get_jwt_identity())
    comment = Comment.query.get_or_404(comment_id)
    
    if comment.author_id != requester_id:
        return jsonify(error="No tienes permisos para eliminar este comentario"), 403

    try:
        db.session.delete(comment)
        db.session.commit()
        return "", 204
    except Exception as e:
        db.session.rollback()
        return jsonify(error="Error interno del servidor al eliminar el comentario"), 500
