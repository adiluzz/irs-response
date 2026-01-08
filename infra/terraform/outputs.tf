output "instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.app_server.id
}

output "instance_public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_eip.app_eip.public_ip
}

output "instance_public_dns" {
  description = "Public DNS name of the EC2 instance"
  value       = aws_instance.app_server.public_dns
}

output "elastic_ip" {
  description = "Elastic IP address (use this for your domain A record)"
  value       = aws_eip.app_eip.public_ip
}

output "ssh_command" {
  description = "Command to SSH into the instance"
  value       = "ssh -i ~/.ssh/${var.ssh_key_name}.pem ec2-user@${aws_eip.app_eip.public_ip}"
}

output "nameservers" {
  description = "Route53 nameservers for the domain"
  value       = aws_route53_zone.main.name_servers
}

output "domain_setup_instructions" {
  description = "Instructions for setting up the domain"
  value = <<-EOT
    Configure your nameservers in Namecheap:
    
    Go to Namecheap → Domain List → Manage → Advanced DNS
    Change from "Namecheap BasicDNS" to "Custom DNS"
    Add these 4 nameservers:
    ${join("\n    ", aws_route53_zone.main.name_servers)}
    
    After nameservers propagate (5-15 minutes), DNS will automatically point to:
    ${aws_eip.app_eip.public_ip}
    
    Then SSH into the server and run:
    sudo /opt/setup-ssl.sh
  EOT
}
