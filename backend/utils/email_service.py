"""
BoulotMan Platform Email Service
Provides convenient methods for sending transactional and notification emails via AWS SES SMTP.
"""

import logging
from django.core.mail import EmailMultiAlternatives
from django.conf import settings

logger = logging.getLogger(__name__)

OFFICIAL_SENDERS = {
    'no_reply': 'BoulotMan <no-reply@boulotman.com>',
    'admin': 'BoulotMan Admin <admin@boulotman.com>',
    'support': 'BoulotMan Support <support@boulotman.com>',
    'contact': 'BoulotMan Contact <contact@boulotman.com>',
    'info': 'BoulotMan Info <info@boulotman.com>',
    'billing': 'BoulotMan Billing <billing@boulotman.com>',
    'career': 'BoulotMan Career <career@boulotman.com>',
    'partnership': 'BoulotMan Partnership <partnership@boulotman.com>',
    'community': 'BoulotMan Community <community@boulotman.com>',
    'legal': 'BoulotMan Legal <legal@boulotman.com>',
    'disputes': 'BoulotMan Disputes <disputes@boulotman.com>',
    'compliance': 'BoulotMan Compliance <compliance@boulotman.com>',
}


def send_platform_email(subject, message, recipient_list, html_message=None, sender_type='no_reply', fail_silently=False):
    """
    Send an email using configured AWS SES SMTP backend.
    """
    if isinstance(recipient_list, str):
        recipient_list = [recipient_list]

    from_email = OFFICIAL_SENDERS.get(sender_type, settings.DEFAULT_FROM_EMAIL)

    try:
        msg = EmailMultiAlternatives(
            subject=subject,
            body=message,
            from_email=from_email,
            to=recipient_list
        )
        if html_message:
            msg.attach_alternative(html_message, "text/html")

        sent_count = msg.send(fail_silently=fail_silently)
        logger.info("Successfully sent %d email(s) from %s to %s", sent_count, from_email, recipient_list)
        return sent_count > 0
    except Exception as e:
        logger.error("Failed to send email to %s: %s", recipient_list, e)
        if not fail_silently:
            raise e
        return False


def send_otp_email(to_email, code, purpose='verification', user_name=None):
    """
    Send a 6-digit OTP code to the given email address.
    """
    greeting = f"Hello {user_name}," if user_name else "Hello,"
    purpose_label = {
        'login': 'Login Verification',
        'registration': 'Account Registration',
        'password_reset': 'Password Reset',
        'verification': 'Identity Verification',
    }.get(purpose, 'Verification')

    subject = f"Your BoulotMan {purpose_label} Code: {code}"

    plain_message = f"""{greeting}

Your BoulotMan verification code for {purpose_label} is: {code}

This code will expire in 10 minutes. For security reasons, please do not share this code with anyone.

Best regards,
The BoulotMan Team
https://boulotman.com
"""

    html_message = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>{subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 520px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden; border: 1px solid #e2e8f0;">
          <tr>
            <td style="padding: 32px 36px; background-color: #0f172a; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">BoulotMan</h1>
              <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 13px;">Secure Technical Services & Verified Work</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 36px 36px 24px 36px;">
              <p style="font-size: 16px; color: #1e293b; margin: 0 0 16px 0;">{greeting}</p>
              <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 24px 0;">
                Use the following 6-digit verification code to complete your <strong>{purpose_label}</strong>:
              </p>
              
              <div style="background-color: #f1f5f9; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 24px;">
                <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #0284c7; font-family: monospace;">{code}</span>
              </div>
              
              <p style="font-size: 13px; line-height: 1.5; color: #64748b; margin: 0 0 12px 0;">
                ⏱️ This code will expire in <strong>10 minutes</strong>.
              </p>
              <p style="font-size: 12px; line-height: 1.5; color: #94a3b8; margin: 0;">
                🔒 If you did not request this verification, you can safely ignore this email. Someone may have typed your address by mistake.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 36px; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                &copy; 2026 BoulotMan. All rights reserved.<br>
                <a href="https://boulotman.com" style="color: #0284c7; text-decoration: none;">boulotman.com</a> &bull; 
                <a href="mailto:support@boulotman.com" style="color: #0284c7; text-decoration: none;">support@boulotman.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""
    return send_platform_email(
        subject=subject,
        message=plain_message,
        recipient_list=[to_email],
        html_message=html_message,
        sender_type='no_reply',
        fail_silently=True
    )


def send_welcome_email(user):
    """
    Send a welcoming email when a user completes registration.
    """
    name = getattr(user, 'first_name', '') or user.email.split('@')[0]
    subject = "Welcome to BoulotMan!"
    plain_message = f"""Hello {name},

Welcome to BoulotMan! We are thrilled to have you join our platform.

Whether you're looking for trusted technicians, managing company projects, or offering professional services, BoulotMan protects your milestones, payments, and work with secure escrow.

Get started by logging in:
https://boulotman.com/login

If you have any questions or need assistance, feel free to reply to support@boulotman.com.

Best regards,
The BoulotMan Team
https://boulotman.com
"""

    html_message = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to BoulotMan</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 520px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden; border: 1px solid #e2e8f0;">
          <tr>
            <td style="padding: 32px 36px; background-color: #0f172a; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">Welcome to BoulotMan!</h1>
              <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 13px;">Secure Technical Services & Verified Work</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 36px 36px 28px 36px;">
              <p style="font-size: 16px; color: #1e293b; margin: 0 0 16px 0;">Hello <strong>{name}</strong>,</p>
              <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 20px 0;">
                Thank you for creating an account on <strong>BoulotMan</strong>. We connect clients, verified technicians, and companies with guaranteed escrow payments and milestone management.
              </p>
              
              <div style="text-align: center; margin: 32px 0;">
                <a href="https://boulotman.com/login" style="background-color: #0284c7; color: #ffffff; padding: 12px 28px; border-radius: 6px; font-size: 15px; font-weight: 600; text-decoration: none; display: inline-block;">
                  Go to Dashboard &rarr;
                </a>
              </div>
              
              <p style="font-size: 13px; line-height: 1.5; color: #64748b; margin: 0;">
                Need help getting started? Check our Help Center or contact our support team at <a href="mailto:support@boulotman.com" style="color: #0284c7;">support@boulotman.com</a>.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 36px; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                &copy; 2026 BoulotMan. All rights reserved.<br>
                <a href="https://boulotman.com" style="color: #0284c7; text-decoration: none;">boulotman.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""
    return send_platform_email(
        subject=subject,
        message=plain_message,
        recipient_list=[user.email],
        html_message=html_message,
        sender_type='info',
        fail_silently=True
    )
