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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react";


export default function AddBet() {
  const [tournament, setTournament] = useState("");
  const [match, setMatch] = useState("");
  const [team, setTeam] = useState("");
  const [stake, setStake] = useState("");

  return (
    <div className="mt-auto p-3 border-t border-gray-700">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full">
            PLACE BET
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-gray-950">
          <DialogHeader>
            <DialogTitle>ADD BET</DialogTitle>
            <DialogDescription>
              First, enter the tournament, then select the match and the team you want to bet on. Finally, specify your stake to start betting.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Turnuva Seçimi */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Select Tournament</label>
              <Select onValueChange={(value) => setTournament(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a tournament" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tournament1">Tournament 1</SelectItem>
                  <SelectItem value="tournament2">Tournament 2</SelectItem>
                  <SelectItem value="tournament3">Tournament 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Maç Seçimi */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Select Match</label>
              <Select onValueChange={(value) => setMatch(value)} disabled={!tournament}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a match" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="match1">Match 1</SelectItem>
                  <SelectItem value="match2">Match 2</SelectItem>
                  <SelectItem value="match3">Match 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Takım Seçimi */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Select Team</label>
              <Select onValueChange={(value) => setTeam(value)} disabled={!match}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="teamA">Team A</SelectItem>
                  <SelectItem value="teamB">Team B</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Bahis Miktarı */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Bet Amount</label>
              <Input
                type="number"
                placeholder="Enter your stake"
                value={stake}
                onChange={(e) => setStake(e.target.value)}
                className="bg-gray-800 text-white"
                disabled={!team}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!team || !stake}>
              Place Bet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
