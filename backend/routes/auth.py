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
        return jsonify(errors=e.messages), 400

    if User.query.filter((User.email == data["email"]) | (User.username == data["username"])).first():
        return jsonify(error="Email o username ya registrados"), 400

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
        return jsonify(errors=e.messages), 400

    user = User.query.filter_by(email=data["email"]).first()
    if not user or not user.check_password(data["password"]):
        return jsonify(error="Credenciales inválidas"), 401

    token = user.generate_token()
    return jsonify(access_token=token, user=user.to_dict()), 200
