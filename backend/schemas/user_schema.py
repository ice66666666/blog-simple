from marshmallow import Schema, fields, validates, ValidationError

class RegisterSchema(Schema):
    username = fields.String(required=True)
    email = fields.Email(required=True)
    password = fields.String(required=True, load_only=True)

    @validates("password")
    def validate_password(self, value):
        if len(value) < 6:
            raise ValidationError("La contraseña debe tener al menos 6 caracteres.")

class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.String(required=True, load_only=True)
