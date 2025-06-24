import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMsg(null);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    setLoading(true);
    try {
      const data = await api.post('/login/', {
        username,
        password
      });

      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setMsg("Login successful! Redirecting to Dashboard...");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#181818]">
      <form
        onSubmit={handleSubmit}
        className="bg-[#232323] shadow-lg p-8 rounded-xl w-full max-w-xs flex flex-col gap-4"
      >
        <h2 className="text-xl font-bold text-brand mb-2 text-center">Login</h2>
        <Input type="text" name="username" placeholder="Username" required />
        <Input type="password" name="password" placeholder="Password" required />
        <Button type="submit" className="bg-brand hover:bg-brand-light font-bold text-white" disabled={loading}>
          {loading ? "Logging in..." : "Log in"}
        </Button>
        {msg && <span className="text-green-400 text-sm text-center">{msg}</span>}
        {error && <span className="text-red-400 text-sm text-center">{error}</span>}
        <span className="text-sm text-gray-400 text-center">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-brand hover:underline">Register</Link>
        </span>
      </form>
    </div>
  );
};

export default Login;
