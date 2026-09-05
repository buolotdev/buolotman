import random
import string
import logging

logger = logging.getLogger(__name__)


def generate_otp(length=6):
    return ''.join(random.choices(string.digits, k=length))


def send_otp(phone, otp, email=None, purpose='verification', user_name=None):
    logger.info("OTP for %s (email: %s, purpose: %s): %s", phone, email, purpose, otp)
    if email:
        try:
            from utils.email_service import send_otp_email
            send_otp_email(email, otp, purpose=purpose, user_name=user_name)
        except Exception as e:
            logger.error("Failed to send OTP email to %s: %s", email, e)
    return True
