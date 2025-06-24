
import React from "react";

const pricingTiers = [
  {
    plan: "Starter",
    price: "$99",
    period: "per month",
    features: [
      "Access to all basic signals",
      "Daily market updates",
      "Email support",
    ],
  },
  {
    plan: "Professional",
    price: "$299",
    period: "per month",
    features: [
      "All Starter features",
      "Premium trading signals",
      "WhatsApp & phone support",
      "Research reports",
    ],
    recommended: true,
  },
  {
    plan: "Enterprise",
    price: "Custom",
    period: "",
    features: [
      "All Professional features",
      "Portfolio customization",
      "Dedicated account manager",
      "Priority support"
    ],
  }
];

const Pricing: React.FC = () => (
  <div className="max-w-5xl mx-auto py-10 px-4">
    <h1 className="text-3xl md:text-4xl font-bold text-brand mb-8 text-center">
      Pricing Plans
    </h1>
    <div className="grid md:grid-cols-3 gap-8">
      {pricingTiers.map((tier, idx) => (
        <div key={tier.plan} className={`bg-card rounded-xl shadow-xl p-8 flex flex-col items-center border-2 ${tier.recommended ? "border-brand" : "border-transparent"}`}>
          <h2 className="text-xl font-semibold text-brand mb-1">{tier.plan}</h2>
          <div className="text-4xl font-bold mb-1">{tier.price}</div>
          <div className="text-gray-400 mb-4">{tier.period}</div>
          <ul className="mb-6 space-y-2 text-center">
            {tier.features.map((feature, i) => (
              <li key={i} className="text-base">✔️ {feature}</li>
            ))}
          </ul>
          <button className={`bg-brand text-white px-6 py-2 rounded-full font-bold shadow hover:bg-brand-light transition`}>
            {tier.plan === "Enterprise" ? "Contact Us" : "Choose Plan"}
          </button>
          {tier.recommended && <span className="mt-3 text-xs px-3 py-1 bg-brand text-white rounded-full font-semibold">Recommended</span>}
        </div>
      ))}
    </div>
  </div>
);

export default Pricing;
