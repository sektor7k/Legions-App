"use client";
import Link from "next/link";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect, useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import AvatarDemo from "./AvatarDemo";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { CheckCircle, Copy, ExternalLink, LogOut } from "lucide-react";

export default function BetDashboard() {
    const [balance, setBalance] = useState(0);
    const [solbalance, setSolBalance] = useState(0);
    const { connection } = useConnection();
    const { publicKey, disconnect } = useWallet();
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState("open");


    const handleCopy = async () => {
        if (!publicKey) return;
        try {
            const copy = await navigator.clipboard.writeText(publicKey.toString());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // 2 saniye sonra "check" simgesini gizle
        } catch (error) {
            console.error("Failed to copy!", error);
        }
    };

    useEffect(() => {
        const updateBalance = async () => {
            if (!connection || !publicKey) return;

            try {
                const accountInfo = await connection.getAccountInfo(publicKey);
                if (accountInfo) {
                    setBalance((accountInfo.lamports / LAMPORTS_PER_SOL) * 240.3);
                    setSolBalance(accountInfo.lamports / LAMPORTS_PER_SOL)
                }
            } catch (error) {
                console.error("Failed to retrieve account info:", error);
            }
        };

        updateBalance();
    }, [connection, publicKey]);

    return (
        <div>
            {!publicKey ? (
                <WalletMultiButton style={{
                    display: "flex",
                    flexDirection: "row",
                    backgroundColor: "rgba(55, 48, 163, 0.2)",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: "1.5rem",
                    borderRadius: "4px",
                    height: "66px",
                    paddingRight: "0px",
                    paddingLeft: "1.5rem",
                }}
                >
                    <p>Connect Wallet</p>
                    <AvatarDemo />
                </WalletMultiButton>
            ) : (
                <Sheet>
                    <SheetTrigger>
                        <button className="flex flex-row bg-indigo-950 bg-opacity-40 justify-center items-center space-x-6 rounded-l-sm pl-6 hover:bg-opacity-80">
                            <div className="flex flex-col">
                                <div className="text-sm font-extrabold pl-3">
                                    {publicKey.toBase58().substring(0, 7)}...
                                </div>
                                <div className="text-2xl font-extrabold">
                                    <span className="text-indigo-700">$</span>
                                    {balance.toFixed(2)}
                                </div>
                            </div>
                            <AvatarDemo />
                        </button>
                    </SheetTrigger>
                    <SheetContent
                        side={"bet"}
                        className="bg-gray-900 w-[503px] p-0 flex flex-col"
                    >
                        <SheetHeader>
                            <SheetTitle>
                                <div className="flex flex-col h-28 ">
                                    <div className="flex flex-row items-center justify-between p-4 pr-10 pb-1">
                                        <Link
                                            href={`https://solscan.io/account/${publicKey}`}
                                            target="_blank"
                                            className="text-sm text-gray-300 flex flex-row text-center gap-1"
                                        >
                                            {publicKey.toBase58().slice(0, 4)}....{publicKey.toBase58().slice(-4)}
                                            <ExternalLink className="h-5" />
                                        </Link>
                                        <div className="flex flex-row items-center justify-center space-x-4">
                                            {/* Copy Button */}
                                            <TooltipProvider delayDuration={100}>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <button
                                                            onClick={handleCopy}
                                                            className="h-9 w-9 bg-gray-900 p-2 rounded-full border-2 border-gray-700 hover:bg-gray-700 duration-300 flex items-center justify-center"
                                                        >
                                                            {copied ? (
                                                                <CheckCircle className="h-5 w-5 text-green-500" />
                                                            ) : (
                                                                <Copy className="h-5 w-5 text-white" />
                                                            )}
                                                        </button>
                                                    </TooltipTrigger>
                                                    <TooltipContent
                                                        className=" -translate-x-3 duration-0"

                                                    >
                                                        <p>{copied ? "Copied!" : "Copy Address"}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>

                                            {/* Disconnect Button */}
                                            <TooltipProvider delayDuration={100}>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <button
                                                            onClick={disconnect}
                                                            className="h-9 w-9 bg-gray-900 p-2 rounded-full border-2 border-gray-700 hover:bg-gray-700 duration-300 flex items-center justify-center"
                                                        >
                                                            <LogOut className="h-5 w-5 text-white" />
                                                        </button>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="-translate-x-3">
                                                        <p>Disconnect</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    </div>
                                    <div className="pl-4">
                                        <p className="text-3xl font-bold">
                                            {balance.toFixed(2)}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            ~{solbalance.toFixed(4)} SOL
                                        </p>
                                    </div>
                                </div>
                            </SheetTitle>


                        </SheetHeader>
                        <div className="flex flex-col w-full h-full bg-gray-800 pt-2 p-4 space-y-4">
                            <div className="flex flex-row justify-center items-center space-x-2 bg-gray-950/70 p-1 rounded-lg">
                                <button
                                    onClick={() => setActiveTab("open")}
                                    className={`font-bold w-full h-9 border-none rounded-lg transition-all duration-400 ease-in-out ${activeTab === "open"
                                        ? "bg-gray-800 bg-opacity-70"
                                        : "text-gray-600"
                                        }`}
                                >
                                    My Bets
                                </button>
                                <button
                                    onClick={() => setActiveTab("closed")}
                                    className={`font-bold w-full h-9 border-none rounded-lg transition-all duration-400 ease-in-out ${activeTab === "closed"
                                        ? "bg-gray-800 bg-opacity-70"
                                        : "text-gray-600"
                                        }`}
                                >
                                    Activity
                                </button>
                            </div>
                            <div className="bg-gray-900 h-full rounded-lg">

                            </div>
                        </div>

                    </SheetContent>
                </Sheet>
            )}
        </div>
    )
}