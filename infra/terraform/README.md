# Infrastructure as Code - IRS Response Application

This Terraform configuration deploys the IRS Response application on AWS EC2 with:
- Next.js application server
- MongoDB database
- Nginx reverse proxy
- SSL/TLS certificates (Let's Encrypt)
- GitHub integration for deployments

## Prerequisites

### 1. AWS Account Setup

1. **Create an AWS Account** (if you don't have one)
   - Go to https://aws.amazon.com/
   - Sign up for an account
   - Complete the registration process

2. **Install AWS CLI**
   ```bash
   # On Linux/Mac
   curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
   unzip awscliv2.zip
   sudo ./aws/install

   # On Mac with Homebrew
   brew install awscli

   # Verify installation
   aws --version
   ```

3. **Configure AWS Credentials**
   ```bash
   aws configure
   ```
   You'll need:
   - **AWS Access Key ID**: Get from AWS Console → IAM → Users → Your User → Security Credentials → Create Access Key
   - **AWS Secret Access Key**: Same location as above
   - **Default region**: e.g., `us-east-1`
   - **Default output format**: `json`

   **How to get AWS Access Keys:**
   1. Log into AWS Console
   2. Go to IAM (Identity and Access Management)
   3. Click "Users" → Your username (or create a new user)
   4. Go to "Security credentials" tab
   5. Click "Create access key"
   6. Choose "Command Line Interface (CLI)"
   7. Download or copy the Access Key ID and Secret Access Key

4. **Create EC2 Key Pair**
   ```bash
   # Option 1: Using AWS CLI
   aws ec2 create-key-pair --key-name irs-response-key --query 'KeyMaterial' --output text > ~/.ssh/irs-response-key.pem
   chmod 400 ~/.ssh/irs-response-key.pem

   # Option 2: Using AWS Console
   # Go to EC2 → Key Pairs → Create key pair
   # Name: irs-response-key
   # Type: RSA
   # Format: .pem
   # Download and save to ~/.ssh/
   ```

### 2. GitHub Access Setup

The EC2 instance needs to clone your repository. Choose one of these methods:

#### Option A: Public Repository (Easiest)
If your repository is public, no additional setup is needed. The user-data script will clone it using HTTPS.

#### Option B: Private Repository - SSH Key (Recommended)

1. **Generate SSH Key on Your Local Machine**
   ```bash
   ssh-keygen -t ed25519 -C "ec2-deploy-key" -f ~/.ssh/irs-response-deploy
   ```

2. **Add Public Key to GitHub**
   - Go to your GitHub repository: https://github.com/adiluzz/irs-response
   - Settings → Deploy keys → Add deploy key
   - Title: `EC2 Deploy Key`
   - Key: Copy contents of `~/.ssh/irs-response-deploy.pub`
   - Check "Allow write access" if you want to push from EC2 (optional)
   - Click "Add key"

3. **Store Private Key in AWS Systems Manager Parameter Store**
   ```bash
   aws ssm put-parameter \
     --name "/irs-response/github-deploy-key" \
     --value "$(cat ~/.ssh/irs-response-deploy)" \
     --type "SecureString" \
     --description "SSH private key for GitHub repository access"
   ```

4. **Update user-data.sh** to retrieve the key:
   ```bash
   # Add this to user-data.sh before git clone:
   mkdir -p /home/ec2-user/.ssh
   aws ssm get-parameter --name "/irs-response/github-deploy-key" --with-decryption --query 'Parameter.Value' --output text > /home/ec2-user/.ssh/id_ed25519
   chmod 600 /home/ec2-user/.ssh/id_ed25519
   chown ec2-user:ec2-user /home/ec2-user/.ssh/id_ed25519
   echo "github.com ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOMqqnkVzrm0SdG6UOoqKLsabgH5C9okWi0dh2l9GKJl" >> /home/ec2-user/.ssh/known_hosts
   ```

#### Option C: Private Repository - Personal Access Token

1. **Create GitHub Personal Access Token**
   - Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Generate new token (classic)
   - Name: `EC2 Deploy Token`
   - Scopes: `repo` (full control of private repositories)
   - Generate and copy the token

2. **Store Token in AWS Systems Manager Parameter Store**
   ```bash
   aws ssm put-parameter \
     --name "/irs-response/github-token" \
     --value "YOUR_GITHUB_TOKEN" \
     --type "SecureString" \
     --description "GitHub personal access token"
   ```

3. **Update user-data.sh** to use token:
   ```bash
   # Add this to user-data.sh before git clone:
   GITHUB_TOKEN=$(aws ssm get-parameter --name "/irs-response/github-token" --with-decryption --query 'Parameter.Value' --output text)
   git clone -b ${github_branch} https://${GITHUB_TOKEN}@github.com/adiluzz/irs-response.git .
   ```

### 3. Install Terraform

```bash
# On Linux
wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update && sudo apt install terraform

# On Mac
brew install terraform

# Verify installation
terraform version
```

## Configuration

1. **Copy the example variables file:**
   ```bash
   cd infra/terraform
   cp terraform.tfvars.example terraform.tfvars
   ```

2. **Edit `terraform.tfvars`** with your values:
   ```hcl
   aws_region = "us-east-1"
   ssh_key_name = "irs-response-key"  # Your EC2 key pair name
   domain_name = "viseething.com"
   
   # Generate NextAuth secret:
   # openssl rand -base64 32
   nextauth_secret = "your-generated-secret-here"
   
   mongodb_admin_pass = "your-strong-password-here"
   email_user = "your-email@gmail.com"
   email_password = "your-gmail-app-password"
   ```

## Deployment

1. **Initialize Terraform:**
   ```bash
   cd infra/terraform
   terraform init
   ```

2. **Review the plan:**
   ```bash
   terraform plan
   ```

3. **Apply the configuration:**
   ```bash
   terraform apply
   ```
   Type `yes` when prompted.

4. **Get the Elastic IP:**
   ```bash
   terraform output elastic_ip
   ```
   Save this IP address - you'll need it for DNS configuration.

## Domain Configuration

### Step 1: Get Your Elastic IP

After Terraform completes, get the Elastic IP:
```bash
cd infra/terraform
terraform output elastic_ip
```

### Step 2: Configure DNS Records

Go to your domain registrar (where you purchased `viseething.com`) and add these DNS records:

#### Option A: Using A Record (Recommended)

1. Log into your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.)
2. Navigate to DNS Management
3. Add/Edit these records:

   **Type: A**
   - **Name/Host**: `@` (or leave blank, or `viseething.com`)
   - **Value/Points to**: `[Your Elastic IP from terraform output]`
   - **TTL**: `3600` (or default)

   **Type: A**
   - **Name/Host**: `www`
   - **Value/Points to**: `[Your Elastic IP from terraform output]`
   - **TTL**: `3600` (or default)

#### Option B: Using CNAME (Alternative)

If your registrar doesn't support A records or you prefer CNAME:

   **Type: CNAME**
   - **Name/Host**: `www`
   - **Value/Points to**: `viseething.com`
   - **TTL**: `3600`

   (The A record for the root domain is still required)

### Step 3: Wait for DNS Propagation

DNS changes can take anywhere from a few minutes to 48 hours to propagate. You can check propagation status:
- https://www.whatsmydns.net/
- https://dnschecker.org/

### Step 4: Verify DNS is Working

Once DNS has propagated, verify:
```bash
# Check A record
dig viseething.com +short
# Should return your Elastic IP

# Check www subdomain
dig www.viseething.com +short
# Should return your Elastic IP
```

### Step 5: Setup SSL Certificate

SSH into your EC2 instance and run:
```bash
ssh -i ~/.ssh/irs-response-key.pem ec2-user@[YOUR_ELASTIC_IP]
sudo /opt/setup-ssl.sh
```

This will:
- Request SSL certificate from Let's Encrypt
- Configure nginx with SSL
- Setup automatic certificate renewal

## Post-Deployment

### Accessing the Server

```bash
ssh -i ~/.ssh/irs-response-key.pem ec2-user@[YOUR_ELASTIC_IP]
```

### Updating the Application

SSH into the server and run:
```bash
sudo /opt/update-app.sh
```

This will:
- Pull latest changes from GitHub
- Install dependencies
- Rebuild the application
- Restart the service

### Monitoring

- **Application logs**: `pm2 logs irs-response`
- **Nginx logs**: `sudo tail -f /var/log/nginx/irs-response-*.log`
- **MongoDB logs**: `sudo tail -f /var/log/mongodb/mongod.log`
- **System status**: `pm2 status`

### Useful Commands

```bash
# Restart application
pm2 restart irs-response

# View application logs
pm2 logs irs-response

# Check nginx status
sudo systemctl status nginx

# Check MongoDB status
sudo systemctl status mongod

# Connect to MongoDB
mongosh -u admin -p [password] --authenticationDatabase admin
```

## Troubleshooting

### Application not accessible
1. Check security group allows ports 80 and 443
2. Verify nginx is running: `sudo systemctl status nginx`
3. Check application is running: `pm2 status`
4. Review logs: `pm2 logs irs-response`

### SSL certificate issues
1. Ensure DNS is pointing to the correct IP
2. Check port 80 is accessible (required for Let's Encrypt)
3. Review certbot logs: `sudo journalctl -u certbot.timer`

### MongoDB connection issues
1. Verify MongoDB is running: `sudo systemctl status mongod`
2. Check MongoDB logs: `sudo tail -f /var/log/mongodb/mongod.log`
3. Verify connection string in `.env.production`

## Cost Estimation

Approximate monthly costs (us-east-1):
- **t3.medium EC2**: ~$30/month
- **Elastic IP**: Free (when attached to running instance)
- **Data transfer**: ~$0.09/GB (first 100GB free)
- **Total**: ~$30-50/month depending on traffic

## Security Notes

- Change default MongoDB passwords
- Keep SSH key secure (chmod 400)
- Regularly update system packages
- Monitor application logs for suspicious activity
- Consider setting up CloudWatch alarms
- Enable AWS GuardDuty for threat detection

## Cleanup

To destroy all resources:
```bash
cd infra/terraform
terraform destroy
```

**Warning**: This will delete all resources including the database. Make sure to backup data first!
