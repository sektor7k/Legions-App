"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface CryptoData {
  logo: string;
  name: string;
  ticker: string;
  price: number;
  change: number;
}

const sampleData: CryptoData[] = [
  { logo: "https://cryptologos.cc/logos/bitcoin-btc-logo.png", name: "Bitcoin", ticker: "BTC", price: 30000, change: 2.5 },
  { logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png", name: "Ethereum", ticker: "ETH", price: 2000, change: 1.8 },
  { logo: "https://cryptologos.cc/logos/binance-coin-bnb-logo.png", name: "Binance Coin", ticker: "BNB", price: 300, change: -0.5 },
  { logo: "https://cryptologos.cc/logos/solana-sol-logo.png", name: "Solana", ticker: "SOL", price: 50, change: 5.2 },
  { logo: "https://cryptologos.cc/logos/cardano-ada-logo.png", name: "Cardano", ticker: "ADA", price: 0.5, change: -1.2 },
];

export default function Trending({
  items = sampleData,
  direction = "left",
  speed = "normal",
  pauseOnHover = true,
}: {
  items?: CryptoData[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  useEffect(() => {
    addAnimation();
  }, []);

  const [start, setStart] = useState(false);

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }

  const getDirection = () => {
    if (containerRef.current) {
      containerRef.current.style.setProperty(
        "--animation-direction",
        direction === "left" ? "forwards" : "reverse"
      );
    }
  };

  const getSpeed = () => {
    if (containerRef.current) {
      const speedMap: { [key: string]: string } = {
        fast: "20s",
        normal: "40s",
        slow: "80s",
      };
      containerRef.current.style.setProperty(
        "--animation-duration",
        speedMap[speed] || "40s"
      );
    }
  };

  return (
    <div
      ref={containerRef}
      className=" top-0 scroller-wrapper z-20  overflow-hidden  bg-opacity-50"
    >
      <ul
        ref={scrollerRef}
        className={`flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap ${
          start ? "animate-scroll" : ""
        } ${pauseOnHover ? "hover:[animation-play-state:paused]" : ""}`}
      >
        {items.map((crypto, idx) => (
          <li
            key={idx}
            className="flex flex-row items-center justify-between w-[300px] max-w-full bg-black/30 bg-opacity-80  border border-gray-700 px-4 py-2 rounded-md"
          >
            <div className="flex items-center gap-4">
              <Image
                src={crypto.logo}
                alt={crypto.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <h3 className="text-sm font-bold text-white">{crypto.name}</h3>
                <p className="text-sm text-gray-400">{crypto.ticker}</p>
              </div>
            </div>
            <div className=" flex flex-col items-center justify-center">
              <p className="text-xl font-semibold text-white">
                ${crypto.price.toFixed(2)}
              </p>
              <p
                className={`text-sm font-medium ${
                  crypto.change >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {crypto.change >= 0 ? "+" : ""}
                {crypto.change.toFixed(2)}%
              </p>
            </div>
          </li>
        ))}
      </ul>

     
    </div>
  );
}
