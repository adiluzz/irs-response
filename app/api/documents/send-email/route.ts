import { NextRequest, NextResponse } from 'next/server';
import { requireAuthApi } from '@/lib/utils/apiAuth';
import connectDB from '@/lib/db/mongodb';
import Document from '@/lib/models/Document';
import { getFileFromS3 } from '@/lib/services/s3Service';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function POST(request: NextRequest) {
  try {
    const session = await requireAuthApi();
    await connectDB();

    const body = await request.json();
    const { documentId, email, noticeType } = body;

    if (!documentId || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: documentId and email' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Fetch document from database and verify ownership
    const document = await Document.findById(documentId);
    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    if (document.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Get PDF from S3
    const pdfBuffer = await getFileFromS3(document.s3Key || '');

    if (!pdfBuffer) {
      return NextResponse.json(
        { error: 'Failed to retrieve PDF from storage' },
        { status: 500 }
      );
    }

    // Prepare email
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Tax Letters System'}" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your ${noticeType || 'IRS Response'} Document`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
                background-color: #f5f5f5;
              }
              .email-container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
              }
              .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 40px 30px;
                text-align: center;
                color: #ffffff;
              }
              .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: 600;
              }
              .content {
                padding: 40px 30px;
              }
              .content p {
                margin: 0 0 20px 0;
                font-size: 16px;
                color: #555;
              }
              .document-info {
                background-color: #f8f9fa;
                border-left: 4px solid #667eea;
                padding: 20px;
                margin: 30px 0;
                border-radius: 4px;
              }
              .document-info h2 {
                margin: 0 0 10px 0;
                font-size: 18px;
                color: #333;
              }
              .document-info p {
                margin: 5px 0;
                font-size: 14px;
                color: #666;
              }
              .footer {
                background-color: #f8f9fa;
                padding: 30px;
                text-align: center;
                border-top: 1px solid #e0e0e0;
              }
              .footer p {
                margin: 5px 0;
                font-size: 12px;
                color: #999;
              }
              .attachment-notice {
                background-color: #e3f2fd;
                border: 1px solid #90caf9;
                padding: 15px;
                border-radius: 4px;
                margin: 20px 0;
              }
              .attachment-notice p {
                margin: 0;
                font-size: 14px;
                color: #1976d2;
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header">
                <h1>Your IRS Response Document</h1>
              </div>
              <div class="content">
                <p>Dear Valued User,</p>
                <p>Thank you for using our IRS Response Document Generator. Your document has been prepared and is attached to this email.</p>
                
                <div class="document-info">
                  <h2>Document Details</h2>
                  <p><strong>Notice Type:</strong> ${noticeType || 'N/A'}</p>
                  <p><strong>Generated:</strong> ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>

                <div class="attachment-notice">
                  <p><strong>📎 Attachment:</strong> Your PDF document is attached to this email. Please check your email client for the attachment.</p>
                </div>

                <p>This document has been generated based on the information you provided. Please review it carefully before submitting to the IRS.</p>
                
                <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
              </div>
              <div class="footer">
                <p><strong>Tax Letters System</strong></p>
                <p>This is an automated email. Please do not reply to this message.</p>
                <p>&copy; ${new Date().getFullYear()} Tax Letters System. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
      attachments: [
        {
          filename: `IRS-Response-${noticeType || 'Document'}-${document._id}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
    });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}
