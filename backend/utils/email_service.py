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


def build_branded_email_html(
    heading_title="BoulotMan",
    heading_subtitle="Verified Work & Technical Services",
    body_content="",
    preheader=""
):
    """
    Standard branded HTML email container with official BoulotMan logo and brand styling.
    Brand Colors:
      - Deep Navy: #001F3F / #0A2D52
      - Accent Orange: #FF4500 / #E03E00
      - Slate/Muted: #94A3B8, #64748B, #475569
    """
    preheader_tag = f'<span style="display:none; font-size:0px; line-height:0px; max-height:0px; max-width:0px; opacity:0; overflow:hidden;">{preheader}</span>' if preheader else ''
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>{heading_title}</title>
  {preheader_tag}
</head>
<body style="margin: 0; padding: 0; background-color: #F1F5F9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #F1F5F9; padding: 40px 16px;">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table role="presentation" width="100%" style="max-width: 560px; background-color: #FFFFFF; border-radius: 18px; box-shadow: 0 12px 36px rgba(0, 31, 63, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04); overflow: hidden; border: 1px solid #E2E8F0; border-collapse: separate;">
          
          <!-- Top Vibrant Brand Stripe -->
          <tr>
            <td style="background: linear-gradient(90deg, #FF4500 0%, #FF7A00 50%, #FF4500 100%); height: 6px; line-height: 6px; font-size: 6px;">&nbsp;</td>
          </tr>

          <!-- Navy Brand Header with Official Logo -->
          <tr>
            <td style="padding: 34px 28px 28px 28px; background: linear-gradient(145deg, #001F3F 0%, #08284D 55%, #0E3666 100%); text-align: center;">
              
              <!-- Logo Container with crisp styling & fallback -->
              <table role="presentation" align="center" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                <tr>
                  <td align="center" style="background-color: #FFFFFF; width: 72px; height: 72px; border-radius: 16px; border: 2px solid rgba(255, 255, 255, 0.25); box-shadow: 0 8px 20px rgba(0, 0, 0, 0.35); vertical-align: middle; text-align: center;">
                    <a href="https://boulotman.com" target="_blank" style="text-decoration: none; display: block; line-height: 0;">
                      <img src="https://boulotman.com/boulotman-logo.png" alt="BoulotMan" width="58" height="58" style="display: block; margin: 0 auto; border: 0; max-width: 100%; height: auto;" />
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Brand Name Text -->
              <div style="margin-top: 14px;">
                <a href="https://boulotman.com" target="_blank" style="text-decoration: none;">
                  <span style="color: #FFFFFF; font-size: 26px; font-weight: 900; letter-spacing: -0.5px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                    Boulot<span style="color: #FF4500;">Man</span>
                  </span>
                </a>
              </div>

              <!-- Subtitle / Tagline -->
              <p style="margin: 6px 0 0 0; color: #94A3B8; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;">
                {heading_subtitle}
              </p>
            </td>
          </tr>

          <!-- Body Content Area -->
          <tr>
            <td style="padding: 36px 36px 30px 36px; background-color: #FFFFFF; color: #1E293B;">
              {body_content}
            </td>
          </tr>

          <!-- Official Footer Area -->
          <tr>
            <td style="background-color: #F8FAFC; padding: 24px 32px; border-top: 1px solid #E2E8F0; text-align: center;">
              
              <!-- Quick Links -->
              <p style="margin: 0 0 10px 0; font-size: 13px;">
                <a href="https://boulotman.com" target="_blank" style="color: #FF4500; text-decoration: none; font-weight: 700;">boulotman.com</a>
                <span style="color: #CBD5E1; margin: 0 10px;">&bull;</span>
                <a href="mailto:support@boulotman.com" style="color: #64748B; text-decoration: none; font-weight: 600;">support@boulotman.com</a>
                <span style="color: #CBD5E1; margin: 0 10px;">&bull;</span>
                <a href="https://boulotman.com/safety" target="_blank" style="color: #64748B; text-decoration: none; font-weight: 600;">Trust &amp; Safety</a>
              </p>

              <!-- Copyright & Security Note -->
              <p style="margin: 0 0 4px 0; font-size: 11px; color: #94A3B8; line-height: 1.5;">
                &copy; 2026 <strong>BoulotMan Platform</strong>. All rights reserved.
              </p>
              <p style="margin: 0; font-size: 10px; color: #94A3B8; line-height: 1.4;">
                This is an official automated security message from BoulotMan. Never share your password or OTP with anyone.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""


def send_otp_email(to_email, code, purpose='verification', user_name=None):
    """
    Send a 6-digit OTP code to the given email address with high-grade BoulotMan branding and dedicated styling for Password Reset.
    """
    greeting = f"Hello {user_name}," if user_name else "Hello,"
    
    is_password_reset = (purpose == 'password_reset')
    
    purpose_label = {
        'login': 'Login Verification',
        'registration': 'Account Registration',
        'password_reset': 'Password Reset',
        'verification': 'Identity Verification',
    }.get(purpose, 'Verification')

    if is_password_reset:
        subject = f"🔐 Your BoulotMan Password Reset Code: {code}"
        badge_text = "🔒 PASSWORD RESET REQUEST"
        badge_bg = "#FEF2F2"
        badge_border = "#FECACA"
        badge_color = "#DC2626"
        instruction_text = (
            "We received a request to reset the password for your <strong>BoulotMan</strong> account.<br>"
            "Please use the 6-digit verification code below to set your new password:"
        )
        preheader_text = f"Your Password Reset Code is {code} (expires in 15 minutes)"
        warning_note = (
            "If you did not request a password reset, you can safely ignore this email. "
            "Your password will remain unchanged, and your account is completely secure."
        )
    else:
        subject = f"Your BoulotMan {purpose_label} Code: {code}"
        badge_text = f"🔐 {purpose_label.upper()}"
        badge_bg = "#FFF3EB"
        badge_border = "#FFE4D6"
        badge_color = "#FF4500"
        instruction_text = f"Use the following 6-digit verification code to complete your <strong>{purpose_label}</strong>:"
        preheader_text = f"Your verification code is {code} (expires in 15 minutes)"
        warning_note = (
            "If you did not request this verification code, please ignore this email. "
            "Someone may have typed your email address by mistake."
        )

    plain_message = f"""{greeting}

{subject}

Verification Code: {code}

This code will expire in 15 minutes.
For your security, never share this code with anyone. BoulotMan staff will never ask for your verification code.

Best regards,
The BoulotMan Security Team
https://boulotman.com
"""

    body_content = f"""
      <p style="font-size: 16px; font-weight: 700; color: #0F172A; margin: 0 0 16px 0;">{greeting}</p>
      
      <!-- Security / Purpose Badge -->
      <div style="margin: 0 0 20px 0;">
        <span style="display: inline-block; background-color: {badge_bg}; border: 1px solid {badge_border}; color: {badge_color}; font-size: 11px; font-weight: 800; padding: 5px 14px; border-radius: 20px; letter-spacing: 0.8px;">
          {badge_text}
        </span>
      </div>

      <!-- Action Message -->
      <p style="font-size: 14px; line-height: 1.7; color: #334155; margin: 0 0 24px 0;">
        {instruction_text}
      </p>

      <!-- Prominent High-Contrast OTP Box -->
      <div style="background: linear-gradient(145deg, #001F3F 0%, #0A2D52 100%); border-radius: 14px; padding: 26px 16px; text-align: center; margin: 0 0 24px 0; box-shadow: 0 6px 18px rgba(0, 31, 63, 0.15);">
        <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2.5px; color: #94A3B8; margin-bottom: 10px;">
          YOUR 6-DIGIT VERIFICATION CODE
        </div>
        <div style="font-size: 42px; font-weight: 900; letter-spacing: 10px; color: #FF4500; font-family: 'SF Pro Display', -apple-system, 'Segoe UI', Consolas, 'Courier New', monospace; line-height: 1.1; padding-left: 10px; text-shadow: 0 2px 4px rgba(0,0,0,0.4);">
          {code}
        </div>
      </div>

      <!-- Expiry Notice Box -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #FFFBEB; border: 1px solid #FDE68A; border-radius: 10px; margin-bottom: 24px;">
        <tr>
          <td style="padding: 12px 16px; font-size: 13px; color: #92400E; font-weight: 600; line-height: 1.5;">
            ⏱️ <strong>Time Sensitive:</strong> This code will expire in <strong>15 minutes</strong>.
          </td>
        </tr>
      </table>

      <!-- Security Notice Footer -->
      <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 14px 16px; margin: 0;">
        <p style="font-size: 12px; line-height: 1.6; color: #64748B; margin: 0;">
          🛡️ <strong>Security Tip:</strong> {warning_note}
        </p>
      </div>
    """

    html_message = build_branded_email_html(
        heading_title="BoulotMan Security" if is_password_reset else f"BoulotMan {purpose_label}",
        heading_subtitle="Verified Work & Technical Services",
        body_content=body_content,
        preheader=preheader_text
    )

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

    body_content = f"""
      <p style="font-size: 16px; font-weight: 600; color: #0f172a; margin: 0 0 16px 0;">Hello <strong>{name}</strong>,</p>
      
      <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 20px 0;">
        Welcome to <strong>BoulotMan</strong>! We connect clients, verified technicians, and companies with guaranteed escrow payments, milestone tracking, and verified workmanship.
      </p>

      <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 18px 20px; margin: 0 0 24px 0;">
        <p style="margin: 0 0 10px 0; font-size: 13px; font-weight: 700; color: #001F3F;">What you can do with BoulotMan:</p>
        <ul style="margin: 0; padding-left: 18px; font-size: 13px; color: #475569; line-height: 1.8;">
          <li>Post or discover technical service contracts across Africa</li>
          <li>Work securely with Milestone-based Escrow payments</li>
          <li>Real-time chat and proposal negotiations</li>
        </ul>
      </div>

      <div style="text-align: center; margin: 28px 0;">
        <a href="https://boulotman.com/login" target="_blank" style="background: linear-gradient(135deg, #FF4500 0%, #E03D00 100%); color: #ffffff; padding: 13px 32px; border-radius: 8px; font-size: 15px; font-weight: 700; text-decoration: none; display: inline-block; box-shadow: 0 4px 12px rgba(255, 69, 0, 0.3);">
          Go to Dashboard &rarr;
        </a>
      </div>

      <div style="border-top: 1px solid #F1F5F9; padding-top: 18px;">
        <p style="font-size: 12px; line-height: 1.6; color: #94A3B8; margin: 0;">
          Need assistance? Our support team is ready to help at <a href="mailto:support@boulotman.com" style="color: #FF4500; text-decoration: none; font-weight: 600;">support@boulotman.com</a>.
        </p>
      </div>
    """

    html_message = build_branded_email_html(
        heading_title="Welcome to BoulotMan!",
        heading_subtitle="Your Verified Services & Escrow Platform",
        body_content=body_content,
        preheader=f"Welcome to BoulotMan, {name}! Start exploring verified technical services."
    )

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

    body_content = f"""
      <div style="text-align: center; margin-bottom: 22px;">
        <div style="display: inline-block; background-color: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 50px; padding: 6px 20px; color: #059669; font-size: 13px; font-weight: 700;">
          &#10004; Account Officially Verified
        </div>
      </div>

      <p style="font-size: 16px; font-weight: 600; color: #0f172a; margin: 0 0 14px 0;">Hello <strong>{name}</strong>,</p>
      
      <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 20px 0;">
        Great news! Our administrative review team has verified your identity and approved your <strong>{role_label}</strong> account. Your profile now proudly displays the official <strong>Verified Badge</strong>.
      </p>

      <div style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 12px; padding: 18px 20px; margin: 0 0 24px 0;">
        <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 700; color: #166534;">Unlocked Verified Features:</p>
        <ul style="margin: 0; padding-left: 18px; font-size: 13px; color: #15803D; line-height: 1.8;">
          <li>Verified Trust Badge displayed on your public profile</li>
          <li>Full bidding access on high-value client projects</li>
          <li>Direct Milestone Escrow payouts</li>
        </ul>
      </div>

      <div style="text-align: center; margin: 28px 0;">
        <a href="{dashboard_url}" target="_blank" style="background: linear-gradient(135deg, #059669 0%, #047857 100%); color: #ffffff; padding: 13px 32px; border-radius: 8px; font-size: 15px; font-weight: 700; text-decoration: none; display: inline-block; box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);">
          Access Verified Dashboard &rarr;
        </a>
      </div>

      <div style="border-top: 1px solid #F1F5F9; padding-top: 18px;">
        <p style="font-size: 12px; line-height: 1.6; color: #94A3B8; margin: 0;">
          Ready to take on new projects? If you have questions, our team is always here at <a href="mailto:support@boulotman.com" style="color: #FF4500; text-decoration: none; font-weight: 600;">support@boulotman.com</a>.
        </p>
      </div>
    """

    html_message = build_branded_email_html(
        heading_title="Account Verified!",
        heading_subtitle=f"Verified {role_label} Status Approved",
        body_content=body_content,
        preheader=f"Congratulations {name}, your BoulotMan account is verified!"
    )

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

    body_content = f"""
      <p style="font-size: 16px; font-weight: 600; color: #0f172a; margin: 0 0 14px 0;">Hello <strong>{client_name}</strong>,</p>
      
      <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 20px 0;">
        You received a new proposal for your task: <strong>"{task_title}"</strong>.
      </p>

      <div style="background-color: #F8FAFC; border-left: 4px solid #FF4500; border-radius: 4px; padding: 16px 20px; margin-bottom: 24px;">
        <p style="margin: 0 0 8px 0; font-size: 14px; color: #001F3F;"><strong>Provider:</strong> {tech_name}</p>
        <p style="margin: 0; font-size: 14px; color: #001F3F;"><strong>Proposed Amount:</strong> <span style="font-weight: 700; color: #FF4500;">{bid_amount}</span></p>
      </div>

      <div style="text-align: center; margin: 28px 0;">
        <a href="{review_url}" target="_blank" style="background: linear-gradient(135deg, #FF4500 0%, #E03D00 100%); color: #ffffff; padding: 13px 32px; border-radius: 8px; font-size: 15px; font-weight: 700; text-decoration: none; display: inline-block; box-shadow: 0 4px 12px rgba(255, 69, 0, 0.3);">
          Review & Award Proposal &rarr;
        </a>
      </div>

      <div style="border-top: 1px solid #F1F5F9; padding-top: 18px;">
        <p style="font-size: 12px; line-height: 1.6; color: #94A3B8; margin: 0;">
          All payments on BoulotMan are protected with secure escrow. Funds are only released when you approve milestone completion.
        </p>
      </div>
    """

    html_message = build_branded_email_html(
        heading_title="New Proposal Received",
        heading_subtitle=f'Task: "{task_title}"',
        body_content=body_content,
        preheader=f"{tech_name} submitted a new proposal for your task: {task_title}"
    )

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

    body_content = f"""
      <div style="text-align: center; margin-bottom: 22px;">
        <div style="display: inline-block; background-color: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 50px; padding: 6px 20px; color: #059669; font-size: 13px; font-weight: 700;">
          &#10004; Contract Awarded to You!
        </div>
      </div>

      <p style="font-size: 16px; font-weight: 600; color: #0f172a; margin: 0 0 14px 0;">Hello <strong>{tech_name}</strong>,</p>
      
      <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 20px 0;">
        Fantastic news! The client has officially accepted your proposal for <strong>"{task_title}"</strong>.
      </p>

      <div style="text-align: center; margin: 28px 0;">
        <a href="{project_url}" target="_blank" style="background: linear-gradient(135deg, #059669 0%, #047857 100%); color: #ffffff; padding: 13px 32px; border-radius: 8px; font-size: 15px; font-weight: 700; text-decoration: none; display: inline-block; box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);">
          Open Project Workspace &rarr;
        </a>
      </div>

      <div style="background: #FFFBEB; border: 1px solid #FEF3C7; border-radius: 8px; padding: 14px 16px; margin: 20px 0 0 0;">
        <p style="font-size: 12px; line-height: 1.6; color: #92400E; margin: 0;">
          <strong>Escrow Protection:</strong> All payments are secured in BoulotMan Escrow. Make sure the client deposits milestone funds before commencing work.
        </p>
      </div>
    """

    html_message = build_branded_email_html(
        heading_title="Contract Awarded!",
        heading_subtitle=f'Task: "{task_title}"',
        body_content=body_content,
        preheader=f"Congratulations {tech_name}, your proposal for {task_title} was accepted!"
    )

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

    ms_row = f'<tr><td style="padding: 8px 0; color: #64748B;">Milestone</td><td align="right" style="font-weight: 500; color: #0F172A;">{milestone_title}</td></tr>' if milestone_title else ''

    body_content = f"""
      <p style="font-size: 16px; font-weight: 600; color: #0f172a; margin: 0 0 14px 0;">Hello <strong>{name}</strong>,</p>
      
      <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 20px 0;">
        Your recent payment activity has been securely processed by BoulotMan Escrow.
      </p>

      <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 20px; margin-bottom: 24px;">
        <table width="100%" style="font-size: 14px; color: #334155; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #E2E8F0;"><td style="padding: 8px 0; color: #64748B;">Status</td><td align="right" style="font-weight: 700; color: #059669;">&#10004; {action_label}</td></tr>
          <tr style="border-bottom: 1px solid #E2E8F0;"><td style="padding: 8px 0; color: #64748B;">Amount</td><td align="right" style="font-size: 18px; font-weight: 800; color: #FF4500;">{amount} {currency}</td></tr>
          <tr style="border-bottom: 1px solid #E2E8F0;"><td style="padding: 8px 0; color: #64748B;">Project</td><td align="right" style="font-weight: 500; color: #0F172A;">{task_title}</td></tr>
          {ms_row}
        </table>
      </div>

      <div style="text-align: center; margin: 28px 0;">
        <a href="https://boulotman.com/dashboard" target="_blank" style="background: linear-gradient(135deg, #001F3F 0%, #001224 100%); color: #ffffff; padding: 13px 32px; border-radius: 8px; font-size: 15px; font-weight: 700; text-decoration: none; display: inline-block;">
          View Wallet Statement &rarr;
        </a>
      </div>

      <div style="border-top: 1px solid #F1F5F9; padding-top: 18px;">
        <p style="font-size: 12px; line-height: 1.6; color: #94A3B8; margin: 0;">
          Questions about this transaction? Reach our billing department at <a href="mailto:billing@boulotman.com" style="color: #FF4500; text-decoration: none; font-weight: 600;">billing@boulotman.com</a>.
        </p>
      </div>
    """

    html_message = build_branded_email_html(
        heading_title="Official Payment Receipt",
        heading_subtitle=action_label,
        body_content=body_content,
        preheader=f"BoulotMan Payment Receipt: {amount} {currency} - {action_label}"
    )

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

    ack_body = f"""
      <p style="font-size: 16px; font-weight: 600; color: #0f172a; margin: 0 0 14px 0;">Hello <strong>{name}</strong>,</p>
      
      <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 20px 0;">
        Thank you for reaching out to <strong>BoulotMan Support</strong>. We have received your inquiry regarding <strong>"{topic}"</strong> and assigned it ticket priority.
      </p>

      <div style="background-color: #F8FAFC; border-left: 4px solid #001F3F; padding: 16px 20px; margin-bottom: 24px; border-radius: 4px;">
        <p style="margin: 0 0 8px 0; font-size: 13px; color: #64748B;"><strong>Inquiry Topic:</strong> {topic}</p>
        <p style="margin: 0; font-size: 13px; color: #334155; line-height: 1.5;"><em>"{message}"</em></p>
      </div>

      <div style="border-top: 1px solid #F1F5F9; padding-top: 18px;">
        <p style="font-size: 12px; line-height: 1.6; color: #64748B; margin: 0;">
          A customer care specialist will review your inquiry and follow up directly to this email address. Average response time is under 2 hours.
        </p>
      </div>
    """

    ack_html = build_branded_email_html(
        heading_title="Support Request Received",
        heading_subtitle="We are on it!",
        body_content=ack_body,
        preheader=f"We received your support request regarding: {topic}"
    )

    return send_platform_email(
        subject=ack_subject,
        message=ack_plain,
        recipient_list=[email],
        html_message=ack_html,
        sender_type='support',
        fail_silently=True
    )

