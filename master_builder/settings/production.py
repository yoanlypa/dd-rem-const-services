import os
import dj_database_url

DEBUG = os.getenv("DEBUG", "0") == "1"
ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "").split(",") if not DEBUG else ["*"]
DATABASES = {
  "default": dj_database_url.config(default=os.getenv("DATABASE_URL"))
}