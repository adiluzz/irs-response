#!/bin/bash
# Helper script to setup GitHub Personal Access Token for EC2 deployment
# This script helps you store your GitHub token in AWS Systems Manager

set -e

SSM_PARAM_NAME="/irs-response/github-token"

echo "=== GitHub Personal Access Token Setup for EC2 Deployment ==="
echo ""

echo "To create a GitHub Personal Access Token:"
echo "1. Go to: https://github.com/settings/tokens"
echo "2. Click 'Generate new token' → 'Generate new token (classic)'"
echo "3. Name: 'EC2 Deploy Token'"
echo "4. Expiration: Choose your preference"
echo "5. Scopes: Check 'repo' (Full control of private repositories)"
echo "6. Click 'Generate token'"
echo "7. Copy the token (you won't see it again!)"
echo ""

read -p "Enter your GitHub Personal Access Token: " -s GITHUB_TOKEN
echo ""

if [ -z "$GITHUB_TOKEN" ]; then
  echo "❌ Token cannot be empty"
  exit 1
fi

# Store token in AWS SSM
echo ""
echo "Storing token in AWS Systems Manager..."
aws ssm put-parameter \
  --name "${SSM_PARAM_NAME}" \
  --value "${GITHUB_TOKEN}" \
  --type "SecureString" \
  --description "GitHub personal access token for repository access" \
  --overwrite

if [ $? -eq 0 ]; then
  echo "✅ Token stored in AWS SSM Parameter Store"
  echo "   Parameter: ${SSM_PARAM_NAME}"
  echo ""
  echo "⚠️  Important: Keep your token secure!"
  echo "   The token is now stored in AWS and will be retrieved by EC2 on startup."
else
  echo "❌ Failed to store token in AWS SSM"
  echo "   Make sure AWS CLI is configured and you have permissions."
  exit 1
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "You can now use HTTPS URL in terraform.tfvars:"
echo "  github_repo_url = \"https://github.com/adiluzz/irs-response.git\""
