import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type JobApplication = {
  id: string;
  company: string;
  position: string;
  status: string;
  date_applied: string;
  location: string;
  salary: string;
  notes: string;
  created_at: string;
  updated_at: string;
};
