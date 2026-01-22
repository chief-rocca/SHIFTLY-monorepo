-- Job Postings Migration
-- Run this in your Supabase SQL Editor

-- Main job postings table
CREATE TABLE IF NOT EXISTS job_postings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID REFERENCES job_posting_templates(id) ON DELETE SET NULL,
    
    -- Basic Info from Template
    job_title TEXT NOT NULL,
    industry TEXT NOT NULL,
    occupation TEXT NOT NULL,
    job_description TEXT NOT NULL,
    location_work_environment TEXT,
    emergency_contact TEXT,
    
    -- Schedule
    job_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    break_start_time TIME,
    break_end_time TIME,
    
    -- Application Settings
    application_closing_option TEXT NOT NULL CHECK (application_closing_option IN ('2_days_before', '1_day_before', 'day_of')),
    head_count INTEGER NOT NULL DEFAULT 1,
    
    -- Visibility
    visibility_type TEXT NOT NULL CHECK (visibility_type IN ('general', 'certified', 'groups')),
    
    -- Compensation
    wage_amount DECIMAL(10, 2) NOT NULL,
    travel_compensation DECIMAL(10, 2) DEFAULT 0,
    
    -- Auto Message
    send_auto_message BOOLEAN DEFAULT false,
    auto_message_target TEXT CHECK (auto_message_target IN ('always', 'first_timers_only')),
    auto_message_text TEXT,
    
    -- Status
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'closed', 'cancelled')),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Experience groups for job posting visibility
CREATE TABLE IF NOT EXISTS job_posting_experience_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_posting_id UUID NOT NULL REFERENCES job_postings(id) ON DELETE CASCADE,
    experience_type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Benefits copied from template to job posting
CREATE TABLE IF NOT EXISTS job_posting_benefits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_posting_id UUID NOT NULL REFERENCES job_postings(id) ON DELETE CASCADE,
    benefit_type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Bring with items copied from template
CREATE TABLE IF NOT EXISTS job_posting_bring_with_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_posting_id UUID NOT NULL REFERENCES job_postings(id) ON DELETE CASCADE,
    item TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Eligibility criteria copied from template
CREATE TABLE IF NOT EXISTS job_posting_eligibility_criteria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_posting_id UUID NOT NULL REFERENCES job_postings(id) ON DELETE CASCADE,
    criterion TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_job_postings_template ON job_postings(template_id);
CREATE INDEX IF NOT EXISTS idx_job_postings_status ON job_postings(status);
CREATE INDEX IF NOT EXISTS idx_job_postings_date ON job_postings(job_date);
CREATE INDEX IF NOT EXISTS idx_job_posting_experience_groups ON job_posting_experience_groups(job_posting_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_job_postings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_job_postings_updated_at ON job_postings;
CREATE TRIGGER update_job_postings_updated_at
    BEFORE UPDATE ON job_postings
    FOR EACH ROW
    EXECUTE FUNCTION update_job_postings_updated_at();
