from validaciones_jwt.auth import require_auth, require_ownership
from models.post import Post
from models.comment import Comment

# Configuración de permisos para posts
POST_PERMISSIONS = {
    'create': require_auth,
    'update': require_ownership(Post, 'post_id'),
    'delete': require_ownership(Post, 'post_id')
}

# Configuración de permisos para comentarios  
COMMENT_PERMISSIONS = {
    'create': require_auth,
    'update': require_ownership(Comment, 'comment_id'),
    'delete': require_ownership(Comment, 'comment_id')
}
