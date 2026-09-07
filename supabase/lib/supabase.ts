import { createClient } from "@supabase/supabase-js";

/* The file previously held this module twice, separated by a rule — the plain
 * client, then a variant scoped to a custom schema. Two copies of the same
 * imports and the same `export const supabase` don't compile, so the variant
 * is now the commented option on the call below. */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

/* Fail at import time rather than on the first query: a missing key otherwise
 * surfaces as an opaque network error somewhere deep in a component. */
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/* Targeting a schema other than `public`? Pass it here instead:
 *
 *   export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
 *     db: { schema: "YourSchemaName" },
 *   });
 *
 * The schema must also be exposed in Dashboard → Settings → API → Exposed
 * schemas, or every request comes back as a 404. */
