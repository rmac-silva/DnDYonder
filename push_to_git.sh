#!/usr/bin/env bash

set -euo pipefail

######################################
# Configuration
######################################

# Absolute path to the Docker volume data on the host
VOLUME_PATH="/home/ricardo/.local/share/containers/storage/volumes/dnd_yonder_data/_data"

# Where to store the database and backups inside this repo
# Adjust these if you prefer a different layout.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR"

DEST_BASE_DIR="$PROJECT_ROOT/src/db_utils"
DEST_DB_DIR="$DEST_BASE_DIR"
DEST_LOGS_DIR="$DEST_BASE_DIR/logs"

DB_FILE_NAME="yonder-prod-db.db"

######################################
# Functions
######################################

info() {
	printf '[INFO] %s\n' "$*"
}

warn() {
	printf '[WARN] %s\n' "$*" >&2
}

error() {
	printf '[ERROR] %s\n' "$*" >&2
	exit 1
}

######################################
# 1. Validate environment
######################################

if [ ! -d "$VOLUME_PATH" ]; then
	error "Docker volume path not found: $VOLUME_PATH"
fi

if [ ! -d "$PROJECT_ROOT/.git" ]; then
	error "This script must be run from within the project git repository."
fi

######################################
# 2. Copy database and backups from volume
######################################

# info "Copying database and backups from volume..."

# mkdir -p "$DEST_DB_DIR"

# DB_SOURCE="$VOLUME_PATH/$DB_FILE_NAME"

# if [ -f "$DB_SOURCE" ]; then
# 	cp "$DB_SOURCE" "$DEST_DB_DIR/$DB_FILE_NAME"
# 	info "Copied main database: $DB_FILE_NAME -> $DEST_DB_DIR"
# else
# 	warn "Main database file not found at $DB_SOURCE"
# fi

# # Copy any backup files that match the naming pattern
# BACKUP_GLOB="$VOLUME_PATH/${DB_FILE_NAME}-backup-*"
# shopt -s nullglob
# BACKUP_FILES=( $BACKUP_GLOB )
# shopt -u nullglob

# if [ ${#BACKUP_FILES[@]} -gt 0 ]; then
# 	cp "${BACKUP_FILES[@]}" "$DEST_DB_DIR/"
# 	info "Copied ${#BACKUP_FILES[@]} backup file(s) to $DEST_DB_DIR"
# else
# 	warn "No backup files found matching: $BACKUP_GLOB"
# fi

######################################
# 3. Copy logs from volume
######################################

LOGS_SOURCE="$VOLUME_PATH/logs"

if [ -d "$LOGS_SOURCE" ]; then
	info "Copying logs from $LOGS_SOURCE to $DEST_LOGS_DIR..."
	mkdir -p "$DEST_LOGS_DIR"
	# Clear existing logs directory contents to avoid stale files
	rm -rf "$DEST_LOGS_DIR"/*
	cp -r "$LOGS_SOURCE/." "$DEST_LOGS_DIR/"
else
	warn "Logs directory not found in volume: $LOGS_SOURCE"
fi

######################################
# 4. Commit and push changes to main
######################################

info "Checking for changes to commit..."

if git diff --quiet && git diff --cached --quiet; then
	info "No changes detected; nothing to commit or push."
	exit 0
fi

info "Staging changes..."
git add .

TIMESTAMP="$(date '+%Y-%m-%d %H:%M:%S')"
COMMIT_MESSAGE="chore: update DB backups and logs ($TIMESTAMP)"

info "Creating commit..."
git commit -m "$COMMIT_MESSAGE"

info "Pushing to origin/main..."
git push origin main

info "Done."

