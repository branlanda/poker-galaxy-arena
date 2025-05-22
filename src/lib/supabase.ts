
import { createClient } from '@supabase/supabase-js';

// Get environment variables with fallbacks to prevent runtime errors
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rbwhgcbiylfjypybltym.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJid2hnY2JpeWxmanlweWJsdHltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NTk2MzEsImV4cCI6MjA2MzQzNTYzMX0.r8erYIYwxL8icQfkc3EEYxYXggyPDz4Uc0KrdjF4XvE';

// Create Supabase client with explicit auth configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Log warning if using placeholder values (only in development)
if (
  import.meta.env.DEV && 
  (supabaseUrl === 'https://rbwhgcbiylfjypybltym.supabase.co' || 
  supabaseAnonKey === 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJid2hnY2JpeWxmanlweWJsdHltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NTk2MzEsImV4cCI6MjA2MzQzNTYzMX0.r8erYIYwxL8icQfkc3EEYxYXggyPDz4Uc0KrdjF4XvE')
) {
  console.warn(
    'Using default Supabase credentials. For development, set your own VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env file.'
  );
}
