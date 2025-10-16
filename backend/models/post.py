from sqlalchemy import func
from database import db

class Post(db.Model):
    __tablename__ = "posts"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False, index=True)
    content = db.Column(db.Text, nullable=False)

    author_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    author = db.relationship("User", backref=db.backref("posts", lazy="dynamic"))

    created_at = db.Column(db.DateTime, server_default=func.now(), nullable=False, index=True)
    updated_at = db.Column(db.DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    def __repr__(self):
        return f"<Post {self.title!r}>"

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "author_id": self.author_id,
            "author_email": getattr(self.author, "email", None),
            "created_at": str(self.created_at),
            "updated_at": str(self.updated_at),
        }

    def is_author(self, user_id: int) -> bool:
        return self.author_id == user_id
  