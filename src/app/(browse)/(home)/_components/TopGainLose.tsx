"use client"

import React from "react"
import useSWR from "swr"
import axios from "axios"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface CoinData {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  price_change_percentage_24h: number
}

interface Coin {
  logo: string
  name: string
  ticker: string
  price: number
  change24h: number
}

const CoinTable: React.FC<{ title: string; coins: Coin[] }> = ({ title, coins }) => (
  <Table>
    <TableHeader>
      <TableRow className="bg-white/5 backdrop-blur-sm border-none">
        <TableHead className="font-bold">{title}</TableHead>
        <TableHead className="font-bold">Price</TableHead>
        <TableHead className="font-bold">24h</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {coins.map((coin, index) => (
        <TableRow
          key={coin.ticker}
          className={index % 2 === 0 ? "bg-white/0 border-none" : "bg-white/5 border-none"}
        >
          <TableCell className="flex items-center space-x-2">
            <Image
              src={coin.logo || "/placeholder.svg"}
              alt={coin.name}
              width={24}
              height={24}
              className="rounded-full bg-white"
            />
            <span className="font-bold">{coin.name}</span>
            <span className="text-muted-foreground">({coin.ticker})</span>
          </TableCell>
          <TableCell className="font-semibold">
            ${coin.price.toLocaleString()}
          </TableCell>
          <TableCell
            className={`${
              coin.change24h < 0 ? "text-red-500" : "text-green-500"
            } font-semibold`}
          >
            {coin.change24h > 0 ? "+" : ""}
            {coin.change24h.toFixed(1)}%
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
)

function TableSkeleton({ title }: { title: string }) {
  const rowCount = 7

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-white/5 backdrop-blur-sm border-none">
          <TableHead className="font-bold">
            {title}
          </TableHead>
          <TableHead className="font-bold">
            <Skeleton className="h-4 w-[60px]" />
          </TableHead>
          <TableHead className="font-bold">
            <Skeleton className="h-4 w-[40px]" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rowCount }).map((_, i) => (
          <TableRow
            key={i}
            className={i % 2 === 0 ? "bg-white/0 border-none" : "bg-white/5 border-none"}
          >
            <TableCell className="flex items-center space-x-2">
              <Skeleton className="h-6 w-6 rounded-full" />

                <Skeleton className="h-4 w-[100px]" />

            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[60px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[40px]" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

const fetcher = async (url: string) => {
  const res = await axios.get<CoinData[]>(url, {
    headers: {
      accept: "application/json",
      "x-cg-pro-api-key": process.env.NEXT_PUBLIC_GECKO_API,
    },
  })
  return res.data
}

export default function CryptoGainLoseTables() {
  const {
    data: coinData,
    error,
    isLoading,
  } = useSWR<CoinData[]>(
    "https://pro-api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=gaming",
    fetcher,
    {
      refreshInterval: 60_000, // 60 saniyede bir yenile
    }
  )

  if (error) {
    return <div>Error: {error.message}</div>
  }

  if (isLoading || !coinData) {
    return (
      <div className="w-full p-4 space-y-4 md:space-y-0 md:flex md:space-x-4">

        <div className="w-full md:w-1/2 backdrop-blur-sm rounded-sm overflow-hidden border-gradient">
          <TableSkeleton title="Top Gaming Tokens" />
        </div>
        <div className="w-full md:w-1/2 backdrop-blur-sm rounded-sm overflow-hidden border-gradient">
          <TableSkeleton title="Top Gaming Tokens Gain" />
        </div>
        <div className="w-full md:w-1/2 backdrop-blur-sm rounded-sm overflow-hidden border-gradient">
          <TableSkeleton title="Top Gaming Tokens Lose" />
        </div>
      </div>
    )
  }

  // 5) Data'yı kendi Coin tipimize dönüştür
  const mappedCoins: Coin[] = coinData.map((coin) => ({
    logo: coin.image,
    name: coin.name,
    ticker: coin.symbol.toUpperCase(),
    price: coin.current_price,
    change24h: coin.price_change_percentage_24h,
  }))

  // 6) Tablolar: Trend, Gainers, Losers
  const sortedBy24hDesc = [...mappedCoins].sort((a, b) => b.change24h - a.change24h)
  const topGainers = sortedBy24hDesc.slice(0, 7)

  const sortedBy24hAsc = [...mappedCoins].sort((a, b) => a.change24h - b.change24h)
  const topLosers = sortedBy24hAsc.slice(0, 7)

  const topTrending = mappedCoins.slice(0, 7)

  return (
    <div className="w-full p-4 space-y-4 md:space-y-0 md:flex md:space-x-4">
      <div className="w-full md:w-1/2 backdrop-blur-sm rounded-sm overflow-hidden border-gradient ">
        <CoinTable title="Top Gaming Tokens" coins={topTrending} />
      </div>
      <div className="w-full md:w-1/2 backdrop-blur-sm rounded-sm overflow-hidden border-gradient ">
        <CoinTable title="Top Gaming Tokens Gain" coins={topGainers} />
      </div>
      <div className="w-full md:w-1/2 backdrop-blur-sm rounded-sm overflow-hidden border-gradient">
        <CoinTable title="Top Gaming Tokens Lose" coins={topLosers} />
      </div>
    </div>
  )
}
