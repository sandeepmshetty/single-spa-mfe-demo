-- ═══════════════════════════════════════════════════════════
-- MFE Application Database Schema
-- PostgreSQL Initialization Script
-- ═══════════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ═══════════════════════════════════════════════════════════
-- Create separate schemas for different services
-- ═══════════════════════════════════════════════════════════

-- Main application schema
CREATE SCHEMA IF NOT EXISTS mfe_app;

-- Keycloak schema
CREATE SCHEMA IF NOT EXISTS keycloak;

-- GlitchTip schema
CREATE SCHEMA IF NOT EXISTS glitchtip;

-- Unleash schema  
CREATE SCHEMA IF NOT EXISTS unleash;

-- SonarQube schema
CREATE SCHEMA IF NOT EXISTS sonarqube;

-- ═══════════════════════════════════════════════════════════
-- MFE Application Tables
-- ═══════════════════════════════════════════════════════════

-- Error logs table
CREATE TABLE IF NOT EXISTS mfe_app.error_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message TEXT NOT NULL,
  stack TEXT,
  source VARCHAR(100) NOT NULL,
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('info', 'warning', 'error', 'critical')),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id VARCHAR(255),
  session_id VARCHAR(255),
  metadata JSONB DEFAULT '{}',
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  resolved_by VARCHAR(255),
  tags TEXT[],
  environment VARCHAR(50) DEFAULT 'development'
);

CREATE INDEX idx_error_logs_timestamp ON mfe_app.error_logs(timestamp DESC);
CREATE INDEX idx_error_logs_severity ON mfe_app.error_logs(severity);
CREATE INDEX idx_error_logs_source ON mfe_app.error_logs(source);
CREATE INDEX idx_error_logs_user_id ON mfe_app.error_logs(user_id);
CREATE INDEX idx_error_logs_resolved ON mfe_app.error_logs(resolved);
CREATE INDEX idx_error_logs_environment ON mfe_app.error_logs(environment);

COMMENT ON TABLE mfe_app.error_logs IS 'Application error logs from all micro-frontends';

-- ───────────────────────────────────────────────────────────

-- Performance metrics table
CREATE TABLE IF NOT EXISTS mfe_app.performance_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  metric_name VARCHAR(100) NOT NULL,
  value NUMERIC NOT NULL,
  unit VARCHAR(20) DEFAULT 'ms',
  source VARCHAR(100) NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id VARCHAR(255),
  session_id VARCHAR(255),
  labels JSONB DEFAULT '{}',
  environment VARCHAR(50) DEFAULT 'development',
  rating VARCHAR(20) CHECK (rating IN ('good', 'needs-improvement', 'poor'))
);

CREATE INDEX idx_performance_timestamp ON mfe_app.performance_metrics(timestamp DESC);
CREATE INDEX idx_performance_metric_name ON mfe_app.performance_metrics(metric_name);
CREATE INDEX idx_performance_source ON mfe_app.performance_metrics(source);
CREATE INDEX idx_performance_rating ON mfe_app.performance_metrics(rating);
CREATE INDEX idx_performance_environment ON mfe_app.performance_metrics(environment);

COMMENT ON TABLE mfe_app.performance_metrics IS 'Web Vitals and custom performance metrics';

-- ───────────────────────────────────────────────────────────

-- User sessions table
CREATE TABLE IF NOT EXISTS mfe_app.user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(255) NOT NULL,
  username VARCHAR(255),
  email VARCHAR(255),
  token TEXT NOT NULL,
  refresh_token TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  last_activity TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  device_info JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_sessions_user_id ON mfe_app.user_sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON mfe_app.user_sessions(expires_at);
CREATE INDEX idx_sessions_is_active ON mfe_app.user_sessions(is_active);
CREATE INDEX idx_sessions_last_activity ON mfe_app.user_sessions(last_activity DESC);

COMMENT ON TABLE mfe_app.user_sessions IS 'Active user sessions for authentication';

-- ───────────────────────────────────────────────────────────

-- Audit logs table
CREATE TABLE IF NOT EXISTS mfe_app.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(255),
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(100) NOT NULL,
  resource_id VARCHAR(255),
  old_value JSONB,
  new_value JSONB,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  success BOOLEAN DEFAULT TRUE,
  error_message TEXT,
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_audit_timestamp ON mfe_app.audit_logs(timestamp DESC);
CREATE INDEX idx_audit_user_id ON mfe_app.audit_logs(user_id);
CREATE INDEX idx_audit_action ON mfe_app.audit_logs(action);
CREATE INDEX idx_audit_resource_type ON mfe_app.audit_logs(resource_type);

COMMENT ON TABLE mfe_app.audit_logs IS 'Audit trail of all user actions';

-- ───────────────────────────────────────────────────────────

-- Feature flags table
CREATE TABLE IF NOT EXISTS mfe_app.feature_flags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  enabled BOOLEAN DEFAULT FALSE,
  rollout_percentage INTEGER DEFAULT 0 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
  target_users TEXT[],
  target_groups TEXT[],
  conditions JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by VARCHAR(255),
  updated_by VARCHAR(255)
);

CREATE INDEX idx_feature_flags_enabled ON mfe_app.feature_flags(enabled);
CREATE INDEX idx_feature_flags_name ON mfe_app.feature_flags(name);

COMMENT ON TABLE mfe_app.feature_flags IS 'Application feature flags configuration';

-- ───────────────────────────────────────────────────────────

-- API metrics table
CREATE TABLE IF NOT EXISTS mfe_app.api_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  endpoint VARCHAR(255) NOT NULL,
  method VARCHAR(10) NOT NULL,
  status_code INTEGER NOT NULL,
  response_time INTEGER NOT NULL, -- in milliseconds
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_id VARCHAR(255),
  error_message TEXT,
  request_size INTEGER, -- in bytes
  response_size INTEGER, -- in bytes
  source VARCHAR(100) NOT NULL
);

CREATE INDEX idx_api_metrics_timestamp ON mfe_app.api_metrics(timestamp DESC);
CREATE INDEX idx_api_metrics_endpoint ON mfe_app.api_metrics(endpoint);
CREATE INDEX idx_api_metrics_status_code ON mfe_app.api_metrics(status_code);
CREATE INDEX idx_api_metrics_source ON mfe_app.api_metrics(source);

COMMENT ON TABLE mfe_app.api_metrics IS 'API request/response metrics';

-- ═══════════════════════════════════════════════════════════
-- Views for Common Queries
-- ═══════════════════════════════════════════════════════════

-- Recent errors view
CREATE OR REPLACE VIEW mfe_app.recent_errors AS
SELECT 
  id,
  message,
  source,
  severity,
  timestamp,
  user_id,
  resolved,
  environment
FROM mfe_app.error_logs
WHERE timestamp > NOW() - INTERVAL '24 hours'
ORDER BY timestamp DESC;

COMMENT ON VIEW mfe_app.recent_errors IS 'Errors from the last 24 hours';

-- ───────────────────────────────────────────────────────────

-- Performance summary view
CREATE OR REPLACE VIEW mfe_app.performance_summary AS
SELECT 
  source,
  metric_name,
  AVG(value) as avg_value,
  MIN(value) as min_value,
  MAX(value) as max_value,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY value) as median_value,
  PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY value) as p95_value,
  COUNT(*) as sample_count,
  DATE_TRUNC('hour', timestamp) as hour
FROM mfe_app.performance_metrics
WHERE timestamp > NOW() - INTERVAL '24 hours'
GROUP BY source, metric_name, DATE_TRUNC('hour', timestamp)
ORDER BY hour DESC, source, metric_name;

COMMENT ON VIEW mfe_app.performance_summary IS 'Hourly performance metrics summary';

-- ───────────────────────────────────────────────────────────

-- Active sessions view
CREATE OR REPLACE VIEW mfe_app.active_sessions AS
SELECT 
  id,
  user_id,
  username,
  email,
  created_at,
  last_activity,
  expires_at,
  ip_address,
  EXTRACT(EPOCH FROM (NOW() - last_activity)) / 60 as idle_minutes
FROM mfe_app.user_sessions
WHERE is_active = TRUE
  AND expires_at > NOW()
ORDER BY last_activity DESC;

COMMENT ON VIEW mfe_app.active_sessions IS 'Currently active user sessions';

-- ═══════════════════════════════════════════════════════════
-- Functions
-- ═══════════════════════════════════════════════════════════

-- Function to clean up old sessions
CREATE OR REPLACE FUNCTION mfe_app.cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  WITH deleted AS (
    DELETE FROM mfe_app.user_sessions
    WHERE expires_at < NOW()
       OR (last_activity < NOW() - INTERVAL '7 days')
    RETURNING *
  )
  SELECT COUNT(*) INTO deleted_count FROM deleted;
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION mfe_app.cleanup_expired_sessions IS 'Removes expired and inactive sessions';

-- ───────────────────────────────────────────────────────────

-- Function to archive old metrics
CREATE OR REPLACE FUNCTION mfe_app.archive_old_metrics(days_to_keep INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
  archived_count INTEGER;
BEGIN
  -- Archive old performance metrics
  WITH archived AS (
    DELETE FROM mfe_app.performance_metrics
    WHERE timestamp < NOW() - (days_to_keep || ' days')::INTERVAL
    RETURNING *
  )
  SELECT COUNT(*) INTO archived_count FROM archived;
  
  RETURN archived_count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION mfe_app.archive_old_metrics IS 'Archives metrics older than specified days';

-- ═══════════════════════════════════════════════════════════
-- Triggers
-- ═══════════════════════════════════════════════════════════

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION mfe_app.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_feature_flags_updated_at
  BEFORE UPDATE ON mfe_app.feature_flags
  FOR EACH ROW
  EXECUTE FUNCTION mfe_app.update_updated_at_column();

-- ═══════════════════════════════════════════════════════════
-- Seed Data (Development)
-- ═══════════════════════════════════════════════════════════

-- Insert sample feature flags
INSERT INTO mfe_app.feature_flags (name, description, enabled, rollout_percentage, created_by)
VALUES 
  ('new-dashboard', 'New dashboard UI', FALSE, 0, 'system'),
  ('dark-mode', 'Dark mode theme', TRUE, 100, 'system'),
  ('advanced-analytics', 'Advanced analytics features', FALSE, 10, 'system'),
  ('beta-features', 'Beta features access', FALSE, 5, 'system')
ON CONFLICT (name) DO NOTHING;

-- ═══════════════════════════════════════════════════════════
-- Grants and Permissions
-- ═══════════════════════════════════════════════════════════

-- Grant usage on schemas
GRANT USAGE ON SCHEMA mfe_app TO mfe_user;
GRANT USAGE ON SCHEMA keycloak TO mfe_user;
GRANT USAGE ON SCHEMA glitchtip TO mfe_user;
GRANT USAGE ON SCHEMA unleash TO mfe_user;
GRANT USAGE ON SCHEMA sonarqube TO mfe_user;

-- Grant permissions on tables
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA mfe_app TO mfe_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA mfe_app TO mfe_user;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA mfe_app TO mfe_user;

-- ═══════════════════════════════════════════════════════════
-- Maintenance Jobs (Run periodically via cron or scheduler)
-- ═══════════════════════════════════════════════════════════

-- Schedule cleanup job (example for pg_cron extension)
-- SELECT cron.schedule('cleanup-expired-sessions', '0 2 * * *', 'SELECT mfe_app.cleanup_expired_sessions()');
-- SELECT cron.schedule('archive-old-metrics', '0 3 * * 0', 'SELECT mfe_app.archive_old_metrics(90)');

-- ═══════════════════════════════════════════════════════════
-- Database Optimization
-- ═══════════════════════════════════════════════════════════

-- Analyze tables for better query performance
ANALYZE mfe_app.error_logs;
ANALYZE mfe_app.performance_metrics;
ANALYZE mfe_app.user_sessions;
ANALYZE mfe_app.audit_logs;
ANALYZE mfe_app.api_metrics;

-- ═══════════════════════════════════════════════════════════
-- Success Message
-- ═══════════════════════════════════════════════════════════

DO $$
BEGIN
  RAISE NOTICE '✅ MFE Database initialized successfully!';
  RAISE NOTICE '   - Schemas: mfe_app, keycloak, glitchtip, unleash, sonarqube';
  RAISE NOTICE '   - Tables: 6 main tables';
  RAISE NOTICE '   - Views: 3 useful views';
  RAISE NOTICE '   - Functions: 2 maintenance functions';
END $$;
