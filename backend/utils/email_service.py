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
