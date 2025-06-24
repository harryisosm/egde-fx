import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { api } from "@/utils/api";

const Contact: React.FC = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await api.post('/contact/', form);

      toast({
        title: "Message Sent!",
        description: data.message,
        duration: 3000,
      });
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to send message',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-brand mb-5 text-center">
        Contact egde-fx
      </h1>
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
        <textarea
          name="message"
          placeholder="Your Message"
          required
          rows={4}
          className="rounded-md border border-input bg-background px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          value={form.message}
          onChange={handleChange}
        />
        <Button 
          type="submit" 
          className="bg-brand hover:bg-brand-light text-white font-bold mt-2"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Message'}
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

export default Contact;
