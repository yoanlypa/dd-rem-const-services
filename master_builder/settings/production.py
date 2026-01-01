import os
from .base import *  # noqa
import dj_database_url


# -------------------------------------------------------------------
# Core production flags
# -------------------------------------------------------------------
DEBUG = os.getenv("DEBUG", "0").strip().lower() in ("1", "true", "yes", "on")


SECRET_KEY = os.getenv("SECRET_KEY", "").strip()
if not SECRET_KEY:
    raise RuntimeError("Missing SECRET_KEY environment variable")


# -------------------------------------------------------------------
# Hosts / CSRF
# -------------------------------------------------------------------
_raw_hosts = os.getenv("ALLOWED_HOSTS", "").strip()
if _raw_hosts:
    ALLOWED_HOSTS = [h.strip() for h in _raw_hosts.split(",") if h.strip()]
else:
    # Safe baseline: Railway domains + localhost. Avoid "*" in production.
    ALLOWED_HOSTS = [
        ".railway.app",
        "localhost",
        "127.0.0.1",
    ]

# If you are behind Railway proxy / HTTPS termination:
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

# For form POSTs from your domains
# Include your service domain and wildcard railway domain.
CSRF_TRUSTED_ORIGINS = [o.strip() for o in os.getenv("CSRF_TRUSTED_ORIGINS", "").split(",") if o.strip()]
if not CSRF_TRUSTED_ORIGINS:
    CSRF_TRUSTED_ORIGINS = [
        "https://*.railway.app",
    ]
    # If ALLOWED_HOSTS contains explicit hostnames, add them as https origins
    for h in ALLOWED_HOSTS:
        if h and "*" not in h and h not in ("localhost", "127.0.0.1"):
            CSRF_TRUSTED_ORIGINS.append(f"https://{h}")


# -------------------------------------------------------------------
# Database
# -------------------------------------------------------------------
DATABASE_URL = os.getenv("DATABASE_URL", "").strip()
if not DATABASE_URL:
    raise RuntimeError(
        "Missing DATABASE_URL. Attach a PostgreSQL database in Railway and ensure DATABASE_URL is set."
    )

# NOTE: Railway internal Postgres typically does NOT require SSL.
# Setting ssl_require=True can break connections depending on Railway networking.
DATABASES = {
    "default": dj_database_url.parse(
        DATABASE_URL,
        conn_max_age=600,
        ssl_require=False,
    )
}


# -------------------------------------------------------------------
# Security defaults for production (adjust if you use a custom domain)
# -------------------------------------------------------------------
SECURE_SSL_REDIRECT = os.getenv("SECURE_SSL_REDIRECT", "1").strip().lower() in ("1", "true", "yes", "on")
SESSION_COOKIE_SECURE = os.getenv("SESSION_COOKIE_SECURE", "1").strip().lower() in ("1", "true", "yes", "on")
CSRF_COOKIE_SECURE = os.getenv("CSRF_COOKIE_SECURE", "1").strip().lower() in ("1", "true", "yes", "on")

# If you use a custom domain, also set:
# SECURE_HSTS_SECONDS, SECURE_HSTS_INCLUDE_SUBDOMAINS, SECURE_HSTS_PRELOAD


# -------------------------------------------------------------------
# Wagtail admin base URL (set it to your real URL)
# -------------------------------------------------------------------
WAGTAILADMIN_BASE_URL = os.getenv("WAGTAILADMIN_BASE_URL", "").strip() or WAGTAILADMIN_BASE_URL
