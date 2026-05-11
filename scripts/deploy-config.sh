#!/bin/bash

LOCAL_FILE="./config/roles-permissions.json"
REMOTE_USER="ssni"
REMOTE_HOST="109.123.253.39"
REMOTE_PATH="/home/ssni/.docker/gielcp/config/"

echo "🚀 Uploading file with progress..."

rsync -avh --progress "$LOCAL_FILE" "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}"

if [ $? -eq 0 ]; then
  echo "✅ File successfully transferred!"
else
  echo "❌ Error during file transfer."
fi