import React, { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Plus, Save, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";

export type Trade = {
  id: number;
  entryTime: Date;
  symbol: string;
  type: string;
  quantity: number;
  entryPrice: number;
  exitTime: Date;
  exitPrice: number;
  pnl: number;
};

type Props = {
  trades: Trade[];
  editable?: boolean;
  onTradesChange?: (trades: Trade[]) => void; // For save/updates from parent
};

const TRADE_TYPES = ["BUY", "SELL", "MARKET_BUY"];

const SYMBOLS = [
  ...new Set([
    ...[
      "EUR/USD", "USD/JPY", "GBP/USD", "USD/CHF",
      "AUD/USD", "USD/CAD", "NZD/USD",
      "XAU/USD", "XAG/USD", "WTI", "BRENT", "NG", "HG", "PL", "PA",
      "AAPL", "MSFT", "AMZN", "TSLA", "GOOGL", "META", "BRK.B", "JPM", "V", "JNJ", "NVDA", "PG",
      "BTC/USD", "ETH/USD", "BNB/USD", "XRP/USD", "SOL/USD", "ADA/USD", "DOGE/USD", "AVAX/USD", "MATIC/USD", "DOT/USD"
    ]
  ])
];

export default function PnlReportLogs({ trades, editable = false, onTradesChange }: Props) {
  // Date, symbol, type, and string search filters
  const [start, setStart] = useState<string>("");
  const [end, setEnd] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<Trade[]>(trades);

  // For handling additions/edits (admin only):
  const [editingRow, setEditingRow] = useState<Trade | null>(null);
  const [adding, setAdding] = useState(false);

  React.useEffect(() => { setRows(trades); }, [trades]);

  // Filtering logic
  function getFilteredRows() {
    let filtered = [...rows];
    const startDate = start ? new Date(start) : null;
    const endDate = end ? new Date(end) : null;
    if (startDate)
      filtered = filtered.filter(t => t.entryTime >= startDate);
    if (endDate)
      filtered = filtered.filter(t => t.exitTime <= endDate);
    if (symbol)
      filtered = filtered.filter(t => t.symbol.toLowerCase().includes(symbol.toLowerCase()));
    if (type)
      filtered = filtered.filter(t => t.type.toLowerCase().includes(type.toLowerCase()));
    if (search)
      filtered = filtered.filter(t =>
        String(t.id).includes(search) ||
        t.symbol.toLowerCase().includes(search.toLowerCase())
      );
    return filtered;
  }

  // Cumulative calculation for display
  let cumulative = 0;
  const cumulativeTrades = getFilteredRows().map((t) => {
    cumulative += t.pnl;
    return { ...t, cumulative: cumulative };
  });
  const totalCumulative = cumulativeTrades.length > 0 ? cumulativeTrades[cumulativeTrades.length - 1].cumulative : 0;

  // Add/Edit row logic (admin only)
  function handleEdit(row: Trade) {
    setEditingRow(row);
    setAdding(false);
  }

  function handleDelete(id: number) {
    const updated = rows.filter(row => row.id !== id);
    setRows(updated);
    if (onTradesChange) onTradesChange(updated);
  }

  function handleSaveEditOrAdd() {
    if (!editingRow) return;
    let updated: Trade[];
    if (adding) {
      updated = [...rows, { ...editingRow, id: Date.now() }];
    } else {
      updated = rows.map(row => (row.id === editingRow.id ? editingRow : row));
    }
    setRows(updated);
    if (onTradesChange) onTradesChange(updated);
    setEditingRow(null);
    setAdding(false);
  }

  function handleStartAdd() {
    setEditingRow({
      id: 0,
      entryTime: new Date(),
      symbol: "",
      type: "",
      quantity: 0,
      entryPrice: 0,
      exitTime: new Date(),
      exitPrice: 0,
      pnl: 0,
    });
    setAdding(true);
  }

  function handleEditInputChange(field: keyof Trade, val: string) {
    if (!editingRow) return;
    setEditingRow({
      ...editingRow,
      [field]: (field === "entryTime" || field === "exitTime")
        ? new Date(val)
        : (field === "quantity" || field === "entryPrice" || field === "exitPrice" || field === "pnl")
          ? Number(val)
          : val
    });
  }

  function handleCancelEdit() {
    setEditingRow(null);
    setAdding(false);
  }

  function handleClearFilters() {
    setStart("");
    setEnd("");
    setSymbol("");
    setType("");
    setSearch("");
  }

  return (
    <div className="min-h-[200px] flex flex-col items-center py-2 px-0 md:px-0">
      {/* Filters */}
      <div className="flex flex-col md:flex-row flex-wrap gap-2 md:gap-4 mb-4 mt-1 items-center w-full">
        <div className="flex items-center gap-2">
          <span className="text-gray-200 font-medium text-sm md:text-base">Start Date:</span>
          <div className="relative">
            <Input type="date" value={start}
              onChange={e => setStart(e.target.value)}
              className="w-[130px] bg-[#222] text-white text-xs md:text-sm border border-yellow-400" />
            <CalendarIcon className="absolute right-2 top-2 w-4 h-4 opacity-60 pointer-events-none" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-200 font-medium text-sm md:text-base">End Date:</span>
          <div className="relative">
            <Input type="date" value={end}
              onChange={e => setEnd(e.target.value)}
              className="w-[130px] bg-[#222] text-white text-xs md:text-sm border border-yellow-400" />
            <CalendarIcon className="absolute right-2 top-2 w-4 h-4 opacity-60 pointer-events-none" />
          </div>
        </div>
        <div>
          <Input value={symbol} onChange={e => setSymbol(e.target.value)} 
            className="w-[115px] bg-[#232323] text-white text-xs md:text-sm border border-yellow-400" 
            placeholder="Symbol"/>
        </div>
        <div>
          <Input value={type} onChange={e => setType(e.target.value)} 
            className="w-[100px] bg-[#232323] text-white text-xs md:text-sm border border-yellow-400" 
            placeholder="Type"/>
        </div>
        <div>
          <Input value={search} onChange={e => setSearch(e.target.value)} 
            className="w-[120px] bg-[#232323] text-white text-xs md:text-sm border border-yellow-400" 
            placeholder="ID/Symbol"/>
        </div>
        <Button onClick={handleClearFilters} variant="outline" 
          className="px-3 md:px-4 py-1 md:py-2 border-gray-400 text-yellow-400 border text-xs md:text-sm">
          Clear
        </Button>
        {editable && (
          <Button onClick={handleStartAdd} 
            className="bg-green-700 text-white rounded-md px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm">
            <Plus className="w-3 h-3 md:w-4 md:h-4 mr-1" /> Add Trade
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto shadow-lg rounded-lg border border-[#555] mb-3 bg-black/80">
        <div className="min-w-[1000px]">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#232323] text-yellow-300 border-b-2 border-yellow-400">
                <TableHead className="text-yellow-300 font-bold text-xs md:text-sm">ID</TableHead>
                <TableHead className="text-yellow-300 font-bold whitespace-nowrap text-xs md:text-sm">ENTRY TIME</TableHead>
                <TableHead className="text-yellow-300 font-bold text-xs md:text-sm">SYMBOL</TableHead>
                <TableHead className="text-yellow-300 font-bold text-xs md:text-sm">TYPE</TableHead>
                <TableHead className="text-yellow-300 font-bold text-xs md:text-sm">QUANTITY</TableHead>
                <TableHead className="text-yellow-300 font-bold whitespace-nowrap text-xs md:text-sm">ENTRY PRICE</TableHead>
                <TableHead className="text-yellow-300 font-bold whitespace-nowrap text-xs md:text-sm">EXIT TIME</TableHead>
                <TableHead className="text-yellow-300 font-bold text-xs md:text-sm">EXIT PRICE</TableHead>
                <TableHead className="text-yellow-300 font-bold text-xs md:text-sm">P&nbsp;&amp;&nbsp;L</TableHead>
                <TableHead className="text-yellow-300 font-bold text-xs md:text-sm">Cumulative P&nbsp;&amp;&nbsp;L</TableHead>
                {editable && <TableHead className="text-yellow-300 font-bold text-xs md:text-sm"></TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {editingRow && (
                <TableRow>
                  <TableCell className="text-xs md:text-sm">{adding ? <span className="italic text-xs text-yellow-500">auto</span> : editingRow.id}</TableCell>
                  <TableCell>
                    <Input type="datetime-local"
                      value={format(editingRow.entryTime, "yyyy-MM-dd'T'HH:mm")}
                      onChange={e => handleEditInputChange("entryTime", e.target.value)}
                      className="w-[160px] bg-[#2a2a2a] text-white text-xs border border-yellow-400"
                    />
                  </TableCell>
                  <TableCell>
                    <Input value={editingRow.symbol}
                      onChange={e => handleEditInputChange("symbol", e.target.value)}
                      className="w-[95px] bg-[#2a2a2a] text-white text-xs border border-yellow-400"
                    />
                  </TableCell>
                  <TableCell>
                    <Input value={editingRow.type}
                      onChange={e => handleEditInputChange("type", e.target.value)}
                      className="w-[90px] bg-[#2a2a2a] text-white text-xs border border-yellow-400"
                    />
                  </TableCell>
                  <TableCell>
                    <Input type="number" min="0" value={editingRow.quantity}
                      onChange={e => handleEditInputChange("quantity", e.target.value)}
                      className="w-[75px] bg-[#2a2a2a] text-white text-xs border border-yellow-400"
                    />
                  </TableCell>
                  <TableCell>
                    <Input type="number" step="0.01" value={editingRow.entryPrice}
                      onChange={e => handleEditInputChange("entryPrice", e.target.value)}
                      className="w-[100px] bg-[#2a2a2a] text-white text-xs border border-yellow-400"
                    />
                  </TableCell>
                  <TableCell>
                    <Input type="datetime-local"
                      value={format(editingRow.exitTime, "yyyy-MM-dd'T'HH:mm")}
                      onChange={e => handleEditInputChange("exitTime", e.target.value)}
                      className="w-[160px] bg-[#2a2a2a] text-white text-xs border border-yellow-400"
                    />
                  </TableCell>
                  <TableCell>
                    <Input type="number" step="0.01" value={editingRow.exitPrice}
                      onChange={e => handleEditInputChange("exitPrice", e.target.value)}
                      className="w-[90px] bg-[#2a2a2a] text-white text-xs border border-yellow-400"
                    />
                  </TableCell>
                  <TableCell>
                    <Input type="number" step="0.01" value={editingRow.pnl}
                      onChange={e => handleEditInputChange("pnl", e.target.value)}
                      className="w-[85px] bg-[#2a2a2a] text-white text-xs border border-yellow-400"
                    />
                  </TableCell>
                  <TableCell />
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-green-700 hover:bg-green-800 rounded px-1 text-xs"
                        onClick={handleSaveEditOrAdd}
                      >
                        <Save className="w-3 h-3 md:w-4 md:h-4" />
                      </Button>
                      <Button size="sm" className="bg-gray-700 hover:bg-red-800 rounded px-1 text-xs" onClick={handleCancelEdit}>
                        Cancel
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {cumulativeTrades.map((trade) => (
                <TableRow key={trade.id} className="border-[#333] text-xs md:text-sm">
                  <TableCell className="text-gray-200">{trade.id}</TableCell>
                  <TableCell className="text-gray-400 whitespace-nowrap">{format(trade.entryTime, "MMM d, yyyy, h:mm a")}</TableCell>
                  <TableCell className="text-gray-300">{trade.symbol}</TableCell>
                  <TableCell className="text-gray-300">{trade.type}</TableCell>
                  <TableCell className="text-gray-300">{trade.quantity}</TableCell>
                  <TableCell className="text-gray-200">{trade.entryPrice}</TableCell>
                  <TableCell className="text-gray-400 whitespace-nowrap">{format(trade.exitTime, "MMM d, yyyy, h:mm a")}</TableCell>
                  <TableCell className="text-gray-200">{trade.exitPrice}</TableCell>
                  <TableCell className={trade.pnl >= 0 ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
                    {trade.pnl >= 0 ? `${trade.pnl.toFixed(2)} $` : `${trade.pnl.toFixed(2)} $`}
                  </TableCell>
                  <TableCell className={trade.cumulative >= 0 ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
                    {trade.cumulative >= 0 ? `${trade.cumulative.toFixed(2)} $` : `${trade.cumulative.toFixed(2)} $`}
                  </TableCell>
                  {editable && (
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" className="bg-blue-800 hover:bg-yellow-600 rounded px-1 py-1 text-xs"
                          onClick={() => handleEdit(trade)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          className="bg-red-700 hover:bg-red-800 rounded px-1 text-xs"
                          onClick={() => handleDelete(trade.id)}>
                          <Trash className="w-3 h-3 md:w-4 md:h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {cumulativeTrades.length === 0 && (
                <TableRow>
                  <TableCell colSpan={editable ? 11 : 10}>
                    <span className="text-yellow-300 text-center text-xs md:text-sm">No trades found for this criteria.</span>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Total cumulative */}
      <div className="w-full text-right mt-2">
        <span
          className={
            "text-lg md:text-xl font-bold " +
            (totalCumulative >= 0 ? "text-yellow-400" : "text-red-500")
          }
        >
          Total cumulative P&amp;L:{" "}
          <span className={totalCumulative >= 0 ? "text-green-500" : "text-red-500"}>
            {totalCumulative >= 0 ? "+" : ""}
            {totalCumulative.toFixed(2)}$
          </span>
        </span>
      </div>
    </div>
  );
}
