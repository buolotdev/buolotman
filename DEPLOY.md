# Boulot Man - Deployment Guide (Free Tier, No Credit Card)

## Architecture
- **Frontend** → Vercel (Hobby, no card)
- **Backend** → Render (Free Web Service)
- **Database** → Neon PostgreSQL (free, already in use)
- **Cache** → Upstash Redis (free, optional but recommended)
- **Storage** → Supabase Storage (free, already in use)
- **Region** → Frankfurt (fra1) for Vercel, EU-West for Render

## Free Tier Limits
- **Vercel**: 100 GB bandwidth/mo, 100 deployments/day
- **Render**: 750 hours/mo (enough for 1 always-on service), 512 MB RAM
- **Neon**: 0.5 GB storage, 191.9 compute hours/mo
- **Upstash**: 10k commands/day
- **Supabase**: 1 GB storage, 2 GB bandwidth

---

## Step 1: Push to GitHub
Repository is already a git repo. Push to GitHub first.

```bash
cd "C:\Users\Haram\Desktop\buolot-man"
git add -A
git commit -m "Deploy: production-ready build with demo data, Supabase uploads, Redis cache"
git push origin main
```

## Step 2: Deploy Backend to Render

1. Go to https://dashboard.render.com → Sign in with GitHub
2. Click **"New +"** → **"Blueprint"**
3. Connect your `buolot-man` GitHub repo
4. Render auto-detects `backend/render.yaml`
5. Fill in the env vars (everything else is pre-configured):
   - `SECRET_KEY` → click "Generate"
   - `CORS_ALLOWED_ORIGINS` → `https://boulotman.vercel.app` (will update after frontend deploy)
   - `DATABASE_URL` → paste Neon connection string
   - `SUPABASE_SERVICE_KEY` → paste from .env
6. Click **"Apply"** → wait ~5 min for first build
7. Note the URL: `https://boulotman-api.onrender.com`
8. Run demo seed: in Render Shell tab:
   ```bash
   python manage.py seed_demo
   ```

## Step 3: Deploy Frontend to Vercel

1. Go to https://vercel.com → Sign in with GitHub
2. Click **"Add New..."** → **"Project"**
3. Import the `buolot-man` repo
4. **Root Directory**: leave as `.` (or `buolot-man` if monorepo)
5. **Framework**: Next.js (auto-detected)
6. **Environment Variables**:
   - `NEXT_PUBLIC_API_URL` = `https://boulotman-api.onrender.com`
7. Click **"Deploy"** → wait ~2 min
8. Note the URL: `https://boulotman.vercel.app` (or random)
9. Go back to Render → update `CORS_ALLOWED_ORIGINS` → redeploy

## Step 4 (Optional): Add Upstash Redis

1. Go to https://console.upstash.com → Sign in with Gmail
2. **Create Database** → Region: EU-West-1, TLS: enabled, type: Pay-as-you-go (still free within limits)
3. Copy the **Redis URL** (starts with `rediss://...`)
4. Add to Render env vars as `REDIS_URL` → Save → Render auto-redeploys
5. Cache is now active for categories, skills, list_users, list_companies

## Step 5: Test Live

Visit `https://boulotman.vercel.app` and test:
- Signup flow (client/technician/company)
- Login as `admin@boulotman.com` / `DemoPass123!`
- Login as `moussa.tech@boulotman.com` to test technician dashboard
- Post a task, place a bid, send a message
- Upload an avatar

---

## Demo Credentials (password: `DemoPass123!`)

| Role | Email |
|---|---|
| Admin | admin@boulotman.com |
| Client (Dakar) | amina.client@boulotman.com |
| Client (Accra) | kwame.client@boulotman.com |
| Technician | moussa.tech@boulotman.com |
| Technician | fatou.tech@boulotman.com |
| Technician | ousmane.tech@boulotman.com |
| Technician | awa.tech@boulotman.com |
| Company | contact@kebuildingsolutions.com |

---

## Important Notes

- **Render free tier sleeps after 15 min of inactivity**. First request takes ~30s while it wakes up. This is fine for a demo.
- **Never commit `.env`** — it's in `.gitignore`
- **Vercel free tier**: no sleep, instant. Perfect for frontend.
- **CORS**: always update `CORS_ALLOWED_ORIGINS` in Render after you know the Vercel URL.
- **Logs**: check Render → Logs tab for backend errors. Vercel → Logs for frontend.
- **If demo seed fails**: run `python manage.py migrate --no-input` first, then `seed_demo --reset`.

## Scaling Beyond Free Tier

When you outgrow free limits (1k+ DAUs):
- **Database**: Neon Scale plan ($19/mo) — auto-scaling
- **Backend**: Render Standard ($7/mo) — no sleep, 2 GB RAM
- **Cache**: Upstash Pro ($1/100k commands)
- **Storage**: Supabase Pro ($25/mo) — 100 GB storage, daily backups
- **CDN**: Vercel Pro is usually not needed
