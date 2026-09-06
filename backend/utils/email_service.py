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


def send_verification_approved_email(user):
    """
    Send an official notification email when Admin verifies a user (Technician, Company, Client).
    """
    name = getattr(user, 'first_name', '') or user.email.split('@')[0]
    role = str(getattr(user, 'role', 'PRO')).upper()
    role_label = 'Technician' if role == 'TECHNICIAN' else ('Company' if role == 'COMPANY' else 'Client')
    dashboard_url = f"https://boulotman.com/dashboard/{role.lower()}"
    subject = f"Congratulations! Your BoulotMan {role_label} Account is Verified!"

    plain_message = f"""Hello {name},

Great news! Your BoulotMan {role_label} account has been officially verified by our administration team.

Your verified badge is now active on your profile, boosting your credibility and opening up full access to the BoulotMan service network, guaranteed escrow payments, and client contracts.

Log in to your verified dashboard:
{dashboard_url}

Thank you for being a trusted member of the BoulotMan network!

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
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">BoulotMan</h1>
              <p style="margin: 4px 0 0 0; color: #38bdf8; font-size: 13px; font-weight: 600;">Verified {role_label} Status Approved</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 36px 36px 28px 36px;">
              <div style="text-align: center; margin-bottom: 24px;">
                <div style="display: inline-block; background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 50px; padding: 6px 18px; color: #059669; font-size: 13px; font-weight: 700;">
                  &#10004; Account Officially Verified
                </div>
              </div>

              <p style="font-size: 16px; color: #1e293b; margin: 0 0 16px 0;">Hello <strong>{name}</strong>,</p>
              <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 20px 0;">
                Great news! Our administrative review team has verified your credentials and approved your account. Your profile now proudly displays the official <strong>Verified Badge</strong>.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="{dashboard_url}" style="background-color: #059669; color: #ffffff; padding: 12px 28px; border-radius: 6px; font-size: 15px; font-weight: 600; text-decoration: none; display: inline-block;">
                  Access Verified Dashboard &rarr;
                </a>
              </div>
              
              <p style="font-size: 13px; line-height: 1.5; color: #64748b; margin: 0;">
                Ready to take on new projects and build relationships with clients across Africa? If you need anything, our support team is available at <a href="mailto:support@boulotman.com" style="color: #0284c7;">support@boulotman.com</a>.
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
        recipient_list=[user.email],
        html_message=html_message,
        sender_type='admin',
        fail_silently=True
    )


def send_new_proposal_email(task, bid, client_user=None):
    """
    Notify client when a technician submits a proposal on their task.
    """
    client = client_user or getattr(task, 'client', None)
    if not client or not getattr(client, 'email', None):
        return False

    client_name = getattr(client, 'first_name', '') or client.email.split('@')[0]
    tech = getattr(bid, 'technician', None)
    tech_name = (f"{getattr(tech, 'first_name', '')} {getattr(tech, 'last_name', '')}").strip() if tech else 'A verified technician'
    if not tech_name:
        tech_name = getattr(tech, 'email', 'A technician')

    task_title = getattr(task, 'title', 'Your posted task')
    task_id = getattr(task, 'id', '')
    bid_amount = getattr(bid, 'amount', getattr(bid, 'bid_amount', ''))
    review_url = f"https://boulotman.com/dashboard/client/tasks/{task_id}"

    subject = f"New Proposal Received: {task_title}"
    plain_message = f"""Hello {client_name},

{tech_name} has just submitted a proposal for your task: "{task_title}".

Proposal Details:
- Offer: {bid_amount}
- Submitted by: {tech_name}

Review this proposal, message the provider, or award the contract:
{review_url}

Best regards,
The BoulotMan Team
https://boulotman.com
"""

    html_message = f"""<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>{subject}</title></head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 520px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden; border: 1px solid #e2e8f0;">
          <tr>
            <td style="padding: 32px 36px; background-color: #0f172a; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">BoulotMan</h1>
              <p style="margin: 4px 0 0 0; color: #38bdf8; font-size: 13px;">New Task Proposal Alert</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 36px 36px 28px 36px;">
              <p style="font-size: 16px; color: #1e293b; margin: 0 0 16px 0;">Hello <strong>{client_name}</strong>,</p>
              <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 20px 0;">
                You received a new proposal for your task: <strong>"{task_title}"</strong>.
              </p>

              <div style="background-color: #f1f5f9; border-left: 4px solid #0284c7; border-radius: 4px; padding: 16px 20px; margin-bottom: 24px;">
                <p style="margin: 0 0 8px 0; font-size: 14px; color: #1e293b;"><strong>Provider:</strong> {tech_name}</p>
                <p style="margin: 0; font-size: 14px; color: #1e293b;"><strong>Proposed Amount:</strong> {bid_amount}</p>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="{review_url}" style="background-color: #0284c7; color: #ffffff; padding: 12px 28px; border-radius: 6px; font-size: 15px; font-weight: 600; text-decoration: none; display: inline-block;">
                  Review & Award Proposal &rarr;
                </a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 36px; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                &copy; 2026 BoulotMan. All rights reserved. &bull; <a href="https://boulotman.com" style="color: #0284c7;">boulotman.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""
    return send_platform_email(
        subject=subject,
        message=plain_message,
        recipient_list=[client.email],
        html_message=html_message,
        sender_type='no_reply',
        fail_silently=True
    )


def send_proposal_accepted_email(task, bid, tech_user=None):
    """
    Notify technician that their proposal has been accepted / task awarded.
    """
    tech = tech_user or getattr(bid, 'technician', None)
    if not tech or not getattr(tech, 'email', None):
        return False

    tech_name = getattr(tech, 'first_name', '') or tech.email.split('@')[0]
    task_title = getattr(task, 'title', 'the task')
    task_id = getattr(task, 'id', '')
    project_url = f"https://boulotman.com/dashboard/technician/tasks/{task_id}"

    subject = f"Congratulations! Your Proposal Was Accepted: {task_title}"
    plain_message = f"""Hello {tech_name},

Congratulations! Your proposal for "{task_title}" has been accepted by the client.

You can now review the project workspace, communicate directly with the client, and track milestone deliverables:
{project_url}

Payment is protected under BoulotMan escrow. Do not begin work until the first milestone is funded.

Best regards,
The BoulotMan Team
https://boulotman.com
"""

    html_message = f"""<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>{subject}</title></head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 520px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden; border: 1px solid #e2e8f0;">
          <tr>
            <td style="padding: 32px 36px; background-color: #0f172a; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">BoulotMan</h1>
              <p style="margin: 4px 0 0 0; color: #10b981; font-size: 13px; font-weight: 600;">&#10004; Contract Awarded</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 36px 36px 28px 36px;">
              <p style="font-size: 16px; color: #1e293b; margin: 0 0 16px 0;">Hello <strong>{tech_name}</strong>,</p>
              <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 20px 0;">
                Fantastic news! The client has accepted your proposal for <strong>"{task_title}"</strong>. The contract is officially awarded to you.
              </p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="{project_url}" style="background-color: #10b981; color: #ffffff; padding: 12px 28px; border-radius: 6px; font-size: 15px; font-weight: 600; text-decoration: none; display: inline-block;">
                  Open Project Workspace &rarr;
                </a>
              </div>

              <p style="font-size: 12px; line-height: 1.5; color: #64748b; background: #fffbeb; border: 1px solid #fef3c7; border-radius: 6px; padding: 12px; margin: 0;">
                <strong>Escrow Reminder:</strong> All payments are secured in BoulotMan Escrow. Make sure the client deposits milestone funds before commencing work.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 36px; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                &copy; 2026 BoulotMan. All rights reserved. &bull; <a href="https://boulotman.com" style="color: #0284c7;">boulotman.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""
    return send_platform_email(
        subject=subject,
        message=plain_message,
        recipient_list=[tech.email],
        html_message=html_message,
        sender_type='no_reply',
        fail_silently=True
    )


def send_payment_escrow_email(user, amount, currency, task_title, milestone_title=None, action_type='deposit'):
    """
    Send payment receipt for Escrow funding or milestone release.
    action_type: 'deposit' | 'release' | 'withdrawal'
    """
    if not user or not getattr(user, 'email', None):
        return False

    name = getattr(user, 'first_name', '') or user.email.split('@')[0]
    action_label = {
        'deposit': 'Escrow Deposit Confirmed',
        'release': 'Milestone Payment Released',
        'withdrawal': 'Payout Withdrawal Completed',
    }.get(action_type, 'Payment Confirmation')

    subject = f"BoulotMan Payment Receipt: {action_label}"
    ms_desc = f" ({milestone_title})" if milestone_title else ""

    plain_message = f"""Hello {name},

This email confirms your recent payment activity on BoulotMan.

Details:
- Action: {action_label}
- Amount: {amount} {currency}
- Task: {task_title}{ms_desc}
- Platform Protection: Verified Escrow

View your transaction statement in your wallet:
https://boulotman.com/dashboard/client/payments

Best regards,
The BoulotMan Billing Team
https://boulotman.com
"""

    html_message = f"""<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>{subject}</title></head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 520px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden; border: 1px solid #e2e8f0;">
          <tr>
            <td style="padding: 32px 36px; background-color: #0f172a; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">BoulotMan</h1>
              <p style="margin: 4px 0 0 0; color: #38bdf8; font-size: 13px;">Official Payment & Escrow Receipt</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 36px 36px 28px 36px;">
              <p style="font-size: 16px; color: #1e293b; margin: 0 0 16px 0;">Hello <strong>{name}</strong>,</p>
              <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 24px 0;">
                Your recent payment activity has been securely processed.
              </p>

              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                <table width="100%" style="font-size: 14px; color: #334155;">
                  <tr><td style="padding: 6px 0; color: #64748b;">Status</td><td align="right" style="font-weight: 600; color: #059669;">&#10004; {action_label}</td></tr>
                  <tr><td style="padding: 6px 0; color: #64748b;">Amount</td><td align="right" style="font-size: 18px; font-weight: 700; color: #0f172a;">{amount} {currency}</td></tr>
                  <tr><td style="padding: 6px 0; color: #64748b;">Project</td><td align="right" style="font-weight: 500;">{task_title}</td></tr>
                  {f'<tr><td style="padding: 6px 0; color: #64748b;">Milestone</td><td align="right" style="font-weight: 500;">{milestone_title}</td></tr>' if milestone_title else ''}
                </table>
              </div>

              <div style="text-align: center; margin: 24px 0;">
                <a href="https://boulotman.com/dashboard" style="background-color: #0f172a; color: #ffffff; padding: 12px 28px; border-radius: 6px; font-size: 14px; font-weight: 600; text-decoration: none; display: inline-block;">
                  View Wallet Statement &rarr;
                </a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 36px; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                &copy; 2026 BoulotMan. All rights reserved. &bull; <a href="mailto:billing@boulotman.com" style="color: #0284c7;">billing@boulotman.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""
    return send_platform_email(
        subject=subject,
        message=plain_message,
        recipient_list=[user.email],
        html_message=html_message,
        sender_type='billing',
        fail_silently=True
    )


def send_contact_form_notification(name, email, phone, topic, message):
    """
    Handle contact form submissions:
    1. Send full details to support@boulotman.com and admin@boulotman.com.
    2. Send an auto-acknowledgement email with ticket details back to the visitor.
    """
    # 1. Email to Platform Support
    support_subject = f"[Support Inquiry] {topic} - from {name}"
    support_plain = f"""New Contact Form Submission:

Name: {name}
Email: {email}
Phone: {phone or 'Not provided'}
Topic: {topic}

Message:
{message}
"""
    send_platform_email(
        subject=support_subject,
        message=support_plain,
        recipient_list=['support@boulotman.com', 'admin@boulotman.com'],
        sender_type='contact',
        fail_silently=True
    )

    # 2. Auto-Acknowledgement Email to Visitor
    ack_subject = f"We have received your message: {topic} [BoulotMan Support]"
    ack_plain = f"""Hello {name},

Thank you for contacting BoulotMan Support. We have successfully received your message regarding: "{topic}".

Our support specialists review all inquiries promptly (average response time is under 2 hours during business operations).

Your Inquiry Summary:
Topic: {topic}
Message: {message}

If your inquiry is urgent regarding an active escrow or task dispute, our resolution team will prioritize your ticket accordingly.

Best regards,
The BoulotMan Support Team
https://boulotman.com
support@boulotman.com
"""

    ack_html = f"""<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>{ack_subject}</title></head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 10px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 520px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden; border: 1px solid #e2e8f0;">
          <tr>
            <td style="padding: 32px 36px; background-color: #0f172a; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">BoulotMan</h1>
              <p style="margin: 4px 0 0 0; color: #38bdf8; font-size: 13px;">Customer Support Ticket Received</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 36px 36px 28px 36px;">
              <p style="font-size: 16px; color: #1e293b; margin: 0 0 16px 0;">Hello <strong>{name}</strong>,</p>
              <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 20px 0;">
                Thank you for contacting BoulotMan. We have received your inquiry regarding <strong>"{topic}"</strong> and assigned it to our support team.
              </p>

              <div style="background-color: #f8fafc; border-left: 4px solid #0284c7; padding: 16px 20px; margin-bottom: 24px; border-radius: 4px;">
                <p style="margin: 0 0 8px 0; font-size: 13px; color: #64748b;"><strong>Inquiry Topic:</strong> {topic}</p>
                <p style="margin: 0; font-size: 13px; color: #334155; line-height: 1.5;"><em>"{message}"</em></p>
              </div>

              <p style="font-size: 13px; line-height: 1.5; color: #64748b; margin: 0;">
                A representative will review your inquiry and follow up directly to this email address. Typical response time is under 2 hours.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 36px; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                &copy; 2026 BoulotMan. All rights reserved. &bull; <a href="mailto:support@boulotman.com" style="color: #0284c7;">support@boulotman.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""

    return send_platform_email(
        subject=ack_subject,
        message=ack_plain,
        recipient_list=[email],
        html_message=ack_html,
        sender_type='support',
        fail_silently=True
    )
