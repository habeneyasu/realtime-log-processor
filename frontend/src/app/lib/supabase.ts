import { createClient } from '@supabase/supabase-js';

// Ensure these variables are correct
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('supabaseUrl:', supabaseUrl);
console.log('supabaseKey:', supabaseKey);   

if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase URL or Key is missing!');
  throw new Error('Supabase URL or Key is missing!');
  
}

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);
