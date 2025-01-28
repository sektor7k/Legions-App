"use client"

import React, { useEffect, useRef, useState } from "react"
import Image from "next/image"
import axios from "axios"
import useSWR from "swr"
import { Skeleton } from "@/components/ui/skeleton" // shadcn skeleton

interface CoinData {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  price_change_percentage_24h: number
}

// Ticker'da gösterilecek veri tipi
interface CryptoData {
  logo: string
  name: string
  ticker: string
  price: number
  change: number
}

// SWR fetcher
const fetcher = async (url: string) => {

  // 2) Gerçek istek
  const res = await axios.get<CoinData[]>(url, {
    headers: {
      accept: "application/json",
      "x-cg-pro-api-key": process.env.NEXT_PUBLIC_GECKO_API,
    },
  })
  return res.data
}

const fetcher2 = async(url:string) => {
  const res = await axios.get(url);
  return res.data.tokenIds;
};

// Skeleton bileşenini kullanan, "kayan liste" görünümüne benzer bir iskelet
function ScrollerSkeleton() {
  const placeholderCount = 5
  return (
    <div className="scroller-wrapper z-20 overflow-hidden bg-opacity-50 p-4">
      <ul className="flex min-w-full shrink-0 gap-4 w-max flex-nowrap animate-pulse">
        {Array.from({ length: placeholderCount }).map((_, idx) => (
          <li
            key={idx}
            className="flex flex-row items-center justify-between w-[300px] max-w-full bg-black/30 border border-gray-700 px-4 py-4 rounded-md"
          >
            <div className="flex items-center gap-4">
              {/* Logo Skeleton */}
              <Skeleton className="h-10 w-10 rounded-full" />
              <div>
                {/* Coin adı */}
                <Skeleton className="h-4 w-[80px] mb-2" />
                {/* Ticker */}
                <Skeleton className="h-3 w-[40px]" />
              </div>
            </div>
            <div className="flex flex-col items-center justify-center">
              {/* Fiyat */}
              <Skeleton className="h-4 w-[60px] mb-2" />
              {/* Değişim */}
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

  const {data:data2, error:error2} = useSWR("/api/getTrends", fetcher2);
  // IDs dizisi (ileride sunucudan da çekebilirsin)

  

  // SWR: 60 saniyede bir yenile
  const {
    data,
    error,
    isLoading,
  } = useSWR<CoinData[]>(
    `https://pro-api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${encodeURIComponent(
      data2
    )}`,
    fetcher,
    {
      refreshInterval: 60_000, // her 60 saniyede bir otomatik re-fetch
    }
  )

  // Ticker'da göstereceğimiz "işlenmiş" veriler
  const [items, setItems] = useState<CryptoData[]>([])

  // Animasyon state
  const [start, setStart] = useState(false)

  // Ref'ler
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollerRef = useRef<HTMLUListElement>(null)

  // Veri geldiğinde "items" state'ine dönüştürülmüş veriyi koyup animasyonu başlat
  useEffect(() => {
    if (data && data.length > 0) {
      // CoinData -> CryptoData map
      const mapped: CryptoData[] = data.map((coin) => ({
        logo: coin.image,
        name: coin.name,
        ticker: coin.symbol.toUpperCase(),
        price: coin.current_price,
        change: coin.price_change_percentage_24h,
      }))
      setItems(mapped)

      // Animasyonu her seferinde tekrar başlatmak istersen önce kapatıp sonra aç
      setStart(false)

      // Bir sonraki render'da UL dolunca animasyonu yeniden ekle
      setTimeout(() => {
        addAnimation()
      }, 0)
    }
  }, [data])

  // Animasyon fonksiyonu
  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children)
      // Sonsuz kaydırma efekti için item’ları klonla
      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true)
        scrollerRef.current?.appendChild(duplicatedItem)
      })

      setDirectionCSS()
      setSpeedCSS()
      setStart(true)
    }
  }

  // Yön
  function setDirectionCSS() {
    if (containerRef.current) {
      containerRef.current.style.setProperty(
        "--animation-direction",
        direction === "left" ? "forwards" : "reverse"
      )
    }
  }

  // Hız
  function setSpeedCSS() {
    if (containerRef.current) {
      const speedMap: { [key: string]: string } = {
        fast: "40s",
        normal: "40s",
        slow: "40s",
      }
      containerRef.current.style.setProperty(
        "--animation-duration",
        speedMap[speed] || "40s"
      )
    }
  }


  if (error || error2) {
    return <div className="p-4 text-red-500">API Error: {error.message}</div>
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
      >
        {items.map((crypto, idx) => (
          <li
            key={idx}
            className="flex flex-row items-center justify-between w-[300px] max-w-full bg-black/30 bg-opacity-80 border border-gray-700 px-4 py-2 rounded-md"
          >
            <div className="flex items-center gap-4">
              <Image
                src={crypto.logo}
                alt={crypto.name}
                width={40}
                height={40}
                className="rounded-full bg-white"
              />
              <div>
                <h3 className="text-sm font-bold text-white">{crypto.name}</h3>
                <p className="text-sm text-gray-400">{crypto.ticker}</p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center">
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
  )
}
