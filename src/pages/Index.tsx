import React from "react";
import TradingCategoryCard from "@/components/TradingCategoryCard";
import { toast } from "@/hooks/use-toast";
import { RefreshCcw } from "lucide-react";
import { Link } from "react-router-dom";

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

const Index: React.FC = () => {
  const [categories, setCategories] = React.useState(initialInstruments);

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

  const handleUpdate = () => {
    toast({
      title: "Configuration Updated!",
      description: "Your trading instruments were updated.",
      duration: 3000,
    });
    // (could call API here)
  };

  return (
    <div className="min-h-screen w-full bg-[#181818] flex flex-col justify-center items-center px-0 py-12">
      <div className="w-full flex flex-row justify-end max-w-6xl mb-4">
        <Link
          to="/admin"
          className="inline-block bg-brand text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-brand-light transition-all"
        >
          Admin Page
        </Link>
      </div>
      <div
        className="w-full flex flex-row gap-6 justify-center items-start overflow-x-auto"
        style={{ maxWidth: "1400px" }}
      >
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
      <button
        type="button"
        className="
          mt-3 shadow-lg shadow-brand/40
          bg-gradient-to-b from-brand to-brand-light
          hover:bg-brand hover:scale-105
          transition-all duration-200
          px-14 py-4 rounded-xl text-white text-2xl font-bold tracking-wider
          border-2 border-brand-light
          outline-none focus:ring-2 focus:ring-brand
          flex flex-row items-center gap-2
          "
        style={{
          boxShadow: "0 0 24px 1px #2997ff33, 0px 4px 40px #000a",
          textShadow: "0 1px 0 #FFF9",
          letterSpacing: 2,
        }}
        onClick={handleUpdate}
      >
        <RefreshCcw color="white" size={28} /> UPDATE
      </button>
    </div>
  );
};

export default Index;
