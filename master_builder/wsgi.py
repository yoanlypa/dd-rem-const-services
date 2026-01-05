import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "master_builder.settings.production")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "master_builder.settings.dev")
application = get_wsgi_application()
