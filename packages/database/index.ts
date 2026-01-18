import { createClient } from '@supabase/supabase-js';

// These will be properly typed later for the case study
export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export type Shift = {
    id: string;
    title: string;
    location: string;
    pay_rate: number;
    created_at: string;
};