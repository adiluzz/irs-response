import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendVerificationEmail(email: string, token: string, name?: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}`;
  
  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME || 'Tax Letters System'}" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify Your Email Address',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .button { display: inline-block; padding: 12px 24px; background-color: transparent; color: #0070f3; text-decoration: none; border: 2px solid #0070f3; border-radius: 5px; margin: 20px 0; }
            .footer { margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Welcome${name ? `, ${name}` : ''}!</h1>
            <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
            <p>Or copy and paste this link into your browser:</p>
            <p>${verificationUrl}</p>
            <p>This link will expire in 24 hours.</p>
            <div class="footer">
              <p>If you didn't create an account, please ignore this email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  return transporter.sendMail(mailOptions);
}

export async function sendPasswordResetEmail(email: string, token: string, name?: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;
  
  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME || 'Tax Letters System'}" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Reset Your Password',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .button { display: inline-block; padding: 12px 24px; background-color: transparent; color: #0070f3; text-decoration: none; border: 2px solid #0070f3; border-radius: 5px; margin: 20px 0; }
            .footer { margin-top: 30px; font-size: 12px; color: #666; }
            .warning { background-color: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Password Reset Request</h1>
            <p>Hello${name ? ` ${name}` : ''},</p>
            <p>You requested to reset your password. Click the button below to reset it:</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <p>Or copy and paste this link into your browser:</p>
            <p>${resetUrl}</p>
            <div class="warning">
              <p><strong>Important:</strong> This link will expire in 1 hour. If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
            </div>
            <div class="footer">
              <p>If you didn't request this, please contact support immediately.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  return transporter.sendMail(mailOptions);
}
