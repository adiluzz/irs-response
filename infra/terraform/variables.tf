variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "irs-response"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.medium"
}

variable "ssh_key_name" {
  description = "Name of the AWS EC2 Key Pair to use for SSH access"
  type        = string
}

variable "domain_name" {
  description = "Domain name for the application"
  type        = string
  default     = "viseething.com"
}

variable "github_repo_url" {
  description = "GitHub repository URL (HTTPS or SSH)"
  type        = string
  default     = "https://github.com/adiluzz/irs-response.git"
}

variable "github_branch" {
  description = "GitHub branch to deploy"
  type        = string
  default     = "main"
}

variable "mongodb_admin_user" {
  description = "MongoDB admin username"
  type        = string
  default     = "admin"
  sensitive   = true
}

variable "mongodb_admin_pass" {
  description = "MongoDB admin password"
  type        = string
  sensitive   = true
}

variable "nextauth_secret" {
  description = "NextAuth secret for JWT signing"
  type        = string
  sensitive   = true
}

variable "email_host" {
  description = "SMTP email host"
  type        = string
  default     = "smtp.gmail.com"
}

variable "email_port" {
  description = "SMTP email port"
  type        = string
  default     = "587"
}

variable "email_user" {
  description = "SMTP email username"
  type        = string
  sensitive   = true
}

variable "email_password" {
  description = "SMTP email password"
  type        = string
  sensitive   = true
}

variable "email_from" {
  description = "Email from address"
  type        = string
  default     = "noreply@viseething.com"
}
