
import React from "react";

const services = [
  {
    title: "FOREX Market Trading",
    description: "Analysis and signals for major currency pairs, delivered with high accuracy by the egde-fx research team.",
    icon: "💱",
  },
  {
    title: "COMEX Market Insights",
    description: "Commodity trade advice with special attention to gold, silver, and crude oil. Tailored strategies from egde-fx experts.",
    icon: "🪙",
  },
  {
    title: "Research Reports",
    description: "Daily and weekly research reports to keep our clients ahead of the market.",
    icon: "📊",
  },
  {
    title: "Account Management",
    description: "Professional trade management and customer support for egde-fx clients, 24/7.",
    icon: "👨‍💼",
  }
];

const Services: React.FC = () => (
  <div className="max-w-5xl mx-auto py-10 px-4">
    <h1 className="text-3xl md:text-4xl font-bold text-brand mb-6 text-center">
      Our Services
    </h1>
    <div className="grid md:grid-cols-2 gap-6">
      {services.map((service, idx) => (
        <div key={service.title} className="bg-card rounded-xl shadow-lg p-6 flex items-start gap-4">
          <div className="text-4xl">{service.icon}</div>
          <div>
            <h2 className="text-xl font-semibold mb-1 text-brand">{service.title}</h2>
            <p>{service.description}</p>
          </div>
        </div>
      ))}
    </div>
    <div className="mt-10 text-center">
      <h3 className="text-lg font-bold mb-2 text-brand">Why Choose egde-fx?</h3>
      <ul className="list-disc list-inside space-y-1 mx-auto max-w-xl text-left text-base">
        <li>Best-in-class research and analytics.</li>
        <li>Customized portfolio strategies and risk management.</li>
        <li>Prompt and professional client support.</li>
        <li>Client-first investment philosophy.</li>
      </ul>
    </div>
  </div>
);

export default Services;
