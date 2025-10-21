import os
import json
import sys
from datetime import datetime, timezone
import random
import string

import requests


"""
End-to-end test for the Job Seeker My Profile flow.

What it does:
1) Authenticate (via /api/auth/login) or use TOKEN env var
2) Submit a sample profile to /api/jobseeker/complete-profile (multipart form)
3) Verify data via /api/profile/profile and /api/jobseeker/profile

Usage:
  BASE_URL=http://localhost:3000 \
  USER_EMAIL=test@example.com \
  USER_PASSWORD=secret \
  python scripts/test_profile_flow.py

Alternatively, set TOKEN to skip login:
  TOKEN=eyJ... python scripts/test_profile_flow.py
"""


def env(name: str, default: str | None = None) -> str:
    val = os.getenv(name, default)
    if val is None:
        print(f"Missing required env var: {name}")
        sys.exit(1)
    return val


def random_email() -> str:
    ts = datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')
    suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=6))
    return f"test+e2e_{ts}_{suffix}@example.com"


def login(base_url: str) -> str:
    # Prefer credentials if provided, else fall back to TOKEN
    email = os.getenv("USER_EMAIL")
    password = os.getenv("USER_PASSWORD")
    if email and password:
        url = f"{base_url}/api/auth/login"
        resp = requests.post(url, json={"email": email, "password": password}, timeout=20)
        if resp.status_code >= 400:
            print("Login failed:", resp.status_code, resp.text)
            sys.exit(1)
        data = resp.json() if resp.headers.get("content-type", "").startswith("application/json") else {}
        token = data.get("token") or data.get("access_token") or data.get("jwt")
        if not token:
            print("Login response did not include a token. Response:", data)
            sys.exit(1)
        return token

    token = os.getenv("TOKEN")
    if token:
        return token

    # Auto-register a temporary user (best-effort) then login
    email = random_email()
    password = "Test@12345"
    try:
        reg_url = f"{base_url}/api/auth/register"
        payload = {"email": email, "password": password, "role": "jobSeeker"}
        resp = requests.post(reg_url, json=payload, timeout=20)
        # Accept 200/201; if backend requires verification, login may still work depending on config
        if resp.status_code >= 400:
            print("Register warning:", resp.status_code, resp.text)
    except Exception as e:
        print("Register error (continuing to login):", e)

    print(f"Auto-testing with temp user {email}")
    login_url = f"{base_url}/api/auth/login"
    resp = requests.post(login_url, json={"email": email, "password": password}, timeout=20)
    if resp.status_code >= 400:
        print("Login failed for temp user:", resp.status_code, resp.text)
        print("Set USER_EMAIL and USER_PASSWORD or a valid TOKEN to run the test.")
        sys.exit(1)
    data = resp.json() if resp.headers.get("content-type", "").startswith("application/json") else {}
    token = data.get("token") or data.get("access_token") or data.get("jwt")
    if not token:
        print("Login response did not include a token. Response:", data)
        sys.exit(1)
    return token


def submit_profile(base_url: str, token: str) -> None:
    url = f"{base_url}/api/jobseeker/complete-profile"
    headers = {"Authorization": f"Bearer {token}"}

    # Compose payload similar to the registration form (arrays are JSON-stringified)
    now_year = datetime.now(timezone.utc).year
    payload = {
        # Personal
        "firstName": "Rahul",
        "lastName": "Shah",
        "email": os.getenv("USER_EMAIL", "rahul.shah.test@example.com"),
        "phone": "+254 700 000 000",
        "dateOfBirth": "1992-05-15",
        "gender": "male",
        "nationality": "Kenyan",
        "residentCountry": "Kenya",
        "currentCity": "Nairobi",
        "workPermit": "citizen",

        # Professional profile
        "professionalTitle": "Senior Software Engineer",
        "yearsExperience": "7-10",
        "careerLevel": "senior",
        "industry": "technology",
        "summary": "Experienced engineer with focus on scalable APIs and mentoring.",

        # Preferences
        "jobType": "full-time",
        "noticePeriod": "1-month",
        "expectedSalary": "USD 80,000 - 100,000",
        "currencyPreference": "USD",
    }

    # Arrays (stringified like the form does with FormData)
    payload["experienceEntries"] = json.dumps([
        {
            "jobTitle": "Senior Software Engineer",
            "company": "TechCorp Kenya",
            "companyLocation": "Nairobi, Kenya",
            "employmentType": "full-time",
            "jobIndustry": "technology",
            "startDate": f"{now_year-3}-01",
            "endDate": "",
            "currentJob": True,
            "jobDescription": "Lead services and mentor team."
        }
    ])
    payload["educationEntries"] = json.dumps([
        {
            "degreeType": "bachelor",
            "fieldOfStudy": "Computer Science",
            "institution": "University of Nairobi",
            "institutionLocation": "Nairobi, Kenya",
            "grade": "First Class",
            "eduStartYear": str(now_year-8),
            "eduEndYear": str(now_year-4),
            "eduActivities": "Projects and leadership"
        }
    ])
    payload["coreSkills"] = json.dumps(["Python", "React", "AWS"])
    payload["tools"] = json.dumps(["Docker", "GitHub"])
    payload["languages"] = json.dumps([{"language": "English", "proficiency": "fluent"}])
    payload["certificationEntries"] = json.dumps([
        {
            "certificationName": "AWS Solutions Architect",
            "certIssuer": "Amazon",
            "certIssueDate": f"{now_year-2}-06",
            "certExpiryDate": "",
            "credentialId": "AWS-XYZ"
        }
    ])
    payload["professionalLinks"] = json.dumps([
        {"type": "LinkedIn", "url": "https://www.linkedin.com/in/rahul-shah"}
    ])

    # Use multipart/form-data (files=None) like the web form
    resp = requests.post(url, headers=headers, files={}, data=payload, timeout=30)
    if resp.status_code >= 400:
        print("Profile submit failed:", resp.status_code, resp.text)
        sys.exit(1)


def fetch_profile(base_url: str, token: str) -> dict:
    headers = {"Authorization": f"Bearer {token}"}
    # Primary endpoint used in dashboard
    url = f"{base_url}/api/profile/profile"
    resp = requests.get(url, headers=headers, timeout=20)
    if resp.status_code >= 400:
        print("Fetch /api/profile/profile failed:", resp.status_code, resp.text)
        sys.exit(1)
    data = resp.json() if resp.headers.get("content-type", "").startswith("application/json") else {}

    # Optional second endpoint used in registration
    url2 = f"{base_url}/api/jobseeker/profile"
    try:
        resp2 = requests.get(url2, headers=headers, timeout=20)
        if resp2.status_code < 400 and resp2.headers.get("content-type", "").startswith("application/json"):
            data["_secondary"] = resp2.json()
    except Exception:
        pass

    return data


def assert_profile_fields(profile: dict) -> None:
    # Accept values from either primary or secondary payloads
    primary = profile
    secondary = profile.get("_secondary", {})

    def pick(*keys):
        for k in keys:
            if k in primary and primary[k]:
                return primary[k]
            if k in secondary and secondary[k]:
                return secondary[k]
        return None

    expected = {
        "professionalTitle": "Senior Software Engineer",
        "nationality": "Kenyan",
    }

    title = pick("professionalTitle", "job_title")
    nationality = pick("nationality")
    first_name = pick("firstName", "first_name")
    last_name = pick("lastName", "last_name")

    assert title and expected["professionalTitle"].split()[0] in title, f"Unexpected title: {title}"
    assert nationality == expected["nationality"], f"Unexpected nationality: {nationality}"
    assert first_name, "Missing firstName"
    assert last_name, "Missing lastName"


def main():
    # Backend runs on 3002 by default; override via BASE_URL if needed
    base_url = env("BASE_URL", "http://localhost:3002")
    token = login(base_url)

    print("1) Submitting profile...")
    submit_profile(base_url, token)

    print("2) Fetching profile...")
    profile = fetch_profile(base_url, token)

    print("3) Asserting fields...")
    assert_profile_fields(profile)

    print("\n✔ My Profile flow passed. Key fields are present and consistent.")


if __name__ == "__main__":
    main()


