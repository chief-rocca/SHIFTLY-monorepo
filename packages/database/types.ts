// Job Posting Template Types
export type BenefitType =
    | 'no_experience'
    | 'no_uniform'
    | 'food_provided'
    | 'parking'
    | 'discount';

export type ImageType = 'setting' | 'exterior' | 'interior';

export interface JobPostingTemplate {
    id: string;
    job_title: string;
    industry: string;
    occupation: string;
    job_description: string;
    location_work_environment: string;
    emergency_contact: string;
    auto_message: string;
    created_at: string;
    updated_at: string;
}

export interface TemplateBenefit {
    id: string;
    template_id: string;
    benefit_type: BenefitType;
}

export interface TemplateBringWithItem {
    id: string;
    template_id: string;
    item: string;
    order_index: number;
}

export interface TemplateEligibilityCriterion {
    id: string;
    template_id: string;
    criterion: string;
    order_index: number;
}

export interface TemplateWorkplaceImage {
    id: string;
    template_id: string;
    image_type: ImageType;
    image_url: string;
    uploaded_at: string;
}

export interface TemplateWorkDocument {
    id: string;
    template_id: string;
    document_name: string;
    document_url: string;
    uploaded_at: string;
}

// Full template with all related data
export interface JobPostingTemplateWithRelations extends JobPostingTemplate {
    benefits: TemplateBenefit[];
    bring_with_items: TemplateBringWithItem[];
    eligibility_criteria: TemplateEligibilityCriterion[];
    workplace_images: TemplateWorkplaceImage[];
    work_documents: TemplateWorkDocument[];
}

// Form data structure (before submission)
export interface JobPostingTemplateFormData {
    job_title: string;
    industry: string;
    occupation: string;
    job_description: string;
    benefits: BenefitType[];
    bring_with_items: string[];
    eligibility_criteria: string[];
    workplace_images: File[]; // Files to upload
    work_documents: File[]; // Files to upload
    location_work_environment: string;
    emergency_contact: string;
    auto_message: string;
}

// Job Posting Types (created from templates)
export type ApplicationClosingOption = '2_days_before' | '1_day_before' | 'day_of';
export type VisibilityType = 'general' | 'certified' | 'groups';
export type AutoMessageTarget = 'always' | 'first_timers_only';
export type JobPostingStatus = 'draft' | 'published' | 'closed' | 'cancelled';

export type ExperienceGroupType =
    // Customer-facing
    | 'customer_service'
    | 'retail'
    | 'sales'
    | 'front_desk'
    | 'hospitality'
    // Food & beverage
    | 'food_service'
    | 'hall_staff'
    | 'kitchen_staff'
    | 'barista'
    | 'dishwashing'
    // Operations
    | 'cash_handling'
    | 'inventory_management'
    | 'opening_closing'
    | 'pos_system'
    // Light labor
    | 'cleaning'
    | 'packing_sorting'
    | 'warehouse'
    | 'moving_loading'
    // Office & other
    | 'administrative'
    | 'data_entry'
    | 'call_center'
    | 'event_staff'
    // Special
    | 'previous_work_experience'
    | 'favourite_recurring'
    | 'other';

export interface JobPosting {
    id: string;
    template_id: string | null;
    job_title: string;
    industry: string;
    occupation: string;
    job_description: string;
    location_work_environment: string;
    emergency_contact: string;
    job_date: string;
    start_time: string;
    end_time: string;
    break_start_time: string | null;
    break_end_time: string | null;
    application_closing_option: ApplicationClosingOption;
    head_count: number;
    visibility_type: VisibilityType;
    wage_amount: number;
    travel_compensation: number;
    send_auto_message: boolean;
    auto_message_target: AutoMessageTarget | null;
    auto_message_text: string | null;
    status: JobPostingStatus;
    created_at: string;
    updated_at: string;
}

export interface JobPostingExperienceGroup {
    id: string;
    job_posting_id: string;
    experience_type: ExperienceGroupType;
}

export interface JobPostingFormData {
    job_date: string;
    start_time: string;
    end_time: string;
    break_start_time: string;
    break_end_time: string;
    application_closing_option: ApplicationClosingOption;
    head_count: number;
    visibility_type: VisibilityType;
    experience_groups: ExperienceGroupType[];
    wage_amount: number;
    travel_compensation: number;
    send_auto_message: boolean;
    auto_message_target: AutoMessageTarget;
}
