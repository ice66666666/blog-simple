from flask import Blueprint, request, jsonify
from marshmallow import ValidationError
from database import db
from models.user import User
from schemas.user_schema import RegisterSchema, LoginSchema

auth_bp = Blueprint("auth", __name__)

@auth_bp.post("/register")
def register():
    try:
        data = RegisterSchema().load(request.get_json() or {})
    except ValidationError as e:
        # Devolver el primer error de validación de manera más amigable
        first_error = list(e.messages.values())[0][0] if e.messages else "Datos de registro inválidos"
        return jsonify(error=first_error), 400

    # Verificar duplicados específicamente
    existing_user = User.query.filter_by(email=data["email"]).first()
    if existing_user:
        return jsonify(error="Este correo electrónico ya está registrado"), 400
    
    existing_user = User.query.filter_by(username=data["username"]).first()
    if existing_user:
        return jsonify(error="Este nombre de usuario ya está registrado"), 400

    user = User(username=data["username"], email=data["email"])
    user.set_password(data["password"])
    db.session.add(user)
    db.session.commit()

    return jsonify(user=user.to_dict()), 201

@auth_bp.post("/login")
def login():
    try:
        data = LoginSchema().load(request.get_json() or {})
    except ValidationError as e:
        # Devolver el primer error de validación de manera más amigable
        first_error = list(e.messages.values())[0][0] if e.messages else "Datos de inicio de sesión inválidos"
        return jsonify(error=first_error), 400

    user = User.query.filter_by(email=data["email"]).first()
    if not user or not user.check_password(data["password"]):
        return jsonify(error="Correo electrónico o contraseña incorrectos"), 401

    token = user.generate_token()
    return jsonify(access_token=token, user=user.to_dict()), 200
