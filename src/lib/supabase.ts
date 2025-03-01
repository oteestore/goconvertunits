import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || "https://example.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "mock-key-for-development";

// Create a mock Supabase client for development if no real credentials are provided
const createMockClient = () => {
  return {
    auth: {
      getSession: async () => ({ data: { session: null } }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
      signInWithPassword: async () => ({
        data: { session: null },
        error: new Error("Mock auth: No credentials configured"),
      }),
      signUp: async () => ({
        data: { session: null },
        error: new Error("Mock auth: No credentials configured"),
      }),
      signOut: async () => ({}),
    },
  };
};

// Use real client if credentials are provided, otherwise use mock
export const supabase =
  supabaseUrl !== "https://example.supabase.co"
    ? createClient(supabaseUrl, supabaseAnonKey)
    : (createMockClient() as any);
