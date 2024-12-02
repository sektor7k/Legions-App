"use client";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search } from "lucide-react";
import OpenBets from "./_components/OpenBets";
import ClosedBets from "./_components/ClosedBets";


export default function BetsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("open");

  return (
    <div className="pt-28 pl-20 w-full flex flex-col justify-center space-y-6">

      <div className="w-full flex flex-row items-center justify-between">
        <div className="flex flex-row space-x-2 bg-gray-900 py-1 px-3 rounded-md">
          <button
            onClick={() => setActiveTab("open")}
            className={`font-bold px-3 h-9 border-none rounded-md transition-all duration-400 ease-in-out ${activeTab === "open"
              ? "text-blue-400 bg-blue-950 bg-opacity-70"
              : "text-gray-200"
              }`}
          >
            OPEN BETS
          </button>
          <button
            onClick={() => setActiveTab("closed")}
            className={`font-bold px-3 h-9 border-none rounded-md transition-all duration-400 ease-in-out ${activeTab === "closed"
              ? "text-blue-400 bg-blue-950 bg-opacity-70"
              : "text-gray-200"
              }`}
          >
            CLOSED BETS
          </button>
        </div>

        {/* Arama Çubuğu */}
        <div className="flex items-center">
          <div className="absolute flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-100" />
          </div>
          <Input
            type="text"
            placeholder="Search Bets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-white !bg-gray-900 pl-10 pr-4"
          />
        </div>
      </div>
      {/* Componentler */}
      {activeTab === "open" && <OpenBets />}
      {activeTab === "closed" && <ClosedBets />}
    </div>

  );
}
