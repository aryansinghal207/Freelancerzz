import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Debug email configuration
console.log('📧 Email Config Debug:');
console.log('EMAIL_USER from env:', process.env.EMAIL_USER || 'NOT SET');
console.log('EMAIL_PASS from env:', process.env.EMAIL_PASS ? `SET (${process.env.EMAIL_PASS.length} chars)` : 'NOT SET');

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'aryansinghal207@gmail.com',
    pass: process.env.EMAIL_PASS || 'pmqavcnyzpfkkilz'
  }
});

console.log('Using email:', process.env.EMAIL_USER || 'aryansinghal207@gmail.com');

// Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log('⚠️  Email configuration error:', error.message);
    console.log('📧 Email invitations will fall back to manual password sharing');
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

export async function sendClientInvitationEmail(clientEmail, clientName, tempPassword, freelancerName) {
  const fromName = process.env.EMAIL_FROM_NAME || 'Freelancerzz';
  const fromEmail = process.env.EMAIL_USER || 'aryansinghal207@gmail.com';
  
  const mailOptions = {
    from: `"${fromName}" <${fromEmail}>`,
    to: clientEmail,
    subject: 'Welcome to Your Client Portal - Freelancerzz',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
          }
          .content {
            background: #f9f9f9;
            padding: 30px 20px;
            border: 1px solid #e0e0e0;
          }
          .credentials-box {
            background: white;
            border: 2px solid #667eea;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          .credential-item {
            margin: 10px 0;
            padding: 10px;
            background: #f5f5f5;
            border-radius: 4px;
          }
          .credential-label {
            font-weight: bold;
            color: #667eea;
            display: block;
            margin-bottom: 5px;
          }
          .credential-value {
            font-family: 'Courier New', monospace;
            font-size: 16px;
            color: #333;
          }
          .button {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
          }
          .footer {
            background: #333;
            color: #fff;
            padding: 20px;
            text-align: center;
            border-radius: 0 0 8px 8px;
            font-size: 12px;
          }
          .warning {
            background: #fff3cd;
            border: 1px solid #ffc107;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎉 Welcome to Freelancerzz</h1>
          <p>Your Client Portal Access</p>
        </div>
        
        <div class="content">
          <p>Hi <strong>${clientName}</strong>,</p>
          
          <p><strong>${freelancerName}</strong> has invited you to access your dedicated client portal on Freelancerzz. You can now track your projects, view invoices, and monitor work progress in real-time.</p>
          
          <div class="credentials-box">
            <h3 style="margin-top: 0; color: #667eea;">Your Login Credentials</h3>
            
            <div class="credential-item">
              <span class="credential-label">Email:</span>
              <span class="credential-value">${clientEmail}</span>
            </div>
            
            <div class="credential-item">
              <span class="credential-label">Temporary Password:</span>
              <span class="credential-value">${tempPassword}</span>
            </div>
          </div>
          
          <div class="warning">
            <strong>⚠️ Important:</strong> Please change your password after your first login for security purposes.
          </div>
          
          <div style="text-align: center;">
            <a href="${process.env.CLIENT_ORIGIN || 'http://localhost:5173'}/login" class="button">
              Access Your Portal
            </a>
          </div>
          
          <h3>What You Can Do:</h3>
          <ul>
            <li>📊 View your project dashboard and progress</li>
            <li>📋 Track tasks and their status</li>
            <li>⏱️ Monitor time logs and work sessions</li>
            <li>💰 View and download invoices</li>
            <li>📈 Generate detailed time reports</li>
          </ul>
          
          <p>If you have any questions or need assistance, please don't hesitate to reach out to <strong>${freelancerName}</strong>.</p>
          
          <p>Best regards,<br><strong>The Freelancerzz Team</strong></p>
        </div>
        
        <div class="footer">
          <p>This is an automated email from Freelancerzz Client Portal</p>
          <p>© ${new Date().getFullYear()} Freelancerzz. All rights reserved.</p>
        </div>
      </body>
      </html>
    `,
    text: `
Welcome to Freelancerzz Client Portal!

Hi ${clientName},

${freelancerName} has invited you to access your dedicated client portal.

Your Login Credentials:
Email: ${clientEmail}
Temporary Password: ${tempPassword}

Portal URL: ${process.env.CLIENT_ORIGIN || 'http://localhost:5173'}/login

What You Can Do:
- View your project dashboard and progress
- Track tasks and their status
- Monitor time logs and work sessions
- View and download invoices
- Generate detailed time reports

IMPORTANT: Please change your password after your first login for security purposes.

If you have any questions, please contact ${freelancerName}.

Best regards,
The Freelancerzz Team
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

export default transporter;
