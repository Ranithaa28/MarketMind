# MarketMind

**Validate. Analyze. Launch.**

An AI-powered SaaS that takes a one-sentence startup idea and produces a full
validation report: competitor analysis, market research, investment estimate,
location recommendations, SWOT, Lean Canvas, Business Model Canvas, business
strategy, and a transparent, explainable success score — plus a chat advisor
and exportable PDF/DOCX reports.

## What's real vs. what needs your own keys

Every line of code here is real and runs against the actual SDKs — nothing is
mocked. But a few features only *do something* once you supply your own
credentials for the underlying service:

| Feature | Needs |
|---|---|
| AI pipeline (competitor/market/etc.) | `OPENAI_API_KEY` — **free option**: defaults to [Groq](https://console.groq.com/keys)'s OpenAI-compatible API (`llama-3.3-70b-versatile`), no card required. Set `OPENAI_BASE_URL=https://api.openai.com/v1` to use real OpenAI instead. |
| Web search grounding | `TAVILY_API_KEY` (recommended), optionally Google CSE / NewsAPI keys |
| Auth (sign up/in, protected dashboard) | Clerk application + `CLERK_*` keys |
| Billing (checkout, portal, webhooks) | Stripe account + price IDs + webhook secret |
| Email | Resend API key (not yet wired into a route — add a `services/email.py` calling Resend when you need transactional email) |
| File storage | Cloudinary URL (not yet wired in; add if you need user-uploaded assets) |
| Error monitoring | `SENTRY_DSN` |
| Interactive map | `NEXT_PUBLIC_MAPBOX_TOKEN` (falls back to a plain list if unset) |

Without any keys, the backend still boots, the frontend still renders, and in
`ENVIRONMENT=development` auth is bypassed with a fake dev user so you can
click through the UI — but idea validation itself needs `OPENAI_API_KEY` at minimum.

## Architecture

```
backend/
  app/
    agents/          LangGraph pipeline: nodes.py (9 pipeline stages), graph.py (wiring), scoring.py
    api/routes/       ideas, reports, chat, subscriptions
    core/             config, Clerk JWT verification, Celery app
    db/               SQLAlchemy models + session
    schemas/          Pydantic request/response models
    services/         OpenAI client, report generator (PDF/DOCX), Stripe
    workers/          Celery task that runs the pipeline async
  alembic/            migrations
  tests/               pytest suite
frontend/
  app/                Next.js App Router pages (landing, auth, dashboard, idea detail)
  components/
    landing/           Hero, Features, Pricing, Testimonials, FAQ, Footer
    dashboard/          Sidebar, stats cards
    validator/          Idea form, results tabs, charts, map, chat, report export
    ui/                 shadcn-style primitives (button, card, tabs, etc.)
  lib/                api client, Clerk-aware hook, utils
```

### The validation pipeline (LangGraph)

```
understand_idea → web_search → competitor_analysis → market_research
  → investment_estimate → location_recommendation → swot_and_canvases
  → business_strategy → success_score
```

Each stage is a small function in `app/agents/nodes.py` that prompts OpenAI
for strict JSON and is independently testable. A failure in any single stage
is caught and recorded rather than crashing the whole run.

### The success score

Deliberately **not** a random or vibes-based percentage. The model rates 10
named factors (market demand, competition, innovation, technology complexity,
scalability, revenue potential, execution difficulty, funding availability,
timing, risk) 0–10 with a written reason each; `app/agents/scoring.py` then
combines them with fixed, documented weights into an overall score plus
strength/risk/opportunity meters. The full breakdown ships with every report.

## Running locally

### Fastest path: Docker

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# edit both .env files with at least OPENAI_API_KEY (backend)
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend docs (Swagger): http://localhost:8000/docs

### Manual setup

**Backend**
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in OPENAI_API_KEY at minimum
alembic upgrade head    # requires a running Postgres — see docker-compose for one
uvicorn app.main:app --reload
# in a second terminal, for async idea validation:
celery -A app.core.celery_app.celery_app worker --loglevel=info
```

**Frontend**
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

## Deployment

- **Frontend** → Vercel (`vercel.json` not needed; default Next.js build works).
- **Backend** → Railway or any container host; point it at the Dockerfile.
- **Database** → Neon (Postgres, pgvector-compatible) — just set `DATABASE_URL`.
- **Redis** → Upstash — set `REDIS_URL` / `CELERY_BROKER_URL` / `CELERY_RESULT_BACKEND`.
- Run `alembic upgrade head` against production `DATABASE_URL` before first deploy.
- Register the Stripe webhook endpoint (`/api/subscriptions/webhook`) in the Stripe dashboard once the backend has a public URL.

## Environment variables

See `backend/.env.example` and `frontend/.env.example` for the full list with
inline comments on where to obtain each key.

## Tests

```bash
cd backend && pytest
cd frontend && npm run build   # type-checks the whole app
```

## Known gaps / good next steps

- Admin panel (users/subscriptions/analytics/logs) is not built yet — the
  data model supports it, but there's no `/admin` route or role check.
- Resend and Cloudinary integrations are documented in `.env.example` but not
  yet wired into a route; add `app/services/email.py` and an upload endpoint
  when you need them.
- No frontend test suite yet (Vitest is installed but unused) — the backend
  has a real pytest suite for the scoring logic as a starting point.
- Rate limiting and stricter prompt-injection filtering on user idea text are
  worth adding before a public launch.
