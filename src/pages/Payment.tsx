
import React from "react";

const Payment: React.FC = () => (
  <div className="max-w-5xl mx-auto py-10 px-4">
    <h1 className="text-3xl md:text-4xl font-bold text-brand mb-6 text-center">
      Payment Options at egde-fx
    </h1>
    <div className="bg-card rounded-xl shadow-lg p-8 text-base">
      <p className="mb-4">
        At <span className="font-bold text-brand">egde-fx</span> you can use a wide range of secure payment options. Kindly contact us for custom payment methods or inquiries.
      </p>
      <ul className="list-disc ml-8 mb-6">
        <li>Credit Card & Debit Card</li>
        <li>Bank Transfer</li>
        <li>Cryptocurrency (BTC, ETH, USDT)</li>
        <li>UPI, net banking & local methods upon request</li>
      </ul>
      <div className="text-center mt-8">
        <a href="/contact" className="bg-brand px-6 py-2 rounded text-white font-semibold shadow hover:bg-brand-light transition">Contact Us for Payment Help</a>
      </div>
    </div>
  </div>
);

export default Payment;
