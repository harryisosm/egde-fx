import React from "react";
import PnlReportLogs, { Trade } from "@/components/PnlReportLogs";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import BottomNav from "@/components/BottomNav";

const trades: Trade[] = [
  {
    id: 52312,
    entryTime: new Date("2025-01-02T10:29:00"),
    symbol: "EUR/USD",
    type: "BUY",
    quantity: 0.1,
    entryPrice: 2634.18,
    exitTime: new Date("2025-01-02T15:49:00"),
    exitPrice: 2642.0,
    pnl: 78.20,
  },
  {
    id: 52386,
    entryTime: new Date("2025-01-10T06:58:00"),
    symbol: "GBP/USD",
    type: "SELL",
    quantity: 0.1,
    entryPrice: 2676.10,
    exitTime: new Date("2025-01-10T07:05:00"),
    exitPrice: 2663.45,
    pnl: 126.05,
  },
  {
    id: 52329,
    entryTime: new Date("2025-01-13T08:11:00"),
    symbol: "USD/JPY",
    type: "SELL",
    quantity: 0.1,
    entryPrice: 2690.2,
    exitTime: new Date("2025-01-13T16:59:00"),
    exitPrice: 2675.0,
    pnl: 152.50,
  },
  {
    id: 52501,
    entryTime: new Date("2025-02-25T10:44:00"),
    symbol: "AUD/USD",
    type: "MARKET_BUY",
    quantity: 0.1,
    entryPrice: 2939.206,
    exitTime: new Date("2025-02-25T12:27:00"),
    exitPrice: 2937.36,
    pnl: -18.46,
  },
];

const PNL: React.FC = () => {
  useAuthGuard();
  return (
    <div className="min-h-screen bg-[#181818] flex flex-col items-center py-6 md:py-8 px-4 md:px-8 pb-28">
      <div className="w-full max-w-7xl">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-brand mb-4 md:mb-6 text-center md:text-left">
          Your Trade History
        </h2>
        <div className="bg-[#232323] rounded-xl p-3 md:p-4 shadow-lg">
          <PnlReportLogs trades={trades} />
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default PNL;
