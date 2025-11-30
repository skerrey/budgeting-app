import { createClient } from "@supabase/supabase-js";

// Server-side only client using service role key
// NEVER expose this to the client
export const createServiceClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
};

