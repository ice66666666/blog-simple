#!/usr/bin/env python3
"""
Script para inicializar la base de datos
Ejecutar: python init_db.py
"""

import time
from app import create_app
from database import db
from models import User, Post, Comment
# Eliminada la importación de 'generate_password_hash' de werkzeug


def seed_data():
    """Inserta datos iniciales si la base está vacía"""
    # Creamos los usuarios sin la contraseña aún
    users = [
        User(username='alice', email='alice@example.com'),
        User(username='bob', email='bob@example.com'),
    ]

    # Establecemos la contraseña usando el método seguro del modelo
    # El método set_password() usa bcrypt para guardar en 'password_hash'
    users[0].set_password('password123')
    users[1].set_password('password123')

    for u in users:
        db.session.add(u)
    db.session.commit()

    # Posts de ejemplo
    posts = [
        Post(title='Primer post', content='Bienvenido al blog!', author_id=users[0].id),
        Post(title='Segundo post', content='Esto es un post de ejemplo', author_id=users[1].id),
    ]
    for p in posts:
        db.session.add(p)
    db.session.commit()

    # Comentarios de ejemplo
    comments = [
        Comment(content='¡Excelente post!', post_id=posts[0].id, author_id=users[1].id),
        Comment(content='Muy interesante', post_id=posts[1].id, author_id=users[0].id),
    ]
    for c in comments:
        db.session.add(c)
    db.session.commit()


def init_db(retries=5, delay=2):
    """Inicializa la base de datos creando las tablas y sembrando datos si están vacías.

    retries: número de intentos para conectar a la DB si falla inicialmente.
    delay: segundos entre intentos.
    """
    for attempt in range(retries):
        try:
            app = create_app()
            with app.app_context():
                # Crear todas las tablas
                db.create_all()
                print("✅ Base de datos inicializada correctamente")

                # Verificar si ya hay datos
                user_count = User.query.count()
                post_count = Post.query.count()
                comment_count = Comment.query.count()

                print(f"📊 Usuarios en BD: {user_count}")
                print(f"📊 Posts en BD: {post_count}")
                print(f"📊 Comentarios en BD: {comment_count}")

                if user_count == 0:
                    print("⚡ Insertando datos iniciales de ejemplo...")
                    seed_data()
                    print("✅ Datos de ejemplo insertados")
                return
        except Exception as e:
            print(f"Intento {attempt+1}/{retries} fallido: {e}")
            time.sleep(delay)

    raise RuntimeError("No se pudo inicializar la base de datos después de varios intentos")


if __name__ == '__main__':
    init_db()