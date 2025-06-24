
/**
 * Clean up all possible Supabase auth keys in localStorage and sessionStorage.
 * Should be called before every explicit login or signup to prevent "limbo" states.
 */
export function cleanupAuthState() {
  // Remove all Supabase auth-related keys in localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("supabase.auth.") || key.includes("sb-")) {
      localStorage.removeItem(key);
    }
  });
  // Remove all Supabase auth-related keys in sessionStorage
  Object.keys(sessionStorage).forEach((key) => {
    if (key.startsWith("supabase.auth.") || key.includes("sb-")) {
      sessionStorage.removeItem(key);
    }
  });
}
