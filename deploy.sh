#!/bin/bash
# Deployment script for IRS Response application
# This script pulls the latest changes and restarts the application on the server

set -e

# Configuration - Update these with your server details
SERVER_USER="${DEPLOY_USER:-ec2-user}"
SERVER_HOST="${DEPLOY_HOST:-}"
APP_DIR="${APP_DIR:-/opt/irs-response}"
SSH_KEY="${SSH_KEY:-~/.ssh/irs-response-key.pem}"

if [ -z "$SERVER_HOST" ]; then
  echo "Error: DEPLOY_HOST environment variable not set"
  echo "Usage: DEPLOY_HOST=your-server-ip ./deploy.sh"
  exit 1
fi

echo "🚀 Deploying to server: $SERVER_HOST"
echo "📁 Application directory: $APP_DIR"

# SSH into server and deploy
ssh -i "$SSH_KEY" "$SERVER_USER@$SERVER_HOST" << 'ENDSSH'
set -e
cd /opt/irs-response

echo "📥 Pulling latest changes from master branch..."
git fetch origin
git checkout master
git pull origin master

echo "📦 Installing/updating dependencies..."
npm install --production

echo "🔄 Restarting application with PM2..."
pm2 restart all || pm2 start npm --name "irs-response" -- start

echo "✅ Deployment complete!"
echo "📊 Application status:"
pm2 status

echo "📝 Recent logs:"
pm2 logs --lines 10 --nostream
ENDSSH

echo "✅ Deployment to $SERVER_HOST completed successfully!"
