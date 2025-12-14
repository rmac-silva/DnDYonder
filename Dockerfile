FROM python:3.11-slim

# Prevent Python from writing pyc files and buffering stdout
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install dependencies first (better caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source (database file is NOT used at runtime)
COPY src ./src

# Create directories for mounted volume usage
RUN mkdir -p /data/backups

# Runtime paths (volume-backed)
ENV DB_PATH=/data/yonder-prod-db.db
ENV BACKUP_PATH=/data/backups
ENV ALGORITHM=HS256
ENV SECRET_KEY=r{-rrd&y[MZ)T3@vB5iZ97W_
ENV CORS_ORIGINS=https://dnd-yonder.vercel.app

CMD ["python", "src/main.py"]
