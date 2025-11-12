# Email Integration Setup Guide

## Overview

The FreeLancer application now sends professional email invitations to clients when they are invited to the portal. The emails include login credentials and instructions for accessing their client dashboard.

## Email Configuration

### Gmail App Password Setup

The application uses Gmail's SMTP service with an App Password. Follow these steps to set it up:

1. **Enable 2-Step Verification**
   - Go to your Google Account settings: https://myaccount.google.com/
   - Navigate to Security → 2-Step Verification
   - Turn on 2-Step Verification if not already enabled

2. **Generate App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "Freelancerzz" as the name
   - Click "Generate"
   - Copy the 16-character password (format: xxxx xxxx xxxx xxxx)

3. **Update .env File**
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-character-app-password
   EMAIL_FROM_NAME=Freelancerzz
   ```

### Current Configuration

The `.env` file should contain:
```env
EMAIL_USER=freelancerzz@gmail.com
EMAIL_PASS=pmqa vcny zpfk kilz
EMAIL_FROM_NAME=Freelancerzz
```

⚠️ **Important**: Make sure the Gmail account has:
- 2-Step Verification enabled
- App Password generated (not the regular Gmail password)
- Less secure app access is NOT needed with App Passwords

## Email Template

The invitation email includes:

- **Professional Design**: Gradient header, structured layout
- **Login Credentials**: Email and temporary password
- **Portal Link**: Direct link to login page
- **Feature List**: Overview of client portal capabilities
- **Security Warning**: Reminder to change password
- **Freelancer Information**: Name of the inviting freelancer

### Email Content

- **Subject**: "Welcome to Your Client Portal - Freelancerzz"
- **From**: "Freelancerzz <freelancerzz@gmail.com>"
- **HTML Version**: Professionally styled with CSS
- **Plain Text Version**: Fallback for email clients that don't support HTML

## How It Works

### Backend Flow

1. Freelancer clicks "Invite to Portal" in Clients page
2. Frontend sends request to `/api/auth/invite-client`
3. Backend:
   - Validates client exists and belongs to freelancer
   - Generates secure temporary password (16 characters)
   - Creates User account with client role
   - Sends email via Nodemailer
   - Returns success/failure status

### Frontend Handling

```javascript
// If email sent successfully
alert('✅ Client invited successfully!\n\nCredentials have been sent to email@example.com.')

// If email failed but user created
alert('⚠️ Email delivery failed. Please share these credentials manually:\n\nEmail: ...\nPassword: ...')
```

## Error Handling

The system gracefully handles email failures:

1. **Email Send Failure**: 
   - User account is still created
   - Temporary password is returned in API response
   - Frontend shows manual sharing instructions

2. **Invalid Credentials**:
   - Server logs warning but continues running
   - Invitations fall back to manual password sharing

3. **Network Issues**:
   - Timeout handled by Nodemailer
   - Graceful fallback to manual process

## Testing

### Test Email Functionality

1. **Start the server**: `npm run dev` in Server directory
2. **Check console**: Look for email verification message
3. **Invite a client**: Use the "Invite to Portal" button
4. **Check email**: Verify email received with correct details

### Test Email Content

The email includes:
- ✅ Client name personalization
- ✅ Freelancer name mention
- ✅ Correct login URL
- ✅ Temporary password
- ✅ Security instructions
- ✅ Feature list

## Troubleshooting

### Common Issues

#### "Invalid login: 535-5.7.8"
**Cause**: Using regular Gmail password instead of App Password
**Solution**: Generate and use App Password from Google Account settings

#### "Less secure app access"
**Cause**: Old authentication method
**Solution**: Use App Passwords (no need to enable less secure apps)

#### Email not received
**Check**:
- Spam/Junk folder
- Gmail sending limits (500 emails/day)
- Recipient email address is correct
- Internet connection

#### Email server timeout
**Cause**: Network issues or Gmail service down
**Solution**: System automatically falls back to manual password sharing

### Email Sending Limits

Gmail limits:
- **Per Day**: 500 emails
- **Per Hour**: ~100 emails
- **Burst**: 20 emails per minute

For production with high volume, consider:
- SendGrid
- AWS SES
- Mailgun
- Postmark

## Production Recommendations

### Security Best Practices

1. **Environment Variables**: Never commit `.env` file
2. **App Passwords**: Rotate periodically
3. **Password Strength**: Current implementation generates 16-character passwords
4. **HTTPS**: Always use HTTPS in production for login URL

### Email Service Alternatives

For production scale, consider:

#### SendGrid
```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY
  }
});
```

#### AWS SES
```javascript
const transporter = nodemailer.createTransport({
  host: 'email-smtp.us-east-1.amazonaws.com',
  port: 587,
  auth: {
    user: process.env.AWS_SES_USER,
    pass: process.env.AWS_SES_PASS
  }
});
```

## Customization

### Change Email Template

Edit: `Server/src/config/email.js`

Customize:
- HTML styling (CSS in `<style>` tag)
- Email content
- Company branding
- Colors and fonts

### Change From Address

Update `.env`:
```env
EMAIL_USER=your-custom-email@gmail.com
EMAIL_FROM_NAME=Your Company Name
```

### Add Attachments

```javascript
const mailOptions = {
  // ... existing options
  attachments: [
    {
      filename: 'welcome.pdf',
      path: './path/to/welcome.pdf'
    }
  ]
};
```

## Monitoring

### Log Email Activity

Emails are logged in console:
```
✅ Email server is ready to send messages
Email sent successfully: <message-id@gmail.com>
```

### Track Failures

Failed emails are caught and logged:
```javascript
console.error('Error sending email:', error);
```

Consider adding:
- Database logging of email attempts
- Email delivery tracking
- Bounce handling
- Click tracking

## Support

If you encounter issues:

1. Check Gmail account settings
2. Verify App Password is correct
3. Check server console logs
4. Test with a simple email first
5. Verify network connectivity

For production deployments, consider implementing:
- Email queue system (Bull, Redis)
- Retry mechanism
- Delivery webhooks
- Analytics and reporting
