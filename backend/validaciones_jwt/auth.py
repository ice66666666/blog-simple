from functools import wraps
from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.user import User

def require_auth(f):
    """Decorador que requiere autenticación y retorna el usuario actual"""
    @wraps(f)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        try:
            user_id = int(get_jwt_identity())
            current_user = User.query.get(user_id)
            if not current_user:
                return jsonify(error="Usuario no encontrado"), 404
            return f(current_user=current_user, *args, **kwargs)
        except (ValueError, TypeError):
            return jsonify(error="Token inválido"), 401
    return decorated_function

def require_ownership(model_class, id_param='id'):
    """Decorador que verifica que el usuario sea propietario del recurso"""
    def decorator(f):
        @wraps(f)
        @require_auth
        def decorated_function(current_user, *args, **kwargs):
            resource_id = kwargs.get(id_param)
            resource = model_class.query.get_or_404(resource_id)
            
            if resource.author_id != current_user.id:
                return jsonify(error="No tienes permisos para realizar esta acción"), 403
            
            return f(current_user=current_user, resource=resource, *args, **kwargs)
        return decorated_function
    return decorator
