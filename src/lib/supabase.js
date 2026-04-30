import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cdrcgmdvepxwsbqaifxv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkcmNnbWR2ZXB4d3NicWFpZnh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MDY4MDksImV4cCI6MjA4OTA4MjgwOX0.pKWLWvsSimTOMkpaXKKrLJESrQEMUayUU1c9ANzr1Dc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  }
});

export async function submitInvestorInquiry(formData) {
  const { data, error } = await supabase
    .from('leads')
    .insert([{
      name: formData.name,
      email: formData.email,
      company: formData.company,
      accredited_investor: formData.accredited_investor,
      investment_range: formData.investment_range,
      message: formData.message,
      interest_level: formData.interest_level || null,
      created_at: new Date().toISOString(),
    }]);

  if (error) {
    console.error('Supabase error:', error);
    throw error;
  }

  return data;
}
