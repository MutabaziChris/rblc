#!/bin/bash
# Run this script on your AOS server after git pull to rebuild and restart
set -e
echo "Building..."
npm install
npm run build
echo "Restarting PM2..."
pm2 restart rblc
echo "Done."
