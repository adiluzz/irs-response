# Infrastructure Documentation

This directory contains the infrastructure as code (IaC) for deploying the IRS Response application.

## Directory Structure

```
infra/
├── terraform/
│   ├── main.tf              # Main Terraform configuration
│   ├── variables.tf          # Variable definitions
│   ├── outputs.tf            # Output values
│   ├── user-data.sh          # EC2 initialization script
│   ├── terraform.tfvars.example  # Example configuration
│   └── README.md             # Detailed setup instructions
└── README.md                 # This file
```

## Quick Start

1. **Prerequisites**: See [terraform/README.md](./terraform/README.md) for detailed setup instructions
   - AWS account with credentials configured
   - EC2 Key Pair created
   - GitHub access configured (for private repos)
   - Terraform installed

2. **Configure**:
   ```bash
   cd terraform
   cp terraform.tfvars.example terraform.tfvars
   # Edit terraform.tfvars with your values
   ```

3. **Deploy**:
   ```bash
   terraform init
   terraform plan
   terraform apply
   ```

4. **Configure Domain**:
   - Get Elastic IP from `terraform output elastic_ip`
   - Add A records in your DNS provider pointing to this IP
   - Wait for DNS propagation
   - SSH into server and run `sudo /opt/setup-ssl.sh`

## What Gets Deployed

- **EC2 Instance**: Amazon Linux 2023 with t3.medium instance type
- **Security Group**: Allows HTTP (80), HTTPS (443), and SSH (22)
- **Elastic IP**: Static IP address for the instance
- **MongoDB**: Installed and configured on the instance
- **Nginx**: Reverse proxy with SSL/TLS support
- **PM2**: Process manager for the Node.js application
- **Let's Encrypt**: SSL certificate automation

## Documentation

For detailed instructions, see [terraform/README.md](./terraform/README.md)
