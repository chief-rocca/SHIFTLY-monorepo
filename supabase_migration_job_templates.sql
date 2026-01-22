-- Job Posting Templates Database Schema
-- This schema stores job posting templates that can be reused for recruitment

-- Main job posting templates table
CREATE TABLE IF NOT EXISTS job_posting_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_title TEXT NOT NULL,
    industry TEXT NOT NULL,
    occupation TEXT NOT NULL,
    job_description TEXT NOT NULL,
    location_work_environment TEXT NOT NULL,
    emergency_contact TEXT NOT NULL,
    auto_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Benefits offered (checkboxes)
CREATE TABLE IF NOT EXISTS template_benefits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID NOT NULL REFERENCES job_posting_templates(id) ON DELETE CASCADE,
    benefit_type TEXT NOT NULL CHECK (benefit_type IN ('no_experience', 'no_uniform', 'food_provided', 'parking', 'discount'))
);

-- Items to bring (displayed as cards)
CREATE TABLE IF NOT EXISTS template_bring_with_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID NOT NULL REFERENCES job_posting_templates(id) ON DELETE CASCADE,
    item TEXT NOT NULL,
    order_index INTEGER NOT NULL
);

-- Eligibility criteria/prerequisites (displayed as cards)
CREATE TABLE IF NOT EXISTS template_eligibility_criteria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID NOT NULL REFERENCES job_posting_templates(id) ON DELETE CASCADE,
    criterion TEXT NOT NULL,
    order_index INTEGER NOT NULL
);

-- Workplace images (setting, exterior, interior)
CREATE TABLE IF NOT EXISTS template_workplace_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID NOT NULL REFERENCES job_posting_templates(id) ON DELETE CASCADE,
    image_type TEXT NOT NULL CHECK (image_type IN ('setting', 'exterior', 'interior')),
    image_url TEXT NOT NULL,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Work-related documents (max 5)
CREATE TABLE IF NOT EXISTS template_work_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID NOT NULL REFERENCES job_posting_templates(id) ON DELETE CASCADE,
    document_name TEXT NOT NULL,
    document_url TEXT NOT NULL,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_template_benefits_template_id ON template_benefits(template_id);
CREATE INDEX IF NOT EXISTS idx_bring_with_items_template_id ON template_bring_with_items(template_id);
CREATE INDEX IF NOT EXISTS idx_eligibility_criteria_template_id ON template_eligibility_criteria(template_id);
CREATE INDEX IF NOT EXISTS idx_workplace_images_template_id ON template_workplace_images(template_id);
CREATE INDEX IF NOT EXISTS idx_work_documents_template_id ON template_work_documents(template_id);

-- Updated timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to job_posting_templates
CREATE TRIGGER update_job_posting_templates_updated_at 
    BEFORE UPDATE ON job_posting_templates 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
