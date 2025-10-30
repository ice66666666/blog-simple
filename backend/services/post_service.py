from database import db
from models.post import Post
from models.user import User
from schemas.post_schema import PostCreateSchema, PostOutSchema
from marshmallow import ValidationError
from sqlalchemy.orm import joinedload

#Servicio para manejar la lógica de negocio de posts
class PostService:
    
    #Obtener todos los posts ordenados por fecha
    @staticmethod
    def get_all_posts():
        # Cargar los posts con la relación de autor para evitar N+1 queries
        posts = Post.query.options(joinedload(Post.author)).order_by(Post.created_at.desc()).all()
        return PostOutSchema(many=True).dump(posts)

    #Crear un nuevo post
    @staticmethod
    def create_post(data, current_user):
        try:
            validated_data = PostCreateSchema().load(data)
        except ValidationError as e:
            first_error = list(e.messages.values())[0][0] if e.messages else "Datos del post inválidos"
            raise ValueError(first_error)
        
        post = Post(
            title=validated_data["title"], 
            content=validated_data["content"], 
            author_id=current_user.id
        )
        
        db.session.add(post)
        db.session.flush()  # Para obtener el ID y mantener la sesión
        # Asegurar que el autor esté cargado
        post = Post.query.options(joinedload(Post.author)).filter_by(id=post.id).first()
        db.session.commit()
        return PostOutSchema().dump(post)

    #Actualizar un post existente
    @staticmethod
    def update_post(post, data):
        try:
            validated_data = PostCreateSchema().load(data)
        except ValidationError as e:
            raise ValueError("Datos del post inválidos")
        
        post.title = validated_data["title"]
        post.content = validated_data["content"]
        db.session.commit()
        # Recargar el post con el autor para la serialización
        post = Post.query.options(joinedload(Post.author)).filter_by(id=post.id).first()
        return PostOutSchema().dump(post)
    
    #Eliminar un post
    @staticmethod
    def delete_post(post):
        db.session.delete(post)
        db.session.commit()
        return True
