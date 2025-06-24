import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { api } from "@/utils/api";

const Franchise: React.FC = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await api.post('/franchise/', form);

      toast({
        title: "Inquiry Submitted!",
        description: data.message,
        duration: 3000,
      });
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to submit inquiry',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-brand mb-5 text-center">
        Become a Franchise &ndash; egde-fx
      </h1>
      <p className="mb-6 text-center text-gray-400">
        Partner with <span className="font-bold text-brand">egde-fx</span> and join our journey of success!
        Fill out the form below and our team will reach out to explain how you can become a valued franchise partner.
      </p>
      <form onSubmit={handleSubmit} className="bg-card rounded-xl shadow-lg p-8 flex flex-col gap-4">
        <Input
          name="name"
          placeholder="Your Name"
          required
          value={form.name}
          onChange={handleChange}
        />
        <Input
          name="email"
          type="email"
          placeholder="Your Email"
          required
          value={form.email}
          onChange={handleChange}
        />
        <Input
          name="phone"
          type="tel"
          placeholder="Your Phone Number"
          required
          value={form.phone}
          onChange={handleChange}
        />
        <Textarea
          name="message"
          placeholder="Tell us about your interest or previous experience…"
          required
          rows={4}
          value={form.message}
          onChange={handleChange}
        />
        <Button 
          type="submit" 
          className="bg-brand hover:bg-brand-light text-white font-bold mt-2"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Franchise Inquiry'}
        </Button>
      </form>
      <div className="mt-10 px-2 text-center text-gray-400">
        <div className="mb-2"><b>Phone:</b> +442038074962</div>
        <div className="mb-2"><b>Email:</b> info@egde-fx.com</div>
        <div><b>Address:</b> Shams Business Center, Sharjah Media City Free Zone, Al Messaned, Sharjah, UAE.</div>
      </div>
    </div>
  );
};

export default Franchise;
