#!/bin/bash
set -e

PROJECT_NAME="DnD-Yonder"
CONTAINER_NAME="dnd-yonder"
IMAGE_NAME="dnd-yonder:latest"
VOLUME_NAME="dnd_yonder_data"

echo "Pulling latest code for $PROJECT_NAME..."
git pull origin main

echo "Stopping running container..."
docker stop $CONTAINER_NAME 2>/dev/null || true

echo "Removing container..."
docker rm $CONTAINER_NAME 2>/dev/null || true

echo "Building new image..."
docker build -t $IMAGE_NAME .

echo "Ensuring volume exists..."
docker volume inspect $VOLUME_NAME >/dev/null 2>&1 || docker volume create $VOLUME_NAME

echo "Starting $PROJECT_NAME container..."
docker run -d \
  --name $CONTAINER_NAME \
  -v /etc/letsencrypt/live/backend.blazy.uk/fullchain.pem:/app/certs/localhost.pem:ro \
  -v /etc/letsencrypt/live/backend.blazy.uk/privkey.pem:/app/certs/localhost-key.pem:ro \
  -v $VOLUME_NAME:/data \
  -e DB_PATH=/data/yonder-prod-db.db \
  -e BACKUP_PATH=/data/backups \
  -p 8000:8000 \
  --restart unless-stopped \
  $IMAGE_NAME

echo "$PROJECT_NAME deployment complete."
