import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";

// Get Supabase URL and key from environment variables
const supabaseUrl = "https://shaorebfoqxvwsmtfvjj.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoYW9yZWJmb3F4dndzbXRmdmpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4MzQ2MTksImV4cCI6MjA1NjQxMDYxOX0.oiDaWstW6QTHs3S9ROsn3a3LcuwcWOKM5TgNg3lQUCc";

// Create the Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
