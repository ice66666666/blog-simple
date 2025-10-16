from marshmallow import Schema, fields

class PostCreateSchema(Schema):
    title = fields.String(required=True)
    content = fields.String(required=True)

class PostOutSchema(Schema):
    id = fields.Int()
    title = fields.String()
    content = fields.String()
    author_id = fields.Int()
    created_at = fields.String()
    updated_at = fields.String()
