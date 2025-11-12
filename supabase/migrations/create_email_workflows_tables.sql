-- =====================================================
-- EMAIL WORKFLOWS SYSTEM - Database Schema
-- =====================================================
-- This migration creates tables for managing email workflows with SendGrid

-- Table: email_workflows
-- Tracks active email workflow instances for users
CREATE TABLE IF NOT EXISTS email_workflows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workflow_id TEXT NOT NULL, -- ID from EMAIL_WORKFLOWS constant
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
  current_step INTEGER NOT NULL DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb, -- Additional data for email personalization
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  last_email_sent_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Table: email_logs
-- Comprehensive log of all emails sent
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  workflow_id TEXT, -- NULL if not part of a workflow
  workflow_record_id UUID REFERENCES email_workflows(id) ON DELETE SET NULL,
  step_id TEXT, -- Step identifier from workflow
  email TEXT NOT NULL,
  subject TEXT,
  status TEXT NOT NULL CHECK (status IN ('sent', 'failed', 'bounced', 'opened', 'clicked')),
  provider TEXT NOT NULL DEFAULT 'sendgrid',
  provider_message_id TEXT, -- SendGrid message ID
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Table: email_schedules
-- Manages scheduled emails for workflows
CREATE TABLE IF NOT EXISTS email_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workflow_record_id UUID NOT NULL REFERENCES email_workflows(id) ON DELETE CASCADE,
  step_index INTEGER NOT NULL,
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
  sent_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Table: email_preferences
-- User email preferences and unsubscribes
CREATE TABLE IF NOT EXISTS email_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  unsubscribed_all BOOLEAN DEFAULT FALSE,
  unsubscribed_marketing BOOLEAN DEFAULT FALSE,
  unsubscribed_transactional BOOLEAN DEFAULT FALSE,
  unsubscribed_workflows JSONB DEFAULT '[]'::jsonb, -- Array of workflow_ids
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- =====================================================
-- INDEXES for Performance
-- =====================================================

-- email_workflows indexes
CREATE INDEX IF NOT EXISTS idx_email_workflows_user_id ON email_workflows(user_id);
CREATE INDEX IF NOT EXISTS idx_email_workflows_workflow_id ON email_workflows(workflow_id);
CREATE INDEX IF NOT EXISTS idx_email_workflows_status ON email_workflows(status);
CREATE INDEX IF NOT EXISTS idx_email_workflows_started_at ON email_workflows(started_at);

-- email_logs indexes
CREATE INDEX IF NOT EXISTS idx_email_logs_user_id ON email_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_workflow_record_id ON email_logs(workflow_record_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_email ON email_logs(email);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs(sent_at);
CREATE INDEX IF NOT EXISTS idx_email_logs_provider_message_id ON email_logs(provider_message_id);

-- email_schedules indexes
CREATE INDEX IF NOT EXISTS idx_email_schedules_workflow_record_id ON email_schedules(workflow_record_id);
CREATE INDEX IF NOT EXISTS idx_email_schedules_scheduled_for ON email_schedules(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_email_schedules_status ON email_schedules(status);
CREATE INDEX IF NOT EXISTS idx_email_schedules_status_scheduled ON email_schedules(status, scheduled_for) 
  WHERE status = 'pending';

-- email_preferences indexes
CREATE INDEX IF NOT EXISTS idx_email_preferences_email ON email_preferences(email);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) Policies
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE email_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_preferences ENABLE ROW LEVEL SECURITY;

-- email_workflows policies
-- Users can view their own workflows
CREATE POLICY "Users can view own workflows" ON email_workflows
  FOR SELECT USING (auth.uid() = user_id);

-- Service role can do everything (for API routes)
CREATE POLICY "Service role full access to workflows" ON email_workflows
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- email_logs policies
-- Users can view their own email logs
CREATE POLICY "Users can view own email logs" ON email_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Service role can do everything
CREATE POLICY "Service role full access to email_logs" ON email_logs
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- email_schedules policies
-- Users can view schedules for their workflows
CREATE POLICY "Users can view own schedules" ON email_schedules
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM email_workflows
      WHERE email_workflows.id = email_schedules.workflow_record_id
      AND email_workflows.user_id = auth.uid()
    )
  );

-- Service role can do everything
CREATE POLICY "Service role full access to schedules" ON email_schedules
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- email_preferences policies
-- Users can manage their own preferences
CREATE POLICY "Users can view own preferences" ON email_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON email_preferences
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences" ON email_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Service role can do everything
CREATE POLICY "Service role full access to preferences" ON email_preferences
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- =====================================================
-- TRIGGERS for updated_at
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_email_workflows_updated_at
  BEFORE UPDATE ON email_workflows
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_schedules_updated_at
  BEFORE UPDATE ON email_schedules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_preferences_updated_at
  BEFORE UPDATE ON email_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- COMMENTS for Documentation
-- =====================================================

COMMENT ON TABLE email_workflows IS 'Tracks active email workflow instances for users';
COMMENT ON TABLE email_logs IS 'Comprehensive log of all emails sent through the system';
COMMENT ON TABLE email_schedules IS 'Manages scheduled emails for automated workflows';
COMMENT ON TABLE email_preferences IS 'User email preferences and unsubscribe settings';

-- Done!
