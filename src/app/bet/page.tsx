"use client";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Search } from "lucide-react";
import OpenBets from "./_components/OpenBets";
import ClosedBets from "./_components/ClosedBets";
import MyBets from "./_components/MyBets";
import History from "./_components/History";
import AddBet from "./_components/AddBet";
 
export default function BetsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("open");
  const [activeTab2, setActiveTab2] = useState("mybets");

  return (
    <div className="pt-28 w-full flex flex-row justify-center space-x-6">
      <div className="w-8/12 flex flex-col  items-center space-y-6">
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
      <div className="w-3/12  flex flex-col h-[600px] bg-gray-900 rounded-md">
        <div className="flex flex-row space-x-2 pt-2 px-3 border-b border-gray-700">
          <button
            
            className={`font-bold px-3 h-9 text-lg  rounded-none transition-all duration-400 ease-in-out border-gradient-bottom `}
          >
            Activity Feed
          </button>
          
        </div>

        <AddBet/>
      </div>
    </div >
  );
}
