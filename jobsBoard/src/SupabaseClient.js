import {createClient} from '@supabase/supabase-js';

// gets url and key values from .env file
//  import.meta.env is how Vite exposes environment variables in the codebase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// createClient() creates a configured Supabase client instace
// export lets other files import the client instance
//  eg. import {supabase} from './SupabaseClient'
export const supabase = createClient(supabaseUrl, supabaseKey);