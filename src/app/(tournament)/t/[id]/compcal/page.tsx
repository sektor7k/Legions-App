"use client"

import ErrorAnimation from "@/components/errorAnimation"
import LoadingAnimation from "@/components/loadingAnimation"
import axios from "axios"
import useSWR from "swr"
import { useState, useEffect } from "react"
import { AlarmClock, Play } from "lucide-react"

interface Team {
  _id: string
  teamName: string
  teamImage: string
}

interface Match {
  team1Id: Team
  team2Id: Team
  matchDate: string
  matchTime: string
  status: "incoming" | "ongoing" | "played"
  team1Score?: string
  team2Score?: string
  winnerTeam?: string
}

const fetcher = (url: string, params: any) => axios.post(url, params).then((res) => res.data)

// Tarih formatını "YYYY-MM-DD" formatına dönüştür
const convertDateToISO = (dateString: string) => {
  try {
    // `February 24th, 2025` gibi bir tarihi düzgün bir hale getir
    const cleanDateString = dateString.replace(/(\d+)(st|nd|rd|th)/, "$1") // "24th" -> "24"

    const parts = cleanDateString.match(/([A-Za-z]+) (\d{1,2}), (\d{4})/)
    if (!parts) {
      console.error(`Geçersiz tarih formatı: ${dateString}`)
      return null
    }

    const monthNames: { [key: string]: string } = {
      January: "01",
      February: "02",
      March: "03",
      April: "04",
      May: "05",
      June: "06",
      July: "07",
      August: "08",
      September: "09",
      October: "10",
      November: "11",
      December: "12",
    }

    const month = monthNames[parts[1]] // "February" -> "02"
    const day = parts[2].padStart(2, "0") // "9" -> "09"
    const year = parts[3]

    return `${year}-${month}-${day}` // "YYYY-MM-DD"
  } catch (error) {
    console.error("Tarih dönüştürme hatası:", error)
    return null
  }
}

// Maç tarihini Date objesine çevir
const parseMatchDate = (match: Match) => {
  const formattedDate = convertDateToISO(match.matchDate)
  if (!formattedDate) return new Date() // Hata durumunda geçerli bir tarih döndür

  const formattedTime = match.matchTime.replace(/^(\d{2})(\d{2})$/, "$1:$2")

  return new Date(`${formattedDate}T${formattedTime}:00`)
}

// Sıralama fonksiyonları
const sortAscending = (a: Match, b: Match) => {
  return parseMatchDate(a).getTime() - parseMatchDate(b).getTime()
}

const sortDescending = (a: Match, b: Match) => {
  return parseMatchDate(b).getTime() - parseMatchDate(a).getTime()
}

export default function CompcalPage({ params }: { params: { id: string } }) {
  const { data: matches, error } = useSWR<Match[]>(
    params.id ? [`${process.env.NEXT_PUBLIC_API_URL}/tournament/getMatch`, { tournamentId: params.id }] : null,
    ([url, params]) => fetcher(url, params),
  )

  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([])
  const [playedMatches, setPlayedMatches] = useState<Match[]>([])

  useEffect(() => {
    if (matches) {
      matches.forEach((match) => {
        console.log(
          `Raw Date: ${match.matchDate}, Cleaned Date: ${convertDateToISO(match.matchDate)}, Raw Time: ${match.matchTime}, Parsed: ${parseMatchDate(match)}`,
        )
      })

      const ongoing = matches.filter((m) => m.status === "ongoing").sort(sortAscending)
      const incoming = matches.filter((m) => m.status === "incoming").sort(sortAscending)
      const played = matches.filter((m) => m.status === "played").sort(sortDescending)

      setUpcomingMatches([...ongoing, ...incoming])
      setPlayedMatches(played)
    }
  }, [matches])

  if (error) {
    return (
      <div className="flex h-screen justify-center items-center">
        <ErrorAnimation />
      </div>
    )
  }

  if (!matches) {
    return (
      <div className="flex h-screen justify-center items-center">
        <LoadingAnimation />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      <div className="flex flex-col justify-center items-center mb-8">
        <p className="text-3xl md:text-4xl font-extrabold border-gradient-bottom px-8 p-1">Compcal</p>
        <p className="text-gray-400 text-sm font-semibold text-center">
          Check match dates and results in the tournament.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {upcomingMatches.length > 0 && (
          <div className={`w-full ${playedMatches.length > 0 ? "md:w-1/2" : ""} space-y-4`}>
            <h2 className="text-2xl font-bold text-center mb-4">Ongoing & Upcoming Matches</h2>
            {upcomingMatches.map((match, index) => (
              <UpcomingMatchCard key={index} match={match} />
            ))}
          </div>
        )}

        {playedMatches.length > 0 && (
          <div className={`w-full ${upcomingMatches.length > 0 ? "md:w-1/2" : ""} space-y-4`}>
            <h2 className="text-2xl font-bold text-center mb-4">Completed Matches</h2>
            {playedMatches.map((match, index) => (
              <PlayedMatchCard key={index} match={match} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const UpcomingMatchCard = ({ match }: { match: Match }) => {
  const isOngoing = match.status === "ongoing"
  const [countdown, setCountdown] = useState("")

  useEffect(() => {
    if (!isOngoing) {
      const timer = setInterval(() => {
        const now = new Date()
        const matchDate = parseMatchDate(match)
        const diff = matchDate.getTime() - now.getTime()

        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24))
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((diff % (1000 * 60)) / 1000)

          setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`)
        } else {
          setCountdown("Match started")
          clearInterval(timer)
        }
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [match, isOngoing])

  return (
    <div className="flex flex-row justify-between items-center bg-black bg-opacity-40 rounded-md min-h-20 backdrop-blur-sm p-4 px-2 transition-all duration-300 hover:scale-105">
      <div className="flex flex-col items-center justify-center w-1/4">
        <img src={match.team1Id.teamImage || "/defaultteam.png"} className="w-12 h-12 md:w-16 md:h-16 rounded-full" />
        <div className="font-bold text-center text-xs md:text-sm">{match.team1Id.teamName}</div>
      </div>

      <div className="flex flex-col justify-center items-center w-1/2">
        {isOngoing ? (
          <div className="flex items-center space-x-2 bg-green-800/40 border-2 border-green-800 px-3 py-2 rounded-md">
            <Play size={16} />
            <span className="text-sm font-bold">Ongoing</span>
          </div>
        ) : (
          <>
            <p className=" flex flex-row items-center justify-center gap-3 text-xl  font-extrabold font-mono bg-white/10 border-2 border-gray-200 px-3 py-2 rounded-md">
              <AlarmClock/>{countdown}
            </p>
          </>
        )}
        <div className="font-bold pt-1 text-xs md:text-sm text-center">{match.matchDate} - {`${match.matchTime.slice(0, 2)}:${match.matchTime.slice(2)}`}</div>
      </div>

      <div className="flex flex-col items-center justify-center w-1/4">
        <img src={match.team2Id.teamImage || "/defaultteam.png"} className="w-12 h-12 md:w-16 md:h-16 rounded-full" />
        <div className="font-bold text-center text-xs md:text-sm">{match.team2Id.teamName}</div>
      </div>
    </div>
  )
}

const PlayedMatchCard = ({ match }: { match: Match }) => {
  const isTie = match.team1Score === match.team2Score
  const team1Won = match.winnerTeam === match.team1Id._id
  const team2Won = match.winnerTeam === match.team2Id._id

  return (
    <div className="flex flex-row justify-between items-center rounded-md p-4 overflow-hidden relative transition-all duration-300 hover:scale-105">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50"></div>
      <div
        className={`absolute inset-y-0 left-0 w-1/2 ${isTie ? "bg-yellow-500" : team1Won ? "bg-green-500" : "bg-red-500"} opacity-50`}
        style={{ clipPath: "polygon(0 0, 100% 0, 80% 100%, 0% 100%)" }}
      ></div>
      <div
        className={`absolute inset-y-0 right-0 w-1/2 ${isTie ? "bg-yellow-500" : team2Won ? "bg-green-500" : "bg-red-500"} opacity-50`}
        style={{ clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)" }}
      ></div>

      <div className="flex flex-col items-center w-1/4 z-10">
        <img src={match.team1Id.teamImage || "/defaultteam.png"} className="w-12 h-12 md:w-16 md:h-16 rounded-full" />
        <div className="font-bold text-center text-xs md:text-sm">{match.team1Id.teamName}</div>
      </div>

      <div className="flex flex-col items-center z-10">
        <p className="text-2xl font-bold">
          {match.team1Score} - {match.team2Score}
        </p>
        <p className="text-sm font-semibold">
          {match.matchDate} - {match.matchTime.slice(0, 2)}:{match.matchTime.slice(2)}
        </p>
      </div>

      <div className="flex flex-col items-center w-1/4 z-10">
        <img src={match.team2Id.teamImage || "/defaultteam.png"} className="w-12 h-12 md:w-16 md:h-16 rounded-full" />
        <div className="font-bold text-center text-xs md:text-sm">{match.team2Id.teamName}</div>
      </div>
    </div>
  )
}

