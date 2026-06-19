# FastAPI extraction backend for Convert Statement.
# Works on Render, Railway, Fly.io, or any container host.
FROM python:3.12-slim

# System deps: pdfplumber/PyMuPDF ship wheels, but keep build tooling minimal.
ENV PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    APP_ENV=production

WORKDIR /app

COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY . .

# Hosts route external traffic to the container's published port, so bind 0.0.0.0.
# $PORT is provided by the platform (Render/Railway/Fly); default 8000 locally.
EXPOSE 8000
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
