import { createClient } from "@supabase/supabase-js";

// Supabase klienti yaranan kimi linkdəki hash/code-u silir,
// ona görə məlumatı createClient-dən ƏVVƏL yadda saxlayırıq.
const { hash, search, pathname } = window.location;

export const isRecoveryLink =
  pathname === "/forgot" &&
  (hash.includes("type=recovery") || search.includes("code="));

export const isLinkExpired =
  pathname === "/forgot" &&
  (hash.includes("error_code=otp_expired") || hash.includes("error=access_denied"));

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);