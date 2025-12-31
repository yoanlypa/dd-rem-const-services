from .base import *

DEBUG = True
SECRET_KEY = "dev-secret-key"
ALLOWED_HOSTS = ["*"]

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
