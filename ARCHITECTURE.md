# Boulot Man - Production-Ready Architecture Plan

> Africa's Professional Marketplace
> This document is the single source of truth for the project architecture.

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | Next.js 16 + React 19 + TypeScript | Already in use |
| **Backend** | Django 5.2 + DRF + SimpleJWT | Already in use, proven at scale |
| **Database** | PostgreSQL (Neon free tier) | ACID, concurrent, scalable |
| **File Storage** | Cloudflare R2 (S3-compatible) | 10GB free, zero egress fees |
| **Cache** | Upstash Redis (free tier) | Rate limiting, sessions, hot data |
| **Search** | PostgreSQL full-text → Meilisearch later | No external dependency to start |
| **Realtime** | Django Channels + WebSocket (later) | Messaging, notifications |

---

## Accounts & Services

Create a project email (e.g., `buolotdev@gmail.com`) and use it for:

| Service | Purpose | Free Tier |
|---------|---------|-----------|
| GitHub | Code repository | Unlimited repos |
| Vercel | Frontend hosting | Unlimited deploys |
| Neon | PostgreSQL database | 512MB |
| Cloudflare R2 | File/image storage | 10GB, zero egress |
| Railway | Backend hosting | 500hrs/month (card required) |
| Upstash Redis | Caching | 10K commands/day |
| Sentry | Error tracking | 5K events/month |

---

## Database Models (17)

### Core

```
User (AbstractUser)
├── id, email, first_name, last_name, role
├── avatar_url, phone, is_verified, is_active
├── created_at, updated_at
└── language_preference, country

Category
├── id, name, slug, icon
└── parent (self FK for subcategories)

Task
├── id, title, description, category (FK)
├── client (FK → User)
├── status (draft / open / in_progress / completed / cancelled)
├── budget_min, budget_max, budget_mode (fixed / hourly)
├── urgency (urgent / standard)
├── service_type (onsite / remote / hybrid)
├── location, city, latitude, longitude
├── schedule, deadline
├── materials_provided (bool)
├── contact_methods (JSON)
├── views_count, bids_count
├── created_at, updated_at
└── published_at

TaskAttachment
├── id, task (FK), file_url, file_name
├── file_type (image / file), file_size
└── created_at

Skill
├── id, name, slug
└── category (FK, nullable)

TaskSkill
├── task (FK), skill (FK)
```

### Bid & Proposal

```
Bid
├── id, task (FK), technician (FK → User)
├── amount, amount_type (fixed / hourly)
├── message, duration, extra_notes
├── status (pending / shortlisted / accepted / rejected / withdrawn)
├── created_at, updated_at
└── accepted_at, rejected_at

Question
├── id, task (FK), asker (FK → User)
├── text, created_at
└── reply_text, replied_by (FK), replied_at
```

### Wallet & Payment

```
Wallet
├── id, user (FK → User, one-to-one)
├── available_balance, pending_escrow
├── total_earnings, total_withdrawn
└── currency (default: XOF)

Transaction
├── id, wallet (FK)
├── amount, type (credit / debit / pending)
├── category (earnings / withdrawal / escrow_hold / escrow_release / refund)
├── reference (task FK, nullable)
├── description, status (completed / pending / failed)
├── metadata (JSON)
└── created_at
```

### Messaging

```
Conversation
├── id, task (FK, nullable)
├── created_at, updated_at
└── last_message_at

ConversationParticipant
├── conversation (FK), user (FK)
├── unread_count, last_read_at
└── joined_at

Message
├── id, conversation (FK), sender (FK → User)
├── text, created_at
└── read_at
```

### Company & Profile

```
CompanyProfile
├── user (FK → User, one-to-one)
├── company_name, registration_number
├── services_offered (JSON), company_size
├── logo_url, cover_url
├── about, website
├── headquarters, business_hours (JSON)
└── is_verified

TechnicianProfile
├── user (FK → User, one-to-one)
├── phone_number, bio, hourly_rate
├── skills (M2M → Skill)
├── languages (JSON), portfolio (JSON)
├── background_check_status
├── is_verified
└── availability_status

PortfolioItem
├── id, user (FK)
├── title, description, category
├── image_url, completed_date
└── project_value
```

### Trust & Safety

```
Review
├── id, task (FK), reviewer (FK), reviewee (FK)
├── rating (1-5), text
└── created_at

SavedProfessional
├── user (FK → Client), professional (FK → User)
└── created_at

KYCVerification
├── id, user (FK)
├── document_type, document_url
├── status (pending / approved / rejected)
├── reviewed_by (FK), reviewed_at
└── created_at

Dispute
├── id, task (FK), reporter (FK)
├── reason, description
├── status (open / investigating / resolved / closed)
├── resolution, admin_notes
├── assigned_to (FK)
└── created_at, resolved_at
```

---

## API Endpoints (42)

### Auth (5)

```
POST   /api/auth/register/              Register user
POST   /api/auth/verify-otp/            Verify phone OTP
POST   /api/auth/resend-otp/            Resend OTP
POST   /api/auth/login/                 Login (JWT)
POST   /api/auth/token/refresh/         Refresh token
```

### Users (3)

```
GET    /api/users/me/                   Current user profile
PATCH  /api/users/me/                   Update profile
GET    /api/users/:id/                  Public user profile
```

### Tasks (8)

```
GET    /api/tasks/                      List tasks (filtered by role)
POST   /api/tasks/                      Create task
GET    /api/tasks/:id/                  Task detail
PATCH  /api/tasks/:id/                  Update task
DELETE /api/tasks/:id/                  Cancel task
GET    /api/tasks/:id/bids/             List bids for task
POST   /api/tasks/:id/bids/             Submit bid
GET    /api/tasks/:id/questions/        List questions
```

### Bids (3)

```
GET    /api/bids/                       My submitted bids (technician)
PATCH  /api/bids/:id/                   Update bid status
DELETE /api/bids/:id/                   Withdraw bid
```

### Marketplace (2)

```
GET    /api/marketplace/tasks/          Browse available tasks
GET    /api/marketplace/tasks/:id/      Task detail for technician
```

### Wallet & Payments (4)

```
GET    /api/wallet/                     Get wallet balance
POST   /api/wallet/withdraw/            Withdraw funds
GET    /api/transactions/               List transactions (paginated)
GET    /api/transactions/export/        Export CSV
```

### Messaging (4)

```
GET    /api/conversations/              List conversations
GET    /api/conversations/:id/          Get messages
POST   /api/conversations/:id/messages/ Send message
PATCH  /api/conversations/:id/read/     Mark as read
```

### Search (1)

```
GET    /api/search/                     Search with filters
       ?q=&category=&location=&budgetMin=&budgetMax=
       &professionalType=&rating=&sort=&tab=&page=
```

### Saved Professionals (3)

```
GET    /api/saved-pros/                 List saved
POST   /api/saved-pros/:id/             Save professional
DELETE /api/saved-pros/:id/             Remove saved
```

### Company (4)

```
GET    /api/company/profile/            Get company profile
PATCH  /api/company/profile/            Update company profile
GET    /api/company/projects/           List projects
GET    /api/company/analytics/          Get analytics
```

### Admin (7)

```
GET    /api/admin/stats/                Dashboard stats
GET    /api/admin/users/                List all users
PATCH  /api/admin/users/:id/status/     Suspend/activate user
GET    /api/admin/tasks/                List all tasks
GET    /api/admin/verification/         Pending KYC list
PATCH  /api/admin/verification/:id/     Approve/reject KYC
GET    /api/admin/disputes/             List disputes
```

---

## Security Architecture

### Authentication Flow

```
Login → POST /api/auth/login/ → { access, refresh, role }
                                ↓
                         Store in httpOnly cookie (NOT localStorage)
                                ↓
                         Every request: Authorization: Bearer <access>
                                ↓
                         Access expires (15min) → POST /api/auth/token/refresh/
                                ↓
                         Refresh expires (7 days) → Re-login
```

### Security Layers

| Layer | Implementation |
|-------|---------------|
| **HTTPS** | Vercel (frontend) + Railway (backend) enforce it |
| **CORS** | Only allow `yourdomain.com` |
| **Rate Limiting** | 100 req/min general, 5 req/min for auth endpoints |
| **JWT** | Access: 15min, Refresh: 7 days, rotation enabled |
| **Password** | PBKDF2 (Django default), min 8 chars |
| **Input Validation** | DRF serializer validation on every endpoint |
| **SQL Injection** | Django ORM (parameterized queries) |
| **XSS** | React auto-escaping + Content-Security-Policy headers |
| **CSRF** | SameSite cookies + CSRF token for state-changing ops |
| **RBAC** | Permission classes: IsClient, IsTechnician, IsCompany, IsAdmin |
| **File Upload** | Validate type, size (max 10MB), scan for malware |
| **API Keys** | Stored in `.env`, never committed |
| **Logging** | Structured logs, no sensitive data in logs |
| **Monitoring** | Sentry for error tracking (free tier) |

### Environment Variables (.env)

```bash
# Django
SECRET_KEY=your-secret-key
DEBUG=False
ALLOWED_HOSTS=yourdomain.com

# Database
DATABASE_URL=postgresql://user:pass@host/dbname

# Redis
REDIS_URL=redis://:password@host:port

# Cloudflare R2
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=buolot-media
R2_PUBLIC_URL=https://pub-xxx.r2.dev

# JWT
JWT_ACCESS_LIFETIME_MINUTES=15
JWT_REFRESH_LIFETIME_DAYS=7

# CORS
CORS_ALLOWED_ORIGINS=https://yourdomain.com

# Sentry
SENTRY_DSN=https://xxx@sentry.io/xxx
```

---

## Performance Architecture

### Caching Strategy (Redis)

| What | TTL | When |
|------|-----|------|
| User profile | 5 min | On read |
| Task list (marketplace) | 1 min | On read |
| Search results | 2 min | On query |
| Category list | 1 hour | Rarely changes |
| Admin stats | 5 min | Dashboard load |

### Database Optimization

- **Indexes** on: `task.status`, `task.category`, `task.client`, `bid.task`, `bid.technician`, `message.conversation`, `transaction.wallet`
- **Select related / prefetch** on all list endpoints (avoid N+1)
- **Pagination** on all list endpoints (20 items default)
- **Full-text search** on task title, description, location

### API Response Optimization

- **Field filtering**: Only return fields the frontend needs
- **Nested serializers**: Compact responses for lists, full for detail
- **Compression**: Gzip on all responses
- **CDN**: Vercel Edge Network for frontend assets

---

## Deployment Architecture

```
                    ┌─────────────┐
                    │   Vercel    │ ← Frontend (Next.js)
                    │  (Edge CDN) │
                    └──────┬──────┘
                           │ HTTPS
                    ┌──────▼──────┐
                    │  Railway    │ ← Backend (Django)
                    │  (Docker)   │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
       ┌──────▼──────┐ ┌──▼───┐ ┌─────▼─────┐
       │   Neon      │ │Upstash│ │Cloudflare │
       │ (PostgreSQL)│ │(Redis)│ │   R2      │
       └─────────────┘ └──────┘ └───────────┘
```

---

## Django Project Structure

```
backend/
├── config/
│   ├── settings/
│   │   ├── base.py           # Shared settings
│   │   ├── dev.py            # Development (DEBUG=True, SQLite)
│   │   └── prod.py           # Production (PostgreSQL, Redis)
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── apps/
│   ├── accounts/             # User, profiles, auth
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── permissions.py
│   │   ├── backends.py
│   │   ├── admin.py
│   │   └── migrations/
│   ├── tasks/                # Tasks, bids, questions
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── permissions.py
│   │   ├── filters.py
│   │   └── migrations/
│   ├── wallet/               # Wallet, transactions, escrow
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   ├── services.py       # Business logic
│   │   └── migrations/
│   ├── messaging/            # Conversations, messages
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── migrations/
│   ├── companies/            # Company profiles, projects
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── migrations/
│   ├── search/               # Search, filtering, marketplace
│   │   ├── views.py
│   │   └── utils.py
│   ├── admin_panel/          # Admin-specific logic
│   │   ├── views.py
│   │   ├── serializers.py
│   │   └── urls.py
│   └── notifications/        # Push notifications (later)
│       ├── models.py
│       └── services.py
├── middleware/
│   ├── rate_limit.py         # Upstash Redis rate limiting
│   ├── logging.py            # Structured request logging
│   └── security.py           # Security headers
├── permissions/
│   ├── role_based.py         # IsClient, IsTechnician, IsCompany, IsAdmin
│   └── object_level.py       # IsOwner, IsTaskClient, etc.
├── utils/
│   ├── storage.py            # R2 file upload helpers
│   ├── otp.py                # OTP generation/verification
│   ├── pagination.py         # Standard pagination class
│   └── validators.py         # Reusable validators
├── requirements/
│   ├── base.txt              # Shared dependencies
│   ├── dev.txt               # Dev-only (debug toolbar, etc.)
│   └── prod.txt              # Production (gunicorn, psycopg2, etc.)
├── manage.py
└── .env
```

---

## Implementation Phases

| Phase | What | Key Files |
|-------|------|-----------|
| **1** | Project setup, models, migrations | settings, models, migrations |
| **2** | Auth (register, login, OTP, JWT) | accounts app |
| **3** | Tasks & Bids API | tasks app |
| **4** | Wallet & Payments | wallet app |
| **5** | Messaging | messaging app |
| **6** | Search & Marketplace | search app |
| **7** | Company & Admin | companies, admin_panel apps |
| **8** | File uploads (R2) | utils/storage.py |
| **9** | Security hardening, rate limiting | middleware, permissions |
| **10** | Testing, deployment | tests, Docker, CI/CD |

---

## Frontend Integration Notes

- **Login**: Frontend sends `{ username: email, password }` to `POST /api/auth/login/`
- **Token storage**: Move from localStorage to httpOnly cookies (more secure)
- **Role routing**: Backend returns `role` in login response, frontend routes accordingly
- **Mock data**: All hardcoded mock data in frontend will be replaced with API calls
- **Currency**: XOF (West African CFA Franc) as default, support multi-currency
- **Pagination**: Frontend pagination components already exist, wire to API `page`/`limit` params
- **i18n**: Backend responses in English, frontend handles translation client-side
- **File uploads**: Frontend uploads to R2 directly via presigned URLs (avoids backend bottleneck)

---

## Git Notes

**IMPORTANT**: Current `.gitignore` excludes `*.py` — this will ignore the Django backend.
Fix before first commit:

```gitignore
# Remove this line:
*.py

# Backend Python files SHOULD be committed
```

---

*Last updated: June 2026*
