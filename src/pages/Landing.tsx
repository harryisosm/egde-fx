import React from "react";
import { Link } from "react-router-dom";

// Remove heroImages (unused)
const logoStrip = "/lovable-uploads/837de0ac-87a7-4adc-a3d8-dbfb8af7f22c.png";
const aboutImg = "/lovable-uploads/b7c6abfd-3650-4fb0-a335-2d6363cc909e.png";

const EndlessLogoSlider: React.FC = () => {
  // Uses two strips for seamless looping, centered, responsive, with no xs gap
  return (
    <div className="w-full flex justify-center bg-[#181818] py-6">
      <div className="relative w-full max-w-4xl px-0 md:px-4 overflow-x-hidden">
        <div
          className="flex items-center animate-slide-logos will-change-transform"
          style={{
            animation: "slide-logos 30s linear infinite",
            gap: 0,
          }}
        >
          <img
            src={logoStrip}
            alt="Broker Logos"
            className="h-12 md:h-16 pointer-events-none select-none"
            draggable={false}
            style={{ minWidth: 650 }}
          />
          <img
            src={logoStrip}
            alt="Broker Logos Duplicate"
            className="h-12 md:h-16 pointer-events-none select-none"
            draggable={false}
            style={{ minWidth: 650 }}
            aria-hidden="true"
          />
        </div>
      </div>
      {/* Custom keyframes */}
      <style>
        {`
        @keyframes slide-logos {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-slide-logos {
          animation: slide-logos 30s linear infinite;
        }
        `}
      </style>
    </div>
  );
};

/**
 * About Section - based on supplied screenshot and instructions.
 * - Responsive side-by-side layout (image left, text right)
 * - Mobile: Stack image above text
 * - Text only refers to Algo Traders, no "Finoways"
 */
const AboutSection: React.FC = () => (
  <section className="w-full bg-[#181818] py-12 md:py-20 px-2 md:px-0 flex justify-center">
    <div className="flex flex-col md:flex-row items-center max-w-5xl w-full gap-0 md:gap-16">
      {/* Image Left */}
      <div className="md:w-1/2 w-full flex justify-center">
        <img
          src={aboutImg}
          alt="About egde-fx"
          className="w-full max-w-md rounded-2xl drop-shadow-xl object-contain transition-transform duration-300 hover:scale-105"
          draggable={false}
        />
      </div>
      {/* Text Right */}
      <div className="md:w-1/2 w-full mt-10 md:mt-0 flex flex-col items-start">
        <h2 className="text-brand text-2xl md:text-3xl font-bold mb-4">
          About egde-fx
        </h2>
        <p className="text-gray-200 mb-4 leading-relaxed text-base md:text-lg">
          At egde-fx, we are dedicated to helping individuals and businesses achieve their financial goals. Our team of experienced consultants has a wealth of knowledge and expertise in areas such as investment management, Forex, Crypto, and Comex.
        </p>
        <p className="text-gray-200 mb-8 leading-relaxed text-base md:text-lg">
          We understand that every client is unique, so we take the time to learn about your specific financial situation and tailor our services to your needs. Our goal is to provide you with a comprehensive financial plan to reach your short-term and long-term objectives.
        </p>
        <Link
          to="/about"
          className="bg-brand hover:bg-brand-light text-white font-bold px-7 py-3 rounded-md shadow transition hover:scale-105"
        >
          Read More
        </Link>
      </div>
    </div>
  </section>
);

const TradingInfoSection: React.FC = () => (
  <section className="w-full bg-black py-16 px-4 flex justify-center">
    <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-y-20 gap-x-14">
      {/* COMEX Row */}
      <div className="flex flex-col gap-6 justify-center">
        <h3 className="text-3xl md:text-4xl font-extrabold text-brand mb-3 leading-tight">
          What is comex trading
        </h3>
        <p className="text-gray-200 text-base md:text-lg leading-relaxed">
          The Comex market is a division of the New York Mercantile Exchange (NYMEX) that specifically deals with the trading of metals futures and options contracts. It stands for the Commodity Exchange, and it is one of the largest and most influential marketplaces for the trading of precious metals such as gold, silver, copper, and platinum. The Comex market provides a platform for investors, speculators, and hedgers to trade these metals based on their anticipated price movements. It plays a crucial role in setting global benchmark prices for these commodities and is closely monitored by traders, miners, jewelry manufacturers, and other industry participants.
        </p>
      </div>
      <div className="w-full flex items-center justify-center">
        {/* Example image, replace src when appropriate */}
        <img
          src="https://images.pexels.com/photos/7990902/pexels-photo-7990902.jpeg?auto=compress&w=600&q=80"
          alt="Comex Trading Illustration"
          className="w-[370px] md:w-[460px] rounded-xl shadow-2xl object-cover"
          draggable={false}
        />
      </div>
      {/* FOREX Row */}
      <div className="w-full flex items-center justify-center md:order-3 order-4">
        {/* Example image, replace src when appropriate */}
        <img
          src="https://images.pexels.com/photos/315788/pexels-photo-315788.jpeg?auto=compress&w=600&q=80"
          alt="Forex Trading Illustration"
          className="w-[370px] md:w-[460px] rounded-xl shadow-2xl object-cover"
          draggable={false}
        />
      </div>
      <div className="flex flex-col gap-6 justify-center md:order-4 order-3">
        <h3 className="text-3xl md:text-4xl font-extrabold text-brand mb-3 leading-tight">
          What is forex trading
        </h3>
        <p className="text-gray-200 text-base md:text-lg leading-relaxed">
          The forex market, also known as the foreign exchange market, is a global decentralized market where the buying and selling of currencies take place. It is the largest and most liquid financial market in the world, with an average daily trading volume of around $6 trillion. Forex market operates 24 hours a day, five days a week, as it involves trading in different time zones across the globe. The forex market is driven by various factors, including economic indicators, geopolitical events, and market sentiment.
        </p>
      </div>
    </div>
  </section>
);

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#181818] to-[#232323] flex flex-col items-center w-full">
      {/* Hero Section with custom background image and overlay */}
      <section
        className="relative w-full flex flex-col items-center justify-center pt-16 pb-12 md:py-28"
        style={{
          backgroundImage: "url('/lovable-uploads/6b9b9f29-c53f-4f7a-b982-e807a0b5c1f9.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-[#181818]/80 backdrop-blur-[1px] z-0" />
        <div className="max-w-4xl mx-auto text-center z-10 px-4 relative">
          <h1 className="text-3xl md:text-5xl font-extrabold text-brand mb-4 drop-shadow animate-fade-in">
            Welcome to egde-fx
          </h1>
          <p
            className="text-gray-200 text-lg mb-8 animate-fade-in"
            style={{ animationDelay: "120ms" }}
          >
            Empower your trading decisions with intelligent automation. <br className="hidden md:block" />
            FOREX, COMEX, Stocks & Crypto — modern growth for modern traders.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link
              to="/register"
              className="bg-brand hover:bg-brand-light text-white font-bold px-8 py-3 rounded-lg transition hover:scale-105 shadow"
            >
              Get Started
            </Link>
            <Link
              to="/dashboard"
              className="border-2 border-brand text-brand font-bold px-8 py-3 rounded-lg hover:bg-brand/10 transition hover:scale-105 shadow"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
        {/* Hero Visuals: Staggered floating effect */}
        
      </section>

      {/* Endless Sliding Broker Logos Section */}
      <EndlessLogoSlider />

      {/* About Section: egde-fx */}
      <AboutSection />

      {/* Trading Info section (COMEX & FOREX) */}
      <TradingInfoSection />

      {/* Section: Why Choose Us */}
      <section className="w-full bg-[#232323] py-12">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-brand mb-3">Why egde-fx?</h2>
          <p className="text-gray-200 text-base md:text-lg mb-4 animate-fade-in" style={{ animationDelay: "110ms" }}>
            AI-powered strategies, proven growth, and transparent analytics.  
            <span className="block mt-1">Unlock market advantages with a global, trusted trading community.</span>
          </p>
        </div>
      </section>
    </div>
  );
};

export default Landing;
