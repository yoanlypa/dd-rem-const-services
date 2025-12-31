FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app
RUN mkdir -p /app/staticfiles


RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
  && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Railway inyecta PORT. En local usará 8000.
CMD ["sh", "-c", "gunicorn master_builder.wsgi:application --bind 0.0.0.0:${PORT:-8000}"]
