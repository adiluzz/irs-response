#!/bin/bash
# Manual SSL setup script for EC2 instance
# Run this on the server if the automated setup didn't complete

set -e

DOMAIN="viseething.com"
EMAIL="admin@viseething.com"

echo "=== Installing required packages ==="
sudo yum update -y
sudo yum install -y nginx certbot python3-certbot-nginx

echo "=== Starting nginx ==="
sudo systemctl enable nginx
sudo systemctl start nginx

echo "=== Configuring nginx (temporary HTTP config) ==="
sudo tee /etc/nginx/conf.d/irs-response.conf > /dev/null <<'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name viseething.com www.viseething.com;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

sudo nginx -t
sudo systemctl reload nginx

echo "=== Getting SSL certificate ==="
sudo certbot --nginx \
  --non-interactive \
  --agree-tos \
  --email $EMAIL \
  -d $DOMAIN \
  -d www.$DOMAIN

echo "=== Setting up auto-renewal ==="
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

echo "=== SSL setup complete! ==="
echo "Your site should now be available at https://$DOMAIN"
