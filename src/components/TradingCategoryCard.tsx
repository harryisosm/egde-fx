
import React from "react";
import InstrumentRow from "./InstrumentRow";

type Instrument = {
  symbol: string;
  value: string;
  enabled: boolean;
};

type TradingCategoryCardProps = {
  title: string;
  instruments: Instrument[];
  onInstrumentChange: (idx: number, updates: Partial<Instrument>) => void;
};

const TradingCategoryCard: React.FC<TradingCategoryCardProps> = ({
  title,
  instruments,
  onInstrumentChange,
}) => {
  return (
    <section
      className="
        bg-gradient-to-b from-brand/80 to-brand-light/80 rounded-t-xl
        pb-0 mb-8
        shadow-lg
        w-full max-w-xs min-w-[250px] flex flex-col
      "
      style={{ minWidth: 290, maxWidth: 340, boxShadow: "0px 4px 32px #18181877" }}
    >
      <div className="
        py-3 text-center rounded-t-xl
        text-white font-extrabold text-xl tracking-wide
        bg-gradient-to-r from-brand via-brand to-brand-light shadow
        select-none
      ">
        {title}
      </div>
      <div
        className="
          flex-1 overflow-y-auto px-2 py-3 bg-[#222]
          rounded-b-xl scrollbar-thin scrollbar-thumb-brand scrollbar-track-transparent
        "
        style={{ maxHeight: 280, minHeight: 240 }}
      >
        {instruments.map((inst, i) => (
          <InstrumentRow
            key={inst.symbol}
            symbol={inst.symbol}
            value={inst.value}
            enabled={inst.enabled}
            onValueChange={(v) => onInstrumentChange(i, { value: v })}
            onEnabledChange={(e) => onInstrumentChange(i, { enabled: e })}
          />
        ))}
      </div>
    </section>
  );
};

export default TradingCategoryCard;

