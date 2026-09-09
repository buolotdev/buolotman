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

## 3. Communication & User Preferences
- **Language:** Communicate primarily in simple Roman Urdu / Urdu.
- **Design Guidelines:**
  - Corporate / Company profile avatars must be circular (`border-radius: 50%`).
  - Trust badges (RCCM, IFU, Insurance, Capability) must NEVER be hardcoded; only display when verified in backend.
  - Services/team fallback texts must not hardcode static categories.
