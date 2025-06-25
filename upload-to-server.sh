#!/bin/bash

echo "📤 Uploading egde-fx website to Digital Ocean server..."
echo "🔑 You will be prompted for the server password"

# Upload project files to server
rsync -avz --progress \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude 'venv' \
    --exclude 'dist' \
    --exclude '__pycache__' \
    --exclude '*.pyc' \
    --exclude '.env' \
    ./ root@165.232.183.241:/var/www/egdefx_website/

echo "✅ Upload completed!"
echo ""
echo "📋 Next steps:"
echo "1. In your SSH session to the server, run:"
echo "   cd /var/www/egdefx_website"
echo "2. Follow the DEPLOYMENT_GUIDE.md for the remaining steps"
