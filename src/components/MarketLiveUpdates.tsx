
import React from "react";

const mockData = [
  {
    ticker: "AUDCAD",
    flagLeft: "🇦🇺",
    flagRight: "🇨🇦",
    price: "0.905260",
    chgPercent: "+0.03%",
    chg: "+0.000260",
    chgPercentPos: true,
  },
  {
    ticker: "AUDCHF",
    flagLeft: "🇦🇺",
    flagRight: "🇨🇭",
    price: "0.569510",
    chgPercent: "+0.01%",
    chg: "+0.000060",
    chgPercentPos: true,
  },
  {
    ticker: "AUDEUR",
    flagLeft: "🇦🇺",
    flagRight: "🇪🇺",
    price: "0.6060",
    chgPercent: "-0.05%",
    chg: "-0.0003",
    chgPercentPos: false,
  },
  {
    ticker: "AUDGBP",
    flagLeft: "🇦🇺",
    flagRight: "🇬🇧",
    price: "0.5025",
    chgPercent: "-0.02%",
    chg: "-0.0001",
    chgPercentPos: false,
  },
  {
    ticker: "AUDJPY",
    flagLeft: "🇦🇺",
    flagRight: "🇯🇵",
    price: "95.114",
    chgPercent: "+0.08%",
    chg: "+0.072",
    chgPercentPos: true,
  },
  {
    ticker: "AUDNZD",
    flagLeft: "🇦🇺",
    flagRight: "🇳🇿",
    price: "1.107070",
    chgPercent: "-0.03%",
    chg: "-0.000310",
    chgPercentPos: false,
  },
  {
    ticker: "AUDUSD",
    flagLeft: "🇦🇺",
    flagRight: "🇺🇸",
    price: "0.63505",
    chgPercent: "+0.04%",
    chg: "+0.00023",
    chgPercentPos: true,
  },
];

const MarketLiveUpdates: React.FC = () => {
  return (
    <section className="mt-10 w-full flex flex-col items-center">
      <div className="w-full max-w-2xl rounded-t-xl overflow-hidden">
        <div className="bg-yellow-400 px-6 py-3 text-black text-2xl text-center font-extrabold select-none border-b border-black">
          Fundamental &amp; Technical
        </div>
      </div>
      <div className="bg-[#181818] w-full max-w-2xl rounded-b-xl shadow-xl overflow-auto border border-[#444] border-t-0">
        <div className="flex items-center px-5 pt-4 gap-3">
          <button className="bg-[#242424] text-gray-100 px-4 py-1 rounded-lg font-medium border border-slate-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 mr-2">
            Filters <span aria-hidden>🧊</span>
          </button>
          <select className="bg-[#242424] text-gray-300 px-2 py-1 rounded mr-2 border border-[#333]">
            <option>Major, Minor Pairs</option>
          </select>
          <select className="bg-[#242424] text-gray-300 px-2 py-1 rounded border border-[#333]">
            <option>General</option>
          </select>
        </div>
        <div className="px-2 pb-2 pt-2">
          <table className="w-full text-left text-xs md:text-sm">
            <thead>
              <tr className="border-b border-[#2c2c2c]">
                <th className="py-2 px-2 text-yellow-400 font-semibold">TICKER <span className="text-xs text-gray-400 ml-2 font-normal">49 MATCHES</span></th>
                <th className="py-2 px-2 text-gray-200 font-semibold">PRICE</th>
                <th className="py-2 px-2 text-gray-200 font-semibold">CHG %</th>
                <th className="py-2 px-2 text-gray-200 font-semibold">CHG</th>
              </tr>
            </thead>
            <tbody>
              {mockData.map((item) => (
                <tr key={item.ticker} className="border-b border-[#232323] last:border-0 hover:bg-[#232323] transition">
                  <td className="py-2 px-2 flex items-center gap-2 font-bold">
                    <span className="text-xl">{item.flagLeft}</span>
                    <span className="text-xl">{item.flagRight}</span>
                    <span className="ml-2 text-blue-400 cursor-pointer hover:underline">{item.ticker}</span>
                  </td>
                  <td className="py-2 px-2 font-mono text-white">{item.price}</td>
                  <td className={`py-2 px-2 font-mono ${item.chgPercentPos ? "text-green-400" : "text-red-500"}`}>{item.chgPercent}</td>
                  <td className={`py-2 px-2 font-mono ${item.chgPercentPos ? "text-green-400" : "text-red-500"}`}>{item.chg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default MarketLiveUpdates;
