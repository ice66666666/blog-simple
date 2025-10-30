from sqlalchemy import func
from database import db

class Image(db.Model):
    __tablename__ = "images"

    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(512), nullable=False, unique=True, index=True)
    url = db.Column(db.Text, nullable=False)
    content_type = db.Column(db.String(128), nullable=True)
    size = db.Column(db.Integer, nullable=True)
    created_at = db.Column(db.DateTime, server_default=func.now(), nullable=False, index=True)

    def to_dict(self):
        return {
            "id": self.id,
            "key": self.key,
            "url": self.url,
            "content_type": self.content_type,
            "size": self.size,
            "created_at": str(self.created_at),
        }


    