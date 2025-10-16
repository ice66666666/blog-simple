from marshmallow import Schema, fields, validates, ValidationError

class PostCreateSchema(Schema):
    title = fields.String(required=True)
    content = fields.String(required=True)

    @validates("title")
    def validate_title(self, value):
        if not value or not value.strip():
            raise ValidationError("El título es requerido.")

    @validates("content")
    def validate_content(self, value):
        if not value or not value.strip():
            raise ValidationError("El contenido es requerido.")

class PostOutSchema(Schema):
    id = fields.Int()
    title = fields.String()
    content = fields.String()
    author_id = fields.Int()
    created_at = fields.String()
    updated_at = fields.String()
