
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { cleanupAuthState } from "@/hooks/cleanupAuthState";

const UserPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);

  const handleLogout = async () => {
    setLoading(true);
    setMsg(null);
    cleanupAuthState();
    try {
      await supabase.auth.signOut({ scope: "global" });
      setMsg("Logged out. Redirecting...");
      setTimeout(() => {
        window.location.href = "/login";
      }, 700);
    } catch {
      setMsg("Error logging out.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#181818] animate-fade-in">
      <div className="bg-[#232323] shadow-lg p-8 rounded-xl w-full max-w-xs flex flex-col gap-6">
        <h2 className="text-xl font-bold text-yellow-400 mb-2 text-center">Your Account</h2>
        <Button
          type="button"
          variant="outline"
          className="font-bold"
          disabled={loading}
          onClick={handleLogout}
        >
          {loading ? "Logging out..." : "Logout"}
        </Button>
        {msg && <span className="text-green-400 text-sm text-center">{msg}</span>}
        <div className="mt-2 text-gray-400 text-sm text-center">Other options coming soon...</div>
      </div>
    </div>
  );
};

export default UserPage;
