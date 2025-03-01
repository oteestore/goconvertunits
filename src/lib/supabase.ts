import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";

// Create a mock Supabase client for development
const createMockClient = () => {
  return {
    auth: {
      getSession: async () => ({ data: { session: null } }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
      signInWithPassword: async () => ({
        data: {
          session: {
            user: {
              id: "mock-user-id",
              email: "user@example.com",
              user_metadata: { full_name: "Test User" },
            },
          },
        },
        error: null,
      }),
      signUp: async () => ({
        data: {
          session: {
            user: {
              id: "mock-user-id",
              email: "user@example.com",
              user_metadata: { full_name: "Test User" },
            },
          },
        },
        error: null,
      }),
      signOut: async () => ({}),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => ({ data: [], error: null }),
        }),
        data: [],
        error: null,
      }),
      insert: () => ({
        select: () => ({
          data: [{ id: "mock-id", created_at: new Date().toISOString() }],
          error: null,
        }),
      }),
      delete: () => ({
        eq: () => ({ error: null }),
      }),
    }),
  };
};

// Use mock client since Supabase project was deleted
export const supabase = createMockClient() as any;
