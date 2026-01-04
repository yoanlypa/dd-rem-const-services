import os
from django.core.wsgi import get_wsgi_application

<<<<<<< HEAD
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "master_builder.settings.production")
=======
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "master_builder.settings.dev")
>>>>>>> 5e3ed98 (Add Bootstrap assets)

application = get_wsgi_application()
