# Deployment Rules

**Frontend Deployment:**
- Hosted on AWS Amplify.
- Connected to GitHub, so any `git push origin main` AUTOMATICALLY triggers a deploy on AWS Amplify.
- Do NOT generate frontend ZIP files unless explicitly asked.
- NEVER mention Vercel.

**Backend Deployment:**
- Hosted on AWS Elastic Beanstalk.
- Deployments are done MANUALLY by the user.
- I need to generate the ZIP file for the backend (`python create_eb_zip_linux.py`) when backend changes are made.
