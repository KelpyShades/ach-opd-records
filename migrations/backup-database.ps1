# Simple PostgreSQL backup script for Windows

# Configuration
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = "$PSScriptRoot\backups"
$containerName = "supabase-db"
$dbUser = "postgres"
$dbName = "postgres"

# Create backup directory
New-Item -ItemType Directory -Force -Path $backupDir | Out-Null

Write-Host "Starting backup at $(Get-Date)"

# Create backup
$backupFile = "$backupDir\backup_$timestamp.sql"
docker exec $containerName pg_dump -U $dbUser $dbName | Out-File -FilePath $backupFile -Encoding UTF8

# Compress the backup
Compress-Archive -Path $backupFile -DestinationPath "$backupFile.zip" -Force
Remove-Item $backupFile

# Check if backup was successful
if (Test-Path "$backupFile.zip") {
    $size = (Get-Item "$backupFile.zip").Length / 1MB
    Write-Host "✅ Backup created: backup_$timestamp.sql.zip"
    Write-Host "   Size: $([math]::Round($size, 2)) MB"
} else {
    Write-Host "❌ Backup failed!"
    exit 1
}

# Delete backups older than 30 days
$cutoffDate = (Get-Date).AddDays(-30)
Get-ChildItem -Path $backupDir -Filter "backup_*.zip" | 
    Where-Object { $_.LastWriteTime -lt $cutoffDate } | 
    Remove-Item -Force

Write-Host "Done!"


# # Allow script execution (run PowerShell as Admin)
# Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

# # Test it
# .\backup-database.ps1

# # Schedule it (run daily at 2 AM, as Admin)
# $action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-File C:\Users\Ryo\Documents\GitHub\ach-server\backup-database.ps1"
# $trigger = New-ScheduledTaskTrigger -Daily -At 2AM
# Register-ScheduledTask -TaskName "Database Backup" -Action $action -Trigger $trigger