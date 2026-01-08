#!/bin/bash
# Helper script to setup GitHub SSH key for EC2 deployment
# This script helps you store your GitHub deploy key in AWS Systems Manager

set -e

KEY_NAME="${1:-irs-response-deploy}"
SSM_PARAM_NAME="/irs-response/github-deploy-key"

echo "=== GitHub SSH Key Setup for EC2 Deployment ==="
echo ""

# Check if key already exists
if [ -f ~/.ssh/${KEY_NAME} ]; then
  echo "⚠️  Key ~/.ssh/${KEY_NAME} already exists"
  read -p "Do you want to use the existing key? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Exiting. Please remove the existing key or use a different name."
    exit 1
  fi
else
  # Generate new SSH key
  echo "Generating new SSH key pair..."
  ssh-keygen -t ed25519 -C "ec2-deploy-key-$(date +%Y%m%d)" -f ~/.ssh/${KEY_NAME} -N ""
  echo "✅ Key generated: ~/.ssh/${KEY_NAME}"
fi

# Display public key
echo ""
echo "=== Public Key (add this to GitHub) ==="
echo ""
cat ~/.ssh/${KEY_NAME}.pub
echo ""
echo ""

# Instructions
echo "=== Next Steps ==="
echo "1. Copy the public key above"
echo "2. Go to: https://github.com/adiluzz/irs-response/settings/keys"
echo "3. Click 'Add deploy key'"
echo "4. Paste the public key"
echo "5. Title: 'EC2 Deploy Key'"
echo "6. Check 'Allow write access' if needed (optional)"
echo "7. Click 'Add key'"
echo ""

read -p "Have you added the key to GitHub? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Please add the key to GitHub and run this script again."
  exit 1
fi

# Store private key in AWS SSM
echo ""
echo "Storing private key in AWS Systems Manager..."
aws ssm put-parameter \
  --name "${SSM_PARAM_NAME}" \
  --value "$(cat ~/.ssh/${KEY_NAME})" \
  --type "SecureString" \
  --description "SSH private key for GitHub repository access" \
  --overwrite

if [ $? -eq 0 ]; then
  echo "✅ Private key stored in AWS SSM Parameter Store"
  echo "   Parameter: ${SSM_PARAM_NAME}"
  echo ""
  echo "⚠️  Important: Keep your private key secure!"
  echo "   The key is now stored in AWS and will be retrieved by EC2 on startup."
else
  echo "❌ Failed to store key in AWS SSM"
  echo "   Make sure AWS CLI is configured and you have permissions."
  exit 1
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Update your terraform.tfvars to use SSH URL:"
echo "  github_repo_url = \"git@github.com:adiluzz/irs-response.git\""
