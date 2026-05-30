#!/usr/bin/env bash

# Namokriti International Foundation (NIF)
# Production MongoDB Automated Backup Script (Docker-based)
#
# This script dumps the database from the running MongoDB container,
# compresses it, saves it to a designated host directory, and maintains
# a rolling 7-day retention policy.

# Exit immediately if a command exits with a non-zero status
set -euo pipefail

# ─── CONFIGURATION ──────────────────────────────────────────────────────────
BACKUP_DIR="${BACKUP_DIR:-/var/backups/mongodb}"
RETENTION_DAYS=7
CONTAINER_NAME="nif-mongodb"
LOG_FILE="/var/log/mongodb-backup.log"
DATE_STR=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/nif-backup-${DATE_STR}.gz"

# ─── LOGGING HELPER ─────────────────────────────────────────────────────────
log() {
    local level="$1"
    local message="$2"
    local timestamp
    timestamp=$(date +"%Y-%m-%d %H:%M:%S")
    local log_msg="[${timestamp}] [${level}] ${message}"
    
    echo "${log_msg}"
    
    # Write to log file if writable
    if [ -w "$(dirname "${LOG_FILE}")" ] || [ ! -f "${LOG_FILE}" -a -w "$(dirname "${LOG_FILE}")" ]; then
        echo "${log_msg}" >> "${LOG_FILE}"
    fi
}

# ─── INITIALIZATION & VALIDATION ───────────────────────────────────────────
log "INFO" "Starting automated database backup process..."

# Ensure backup directory exists
if [ ! -d "${BACKUP_DIR}" ]; then
    log "INFO" "Creating backup directory: ${BACKUP_DIR}"
    mkdir -p "${BACKUP_DIR}"
fi

# Ensure docker is installed
if ! command -v docker &> /dev/null; then
    log "ERROR" "Docker command-line tool is not installed or not in PATH."
    exit 1
fi

# Verify MongoDB container is running
if ! docker ps --filter "name=${CONTAINER_NAME}" --filter "status=running" --format '{{.Names}}' | grep -Eq "^${CONTAINER_NAME}$"; then
    log "ERROR" "MongoDB container '${CONTAINER_NAME}' is not running."
    exit 1
fi

# ─── EXECUTE BACKUP ─────────────────────────────────────────────────────────
log "INFO" "Streaming mongodump from container '${CONTAINER_NAME}'..."

if docker exec -t "${CONTAINER_NAME}" mongodump --archive --gzip > "${BACKUP_FILE}"; then
    log "SUCCESS" "Database backup created successfully: ${BACKUP_FILE}"
    
    # Secure the backup file permissions (Read-only for owner/root)
    chmod 600 "${BACKUP_FILE}"
else
    log "ERROR" "Failed to dump database from container."
    # Clean up empty/corrupt file if created
    rm -f "${BACKUP_FILE}"
    exit 1
fi

# ─── CLEANUP (RETENTION POLICY) ─────────────────────────────────────────────
log "INFO" "Enforcing ${RETENTION_DAYS}-day backup retention policy..."

# Count files before deleting
OLD_BACKUPS=$(find "${BACKUP_DIR}" -type f -name "nif-backup-*.gz" -mtime +"${RETENTION_DAYS}")

if [ -n "${OLD_BACKUPS}" ]; then
    echo "${OLD_BACKUPS}" | while read -r old_file; do
        if [ -f "${old_file}" ]; then
            rm -f "${old_file}"
            log "INFO" "Deleted stale backup file: ${old_file}"
        fi
    done
    log "INFO" "Retention cleanup completed."
else
    log "INFO" "No backups older than ${RETENTION_DAYS} days found. Retention is clean."
fi

log "SUCCESS" "MongoDB automated backup job completed successfully."
