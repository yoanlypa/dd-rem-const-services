from .base import *
import dj_database_url

DEBUG = os.getenv("DEBUG", "0") in ("1", "true", "True", "yes", "on")

SECRET_KEY = os.getenv("SECRET_KEY", "")
if not SECRET_KEY:
    raise RuntimeError("Missing SECRET_KEY environment variable")

ALLOWED_HOSTS = [h.strip() for h in os.getenv("ALLOWED_HOSTS", "").split(",") if h.strip()]
if not ALLOWED_HOSTS:
    raise RuntimeError("Missing ALLOWED_HOSTS environment variable")

DATABASE_URL = os.getenv("DATABASE_URL", "").strip()
if not DATABASE_URL:
    raise RuntimeError("Missing DATABASE_URL environment variable")

DATABASES = {
    "default": dj_database_url.parse(
        DATABASE_URL,
        conn_max_age=600,
        ssl_require=False,  # Railway internal connection; keep False unless you use public proxy
    )
}


SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

CSRF_TRUSTED_ORIGINS = [
    f"https://{host}" for host in ALLOWED_HOSTS if host and "*" not in host
] + ["https://*.railway.app"]
