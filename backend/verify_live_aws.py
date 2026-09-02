import urllib.request
import urllib.error
import json
import uuid
import sys

BASE_URL = "http://BoulotMan-API-env.eba-exncce63.eu-north-1.elasticbeanstalk.com"

def run_request(url, method="GET", headers=None, data=None):
    if headers is None:
        headers = {}
    
    encoded_data = None
    if data is not None:
        encoded_data = json.dumps(data).encode("utf-8")
        headers["Content-Type"] = "application/json"
    
    req = urllib.request.Request(url, data=encoded_data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            status_code = resp.status
            body = resp.read().decode("utf-8")
            parsed_json = json.loads(body) if body else {}
            return status_code, parsed_json
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        try:
            parsed_json = json.loads(body)
        except Exception:
            parsed_json = {"raw_error": body}
        return e.code, parsed_json
    except Exception as e:
        return 0, {"error": str(e)}

def main():
    print(f"=== Testing Live AWS Elastic Beanstalk Environment: {BASE_URL} ===\n")
    
    uid = str(uuid.uuid4())[:8]
    test_email = f"live_tech_{uid}@boulotman.com"
    test_pass = "LiveTestPass123!"
    
    # 1. Register a technician user on live server
    print(f"1. Registering test technician: {test_email} ...")
    reg_status, reg_data = run_request(
        f"{BASE_URL}/api/auth/register/technician/",
        method="POST",
        data={
            "email": test_email,
            "username": f"livetech_{uid}",
            "password": test_pass,
            "first_name": "Live",
            "last_name": "Tester",
            "phone": "+250788990011",
            "country": "Rwanda",
            "role": "TECHNICIAN"
        }
    )
    
    token = None
    if reg_status in [200, 201]:
        print(f"   [OK] Registration Successful (Status {reg_status})")
    else:
        print(f"   Registration note (Status {reg_status}): {reg_data}")

    print(f"   Logging in to obtain JWT access token...")
    login_status, login_data = run_request(
        f"{BASE_URL}/api/auth/login/",
        method="POST",
        data={"username": test_email, "password": test_pass}
    )
    if login_status == 200:
        token = login_data.get("access")
        print(f"   [OK] Login Successful (Status 200)")
    else:
        print(f"   [FAIL] Login Failed: {login_data}")
        return

    if not token:
        print("[FAIL] No JWT access token retrieved.")
        return

    auth_headers = {"Authorization": f"Bearer {token}"}

    # 2. Test DELETE endpoint check (check if route is live)
    print("\n2. Checking DELETE /api/auth/user/delete/ route presence...")
    del_check_status, del_check_data = run_request(
        f"{BASE_URL}/api/auth/user/delete/",
        method="GET"
    )
    if del_check_status == 404:
        print(f"   [FAIL] Route returns 404 Not Found! The latest code is NOT yet deployed on AWS.")
        print(f"   Please upload 'aws-eb-final.zip' in the AWS Elastic Beanstalk Console (BoulotMan-API-env).\n")
    else:
        print(f"   [OK] Route exists (Status {del_check_status} returned, not 404).")

    # 3. Test Unknown Field Rejection (Must return 400)
    print("\n3. Testing Unknown Field Rejection on PATCH /api/auth/me/ ...")
    unk_status, unk_data = run_request(
        f"{BASE_URL}/api/auth/me/",
        method="PATCH",
        headers=auth_headers,
        data={"random_fake_field_123": "invalid_value"}
    )
    print(f"   Unknown field response status: {unk_status} (Expected 400)")
    print(f"   Response payload: {unk_data}")

    # 4. Test Comprehensive Profile PATCH
    print("\n4. Testing Comprehensive Technician Profile PATCH /api/auth/me/ ...")
    patch_payload = {
        "first_name": "LiveJoseph",
        "last_name": "Mugisha",
        "phone": "+250788112233",
        "country": "Rwanda",
        "city": "Kigali",
        "emergency_contact_name": "Sarah Mugisha",
        "emergency_contact_phone": "+250788998877",
        "headline": "Lead Solar & High Voltage Engineer",
        "experience_years": "9",
        "bio": "Certified commercial solar installations and 3-phase grid maintenance.",
        "hourly_rate": "30000",
        "daily_rate": "180000 RWF / day",
        "starting_price": "30000 RWF",
        "inspection_fee": "15000 RWF",
        "is_negotiable": True,
        "pricing": {
            "hourly_rate": "30000",
            "daily_rate": "180000 RWF / day",
            "starting_price": "30000 RWF",
            "inspection_fee": "15000 RWF",
            "is_negotiable": True
        },
        "availability": "available",
        "response_time": "Within 30 mins",
        "skills": ["Solar Grid Setup", "Commercial Inverter Repair"],
        "tools": ["Fluke 87V Multimeter", "Hydraulic Crimper"],
        "payout": {
            "method": "MTN Mobile Money",
            "account_number": "+250788112233",
            "account_name": "Joseph Mugisha"
        },
        "kyc": {
            "id_type": "national_id",
            "id_number": "1199580012345678",
            "status": "verified"
        }
    }
    patch_status, patch_data = run_request(
        f"{BASE_URL}/api/auth/me/",
        method="PATCH",
        headers=auth_headers,
        data=patch_payload
    )
    print(f"   PATCH response status: {patch_status} (Expected 200)")

    # 5. Test GET /api/auth/me/ on same user
    print("\n5. Testing GET /api/auth/me/ to verify persistence...")
    get_status, get_data = run_request(
        f"{BASE_URL}/api/auth/me/",
        method="GET",
        headers=auth_headers
    )
    print(f"   GET response status: {get_status} (Expected 200)")
    
    if get_status == 200:
        print("\n   --- Verified Fields Returned on Live Server ---")
        print(f"   • Country: {get_data.get('country')}")
        print(f"   • City: {get_data.get('city')}")
        print(f"   • Headline: {get_data.get('headline')}")
        print(f"   • Experience Years: {get_data.get('experience_years')}")
        print(f"   • Emergency Contact: {get_data.get('emergency_contact_name')} ({get_data.get('emergency_contact_phone')})")
        print(f"   • Pricing: {get_data.get('pricing')}")
        print(f"   • Availability: {get_data.get('availability')} (Available Now: {get_data.get('available_now')})")
        print(f"   • Payout: {get_data.get('payout')}")
        print(f"   • KYC: {get_data.get('kyc')}")
        print(f"   • Skills: {get_data.get('skills')}")
        print(f"   • Tools: {get_data.get('tools')}")

    # 6. Test Account Deletion on live server
    print("\n6. Testing DELETE /api/auth/user/delete/ on test account...")
    del_status, del_data = run_request(
        f"{BASE_URL}/api/auth/user/delete/",
        method="DELETE",
        headers=auth_headers
    )
    print(f"   DELETE response status: {del_status} (Expected 204 No Content)")

if __name__ == "__main__":
    main()
