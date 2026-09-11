import os
import sys

# Add backend directory to sys.path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')

from utils.email_service import build_branded_email_html, send_otp_email

# Generate sample password reset HTML
is_password_reset = True
code = "849201"
greeting = "Hello User,"
subject = f"🔐 Your BoulotMan Password Reset Code: {code}"
badge_text = "🔒 PASSWORD RESET REQUEST"
badge_bg = "#FEF2F2"
badge_border = "#FECACA"
badge_color = "#DC2626"
instruction_text = (
    "We received a request to reset the password for your <strong>BoulotMan</strong> account.<br>"
    "Please use the 6-digit verification code below to set your new password:"
)
warning_note = (
    "If you did not request a password reset, you can safely ignore this email. "
    "Your password will remain unchanged, and your account is completely secure."
)

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
    heading_title="BoulotMan Security",
    heading_subtitle="Verified Work & Technical Services",
    body_content=body_content,
    preheader=f"Your Password Reset Code is {code} (expires in 15 minutes)"
)

preview_path = os.path.join(os.path.dirname(__file__), 'public', 'email_preview.html')
with open(preview_path, 'w', encoding='utf-8') as f:
    f.write(html_message)

print(f"Generated successfully at: {preview_path}")
