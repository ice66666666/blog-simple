from marshmallow import Schema, fields, validates, ValidationError
import re

class RegisterSchema(Schema):
    username = fields.String(required=True)
    email = fields.Email(required=True)
    password = fields.String(required=True, load_only=True)

    @validates("username")
    def validate_username(self, value):
        if len(value) < 3:
            raise ValidationError("El nombre de usuario debe tener al menos 3 caracteres.")
        if not re.match(r'^[a-zA-Z0-9_]+$', value):
            raise ValidationError("El nombre de usuario solo puede contener letras, números y guiones bajos.")

    @validates("email")
    def validate_email(self, value):
        if not value:
            raise ValidationError("El correo electrónico es requerido.")
        email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_regex, value):
            raise ValidationError("Por favor ingresa un correo electrónico válido.")

    @validates("password")
    def validate_password(self, value):
        if len(value) < 6:
            raise ValidationError("La contraseña debe tener al menos 6 caracteres.")

class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.String(required=True, load_only=True)

    @validates("email")
    def validate_email(self, value):
        if not value:
            raise ValidationError("El correo electrónico es requerido.")
        email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_regex, value):
            raise ValidationError("Por favor ingresa un correo electrónico válido.")

    @validates("password")
    def validate_password(self, value):
        if not value:
            raise ValidationError("La contraseña es requerida.")
