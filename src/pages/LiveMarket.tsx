import React, { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------
   LiveMarketDashboard (v2)
   ------------------------------------------------------------------
   ▸ Dark‑themed, responsive trading dashboard that mirrors the
     InfiAlgo layout from your screenshot.
   ▸ New in this version:
       • Left sidebar now uses TradingView's **Screener** widget,
         so users can flip between Overview, General, Filters, etc.
       • Dropdown lets users switch between **Forex, Crypto, Stocks**
         screeners without reloading the whole page.
   ▸ All widgets are free, client‑side embeds from TradingView — no API keys.
-------------------------------------------------------------------*/

declare global {
  interface Window {
    TradingView: any;
  }
}

const LiveMarketDashboard: React.FC = () => {
  /* ------------------------------ state ------------------------------ */
  const [viewport, setViewport] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1280,
    height: typeof window !== "undefined" ? window.innerHeight : 720,
  });

  const [screenerType, setScreenerType] = useState<"forex" | "crypto" | "stock">("forex");

  /* ---------------------------- refs ---------------------------- */
  const tickerRef = useRef<HTMLDivElement>(null);
  const screenerRef = useRef<HTMLDivElement>(null);
  const watchlistRef = useRef<HTMLDivElement>(null);

  /* -------------------------- resize hook ------------------------- */
  useEffect(() => {
    const onResize = () =>
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ------------------ ensure TradingView JS loaded ----------------- */
  useEffect(() => {
    if (window.TradingView) return; // already in page
    const tvScript = document.createElement("script");
    tvScript.src = "https://s3.tradingview.com/tv.js";
    tvScript.async = true;
    document.body.appendChild(tvScript);
    return () => {
      document.body.removeChild(tvScript);
    };
  }, []);

  /* ------------------------- main chart ------------------------- */
  useEffect(() => {
    if (!window.TradingView) return; // wait until script loads

    const containerId = "live_chart_container";
    const holder = document.getElementById(containerId);
    if (holder) holder.innerHTML = ""; // reset chart on resize

    new window.TradingView.widget({
      symbol: "OANDA:XAUUSD",
      interval: viewport.width < 768 ? "30" : "D",
      autosize: true,
      container_id: containerId,
      theme: "dark",
      timezone: "Etc/UTC",
      hide_side_toolbar: viewport.width < 768,
      withdateranges: viewport.width >= 768,
      style: "1",
      locale: "en",
      disabled_features:
        viewport.width < 768
          ? [
              "header_symbol_search",
              "header_compare",
              "header_saveload",
              "header_screenshot",
              "header_undo_redo",
              "header_fullscreen_button",
            ]
          : [],
      overrides: {
        "mainSeriesProperties.candleStyle.upColor": "#26a69a",
        "mainSeriesProperties.candleStyle.downColor": "#ef5350",
        "mainSeriesProperties.candleStyle.borderUpColor": "#26a69a",
        "mainSeriesProperties.candleStyle.borderDownColor": "#ef5350",
        "mainSeriesProperties.candleStyle.wickUpColor": "#26a69a",
        "mainSeriesProperties.candleStyle.wickDownColor": "#ef5350",
      },
    });
  }, [viewport.width]);

  /* -------------------------- ticker tape ------------------------- */
  useEffect(() => {
    if (!tickerRef.current || tickerRef.current.childElementCount) return;
    const s = document.createElement("script");
    s.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    s.async = true;
    s.innerHTML = JSON.stringify({
      symbols: [
        { proName: "FOREXCOM:EURUSD", title: "EUR/USD" },
        { proName: "OANDA:XAUUSD", title: "Gold" },
        { proName: "NASDAQ:AAPL", title: "Apple" },
        { proName: "NASDAQ:TSLA", title: "Tesla" },
        { proName: "TVC:UKOIL", title: "UK Oil" },
      ],
      showSymbolLogo: true,
      colorTheme: "dark",
      displayMode: "adaptive",
      locale: "en",
    });
    tickerRef.current.appendChild(s);
  }, []);

  /* --------------------- build / rebuild screener --------------------- */
  const buildScreener = () => {
    if (!window.TradingView || !screenerRef.current) return;
    screenerRef.current.innerHTML = ""; // clear previous
    const scr = document.createElement("script");
    scr.src = "https://s3.tradingview.com/external-embedding/embed-widget-screener.js";
    scr.async = true;
    scr.innerHTML = JSON.stringify({
      width: "100%",
      height: "100%",
      defaultColumn: "overview", // user can click other columns (general, etc.)
      colorTheme: "dark",
      locale: "en",
      market: screenerType, // forex | crypto | stock
      screen: "general",
      showToolbar: true,
      isTransparent: false,
    });
    screenerRef.current.appendChild(scr);
  };

  useEffect(buildScreener, [screenerType]);

  /* ----------------------- build watchlist once ---------------------- */
  useEffect(() => {
    if (!watchlistRef.current || watchlistRef.current.childElementCount) return;
    const w = document.createElement("script");
    w.src = "https://s3.tradingview.com/external-embedding/embed-widget-watchlist.js";
    w.async = true;
    w.innerHTML = JSON.stringify({
      colorTheme: "dark",
      locale: "en",
      width: "100%",
      height: "100%",
      showSymbolLogo: true,
      symbols: [
        "OANDA:XAUUSD|1D",
        "FOREXCOM:EURUSD|1D",
        "NASDAQ:AAPL|1D",
        "NASDAQ:TSLA|1D",
        "FOREXCOM:GBPUSD|1D",
      ],
      gridLineColor: "rgba(240, 243, 250, 0.06)",
      fontColor: "rgba(255, 255, 255, 0.8)",
    });
    watchlistRef.current.appendChild(w);
  }, []);

  /* ------------------------------ JSX ------------------------------ */
  return (
    <div className="min-h-screen bg-[#141414] text-white flex flex-col">
      {/* ─── Top Ticker ─────────────────────────────── */}
      <div ref={tickerRef} className="w-full h-8" />

      {/* ─── Main Grid ─────────────────────────────── */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Sidebar (Screener) */}
        <aside className="md:w-80 bg-[#181818] border-r border-[#222] hidden md:flex flex-col overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-[#222]">
            <h2 className="text-lg font-semibold">Market Screener</h2>
            {/* Screener type selector */}
            <select
              value={screenerType}
              onChange={(e) => setScreenerType(e.target.value as any)}
              className="bg-[#2d2d2d] text-sm rounded p-1"
            >
              <option value="forex">Forex</option>
              <option value="crypto">Crypto</option>
              <option value="stock">Stocks</option>
            </select>
          </div>
          <div ref={screenerRef} className="flex-1" />
        </aside>

        {/* Main Chart */}
        <main className="flex-1 bg-[#1e1e1e] flex flex-col">
          <h1 className="text-xl font-bold p-4 border-b border-[#222]">Live Rates</h1>
          <div id="live_chart_container" className="flex-1" />
        </main>

        {/* Right Sidebar (Watchlist) */}
        <aside className="md:w-72 bg-[#181818] border-l border-[#222] hidden md:block overflow-hidden">
          <h2 className="text-lg font-semibold p-4 border-b border-[#222]">Watchlist</h2>
          <div ref={watchlistRef} className="flex-1" />
        </aside>
      </div>

      {/* Bottom nav (only on mobile) */}
      <nav className="md:hidden h-12 bg-[#181818] flex justify-around items-center border-t border-[#222] text-xs">
        <button>Live Market</button>
        <button>Dashboard</button>
        <button>Events</button>
        <button>Status</button>
        <button>P&L</button>
      </nav>
    </div>
  );
};

export default LiveMarketDashboard; 