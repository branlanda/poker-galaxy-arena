
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://rbwhgcbiylfjypybltym.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJid2hnY2JpeWxmanlweWJsdHltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NTk2MzEsImV4cCI6MjA2MzQzNTYzMX0.r8erYIYwxL8icQfkc3EEYxYXggyPDz4Uc0KrdjF4XvE";

// Create Supabase client with explicit auth configuration
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10, // Increase for more responsive real-time updates
    }
  }
});

// Log warning if environment variables are missing (only in development)
if (
  import.meta.env.DEV && 
  (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY)
) {
  console.warn(
    'Using placeholder Supabase credentials. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env file.'
  );
}
