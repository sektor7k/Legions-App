"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import axios from "axios"
import useSWR from "swr"
import { useRouter } from "next/navigation"
import { CardDemo } from "./Card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import LoadingAnimation from "@/components/loadingAnimation"
import ErrorAnimation from "@/components/errorAnimation"

interface TournamentsProps {
  _id: string
  tname: string
  thumbnail: string
  thumbnailGif: string
  organizer: string
  organizerAvatar: string
  participants: number
  capacity: number
  starts: string
  game: string
  tournamentStatus: string
  bracket: string
  region: string
}

const fetcher = (url: string) =>
  axios.get(url).then((res) => {
    const tournaments: TournamentsProps[] = res.data.tournaments

    // Sadece "open" durumdaki turnuvaları filtrele
    const openTournaments = tournaments.filter(
      (tournament) => tournament.tournamentStatus === "open"
    )

    // Tarihe göre sırala
    openTournaments.sort((a, b) => {
      const dateA = new Date(a.starts).getTime()
      const dateB = new Date(b.starts).getTime()
      return dateA - dateB
    })

    // İlk 5 turnuvayı döndür
    return openTournaments.slice(0, 5)
  })

export function TournamentCards() {
  const {
    data: tournaments,
    error,
    isLoading,
  } = useSWR<TournamentsProps[]>("/api/tournament/getAllTournament", fetcher)
  const router = useRouter()

  if (isLoading) return <div className="flex justify-center items-center h-40"><LoadingAnimation /></div>
  if (error) return <div className="flex justify-center items-center h-40"><ErrorAnimation /></div>
  if (!tournaments || tournaments.length === 0)
    return <div className="flex justify-center items-center h-40">No Active Tournament</div>

  return (
    <div className="relative w-full space-y-4 pt-10">
      <p className=" font-bold text-2xl pl-10">Upcoming Tournaments</p>

      <div className="w-full flex justify-center items-center pt-5">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-[calc(100vw-120px)] relative"
        >
          <CarouselContent className="-ml-1">
            {tournaments.map((tournament) => (
              <CarouselItem key={tournament._id} className="pl-1 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                <button onClick={() => router.push(`/t/${tournament._id}`)}>
                  <CardDemo
                    name={tournament.tname || "Unnamed Tournament"}
                    thumbnail={tournament.thumbnail || "/placeholder.png"}
                    thumbnailGif={tournament.thumbnailGif || "/placeholder.gif"}
                    organizer={tournament.organizer || "Unknown Organizer"}
                    organizerAvatar={tournament.organizerAvatar || "/placeholder-avatar.png"}
                    participants={tournament.participants || 0}
                    capacity={tournament.capacity || 0}
                    date={tournament.starts || "TBA"}
                    tournamentStatus={tournament.tournamentStatus || "Unknown"}
                  />
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Önceki buton */}
          <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-gray-800 hover:bg-gray-700 text-white rounded-full h-10 w-10 shadow-md transition-transform transform hover:scale-110">
            <ChevronLeft />
          </CarouselPrevious>

          {/* Sonraki buton */}
          <CarouselNext className="absolute right-8 top-1/2 -translate-y-1/2 z-20 bg-gray-800 hover:bg-gray-700 text-white rounded-full h-10 w-10 shadow-md transition-transform transform hover:scale-110">
            <ChevronRight />
          </CarouselNext>
        </Carousel>
      </div>
    </div>
  )
}
