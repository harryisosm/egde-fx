
import React from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import BottomNav from "@/components/BottomNav";

const News: React.FC = () => {
  useAuthGuard();
  return (
    <div className="min-h-screen bg-[#181818] flex flex-col items-center justify-center pb-20">
      <h2 className="text-2xl md:text-3xl font-bold text-brand mb-3">News</h2>
      <p className="text-gray-200 text-lg">The latest market news will appear here.</p>
      <BottomNav />
    </div>
  );
};

export default News;
