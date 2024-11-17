"use client"
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import axios from "axios";
import { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast";

interface Tournament {
  _id: string;
  tname: string;
  thumbnail: string
}

interface Match {
  _id: string;
  matchDate: string;
  matchTime: string;
  team1Id: Team;
  team2Id: Team;
}

interface Team {
  _id: string;
  teamName: string;
  teamImage: string;
}

export default function AddBet() {
  const [tournament, setTournament] = useState<string>("");
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [match, setMatch] = useState<string>("");
  const [matches, setMatches] = useState<Match[]>([]);
  const [team, setTeam] = useState<string>("");
  const [stake, setStake] = useState<string>("");

  // Tüm turnuvaları çek
  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await axios.get('/api/tournament/getAllTournament');

        if (response.data && response.data.tournaments) {
          setTournaments(response.data.tournaments); // Turnuvaları state'e kaydedin
        }
      } catch (error) {
        console.error('Error fetching tournaments:', error);
      }
    };
    fetchTournaments();
  }, []);

  // Seçilen turnuvaya ait maçları çek
  useEffect(() => {
    if (tournament) {
      const fetchMatches = async () => {
        try {
          const response = await axios.post('/api/tournament/match/getMatch', { tournamentId: tournament });
          if (response.data && response.data.data) {
            setMatches(response.data.data); // Maçları state'e kaydedin
          }
        } catch (error) {
          console.error('Error fetching matches:', error);
        }
      };
      fetchMatches();
    } else {
      setMatches([]); // Turnuva seçilmediğinde maçları temizleyin
    }
  }, [tournament]);

  function showErrorToast(message: string): void {
    toast({
        variant: "destructive",
        title: message,
        description: "",
    })
}

function showToast(message: string): void {
    toast({
        variant: "default",
        title: message,
        description: "",
    })
}


  const placeBet = async () => {

    if (!tournament || !match || !team || !stake) {
      showErrorToast("Please fill in all fields.");
      return;
  }

    try {

      const response = await axios.post('/api/bet/placeBet', {
        tournamentId: tournament,
        matchId: match,
        selectedTeamId: team,
        stake: stake
      })
      showToast("Bet successfully created")
    } catch (error) {
      console.error('Error placing bet:', error);
    }
  }

  return (
    <div className="mt-auto p-3 border-t border-gray-700">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full">
            PLACE BET
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px] bg-gray-950">
          <DialogHeader>
            <DialogTitle>PLACE BET</DialogTitle>
            <DialogDescription>
              First, enter the tournament, then select the match and the team you want to bet on. Finally, specify your stake to start betting.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Turnuva Seçimi */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Select Tournament</label>
              <Select onValueChange={(value) => setTournament(value)}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select a tournament" />
                </SelectTrigger>
                <SelectContent>
                  {tournaments.length > 0 ? (
                    tournaments.map((tournament) => (
                      <SelectItem key={tournament._id} value={tournament._id}>
                        <div className="flex flex-row items-center space-x-4">
                          <img src={tournament.thumbnail} alt="" className="h-10 w-20 rounded-md" />
                          <p className="font-semibold text-base">{tournament.tname}</p>
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-tournaments" disabled>No tournaments available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            {/* Maç Seçimi */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Select Match</label>
              <Select onValueChange={(value) => setMatch(value)} disabled={!tournament}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select a match" />
                </SelectTrigger>
                <SelectContent>
                  {matches.length > 0 ? (
                    matches.map((match) => (
                      <SelectItem key={match._id} value={match._id}>
                        <div className="flex flex-row items-center space-x-6 py-2">
                          <div className="flex flex-row items-center space-x-4">
                            <img src={match.team1Id.teamImage} alt="" className="h-10 w-10 rounded-full" />
                            <p className="font-semibold text-base text-white">{match.team1Id.teamName}</p>
                          </div>
                          <div className="h-10 w-px bg-gray-500"></div>
                          <div className="flex flex-row items-center space-x-4">
                            <img src={match.team2Id.teamImage} alt="" className="h-10 w-10 rounded-full" />
                            <p className="font-semibold text-base text-white">{match.team2Id.teamName}</p>
                          </div>
                          <div className="ml-auto text-gray-400 text-sm">
                            {match.matchDate} // {match.matchTime}
                          </div>
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-matches" disabled>No matches available</SelectItem>
                  )}
                </SelectContent>

              </Select>
            </div>
            {/* Takım Seçimi */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Select Team</label>
              <Select onValueChange={(value) => setTeam(value)} disabled={!match}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select a team" />
                </SelectTrigger>
                <SelectContent>
                  {match && matches.length > 0 && matches.find((m) => m._id === match) ? (
                    <>
                      {matches.find((m) => m._id === match)!.team1Id && (
                        <SelectItem value={matches.find((m) => m._id === match)!.team1Id._id}>
                          <div>
                            <div className="flex flex-row items-center space-x-4">
                              <img
                                src={matches.find((m) => m._id === match)!.team1Id.teamImage}
                                alt=""
                                className="h-10 w-10 rounded-full"
                              />
                              <p className="font-semibold text-base text-white">
                                {matches.find((m) => m._id === match)!.team1Id.teamName}
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                      )}
                      {matches.find((m) => m._id === match)!.team2Id && (
                        <SelectItem value={matches.find((m) => m._id === match)!.team2Id._id}>
                          <div>
                            <div className="flex flex-row items-center space-x-4">
                              <img
                                src={matches.find((m) => m._id === match)!.team2Id.teamImage}
                                alt=""
                                className="h-10 w-10 rounded-full"
                              />
                              <p className="font-semibold text-base text-white">
                                {matches.find((m) => m._id === match)!.team2Id.teamName}
                              </p>
                            </div>
                          </div>
                        </SelectItem>
                      )}
                    </>
                  ) : (
                    <SelectItem value="no-matches" disabled>
                      No team available
                    </SelectItem>
                  )}
                </SelectContent>

              </Select>
            </div>
            {/* Bahis Miktarı */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Bet Amount</label>
              <div className="flex flex-row items-center justify-center space-x-4">
                <div className="relative">
                  <span className="absolute inset-y-0 left-2 flex items-center text-gray-400 pointer-events-none">$</span>
                  <Input
                    type="number"
                    placeholder="Enter your stake"
                    value={stake}
                    onChange={(e) => setStake(e.target.value)}
                    className="pl-4 bg-gray-800 text-white"
                    disabled={!team}
                  />
                </div>
                <Slider className="w-40" defaultValue={[33]} max={100} step={1} disabled={!team} onValueChange={(e) => setStake(e[0].toString())} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!team || !stake} onClick={placeBet}>
              Place Bet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

