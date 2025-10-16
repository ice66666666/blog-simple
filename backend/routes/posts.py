from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError
from database import db
from models.post import Post
from schemas.post_schema import PostCreateSchema, PostOutSchema

posts_bp = Blueprint("posts", __name__)

@posts_bp.get("/")
def list_posts():
    posts = Post.query.order_by(Post.created_at.desc()).all()
    return jsonify(posts=PostOutSchema(many=True).dump(posts)), 200

@posts_bp.post("/")
@jwt_required()
def create_post():
    try:
        data = PostCreateSchema().load(request.get_json() or {})
    except ValidationError as e:
        return jsonify(errors=e.messages), 400

    author_id = int(get_jwt_identity())
    post = Post(title=data["title"], content=data["content"], author_id=author_id)
    db.session.add(post)
    db.session.commit()
    return jsonify(post=PostOutSchema().dump(post)), 201

@posts_bp.put("/<int:post_id>")
@jwt_required()
def update_post(post_id: int):
    try:
        data = PostCreateSchema().load(request.get_json() or {})
    except ValidationError as e:
        return jsonify(errors=e.messages), 400

    requester_id = int(get_jwt_identity())
    post = Post.query.get_or_404(post_id)
    if post.author_id != requester_id:
        return jsonify(error="Sin permisos"), 403

    post.title = data["title"]
    post.content = data["content"]
    db.session.commit()
    return jsonify(post=PostOutSchema().dump(post)), 200

@posts_bp.delete("/<int:post_id>")
@jwt_required()
def delete_post(post_id: int):
    requester_id = int(get_jwt_identity())
    post = Post.query.get_or_404(post_id)
    if post.author_id != requester_id:
        return jsonify(error="Sin permisos"), 403

    db.session.delete(post)
    db.session.commit()
    return "", 204
