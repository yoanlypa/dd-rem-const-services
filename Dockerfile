FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
  && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Collectstatic en build (opcional, yo prefiero ejecutarlo en Release Command en Railway)
# RUN python manage.py collectstatic --noinput

CMD gunicorn builder_site.wsgi:application --bind 0.0.0.0:${PORT:-8000}
