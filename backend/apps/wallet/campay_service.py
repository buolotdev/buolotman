import urllib.request
import urllib.error
import json
import logging
from django.conf import settings

logger = logging.getLogger(__name__)

CAMPAY_BASE_URL = getattr(settings, 'CAMPAY_BASE_URL', 'https://www.campay.net/api')
CAMPAY_TOKEN = getattr(settings, 'CAMPAY_PERMANENT_TOKEN', '8e733aef0aaed45c53221bd71154ca82cb3fcb89')
CAMPAY_USERNAME = getattr(settings, 'CAMPAY_APP_USERNAME', '')
CAMPAY_PASSWORD = getattr(settings, 'CAMPAY_APP_PASSWORD', '')


def format_cameroon_phone(phone_str):
    """
    Cleans phone number to standard Cameroon format: 237XXXXXXXXX
    """
    if not phone_str:
        return ""
    digits = ''.join(c for c in str(phone_str) if c.isdigit())
    if digits.startswith('237') and len(digits) >= 12:
        return digits[:12]
    if len(digits) == 9:
        return f"237{digits}"
    return digits


def get_campay_headers():
    token = CAMPAY_TOKEN
    return {
        "Authorization": f"Token {token}",
        "Content-Type": "application/json",
        "Accept": "application/json",
    }


def campay_get_balance():
    """
    Returns current CamPay account balance (MTN, Orange, Total).
    """
    url = f"{CAMPAY_BASE_URL}/balance/"
    req = urllib.request.Request(url, headers=get_campay_headers(), method="GET")
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            return {"success": True, "data": data}
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        logger.error(f"CamPay balance HTTPError: {e.code} - {error_body}")
        return {"success": False, "error": error_body, "status_code": e.code}
    except Exception as e:
        logger.error(f"CamPay balance error: {str(e)}")
        return {"success": False, "error": str(e)}


def campay_collect(amount, phone_number, description="Boulot Man Payment", external_reference=""):
    """
    Initiates Mobile Money payment prompt (USSD push) on user's phone.
    Returns reference and initial status.
    """
    url = f"{CAMPAY_BASE_URL}/collect/"
    cleaned_phone = format_cameroon_phone(phone_number)
    
    payload = {
        "amount": str(int(float(amount))),
        "currency": "XAF",
        "from": cleaned_phone,
        "description": description[:100],
        "external_reference": str(external_reference)[:100] if external_reference else "",
    }
    
    encoded_data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(url, data=encoded_data, headers=get_campay_headers(), method="POST")
    
    try:
        with urllib.request.urlopen(req, timeout=25) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            return {
                "success": True,
                "reference": data.get("reference"),
                "ussd_code": data.get("ussd_code"),
                "operator": data.get("operator"),
                "data": data,
            }
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        try:
            parsed = json.loads(error_body)
        except Exception:
            parsed = {"detail": error_body}
        logger.error(f"CamPay collect HTTPError: {e.code} - {error_body}")
        return {"success": False, "error": parsed, "status_code": e.code}
    except Exception as e:
        logger.error(f"CamPay collect error: {str(e)}")
        return {"success": False, "error": str(e)}


def campay_check_transaction(reference):
    """
    Queries transaction status by CamPay reference.
    Statuses: SUCCESSFUL, FAILED, PENDING
    """
    if not reference:
        return {"success": False, "error": "Reference is required"}
        
    url = f"{CAMPAY_BASE_URL}/transaction/{reference}/"
    req = urllib.request.Request(url, headers=get_campay_headers(), method="GET")
    
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            # status is typically 'SUCCESSFUL', 'FAILED', or 'PENDING'
            tx_status = (data.get("status") or "").upper()
            return {
                "success": True,
                "status": tx_status,
                "amount": data.get("amount"),
                "currency": data.get("currency"),
                "reference": data.get("reference"),
                "operator": data.get("operator"),
                "code": data.get("code"),
                "operator_reference": data.get("operator_reference"),
                "external_reference": data.get("external_reference"),
                "data": data,
            }
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        logger.error(f"CamPay check_transaction HTTPError: {e.code} - {error_body}")
        return {"success": False, "error": error_body, "status_code": e.code}
    except Exception as e:
        logger.error(f"CamPay check_transaction error: {str(e)}")
        return {"success": False, "error": str(e)}


def campay_withdraw(amount, phone_number, description="Boulot Man Payout", external_reference=""):
    """
    Disburses money to technician/company Mobile Money account.
    """
    url = f"{CAMPAY_BASE_URL}/withdraw/"
    cleaned_phone = format_cameroon_phone(phone_number)
    
    payload = {
        "amount": str(int(float(amount))),
        "currency": "XAF",
        "to": cleaned_phone,
        "description": description[:100],
        "external_reference": str(external_reference)[:100] if external_reference else "",
    }
    
    encoded_data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(url, data=encoded_data, headers=get_campay_headers(), method="POST")
    
    try:
        with urllib.request.urlopen(req, timeout=25) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            return {
                "success": True,
                "reference": data.get("reference"),
                "data": data,
            }
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        try:
            parsed = json.loads(error_body)
        except Exception:
            parsed = {"detail": error_body}
        logger.error(f"CamPay withdraw HTTPError: {e.code} - {error_body}")
        return {"success": False, "error": parsed, "status_code": e.code}
    except Exception as e:
        logger.error(f"CamPay withdraw error: {str(e)}")
        return {"success": False, "error": str(e)}
