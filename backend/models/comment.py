from datetime import datetime
from sqlalchemy import func
from database import db

class Comment(db.Model):
    __tablename__ = "comments"

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey("posts.id"), nullable=False)

    created_at = db.Column(db.DateTime, server_default=func.now(), nullable=False, index=True)
    updated_at = db.Column(db.DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    def __repr__(self):
        return f"<Comment {self.id} by User {self.author_id} on Post {self.post_id}>"

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "content": self.content,
            "author_id": self.author_id,
            "post_id": self.post_id,
            "author_username": getattr(self.author, "username", None),
            "created_at": str(self.created_at),
            "updated_at": str(self.updated_at),
        }

