-- Visitor Analytics: Create visits table for tracking page views
-- Run this in Supabase SQL Editor: Dashboard → SQL Editor → New Query

-- Create visits table
CREATE TABLE IF NOT EXISTS visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  page_url TEXT NOT NULL,
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for faster queries on common filters
CREATE INDEX IF NOT EXISTS idx_visits_visited_at ON visits(visited_at DESC);
CREATE INDEX IF NOT EXISTS idx_visits_page_url ON visits(page_url);
CREATE INDEX IF NOT EXISTS idx_visits_created_at ON visits(created_at DESC);

-- Enable Row Level Security (RLS)
-- No policies = deny all for anon key. API uses service_role which bypasses RLS.
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
