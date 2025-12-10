import { createClient } from '@supabase/supabase-js';

/**
 * PUBLIC_INTERFACE
 * Supabase client singleton for the frontend application.
 * 
 * This module initializes and exports a configured Supabase client
 * using environment variables for the URL and anonymous key.
 * 
 * Required environment variables:
 * - REACT_APP_SUPABASE_URL: Your Supabase project URL
 * - REACT_APP_SUPABASE_ANON_KEY: Your Supabase anonymous/public API key
 * 
 * The client is configured with:
 * - persistSession: true - Sessions are persisted in localStorage
 * - autoRefreshToken: true - Tokens are automatically refreshed
 * - detectSessionInUrl: true - Handles OAuth callbacks and email confirmation links
 */

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '[Supabase] Missing required environment variables. ' +
    'Please ensure REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY are set in your .env file.'
  );
}

const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export default supabase;
