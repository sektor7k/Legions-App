"use client"

import type React from "react"
import Image from "next/image"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"


interface Coin {
  logo: string
  name: string
  ticker: string
  price: number
  change24h: number
}
const trend: Coin[] = [
    { logo: "https://cryptologos.cc/logos/cardano-ada-logo.png", name: "Bitcoin", ticker: "BTC", price: 50000, change24h: 5.2 },
    { logo: "https://cryptologos.cc/logos/cardano-ada-logo.png", name: "Ethereum", ticker: "ETH", price: 3000, change24h: 4.8 },
    { logo: "https://cryptologos.cc/logos/cardano-ada-logo.png", name: "Cardano", ticker: "ADA", price: 2.5, change24h: 7.1 },
    { logo: "https://cryptologos.cc/logos/cardano-ada-logo.png", name: "Polkadot", ticker: "DOT", price: 40, change24h: 6.5 },
    { logo: "https://cryptologos.cc/logos/cardano-ada-logo.png", name: "Solana", ticker: "SOL", price: 150, change24h: 8.3 },
    { logo: "https://cryptologos.cc/logos/cardano-ada-logo.png", name: "Chainlink", ticker: "LINK", price: 30, change24h: 5.7 },
    { logo: "https://cryptologos.cc/logos/cardano-ada-logo.png", name: "Uniswap", ticker: "UNI", price: 28, change24h: 4.2 },
  ]

const gainers: Coin[] = [
  { logo: "https://cryptologos.cc/logos/cardano-ada-logo.png", name: "Bitcoin", ticker: "BTC", price: 50000, change24h: 5.2 },
  { logo: "https://cryptologos.cc/logos/cardano-ada-logo.png", name: "Ethereum", ticker: "ETH", price: 3000, change24h: 4.8 },
  { logo: "https://cryptologos.cc/logos/cardano-ada-logo.png", name: "Cardano", ticker: "ADA", price: 2.5, change24h: 7.1 },
  { logo: "https://cryptologos.cc/logos/cardano-ada-logo.png", name: "Polkadot", ticker: "DOT", price: 40, change24h: 6.5 },
  { logo: "https://cryptologos.cc/logos/cardano-ada-logo.png", name: "Solana", ticker: "SOL", price: 150, change24h: 8.3 },
  { logo: "https://cryptologos.cc/logos/cardano-ada-logo.png", name: "Chainlink", ticker: "LINK", price: 30, change24h: 5.7 },
  { logo: "https://cryptologos.cc/logos/cardano-ada-logo.png", name: "Uniswap", ticker: "UNI", price: 28, change24h: 4.2 },
]

const losers: Coin[] = [
  { logo: "https://cryptologos.cc/logos/cardano-ada-logo.png", name: "Dogecoin", ticker: "DOGE", price: 0.25, change24h: -3.8 },
  { logo: "https://cryptologos.cc/logos/cardano-ada-logo.png", name: "Ripple", ticker: "XRP", price: 1.1, change24h: -2.5 },
  { logo: "https://cryptologos.cc/logos/cardano-ada-logo.png", name: "Litecoin", ticker: "LTC", price: 180, change24h: -4.2 },
  { logo: "https://cryptologos.cc/logos/cardano-ada-logo.png", name: "Bitcoin Cash", ticker: "BCH", price: 650, change24h: -3.1 },
  { logo: "https://cryptologos.cc/logos/cardano-ada-logo.png", name: "Stellar", ticker: "XLM", price: 0.4, change24h: -5.6 },
  { logo: "https://cryptologos.cc/logos/cardano-ada-logo.png", name: "VeChain", ticker: "VET", price: 0.12, change24h: -4.9 },
  { logo: "https://cryptologos.cc/logos/cardano-ada-logo.png", name: "Tron", ticker: "TRX", price: 0.08, change24h: -3.4 },
]



const CoinTable: React.FC<{ title: string; coins: Coin[]; isGainer: boolean }> = ({ title, coins, isGainer }) => (
  <Table >
    <TableHeader>
      
      <TableRow className="bg-white/5 backdrop-blur-sm border-none">
        <TableHead className="font-bold">{title}</TableHead>
        <TableHead className="font-bold">Price</TableHead>
        <TableHead className="font-bold">24h</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody >
      {coins.map((coin, index) => (
        <TableRow key={coin.ticker} className={index % 2 === 0 ? "bg-white/0 border-none" : "bg-white/5 border-none"}>
          <TableCell className="flex items-center space-x-2">
            <Image
              src={coin.logo || "/placeholder.svg"}
              alt={coin.name}
              width={24}
              height={24}
              className="rounded-full"
            />
            <span className="font-bold">{coin.name}</span>
            <span className="text-muted-foreground">({coin.ticker})</span>
          </TableCell>
          <TableCell className="font-semibold">${coin.price.toLocaleString()}</TableCell>
          <TableCell className={isGainer ? "text-green-500 font-semibold" : "text-red-500 font-semibold"}>
            {isGainer ? "+" : ""}
            {coin.change24h.toFixed(1)}%
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
)

export default function CryptoGainLoseTables() {
  return (
    <div className="w-full p-4 space-y-4 md:space-y-0 md:flex md:space-x-4">
        <div className="w-full md:w-1/2 backdrop-blur-sm rounded-sm overflow-hidden border-gradient ">
        <CoinTable title="Top Trendings Tokens " coins={trend} isGainer={true} />
      </div>
      <div className="w-full md:w-1/2 backdrop-blur-sm rounded-sm overflow-hidden border-gradient ">
        <CoinTable title="Top Gaming Tokens Gain" coins={gainers} isGainer={true} />
      </div>
      <div className="w-full md:w-1/2 backdrop-blur-sm rounded-sm overflow-hidden border-gradient">
        <CoinTable title="Top Gaming Tokens Lose" coins={losers} isGainer={false} />
      </div>
    </div>
  )
}

