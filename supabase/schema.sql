-- AccessCheck Database Schema
-- Run this in your Supabase SQL Editor to create the required tables.

-- Scans table: stores every scan job and its results
CREATE TABLE scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued', -- queued, scanning, complete, error
  score INTEGER,
  issues_critical INTEGER DEFAULT 0,
  issues_serious INTEGER DEFAULT 0,
  issues_moderate INTEGER DEFAULT 0,
  issues_minor INTEGER DEFAULT 0,
  result JSONB, -- full axe-core output for paid reports
  examples JSONB, -- 2-3 examples for the free report
  pages_scanned INTEGER DEFAULT 0,
  scan_duration INTEGER, -- milliseconds
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Contacts table: stores contact form submissions
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id UUID REFERENCES scans(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  message TEXT,
  consent_given BOOLEAN NOT NULL DEFAULT false,
  consent_text TEXT NOT NULL, -- exact wording user agreed to
  consent_timestamp TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Payments table: tracks report purchases
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_id UUID REFERENCES scans(id),
  tier TEXT NOT NULL, -- 'detailed' (€1) or 'full' (€3)
  amount_cents INTEGER NOT NULL, -- 100 or 300
  currency TEXT NOT NULL DEFAULT 'eur',
  stripe_session_id TEXT,
  stripe_payment_intent TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, paid, failed
  email TEXT, -- buyer's email from Stripe
  created_at TIMESTAMPTZ DEFAULT now(),
  paid_at TIMESTAMPTZ
);

-- Index for looking up scans by URL (for deduplication/caching)
CREATE INDEX idx_scans_url ON scans(url);

-- Index for looking up payments by scan
CREATE INDEX idx_payments_scan_id ON payments(scan_id);
