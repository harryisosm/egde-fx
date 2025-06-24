
import React from "react";
import BottomNav from "./BottomNav";

const AppContentLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col min-h-screen bg-[#181818] relative">
    <main className="flex-1">{children}</main>
    <BottomNav />
  </div>
);

export default AppContentLayout;
