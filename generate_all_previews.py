import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')

from utils.email_service import build_branded_email_html

previews = {}

# 1. Welcome Email
welcome_body = """
  <p style="font-size: 16px; font-weight: 700; color: #0F172A; margin: 0 0 16px 0;">Hello <strong>Alex Johnson</strong>,</p>
  
  <p style="font-size: 14px; line-height: 1.7; color: #334155; margin: 0 0 20px 0;">
    Welcome to <strong>BoulotMan</strong>! We connect clients, verified technicians, and companies with guaranteed escrow payments, milestone tracking, and verified workmanship.
  </p>

  <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px 22px; margin: 0 0 24px 0;">
    <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: 800; color: #001F3F;">What you can do with BoulotMan:</p>
    <ul style="margin: 0; padding-left: 18px; font-size: 13px; color: #475569; line-height: 1.8;">
      <li>Post or discover technical service contracts across Africa</li>
      <li>Work securely with Milestone-based Escrow payments</li>
      <li>Real-time chat and proposal negotiations</li>
    </ul>
  </div>

  <div style="text-align: center; margin: 28px 0;">
    <a href="https://boulotman.com/login" target="_blank" style="background: linear-gradient(135deg, #FF4500 0%, #E03D00 100%); color: #ffffff; padding: 14px 34px; border-radius: 10px; font-size: 15px; font-weight: 800; text-decoration: none; display: inline-block; box-shadow: 0 4px 14px rgba(255, 69, 0, 0.35);">
      Go to Dashboard &rarr;
    </a>
  </div>

  <div style="border-top: 1px solid #F1F5F9; padding-top: 18px;">
    <p style="font-size: 12px; line-height: 1.6; color: #94A3B8; margin: 0;">
      Need assistance? Our support team is ready to help at <a href="mailto:support@boulotman.com" style="color: #FF4500; text-decoration: none; font-weight: 700;">support@boulotman.com</a>.
    </p>
  </div>
"""
previews['welcome.html'] = build_branded_email_html("Welcome to BoulotMan!", "Verified Work & Technical Services", welcome_body)

# 2. Verification Approved Email
verified_body = """
  <div style="text-align: center; margin-bottom: 22px;">
    <div style="display: inline-block; background-color: #ECFDF5; border: 1px solid #A7F3D0; border-radius: 50px; padding: 7px 22px; color: #059669; font-size: 13px; font-weight: 800;">
      &#10004; Account Officially Verified
    </div>
  </div>

  <p style="font-size: 16px; font-weight: 700; color: #0F172A; margin: 0 0 14px 0;">Hello <strong>Master Electricians Ltd</strong>,</p>
  
  <p style="font-size: 14px; line-height: 1.7; color: #334155; margin: 0 0 20px 0;">
    Great news! Our administrative review team has verified your credentials and approved your <strong>Company</strong> account. Your profile now proudly displays the official <strong>Verified Badge</strong>.
  </p>

  <div style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 12px; padding: 18px 20px; margin: 0 0 24px 0;">
    <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 800; color: #166534;">Unlocked Verified Features:</p>
    <ul style="margin: 0; padding-left: 18px; font-size: 13px; color: #15803D; line-height: 1.8;">
      <li>Verified Trust Badge displayed on your public profile</li>
      <li>Full bidding access on high-value client projects</li>
      <li>Direct Milestone Escrow payouts</li>
    </ul>
  </div>

  <div style="text-align: center; margin: 28px 0;">
    <a href="https://boulotman.com/dashboard/company" target="_blank" style="background: linear-gradient(135deg, #059669 0%, #047857 100%); color: #ffffff; padding: 14px 34px; border-radius: 10px; font-size: 15px; font-weight: 800; text-decoration: none; display: inline-block; box-shadow: 0 4px 14px rgba(5, 150, 105, 0.35);">
      Access Verified Dashboard &rarr;
    </a>
  </div>
"""
previews['verified.html'] = build_branded_email_html("Account Verified!", "Verified Status Approved", verified_body)

# 3. New Proposal Received Email
proposal_body = """
  <p style="font-size: 16px; font-weight: 700; color: #0F172A; margin: 0 0 14px 0;">Hello <strong>David Miller</strong>,</p>
  
  <p style="font-size: 14px; line-height: 1.7; color: #334155; margin: 0 0 20px 0;">
    You received a new proposal for your task: <strong>"Commercial Solar Inverter Installation"</strong>.
  </p>

  <div style="background-color: #F8FAFC; border-left: 4px solid #FF4500; border-radius: 8px; padding: 18px 20px; margin-bottom: 24px; border: 1px solid #E2E8F0; border-left-width: 4px;">
    <p style="margin: 0 0 8px 0; font-size: 14px; color: #001F3F;"><strong>Provider:</strong> Samuel Eto'o (Certified Electrician)</p>
    <p style="margin: 0; font-size: 14px; color: #001F3F;"><strong>Proposed Amount:</strong> <span style="font-weight: 800; color: #FF4500; font-size: 16px;">150,000 XAF</span></p>
  </div>

  <div style="text-align: center; margin: 28px 0;">
    <a href="https://boulotman.com/dashboard/client/tasks/12" target="_blank" style="background: linear-gradient(135deg, #FF4500 0%, #E03D00 100%); color: #ffffff; padding: 14px 34px; border-radius: 10px; font-size: 15px; font-weight: 800; text-decoration: none; display: inline-block; box-shadow: 0 4px 14px rgba(255, 69, 0, 0.35);">
      Review & Award Proposal &rarr;
    </a>
  </div>

  <div style="border-top: 1px solid #F1F5F9; padding-top: 18px;">
    <p style="font-size: 12px; line-height: 1.6; color: #94A3B8; margin: 0;">
      All payments on BoulotMan are protected with secure escrow. Funds are only released when you approve milestone completion.
    </p>
  </div>
"""
previews['proposal.html'] = build_branded_email_html("New Proposal Received", 'Task: "Solar Inverter Installation"', proposal_body)

# 4. Payment Escrow Receipt
payment_body = """
  <p style="font-size: 16px; font-weight: 700; color: #0F172A; margin: 0 0 14px 0;">Hello <strong>David Miller</strong>,</p>
  
  <p style="font-size: 14px; line-height: 1.7; color: #334155; margin: 0 0 20px 0;">
    Your recent payment activity has been securely processed by BoulotMan Escrow.
  </p>

  <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
    <table width="100%" style="font-size: 14px; color: #334155; border-collapse: collapse;">
      <tr style="border-bottom: 1px solid #E2E8F0;"><td style="padding: 10px 0; color: #64748B;">Status</td><td align="right" style="font-weight: 800; color: #059669;">&#10004; Escrow Deposit Confirmed</td></tr>
      <tr style="border-bottom: 1px solid #E2E8F0;"><td style="padding: 10px 0; color: #64748B;">Amount</td><td align="right" style="font-size: 18px; font-weight: 900; color: #FF4500;">150,000 XAF</td></tr>
      <tr><td style="padding: 10px 0; color: #64748B;">Project</td><td align="right" style="font-weight: 700; color: #001F3F;">Solar Inverter Installation</td></tr>
    </table>
  </div>

  <div style="text-align: center; margin: 28px 0;">
    <a href="https://boulotman.com/dashboard/client/payments" target="_blank" style="background: linear-gradient(135deg, #001F3F 0%, #0A2D52 100%); color: #ffffff; padding: 14px 34px; border-radius: 10px; font-size: 15px; font-weight: 800; text-decoration: none; display: inline-block;">
      View Wallet Statement &rarr;
    </a>
  </div>
"""
previews['payment.html'] = build_branded_email_html("Official Payment Receipt", "Escrow Deposit Confirmed", payment_body)

for filename, content in previews.items():
    out_path = os.path.join(os.path.dirname(__file__), 'public', filename)
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Generated: {out_path}")
