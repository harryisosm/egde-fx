
import React from "react";

const About: React.FC = () => (
  <div className="max-w-5xl mx-auto py-10 px-4">
    <h1 className="text-3xl md:text-4xl font-bold text-brand mb-6 text-center">
      About egde-fx
    </h1>
    <div className="bg-card rounded-xl shadow-lg p-6 md:p-10">
      <p className="mb-4">
        <span className="font-bold text-brand">egde-fx LLC</span> is committed to providing transparent investment opportunities in global markets including FOREX and COMEX. With a professional research team, egde-fx delivers actionable insights to help investors maximize gains and achieve financial freedom.
      </p>
      <ul className="list-disc ml-6 mb-4">
        <li>Global market expertise and 24/7 client support.</li>
        <li>Transparent and trustworthy investment migration services.</li>
        <li>Regular research updates and best-in-class client confidentiality.</li>
        <li>Licensed and experienced trading professionals.</li>
      </ul>
      <div className="flex flex-col md:flex-row gap-6 mt-6 items-center justify-center">
        <img src="/placeholder.svg" alt="Research Team" className="rounded-lg shadow-md w-full md:w-1/2 h-64 object-cover"/>
        <div>
          <h2 className="text-2xl font-semibold mb-2 text-brand">Our Philosophy</h2>
          <p>
            At egde-fx, we believe in empowering our clients through deep research, advanced trading technology, and a culture of integrity.
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default About;
