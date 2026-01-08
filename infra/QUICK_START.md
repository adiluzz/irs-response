# Quick Start Guide - Infrastructure Setup

This is a condensed guide to get you up and running quickly. For detailed instructions, see [terraform/README.md](./terraform/README.md).

## Prerequisites Checklist

- [ ] AWS Account created
- [ ] AWS CLI installed and configured (`aws configure`)
- [ ] Terraform installed (`terraform version`)
- [ ] EC2 Key Pair created in AWS
- [ ] Domain `viseething.com` registered

## Step 1: AWS Setup (5 minutes)

### 1.1 Install AWS CLI
```bash
# Linux
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip && sudo ./aws/install

# Mac
brew install awscli
```

### 1.2 Get AWS Access Keys
1. Go to https://console.aws.amazon.com/
2. IAM → Users → Your User → Security Credentials
3. Create Access Key → CLI
4. Download or copy Access Key ID and Secret

### 1.3 Configure AWS CLI
```bash
aws configure
# Enter: Access Key ID, Secret Key, Region (e.g., us-east-1), Format (json)
```

### 1.4 Create EC2 Key Pair
```bash
aws ec2 create-key-pair --key-name irs-response-key --query 'KeyMaterial' --output text > ~/.ssh/irs-response-key.pem
chmod 400 ~/.ssh/irs-response-key.pem
```

## Step 2: GitHub Access Setup (Choose One)

### Option A: Public Repository (Easiest)
If your repo is public, skip this step.

### Option B: SSH Key (Recommended for Private Repos)
```bash
cd infra/scripts
./setup-github-ssh.sh
```
Follow the prompts to add the key to GitHub.

### Option C: Personal Access Token
```bash
cd infra/scripts
./setup-github-token.sh
```
Follow the prompts to create and store a GitHub token.

## Step 3: Terraform Configuration (2 minutes)

```bash
cd infra/terraform
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars`:
```hcl
aws_region = "us-east-1"
ssh_key_name = "irs-response-key"
domain_name = "viseething.com"

# Generate with: openssl rand -base64 32
nextauth_secret = "YOUR_SECRET_HERE"

mongodb_admin_pass = "STRONG_PASSWORD_HERE"
email_user = "your-email@gmail.com"
email_password = "your-gmail-app-password"
```

## Step 4: Deploy Infrastructure (5 minutes)

```bash
cd infra/terraform
terraform init
terraform plan    # Review what will be created
terraform apply   # Type 'yes' when prompted
```

**Save the Elastic IP** from the output:
```bash
terraform output elastic_ip
```

## Step 5: Configure Domain DNS (5 minutes)

1. Log into your domain registrar (GoDaddy, Namecheap, etc.)
2. Go to DNS Management
3. Add these records:

   **A Record:**
   - Name: `@` (or leave blank)
   - Value: `[Elastic IP from Step 4]`
   - TTL: `3600`

   **A Record:**
   - Name: `www`
   - Value: `[Elastic IP from Step 4]`
   - TTL: `3600`

4. Wait 5-15 minutes for DNS propagation
5. Verify: `dig viseething.com +short` (should return your IP)

## Step 6: Setup SSL Certificate (2 minutes)

```bash
# SSH into your server
ssh -i ~/.ssh/irs-response-key.pem ec2-user@[YOUR_ELASTIC_IP]

# Run SSL setup
sudo /opt/setup-ssl.sh
```

## Step 7: Verify Deployment

Visit: `https://viseething.com`

You should see your application!

## Common Issues

### "Could not resolve host: github.com"
- Check internet connectivity
- Verify security group allows outbound traffic

### "Permission denied (publickey)"
- Verify EC2 key pair name matches `terraform.tfvars`
- Check key file permissions: `chmod 400 ~/.ssh/irs-response-key.pem`

### DNS not resolving
- Wait longer (can take up to 48 hours)
- Check DNS records are correct
- Verify Elastic IP is correct

### SSL certificate fails
- Ensure DNS is pointing to correct IP
- Check port 80 is accessible
- Verify domain name is correct

## Next Steps

- **Update application**: SSH and run `sudo /opt/update-app.sh`
- **View logs**: `pm2 logs irs-response`
- **Monitor**: Check AWS CloudWatch for metrics

## Cost Estimate

- **EC2 t3.medium**: ~$30/month
- **Data transfer**: ~$0-10/month (first 100GB free)
- **Total**: ~$30-40/month

## Need Help?

See the detailed [terraform/README.md](./terraform/README.md) for:
- Detailed explanations
- Troubleshooting guide
- Security best practices
- Advanced configuration
