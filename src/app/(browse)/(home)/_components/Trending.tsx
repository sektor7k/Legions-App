"use client"

import React, { useEffect, useRef, useState } from "react"
import Image from "next/image"
import axios from "axios"
import useSWR from "swr"
import { Skeleton } from "@/components/ui/skeleton"

interface CoinData {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  price_change_percentage_24h: number
}

interface CryptoData {
  logo: string
  name: string
  ticker: string
  price: number
  change: number
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

const fetcher2 = async (url: string) => {
  const res = await axios.get(url)
  return res.data.tokenIds
}

function ScrollerSkeleton() {
  return (
    <div className="scroller-wrapper z-20 overflow-hidden bg-opacity-50 p-4">
      <ul className="flex min-w-full shrink-0 gap-4 w-max flex-nowrap animate-pulse">
        {Array.from({ length: 5 }).map((_, idx) => (
          <li
            key={idx}
            className="flex flex-row items-center justify-between w-[300px] max-w-full bg-black/30 border border-gray-700 px-4 py-4 rounded-md"
          >
            <Skeleton className="h-10 w-10 rounded-full" />
            <div>
              <Skeleton className="h-4 w-[80px] mb-2" />
              <Skeleton className="h-3 w-[40px]" />
            </div>
            <div>
              <Skeleton className="h-4 w-[60px] mb-2" />
              <Skeleton className="h-3 w-[30px]" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Trending({
  direction = "left",
  speed = "normal",
  pauseOnHover = true,
}: {
  direction?: "left" | "right"
  speed?: "normal"
  pauseOnHover?: boolean
}) {
  const { data: data2, error: error2 } = useSWR("/api/getTrends", fetcher2)

  const {
    data,
    error,
    isLoading,
  } = useSWR<CoinData[]>(
    data2
      ? `https://pro-api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${encodeURIComponent(
          data2
        )}`
      : null,
    fetcher,
    { refreshInterval: 60_000 }
  )

  const [items, setItems] = useState<CryptoData[]>([])
  const [start, setStart] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const scrollerRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (data && data.length > 0) {
      const mapped: CryptoData[] = data.map((coin) => ({
        logo: coin.image,
        name: coin.name,
        ticker: coin.symbol.toUpperCase(),
        price: coin.current_price,
        change: coin.price_change_percentage_24h,
      }))
      setItems(mapped)
    }
  }, [data])

  useEffect(() => {
    if (items.length > 0) {
      resetAnimation()
    }
  }, [items])

  function resetAnimation() {
    if (scrollerRef.current) {
      const scroller = scrollerRef.current
  
      // Mevcut içeriği temizle, sadece orijinal öğeleri bırak
      scroller.innerHTML = ""
  
      // Orijinal veriyi tekrar ekle
      items.forEach((crypto) => {
        const item = document.createElement("li")
        item.className =
          "flex flex-row items-center justify-between w-[300px] max-w-full bg-black/30 bg-opacity-80 border border-gray-700 px-4 py-2 rounded-md"
  
        item.innerHTML = `
          <div class="flex items-center gap-4">
            <img src="${crypto.logo}" alt="${crypto.name}" width="40" height="40" class="rounded-full bg-white" />
            <div>
              <h3 class="text-sm font-bold text-white">${crypto.name}</h3>
              <p class="text-sm text-gray-400">${crypto.ticker}</p>
            </div>
          </div>
          <div class="flex flex-col items-center justify-center">
            <p class="text-xl font-semibold text-white">$${crypto.price.toFixed(2)}</p>
            <p class="text-sm font-medium ${
              crypto.change >= 0 ? "text-green-500" : "text-red-500"
            }">
              ${crypto.change >= 0 ? "+" : ""}${crypto.change.toFixed(2)}%
            </p>
          </div>
        `
        scroller.appendChild(item)
      })
  
      // **HATA BURADA OLUŞUYORDU:** Şimdi sadece listeyi tek seferde klonla!
      const originalItems = Array.from(scroller.children)
      originalItems.forEach((item) => {
        const clone = item.cloneNode(true) as HTMLElement
        scroller.appendChild(clone) // Sadece orijinal öğeleri klonla
      })
  
      setDirectionCSS()
      setSpeedCSS()
      setStart(true)
    }
  }
  

  function setDirectionCSS() {
    if (containerRef.current) {
      containerRef.current.style.setProperty(
        "--animation-direction",
        direction === "left" ? "forwards" : "reverse"
      )
    }
  }

  function setSpeedCSS() {
    if (containerRef.current) {
      const speedMap: { [key: string]: string } = {
        fast: "30s",
        normal: "40s",
        slow: "50s",
      }
      containerRef.current.style.setProperty(
        "--animation-duration",
        speedMap[speed] || "40s"
      )
    }
  }

  if (error || error2) {
    return <div className="p-4 text-red-500">API Error</div>
  }

  if (isLoading || !data) {
    return <ScrollerSkeleton />
  }

  return (
    <div
      ref={containerRef}
      className="scroller-wrapper z-20 overflow-hidden bg-opacity-50"
    >
      <ul
        ref={scrollerRef}
        className={`flex min-w-full shrink-0 gap-4 py-4 w-max flex-nowrap ${
          start ? "animate-scroll" : ""
        } ${pauseOnHover ? "hover:[animation-play-state:paused]" : ""}`}
      ></ul>
    </div>
  )
}
