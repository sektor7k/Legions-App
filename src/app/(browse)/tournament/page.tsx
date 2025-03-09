"use client"
import LoadingAnimation from "@/components/loadingAnimation"
import { CardDemo } from "./_components/Card"
import axios from "axios"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import ErrorAnimation from "@/components/errorAnimation"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

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
    const tournaments: TournamentsProps[] = res.data.tournaments;

    tournaments.sort((a, b) => {
      // Sort by status
      if (a.tournamentStatus !== b.tournamentStatus) {
        return a.tournamentStatus === "open" ? -1 : 1;
      }

      // Sort by date
      const dateA = new Date(a.starts).getTime();
      const dateB = new Date(b.starts).getTime();
      return dateA - dateB; 
    });

    return tournaments;
  });

export default function Tournaments() {
  const { data: tournaments, error } = useSWR<TournamentsProps[]>(`${process.env.NEXT_PUBLIC_API_URL}/tournament/getAllTournament`, fetcher)

  const router = useRouter()

  const [filters, setFilters] = useState({
    game: "",
    tournamentStatus: "",
    bracket: "",
    region: "",
  })
  const [search, setSearch] = useState("")

  if (!tournaments && !error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <LoadingAnimation />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <ErrorAnimation />
        <p className="text-red-500 mt-4">Failed to load tournaments. Please try again later.</p>
      </div>
    )
  }

  const filteredTournaments = tournaments?.filter(
    (tournament) =>
      (filters.game ? tournament.game === filters.game : true) &&
      (filters.tournamentStatus ? tournament.tournamentStatus === filters.tournamentStatus : true) &&
      (filters.bracket ? tournament.bracket === filters.bracket : true) &&
      (filters.region ? tournament.region === filters.region : true) &&
      (search ? tournament.tname.toLowerCase().includes(search.toLowerCase()) : true),
  )

  return (
    <div className=" px-6 space-y-10">
      <div className="sticky top-0  backdrop-blur-sm bg-black/35 z-20 p-4 pt-6 space-y-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4">
            {/* <Select
              onValueChange={(value) => setFilters((prev) => ({ ...prev, game: value === "_clear" ? "" : value }))}
            >
              <SelectTrigger className="w-[120px] bg-white/10 border-none rounded-none ">
                <SelectValue placeholder=" Game" />
              </SelectTrigger>
              <SelectContent className=" rounded-none bg-black">
                <SelectItem value="_clear">All Game</SelectItem>
                <SelectItem value="game1">Game 1</SelectItem>
                <SelectItem value="game2">Game 2</SelectItem>
              </SelectContent>
            </Select> */}
            <Select
              onValueChange={(value) => setFilters((prev) => ({ ...prev, tournamentStatus: value === "_clear" ? "" : value }))}
            >
              <SelectTrigger className="w-[120px] bg-white/10 border-none rounded-none">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className=" rounded-none bg-black">
                <SelectItem value="_clear">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select
              onValueChange={(value) => setFilters((prev) => ({ ...prev, bracket: value === "_clear" ? "" : value }))}
            >
              <SelectTrigger className="w-[120px] bg-white/10 border-none rounded-none">
                <SelectValue placeholder="Bracket" />
              </SelectTrigger>
              <SelectContent className=" rounded-none bg-black">
                <SelectItem value="_clear">All Bracket</SelectItem>
                <SelectItem value="Single">Single</SelectItem>
                <SelectItem value="Team">Team</SelectItem>
              </SelectContent>
            </Select>
            <Select
              onValueChange={(value) => setFilters((prev) => ({ ...prev, region: value === "_clear" ? "" : value }))}
            >
              <SelectTrigger className="w-[120px] bg-white/10 border-none rounded-none">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent className=" rounded-none bg-black">
                <SelectItem value="_clear">All Region</SelectItem>
                <SelectItem value="Asia">Asia</SelectItem>
                <SelectItem value="Europe">Europe</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="relative max-w-sm">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-300" />
            <Input
              type="search"
              placeholder="Search tournaments..."
              className="pl-8 pr-4 "
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {filteredTournaments?.length === 0 ? (
        <div className="flex justify-center items-center">No Active Tournament</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3  ">
          {filteredTournaments?.map((tournament) => (
            <button onClick={() => router.push(`/t/${tournament._id}`)} key={tournament._id}>
              <CardDemo
                name={tournament.tname}
                thumbnail={tournament.thumbnail}
                thumbnailGif={tournament.thumbnailGif}
                organizer={tournament.organizer}
                organizerAvatar={tournament.organizerAvatar}
                participants={tournament.participants}
                capacity={tournament.capacity}
                date={tournament.starts}
                tournamentStatus={tournament.tournamentStatus}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

