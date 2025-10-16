#!/usr/bin/env python3
"""
Script para inicializar la base de datos
Ejecutar: python init_db.py
"""

from app import create_app, db
from models import User, Post

def init_db():
    """Inicializa la base de datos creando las tablas"""
    app = create_app()
    
    with app.app_context():
        # Crear todas las tablas
        db.create_all()
        print("✅ Base de datos inicializada correctamente")
        
        # Verificar si ya hay datos
        user_count = User.query.count()
        post_count = Post.query.count()
        
        print(f"📊 Usuarios en BD: {user_count}")
        print(f"📊 Posts en BD: {post_count}")
        
        if user_count == 0:
            print("💡 La base de datos está vacía. Puedes registrar usuarios desde el frontend.")

if __name__ == '__main__':
    init_db()