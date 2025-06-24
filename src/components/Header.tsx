import React from "react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { label: "About Us", to: "/about" },
  { label: "Services", to: "/services" },
  { label: "Pricing", to: "/pricing" },
  { label: "Payment", to: "/payment" },
  { label: "Contact Us", to: "/contact" },
  { label: "Research Report", to: "/research-report" },
  { label: "Become a Franchise", to: "/franchise" },
];

const Header: React.FC = () => {
  const location = useLocation();

  return (
    <header className="bg-white shadow-md dark:bg-[#191b1f] sticky top-0 z-30 w-full">
      <nav className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          <div className="flex items-center space-x-4">
            {/* Logo or brand name */}
            <span className="text-xl font-extrabold text-brand">egde-fx</span>
          </div>
          <div className="hidden md:flex items-center space-x-5">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className={`text-base font-medium hover:text-brand ${
                  location.pathname.startsWith(link.to)
                    ? "text-brand"
                    : "text-gray-700 dark:text-gray-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex space-x-2">
            <Link
              to="/login"
              className="bg-brand text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-brand-light transition"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
