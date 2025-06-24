import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setError(null);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirm = formData.get("confirm") as string;
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const data = await api.post('/register/', {
        username,
        email,
        password,
        name,
        phone
      });

      setMsg("Registration successful! Please login.");
      setTimeout(() => {
        navigate("/login");
      }, 2400);
    } catch (e: any) {
      setError(e.message);
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
        <h2 className="text-xl font-bold text-brand mb-2 text-center">Register</h2>
        <Input type="text" name="username" placeholder="Username" required />
        <Input type="text" name="name" placeholder="Full Name" required />
        <Input type="email" name="email" placeholder="Email" required />
        <Input type="tel" name="phone" placeholder="Phone Number" required />
        <Input type="password" name="password" placeholder="Password" required />
        <Input type="password" name="confirm" placeholder="Confirm Password" required />
        <Button type="submit" className="bg-brand hover:bg-brand-light font-bold text-white" disabled={loading}>
          {loading ? "Creating..." : "Sign Up"}
        </Button>
        {msg && <span className="text-green-400 text-sm text-center">{msg}</span>}
        {error && <span className="text-red-400 text-sm text-center">{error}</span>}
        <span className="text-sm text-gray-400 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-brand hover:underline">Login</Link>
        </span>
      </form>
    </div>
  );
};

export default Register;
