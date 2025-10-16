from marshmallow import Schema, fields, validates, ValidationError

class CommentCreateSchema(Schema):
    content = fields.String(required=True)

    @validates("content")
    def validate_content(self, value):
        if not value or not value.strip():
            raise ValidationError("El contenido del comentario es requerido.")
        if len(value.strip()) < 1:
            raise ValidationError("El comentario no puede estar vacío.")
        if len(value.strip()) > 1000:
            raise ValidationError("El comentario no puede tener más de 1000 caracteres.")

class CommentOutSchema(Schema):
    id = fields.Int()
    content = fields.String()
    author_id = fields.Int()
    post_id = fields.Int()
    author_username = fields.String()
    created_at = fields.String()
    updated_at = fields.String()
