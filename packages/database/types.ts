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
