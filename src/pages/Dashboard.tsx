import React, { useEffect } from "react";
import TradingCategoryCard from "@/components/TradingCategoryCard";
import { toast } from "@/hooks/use-toast";
import { RefreshCcw, User, LogOut } from "lucide-react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useNavigate } from "react-router-dom";
import { api } from "@/utils/api";

const initialInstruments = {
  FOREX: [
    { symbol: "EUR/USD", value: "0.1", enabled: true },
    { symbol: "USD/JPY", value: "0.01", enabled: true },
    { symbol: "GBP/USD", value: "0.01", enabled: true },
    { symbol: "USD/CHF", value: "0.01", enabled: true },
    { symbol: "AUD/USD", value: "0.01", enabled: false },
    { symbol: "USD/CAD", value: "0.01", enabled: true },
    { symbol: "NZD/USD", value: "0.01", enabled: true },
  ],
  COMEX: [
    { symbol: "XAU/USD", value: "0.1", enabled: true },
    { symbol: "XAG/USD", value: "0.01", enabled: true },
    { symbol: "WTI", value: "1.0", enabled: true },
    { symbol: "BRENT", value: "0.01", enabled: true },
    { symbol: "NG", value: "0.01", enabled: false },
    { symbol: "HG", value: "0.01", enabled: true },
    { symbol: "PL", value: "0.01", enabled: true },
    { symbol: "PA", value: "0.01", enabled: false },
  ],
  STOCKS: [
    { symbol: "AAPL", value: "0.01", enabled: true },
    { symbol: "MSFT", value: "0.01", enabled: true },
    { symbol: "AMZN", value: "0.01", enabled: true },
    { symbol: "TSLA", value: "0.01", enabled: true },
    { symbol: "GOOGL", value: "0.01", enabled: true },
    { symbol: "META", value: "0.01", enabled: true },
    { symbol: "BRK.B", value: "0.01", enabled: true },
    { symbol: "JPM", value: "0.01", enabled: true },
    { symbol: "V", value: "0.01", enabled: true },
    { symbol: "JNJ", value: "0.01", enabled: true },
    { symbol: "NVDA", value: "0.01", enabled: true },
    { symbol: "PG", value: "0.01", enabled: true },
  ],
  CRYPTO: [
    { symbol: "BTC/USD", value: "0.2", enabled: true },
    { symbol: "ETH/USD", value: "0.01", enabled: true },
    { symbol: "BNB/USD", value: "0.01", enabled: true },
    { symbol: "XRP/USD", value: "0.01", enabled: false },
    { symbol: "SOL/USD", value: "0.01", enabled: true },
    { symbol: "ADA/USD", value: "0.01", enabled: true },
    { symbol: "DOGE/USD", value: "0.01", enabled: false },
    { symbol: "AVAX/USD", value: "0.01", enabled: true },
    { symbol: "MATIC/USD", value: "0.01", enabled: true },
    { symbol: "DOT/USD", value: "0.01", enabled: false },
  ],
};

const categoryOrder: ("FOREX" | "COMEX" | "STOCKS" | "CRYPTO")[] = [
  "FOREX", "COMEX", "STOCKS", "CRYPTO"
];

const Dashboard: React.FC = () => {
  useAuthGuard();
  const navigate = useNavigate();
  const [categories, setCategories] = React.useState(initialInstruments);
  const [loading, setLoading] = React.useState(true);
  const [userData, setUserData] = React.useState<any>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserData(user);
    fetchConfigurations();
  }, []);

  const fetchConfigurations = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const data = await api.get(`/trading-config/?user_id=${user.id}`);
      
      if (Object.keys(data).length > 0) {
        setCategories(data);
      } else {
        setCategories(initialInstruments);
      }
    } catch (error) {
      console.error('Error fetching configurations:', error);
      setCategories(initialInstruments);
    } finally {
      setLoading(false);
    }
  };

  const handleInstrumentChange = (
    category: keyof typeof initialInstruments,
    idx: number,
    updates: any
  ) => {
    setCategories((prev) => ({
      ...prev,
      [category]: prev[category].map((row, i) =>
        i === idx ? { ...row, ...updates } : row
      ),
    }));
  };

  const handleUpdate = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      await api.post('/trading-config/', {
        user_id: user.id,
        ...categories
      });

      toast({
        title: "Configuration Updated!",
        description: "Your trading instruments were updated.",
        duration: 3000,
      });
      // Refresh configurations after update
      fetchConfigurations();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update configuration. Please try again.",
        duration: 3000,
      });
    }
  };

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user');
    // Show success message
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
      duration: 3000,
    });
    // Redirect to root page
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#181818] flex flex-col justify-center items-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#181818] flex flex-col items-center px-4 md:px-6 py-6 md:py-12 animate-fade-in pb-20">
      {/* User Info Header */}
      <div className="w-full max-w-6xl mb-6 md:mb-8 bg-[#232323] rounded-xl p-4 md:p-6 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
          <div className="flex items-center gap-4">
            <div className="bg-brand/20 p-2 md:p-3 rounded-full">
              <User className="w-6 h-6 md:w-8 md:h-8 text-brand" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white">{userData?.name}</h2>
              <div className="text-gray-400 text-sm md:text-base">
                <p>Username: {userData?.username}</p>
                <p>Email: {userData?.email}</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="
              w-full md:w-auto
              px-4 md:px-6 py-2 rounded-lg
              bg-red-500/10 hover:bg-red-500/20
              text-red-500 font-medium
              flex items-center justify-center gap-2
              transition-all duration-200
              border border-red-500/20
            "
          >
            <LogOut size={18} className="md:w-5 md:h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Trading Categories */}
      <div className="w-full max-w-[1400px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categoryOrder.map((cat) => (
            <TradingCategoryCard
              key={cat}
              title={cat}
              instruments={categories[cat]}
              onInstrumentChange={(idx, updates) =>
                handleInstrumentChange(cat, idx, updates)
              }
            />
          ))}
        </div>
      </div>

      {/* Update Button */}
      <button
        type="button"
        className="
          mt-6 md:mt-8 shadow-lg shadow-brand/40
          bg-gradient-to-b from-brand to-brand-light
          hover:bg-brand hover:scale-105
          transition-all duration-200
          px-8 md:px-14 py-3 md:py-4 rounded-xl text-white text-lg md:text-2xl font-bold tracking-wider
          border-2 border-brand-light
          outline-none focus:ring-2 focus:ring-brand
          flex flex-row items-center gap-2
          w-full md:w-auto
          justify-center
          "
        style={{
          boxShadow: "0 0 24px 1px #2997ff33, 0px 4px 40px #000a",
          textShadow: "0 1px 0 #FFF9",
          letterSpacing: 2,
        }}
        onClick={handleUpdate}
      >
        <RefreshCcw color="white" size={24} className="md:w-7 md:h-7" /> UPDATE
      </button>
    </div>
  );
};

export default Dashboard;

