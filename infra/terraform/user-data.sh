#!/bin/bash
set -e

# Update system
yum update -y

# Install required packages
yum install -y \
  git \
  nodejs \
  npm \
  nginx \
  mongodb-org \
  certbot \
  python3-certbot-nginx \
  htop \
  unzip

# Install Node.js 20.x (if not already installed)
if ! command -v node &> /dev/null || [ "$(node -v | cut -d'v' -f2 | cut -d'.' -f1)" -lt "20" ]; then
  curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
  yum install -y nodejs
fi

# Install PM2 for process management
npm install -g pm2

# Create application directory
APP_DIR="/opt/irs-response"
mkdir -p $APP_DIR
cd $APP_DIR

# Clone the repository
# For private repos, you can use SSH or a GitHub token stored in AWS SSM
# Option 1: Public repo or HTTPS with token
if [[ "${github_repo_url}" == *"github.com"* ]] && [[ "${github_repo_url}" == *"https"* ]]; then
  # Try to get GitHub token from SSM if available
  GITHUB_TOKEN=$(aws ssm get-parameter --name "/irs-response/github-token" --with-decryption --query 'Parameter.Value' --output text 2>/dev/null || echo "")
  if [ -n "$GITHUB_TOKEN" ] && [ "$GITHUB_TOKEN" != "None" ]; then
    # Use token for private repo
    REPO_URL=$(echo "${github_repo_url}" | sed "s|https://|https://$GITHUB_TOKEN@|")
    git clone -b ${github_branch} "$REPO_URL" .
  else
    # Public repo or no token
    git clone -b ${github_branch} ${github_repo_url} .
  fi
else
  # SSH URL - setup SSH key if available
  mkdir -p /home/ec2-user/.ssh
  chmod 700 /home/ec2-user/.ssh
  
  # Try to get SSH key from SSM
  SSH_KEY=$(aws ssm get-parameter --name "/irs-response/github-deploy-key" --with-decryption --query 'Parameter.Value' --output text 2>/dev/null || echo "")
  if [ -n "$SSH_KEY" ] && [ "$SSH_KEY" != "None" ]; then
    echo "$SSH_KEY" > /home/ec2-user/.ssh/id_ed25519
    chmod 600 /home/ec2-user/.ssh/id_ed25519
    chown ec2-user:ec2-user /home/ec2-user/.ssh/id_ed25519
    echo "github.com ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOMqqnkVzrm0SdG6UOoqKLsabgH5C9okWi0dh2l9GKJl" >> /home/ec2-user/.ssh/known_hosts
    chown ec2-user:ec2-user /home/ec2-user/.ssh/known_hosts
    GIT_SSH_COMMAND="ssh -i /home/ec2-user/.ssh/id_ed25519" git clone -b ${github_branch} ${github_repo_url} .
  else
    git clone -b ${github_branch} ${github_repo_url} .
  fi
fi

# Install dependencies
npm install --production

# Configure MongoDB
cat > /etc/mongod.conf <<EOF
storage:
  dbPath: /var/lib/mongo
  journal:
    enabled: true

systemLog:
  destination: file
  logAppend: true
  path: /var/log/mongodb/mongod.log

net:
  port: 27017
  bindIp: 127.0.0.1

security:
  authorization: enabled
EOF

# Start MongoDB
systemctl enable mongod
systemctl start mongod

# Wait for MongoDB to start
sleep 5

# Create MongoDB admin user
mongosh admin --eval "
db.createUser({
  user: '${mongodb_admin_user}',
  pwd: '${mongodb_admin_pass}',
  roles: [{ role: 'root', db: 'admin' }]
})
" || echo "Admin user may already exist"

# Create application database and user
mongosh admin -u ${mongodb_admin_user} -p ${mongodb_admin_pass} --authenticationDatabase admin --eval "
use taxletters
db.createUser({
  user: 'taxletters',
  pwd: '${mongodb_admin_pass}',
  roles: [{ role: 'readWrite', db: 'taxletters' }]
})
" || echo "Database user may already exist"

# Create environment file
cat > $APP_DIR/.env.production <<EOF
# Database Configuration
MONGODB_URI=mongodb://taxletters:${mongodb_admin_pass}@localhost:27017/taxletters?authSource=taxletters

# NextAuth Configuration
NEXTAUTH_URL=${nextauth_url}
NEXTAUTH_SECRET=${nextauth_secret}

# Email SMTP Configuration
EMAIL_HOST=${email_host}
EMAIL_PORT=${email_port}
EMAIL_USER=${email_user}
EMAIL_PASSWORD=${email_password}
EMAIL_FROM=${email_from}
EMAIL_FROM_NAME=Tax Letters System

# Node Environment
NODE_ENV=production
EOF

# Build the Next.js application
cd $APP_DIR
npm run build

# Configure nginx
cat > /etc/nginx/conf.d/irs-response.conf <<EOF
# Rate limiting
limit_req_zone \$binary_remote_addr zone=api_limit:10m rate=10r/s;
limit_req_zone \$binary_remote_addr zone=general_limit:10m rate=30r/s;

# Upstream for Next.js
upstream nextjs {
    server 127.0.0.1:3001;
    keepalive 64;
}

# HTTP server - redirect to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name ${domain_name} www.${domain_name};

    # For Let's Encrypt
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://\$server_name\$request_uri;
    }
}

# HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ${domain_name} www.${domain_name};

    # SSL certificates (will be configured by certbot)
    ssl_certificate /etc/letsencrypt/live/${domain_name}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/${domain_name}/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Logging
    access_log /var/log/nginx/irs-response-access.log;
    error_log /var/log/nginx/irs-response-error.log;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/rss+xml font/truetype font/opentype application/vnd.ms-fontobject image/svg+xml;

    # Client body size
    client_max_body_size 10M;

    # API routes with rate limiting
    location /api/ {
        limit_req zone=api_limit burst=20 nodelay;
        proxy_pass http://nextjs;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Static files
    location /_next/static/ {
        proxy_pass http://nextjs;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # All other requests
    location / {
        limit_req zone=general_limit burst=50 nodelay;
        proxy_pass http://nextjs;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Create PM2 ecosystem file
cat > $APP_DIR/ecosystem.config.js <<EOF
module.exports = {
  apps: [{
    name: 'irs-response',
    script: 'node_modules/.bin/next',
    args: 'start -p 3001',
    cwd: '$APP_DIR',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: '3001',
      NEXTAUTH_URL: '${nextauth_url}',
      MONGODB_URI: 'mongodb://localhost:27017/taxletters',
      NEXTAUTH_SECRET: '${nextauth_secret}',
      EMAIL_HOST: '${email_host}',
      EMAIL_PORT: '${email_port}',
      EMAIL_USER: '${email_user}',
      EMAIL_PASSWORD: '${email_password}',
      EMAIL_FROM: '${email_from}',
      EMAIL_FROM_NAME: 'Tax Letters System'
    },
    error_file: '/var/log/pm2/irs-response-error.log',
    out_file: '/var/log/pm2/irs-response-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_memory_restart: '1G',
    watch: false
  }]
};
EOF

# Create PM2 log directory
mkdir -p /var/log/pm2

# Start the application with PM2
cd $APP_DIR
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd -u ec2-user --hp /home/ec2-user

# Start nginx (but don't enable yet - wait for SSL)
systemctl start nginx

# Create a script to setup SSL after DNS is configured
cat > /opt/setup-ssl.sh <<'SCRIPT_EOF'
#!/bin/bash
DOMAIN="${domain_name}"
EMAIL="admin@${domain_name}"

# Stop nginx temporarily for certbot
systemctl stop nginx

# Get SSL certificate
certbot certonly --standalone \
  --non-interactive \
  --agree-tos \
  --email $EMAIL \
  -d $DOMAIN \
  -d www.$DOMAIN

# Start nginx
systemctl enable nginx
systemctl start nginx

# Setup auto-renewal
systemctl enable certbot.timer
systemctl start certbot.timer
SCRIPT_EOF

chmod +x /opt/setup-ssl.sh

# Create update script
cat > /opt/update-app.sh <<'UPDATE_EOF'
#!/bin/bash
set -e
APP_DIR="/opt/irs-response"
cd $APP_DIR

# Pull latest changes
git pull origin ${github_branch}

# Install dependencies
npm install --production

# Build application
npm run build

# Restart application
pm2 restart irs-response

echo "Application updated successfully"
UPDATE_EOF

chmod +x /opt/update-app.sh

# Setup log rotation
cat > /etc/logrotate.d/irs-response <<EOF
/var/log/pm2/*.log {
    daily
    rotate 7
    compress
    delaycompress
    notifempty
    missingok
    create 0640 ec2-user ec2-user
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
EOF

# Final message
echo "Setup complete! Next steps:"
echo "1. Point your domain ${domain_name} to $(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
echo "2. Run: /opt/setup-ssl.sh to configure SSL"
echo "3. Your application will be available at https://${domain_name}"
