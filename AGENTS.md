<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Deployment & Architecture Memory (CRITICAL)

## 1. Frontend Deployment (Netlify)
- **Hosting:** Netlify (configured via `netlify.toml` with Next.js plugin).
- **Auto-Deployment:** Connected to GitHub repo `https://github.com/buolotdev/buolotman.git` on branch `main`.
- **How to deploy frontend:** Simply commit and run:
  ```bash
  git push origin main
  ```
  Netlify automatically detects new commits and deploys within 1-2 minutes.

## 2. Backend Deployment (AWS Elastic Beanstalk)
- **Hosting:** AWS Elastic Beanstalk (Environment: `BoulotMan-API-env`, region: `eu-north-1`).
- **How to deploy backend:**
  1. Run script:
     ```bash
     python create_eb_zip.py
     ```
     This automatically packages `backend/` into `Desktop/aws-eb-final.zip` (excluding git, venv, pycache, and sqlite database).
  2. In AWS Elastic Beanstalk Console, click **"Upload and Deploy"** and upload `aws-eb-final.zip`.

## 3. Mobile Developer Files - Safe Merge Protocol (STRICT RULE)
- **Problem:** Mobile developer frequently sends backend files (e.g. `views.py`, `models.py`, `asgi.py`, `consumers.py`) that may lack website logic (categories, custom company endpoints, email templates, trust badges).
- **Rule:** **NEVER directly overwrite or blindly replace existing backend files** with mobile developer files.
- **Workflow:**
  1. Inspect the incoming mobile developer files side-by-side with existing code.
  2. Extract and merge ONLY the new mobile app endpoints, serializers, or WebSocket consumers.
  3. Ensure all website endpoints (`categories`, `email_service`, `company`, `wallet`, `search`, `tasks`) remain 100% intact and functional.
  4. Always test/verify before generating `aws-eb-final.zip` and pushing to Git.

## 4. Communication & User Preferences
- **Language:** Communicate primarily in simple Roman Urdu / Urdu.
- **Design Guidelines:**
  - Corporate / Company profile avatars must be circular (`border-radius: 50%`).
  - Trust badges (RCCM, IFU, Insurance, Capability) must NEVER be hardcoded; only display when verified in backend.
  - Services/team fallback texts must not hardcode static categories.
  - Categories must always have self-healing seeder on backend and client-side safe fallbacks.
