import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LineChart, Home, RefreshCw, Activity, Newspaper } from "lucide-react";

const navItems = [
  {
    label: "LIVE MARKET",
    icon: <LineChart size={22} strokeWidth={2.3} />,
    path: "/live-market",
  },
  {
    label: "DASHBOARD",
    icon: <Home size={22} strokeWidth={2.3} />,
    path: "/dashboard",
  },
  {
    label: "P&L",
    icon: <RefreshCw size={22} strokeWidth={2.3} />,
    path: "/pnl",
  },
  {
    label: "ACTIVITY",
    icon: <Activity size={22} strokeWidth={2.3} />,
    path: "/activity",
  },
  {
    label: "NEWS",
    icon: <Newspaper size={22} strokeWidth={2.3} />,
    path: "/news",
  },
];

const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 bg-[#101010] border-t border-brand/30 h-16 flex items-center justify-around px-4 shadow-lg">
      {navItems.map((item) => {
        const active = location.pathname === item.path;
        return (
          <button
            key={item.label}
            className={`flex flex-col items-center flex-1 justify-center 
              transition 
              ${active ? "text-brand font-bold" : "text-gray-100 hover:text-brand/70"} 
              focus:outline-none`}
            onClick={() => navigate(item.path)}
          >
            <span className="mb-1">{item.icon}</span>
            <span className="text-xs tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
