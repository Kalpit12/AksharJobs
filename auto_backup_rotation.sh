#!/bin/bash
# Automatic backup rotation script
# Keeps only the latest 3 frontend backups

BACKUP_DIR="/var/www/AksharJobs/frontend"
MAX_BACKUPS=3

echo "🗂️  Automatic Backup Rotation"
echo "================================"
echo "📁 Directory: $BACKUP_DIR"
echo "📊 Max backups to keep: $MAX_BACKUPS"
echo ""

cd "$BACKUP_DIR" || exit 1

# Count current backups
BACKUP_COUNT=$(ls -d build_backup_* 2>/dev/null | wc -l)
echo "📋 Current backups: $BACKUP_COUNT"

if [ "$BACKUP_COUNT" -le "$MAX_BACKUPS" ]; then
    echo "✅ No cleanup needed (backups <= $MAX_BACKUPS)"
    exit 0
fi

# Calculate how many to delete
TO_DELETE=$((BACKUP_COUNT - MAX_BACKUPS))
echo "🗑️  Backups to delete: $TO_DELETE"

# Delete oldest backups
echo ""
echo "Deleting oldest backups..."
ls -dt build_backup_* | tail -n +$((MAX_BACKUPS + 1)) | while read -r backup; do
    echo "  ❌ Deleting: $backup"
    sudo rm -rf "$backup"
done

echo ""
echo "✅ Backup rotation complete!"
echo ""
echo "Remaining backups:"
ls -lht build_backup_* 2>/dev/null | head -5 || echo "No backups found"

