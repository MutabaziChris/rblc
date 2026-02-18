# Visitor Analytics Setup

## 1. Create the `visits` table in Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard) → your project
2. Open **SQL Editor** → **New query**
3. Paste and run:

```sql
-- Visitor Analytics: Create visits table
CREATE TABLE IF NOT EXISTS visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  page_url TEXT NOT NULL,
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_visits_visited_at ON visits(visited_at DESC);
CREATE INDEX IF NOT EXISTS idx_visits_page_url ON visits(page_url);
CREATE INDEX IF NOT EXISTS idx_visits_created_at ON visits(created_at DESC);

ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
```

4. Click **Run**

## 2. Environment variables

Uses existing Supabase env vars:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

No extra variables are required.

## 3. How it works

- **trackVisitor()** (in `lib/analytics.ts`): Sends visit data to `/api/analytics/track`
- **VisitorTracker**: Runs on every page and calls `trackVisitor()` when the route changes
- **30-second debounce**: Same page within 30 seconds is not tracked again
- **Non-blocking**: Uses `sendBeacon` or `fetch` with `keepalive`

## 4. Admin dashboard

Open **Admin** → **Analytics** to view:

- Total visitors
- Visitors today
- Visitors this week
- Visits over the last 7 days (chart)
- Most visited pages (chart + table)
