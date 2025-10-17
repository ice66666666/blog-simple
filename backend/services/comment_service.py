from database import db
from models.comment import Comment
from models.post import Post
from models.user import User
from schemas.comment_schema import CommentCreateSchema, CommentOutSchema
from marshmallow import ValidationError

class CommentService:
    # Servicio para manejar la lógica de negocio de comentarios
    
    @staticmethod
    def get_comments_by_post(post_id):
        # Obtener todos los comentarios de un post
        comments = Comment.query.filter_by(post_id=post_id).order_by(Comment.created_at.asc()).all()
        return CommentOutSchema(many=True).dump(comments)
    
    @staticmethod
    def create_comment(data, post_id, current_user):
        # Crear un nuevo comentario
        try:
            validated_data = CommentCreateSchema().load(data)
        except ValidationError as e:
            first_error = list(e.messages.values())[0][0] if e.messages else "Datos del comentario inválidos"
            raise ValueError(first_error)
        
        # Verificar que el post existe
        post = Post.query.get_or_404(post_id)
        
        comment = Comment(
            content=validated_data["content"],
            author_id=current_user.id,
            post_id=post_id
        )
        
        db.session.add(comment)
        db.session.commit()
        return CommentOutSchema().dump(comment)
    
    @staticmethod
    def update_comment(comment, data):
        # Actualizar un comentario existente
        try:
            validated_data = CommentCreateSchema().load(data)
        except ValidationError as e:
            first_error = list(e.messages.values())[0][0] if e.messages else "Datos del comentario inválidos"
            raise ValueError(first_error)
        
        comment.content = validated_data["content"]
        db.session.commit()
        return CommentOutSchema().dump(comment)
    
    @staticmethod
    def delete_comment(comment):
        # Eliminar un comentario
        db.session.delete(comment)
        db.session.commit()
        return True
