"use client"

import { useMemo, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DialogTitle,Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Trophy, ChevronDown, ChevronUp } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import useSWR from "swr"
import axios from "axios"

interface TeamMember {
  memberId: string
  username: string
  image: string
  isLead: boolean
}

interface TeamResult {
  position: number
  name: string
  wins: number
  losses: number
  draws: number
  members: TeamMember[]
  teamImage: string
}

const fetcher = (url: string, params: any) =>
  axios.post(url, params).then((res) => {
    const data = res.data
    const sortedData = data.sort((a: any, b: any) => a.position - b.position)

    return sortedData
  })

export default function TournamentResults({ id, isOpen, setIsOpen }: { id: string, isOpen: boolean, setIsOpen: (val: boolean) => void }) {

  const [expandedTeam, setExpandedTeam] = useState<number | null>(null)
  const [teamResults, setTeamResults] = useState<TeamResult[]>([])

  // API'den turnuva sonuçlarını çek
  const { data: result, error: resultsError } = useSWR(
    useMemo(() => ["/api/tournament/getResultTeam", { tournamentId: id }], [id]),
    ([url, params]) => fetcher(url, params)
  )

  // 🟢 API'den gelen verileri `teamResults` state'ine yerleştir
  useEffect(() => {
    if (!result || !Array.isArray(result) || result.length === 0) {
      
      setTeamResults([]); // Eğer sonuç yoksa state'i sıfırla
      return;
    }
  
    const formattedResults: TeamResult[] = result.map((team: any) => ({
      position: team.position,
      name: team.team?.teamName || "Unknown Team",
      teamImage: team.team?.teamImage || "/placeholder.svg",
      wins: team.wins || 0,
      losses: team.losses || 0,
      draws: team.draws || 0,
      members: team.team?.members?.map((member: any) => ({
        memberId: member.memberId || "",
        username: member.username || "Unknown Player",
        image: member.image || "/placeholder.svg",
        isLead: member.isLead || false,
      })) || [],
    }));
  
    setTeamResults(formattedResults);
  }, [result]);
  

  const toggleTeam = (position: number) => {
    setExpandedTeam(expandedTeam === position ? null : position)
  }

  const getOrdinalSuffix = (position: number) => {
    if (position === 1) return "st"
    if (position === 2) return "nd"
    if (position === 3) return "rd"
    return "th"
  }
  if (resultsError) return <div className="text-red-500 text-center">Error</div>
  if (!result) return <div className="text-gray-400 text-center">⏳ Loading...</div>
  if (teamResults.length === 0) return <div className="text-gray-400 text-center">Result not found</div>



  const TeamCard = ({ team }: { team: TeamResult }) => {
    const isTopThree = team.position <= 3
    const bgClass = isTopThree
      ? team.position === 1
        ? "bg-gradient-to-r from-yellow-900/30 to-yellow-800/30 border border-yellow-700"
        : team.position === 2
          ? "bg-gradient-to-r from-gray-800/30 to-gray-700/30 border border-gray-600"
          : "bg-gradient-to-r from-amber-900/30 to-amber-800/30 border border-amber-700/50"
      : "bg-gray-900/50"

    return (
      <div className={`rounded-lg p-4 ${bgClass}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {isTopThree && (
              <Trophy
                className={`flex-shrink-0 ${team.position === 1
                  ? "text-yellow-400 w-20 h-20"
                  : team.position === 2
                    ? "text-gray-400 w-16 h-16"
                    : "text-amber-700 w-14 h-14"
                  }`}
              />
            )}
            {!isTopThree && (
              <span className="text-2xl font-bold text-white min-w-[40px]">
                {team.position}
                <sup className="text-sm text-gray-400">{getOrdinalSuffix(team.position)}</sup>
              </span>
            )}
            <div className={`relative flex-shrink-0 ${isTopThree ? "h-16 w-16" : "h-10 w-10"}`}>
              <Image
                src={team.teamImage || "/placeholder.svg"}
                alt="Team Logo"
                fill
                className="rounded-full"
              />
            </div>
            <div className="flex flex-col">
              {isTopThree && (
                <span
                  className={`text-sm font-semibold ${team.position === 1 ? "text-yellow-400" : team.position === 2 ? "text-gray-400" : "text-amber-700"
                    }`}
                >
                  {team.position === 1 ? "1ST PLACE" : team.position === 2 ? "2ND PLACE" : "3RD PLACE"}
                </span>
              )}
              <span className={`font-bold text-white  md:w-52 w-48 md:truncate ${isTopThree ? "text-3xl" : "text-xl"}`}>
                {team.name}
              </span>
              <span className={`text-xs text-gray-300 ${isTopThree ? "text-end" : "text-start"}`}>
                {team.wins} Win - {team.losses} Lose - {team.draws} Draw
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleTeam(team.position)}
            aria-label={expandedTeam === team.position ? "Collapse team details" : "Expand team details"}
          >
            {expandedTeam === team.position ? (
              <ChevronUp className="text-gray-400" />
            ) : (
              <ChevronDown className="text-gray-400" />
            )}
          </Button>
        </div>
        <AnimatePresence>
          {expandedTeam === team.position && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 space-y-2"
            >
              {team.members.map((member, index) => (
                <div key={index} className="flex items-center space-x-2 bg-gray-800/50 p-2 rounded">
                  <div className="h-8 w-8 relative">
                    <Image src={member.image || "/placeholder.svg"} alt={member.username} fill className="rounded-full" />
                  </div>
                  <span className="text-sm text-white">{member.username}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Tournament Results</Button>
      </DialogTrigger>
      <DialogTitle>
        
      </DialogTitle>
      <DialogContent className="max-w-full sm:max-w-[75vw] h-screen max-h-screen p-0 bg-black/95">
        <div className="h-full overflow-y-auto scrollbar-hide">
          <div className="p-6">
            <h1 className="text-4xl font-bold text-center text-white mb-8">Tournament Results</h1>

            {/* Top 3 Section */}
            <div className="max-w-4xl mx-auto mb-8 space-y-4">
              <div className="w-full md:w-2/4 mx-auto">
                {teamResults.length > 0 && <TeamCard team={teamResults[0]} />}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {teamResults.length > 1 && <TeamCard team={teamResults[1]} />}
                {teamResults.length > 2 && <TeamCard team={teamResults[2]} />}
              </div>
            </div>

            <div className="max-w-4xl mx-auto space-y-4">
              {teamResults.slice(3).map((team) => (
                <TeamCard key={team.position} team={team} />
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
