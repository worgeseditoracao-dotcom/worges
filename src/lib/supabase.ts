import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";

function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

let browserClient: ReturnType<typeof createClient> | undefined;

export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(_, prop) {
    if (!browserClient) browserClient = createClient();
    return (browserClient as any)[prop];
  },
});
