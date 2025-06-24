
import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col min-h-screen bg-[#181818]">
    <Header />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

export default MainLayout;
