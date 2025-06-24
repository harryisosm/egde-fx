
import React from "react";
import { Switch } from "@/components/ui/switch";

type InstrumentRowProps = {
  symbol: string;
  value: string;
  enabled: boolean;
  onValueChange: (val: string) => void;
  onEnabledChange: (val: boolean) => void;
};

const InstrumentRow: React.FC<InstrumentRowProps> = ({
  symbol,
  value,
  enabled,
  onValueChange,
  onEnabledChange,
}) => {
  return (
    <div
      className={`flex items-center justify-between px-4 py-3 rounded-xl mb-3
        bg-[#262626] shadow-inner
        border border-transparent
        transition-colors
        ${enabled ? "border-brand shadow-[0_0_16px_1px_#2997ff99]" : "hover:border-brand-dark"}
      `}
      style={{ minHeight: 54 }}
    >
      <div className="flex-1 font-bold text-brand text-lg">{symbol}</div>
      <input
        className="w-20 text-center font-semibold text-brand-light
          bg-[#181818] border border-brand-dark rounded-md mx-3
          focus:outline-none focus:ring-2 focus:ring-brand
          transition-all"
        style={{ fontSize: 18, height: 34 }}
        value={value}
        onChange={e => onValueChange(e.target.value)}
      />
      <Switch
        checked={enabled}
        onCheckedChange={onEnabledChange}
        className="ml-3 scale-125 data-[state=checked]:bg-brand data-[state=checked]:border-brand-light border-brand-dark"
        style={{
          boxShadow: enabled ? "0 0 10px 2px #2997ff88" : undefined,
          background: enabled ? "#2997ff" : undefined,
        }}
      />
    </div>
  );
};
export default InstrumentRow;

