"use client";
import Link from "next/link";
import Image from "next/image";
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

export default function BetHeader() {
    const [balance, setBalance] = useState(0);
    const { connection } = useConnection();
    const { publicKey, disconnect } = useWallet();
    const [copied, setCopied] = useState(false);
    const [isCopyTooltipOpen, setIsCopyTooltipOpen] = useState(false)

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
                }
            } catch (error) {
                console.error("Failed to retrieve account info:", error);
            }
        };

        updateBalance();
    }, [connection, publicKey]);

    return (
        <div className="supports-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-20 border-b bg-black bg-opacity-30 backdrop-blur">
            <nav className="flex h-24 items-center justify-between px-4">
                <div className="hidden lg:block">
                    <Link href={"/"}>
                        <Image src={"/betlogo.png"} alt="Logo" width={190} height={100} />
                    </Link>
                </div>

                <div className="flex flex-row space-x-5">

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
                                className="bg-gray-900 w-[503px] p-4 flex flex-col"
                            >
                                <SheetHeader>
                                    <SheetTitle>
                                        <div className="flex flex-row items-center justify-between pr-6">
                                            <Link
                                                href={`https://solscan.io/account/${publicKey}`}
                                                target="_blank"
                                                className="text-sm text-gray-300 flex flex-row text-center gap-1"
                                            >
                                                {publicKey.toBase58().slice(0, 4)}....{publicKey.toBase58().slice(-4)}
                                                <ExternalLink className="h-5" />
                                            </Link>
                                            <div className="flex flex-row items-center justify-center space-x-6">
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
                                    </SheetTitle>


                                </SheetHeader>
                                sa

                            </SheetContent>
                        </Sheet>
                    )}
                </div>
            </nav>
        </div>
    );
}
