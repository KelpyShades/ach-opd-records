#!/bin/bash
# Simple PostgreSQL backup script for Linux/WSL

# Configuration
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="$(dirname "$0")/backups"
CONTAINER_NAME="supabase-db"
DB_USER="postgres"
DB_NAME="postgres"

# Create backup directory
mkdir -p "$BACKUP_DIR"

echo "Starting backup at $(date)"

# Create backup
docker exec "$CONTAINER_NAME" pg_dump -U "$DB_USER" "$DB_NAME" | \
    gzip > "$BACKUP_DIR/backup_$TIMESTAMP.sql.gz"

# Check if backup was successful
if [ $? -eq 0 ]; then
    echo "✅ Backup created: backup_$TIMESTAMP.sql.gz"
    echo "   Size: $(du -h "$BACKUP_DIR/backup_$TIMESTAMP.sql.gz" | cut -f1)"
else
    echo "❌ Backup failed!"
    exit 1
fi

# Delete backups older than 30 days
find "$BACKUP_DIR" -name "backup_*.sql.gz" -mtime +30 -delete

echo "Done!"

# # Make executable
# chmod +x backup-database.sh

# # Test it
# ./backup-database.sh

# # Schedule it (run daily at 2 AM)
# crontab -e
# # Add this line:
# 0 2 * * * C:\Users\Ryo\Documents\GitHub\ach-server\backup-database.sh