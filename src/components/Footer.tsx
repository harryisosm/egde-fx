
import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Send,
  Phone,
  Mail,
  MapPin
} from "lucide-react";

const Footer: React.FC = () => (
  <footer className="bg-[#111] py-10 w-full mt-10 border-t border-brand/10">
    <div className="max-w-7xl mx-auto px-4 flex flex-wrap gap-y-10 gap-x-8 justify-between text-left">
      {/* About section */}
      <div className="flex-1 min-w-[220px] max-w-sm">
        <p className="text-gray-200 mb-6 leading-relaxed">
          egde-fx offers investment opportunities in various global markets including FOREX, COMEX to help clients achieve financial freedom.
        </p>
        <Link to="/" className="inline-block bg-brand text-white font-semibold px-6 py-3 rounded-md hover:bg-brand-light transition">
          LIVE MARKET
        </Link>
        <div className="flex space-x-4 mt-8">
          <a href="#" className="hover:text-brand text-gray-300">
            <Twitter size={22} />
          </a>
          <a href="#" className="hover:text-brand text-gray-300">
            <Facebook size={22} />
          </a>
          <a href="#" className="hover:text-brand text-gray-300">
            <Instagram size={22} />
          </a>
          <a href="#" className="hover:text-brand text-gray-300">
            <Youtube size={22} />
          </a>
          <a href="#" className="hover:text-brand text-gray-300">
            <Send size={22} />
          </a>
        </div>
      </div>
      {/* Quick Links */}
      <div className="flex-1 min-w-[180px]">
        <h4 className="text-brand font-bold mb-3 text-lg">Quick Links</h4>
        <ul className="space-y-2">
          <li><Link to="/" className="text-gray-100 hover:text-brand transition">Home</Link></li>
          <li><Link to="/about" className="text-gray-100 hover:text-brand transition">About Us</Link></li>
          <li><Link to="/services" className="text-gray-100 hover:text-brand transition">Services</Link></li>
          <li><Link to="/pricing" className="text-gray-100 hover:text-brand transition">Pricing</Link></li>
          <li><Link to="/payment" className="text-gray-100 hover:text-brand transition">Payment</Link></li>
          <li><Link to="/contact" className="text-gray-100 hover:text-brand transition">Contact us</Link></li>
          <li><Link to="/faq" className="text-gray-100 hover:text-brand transition">FAQ</Link></li>
          <li><Link to="/franchise" className="text-gray-100 hover:text-brand transition">Become a Franchise</Link></li>
        </ul>
      </div>
      {/* Policies */}
      <div className="flex-1 min-w-[180px]">
        <h4 className="text-brand font-bold mb-3 text-lg">Policies</h4>
        <ul className="space-y-2">
          <li><Link to="/terms" className="text-gray-100 hover:text-brand transition">Terms and Conditions</Link></li>
          <li><Link to="/disclaimer" className="text-gray-100 hover:text-brand transition">Disclaimer</Link></li>
          <li><Link to="/privacy" className="text-gray-100 hover:text-brand transition">Privacy Policy</Link></li>
          <li><Link to="/refund" className="text-gray-100 hover:text-brand transition">Refund Policy</Link></li>
          <li><Link to="/benefits-forex" className="text-gray-100 hover:text-brand transition">Benefits of Forex</Link></li>
          <li><Link to="/benefits-comex" className="text-gray-100 hover:text-brand transition">Benefits of Comex</Link></li>
          <li><Link to="/live-accounts" className="text-gray-100 hover:text-brand transition">Live Accounts</Link></li>
        </ul>
      </div>
      {/* Contact Section */}
      <div className="flex-1 min-w-[220px] max-w-xs">
        <h4 className="text-brand font-bold mb-3 text-lg">Contact Us</h4>
        <ul className="space-y-3 text-gray-100">
          <li className="flex gap-4 items-center">
            <Phone size={18} className="text-brand" /> +442038074962
          </li>
          <li className="flex gap-4 items-center">
            <Mail size={18} className="text-brand" />
            <span className="break-all">info@egde-fx.com</span>
          </li>
          <li className="flex gap-4 items-start">
            <MapPin size={18} className="text-brand" />
            <span>
              Shams Business Center, Sharjah Media City Free Zone, Al Messaned,<br />
              Sharjah, UAE.
            </span>
          </li>
        </ul>
      </div>
    </div>
    <div className="text-gray-500 text-center mt-10 text-sm">
      &copy; {new Date().getFullYear()} egde-fx. All rights reserved.
    </div>
  </footer>
);

export default Footer;
