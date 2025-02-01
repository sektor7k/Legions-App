"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import useSWR from "swr"
import axios from "axios"
import { toast } from "@/components/ui/use-toast"
import { Trash2Icon } from "lucide-react"

interface Team {
    _id: string
    teamName: string
    teamImage: string
}

interface TeamResult {
    position: number
    team: Team
    wins: number
    losses: number
    draws: number
}



const fetcher = (url: string, params: any) => axios.post(url, params).then((res) => res.data)

export default function AdminPanel({ params }: { params: { id: string } }) {
    const { data: teams, error: teamsError } = useSWR(
        useMemo(() => ["/api/tournament/team/getTeam", { tournamentId: params.id }], [params.id]),
        ([url, params]) => fetcher(url, params)
    )
    const { data: result, error: resultsError } = useSWR<TeamResult[]>(
        useMemo(() => ["/api/tournament/getResult", { tournamentId: params.id }], [params.id]), ([url, params]) => fetcher(url, params));

    const [results, setResults] = useState<TeamResult[]>([])
    const [currentResult, setCurrentResult] = useState<TeamResult>({
        position: results.length + 1,
        team: { _id: "", teamName: "", teamImage: "" },
        wins: 0,
        losses: 0,
        draws: 0,
    })
    useEffect(() => {
        if (result) {
            const sortedResults = [...result].sort((a, b) => a.position - b.position); 
            console.log("Sıralanmış API verisi:", sortedResults); 
            setResults(sortedResults);
        }
    }, [result]); 
    
    const handleInputChange = (field: keyof TeamResult, value: string | number) => {
        setCurrentResult((prev) => ({ ...prev, [field]: value }))
    }

    const handleTeamSelect = (teamId: string) => {
        const selectedTeam = teams?.find((team: Team) => team._id === teamId)
        if (selectedTeam) {
            setCurrentResult((prev) => ({
                ...prev,
                team: {
                    _id: selectedTeam._id,
                    teamName: selectedTeam.teamName,
                    teamImage: selectedTeam.teamImage,
                },
            }))
        }
    }

    const handleAddResult = () => {
        setResults((prev) => [...prev, currentResult]);
    
        setCurrentResult({
            position: results.length + 2, 
            team: { _id: "", teamName: "", teamImage: "" },
            wins: 0,
            losses: 0,
            draws: 0,
        });
    };

    const handleRemoveResult = (index: number) => {
        setResults((prev) => prev.filter((_, i) => i !== index))
    }

    const handleSaveResults = async () => {
        try {
            const response = await axios.post("/api/admin/tournament/setResult", { tournamentId: params.id, teams: results });
            toast({ title: "Success", description: "Results saved successfully" });
        } catch (error) {
            console.error("Save error:", error);
            toast({ title: "Error", description: "Failed to save results", variant: "destructive" });
        }
    };

    if (teamsError || resultsError) return <div>Failed to load teams</div>
    if (!teams) return <div>Loading...</div>

    return (
        <div className="container mx-auto p-4 space-y-8">
            <h1 className="text-3xl font-bold text-center">Tournament Results Admin Panel</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                        id="position"
                        type="number"
                        value={currentResult.position}
                        onChange={(e) => handleInputChange("position", Number.parseInt(e.target.value))}
                        min={1}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="team">Team</Label>
                    <Select value={currentResult.team._id} onValueChange={handleTeamSelect}>
                        <SelectTrigger id="team">
                            <SelectValue placeholder="Select team" />
                        </SelectTrigger>
                        <SelectContent>
                            {teams.map((team: Team) => (
                                <SelectItem key={team._id} value={team._id}>
                                    <div className="flex items-center gap-2">
                                        <div className="relative w-6 h-6">
                                            <Image
                                                src={team.teamImage || "/placeholder.svg"}
                                                alt={team.teamName}
                                                fill
                                                className="rounded-full object-cover"
                                            />
                                        </div>
                                        <span>{team.teamName}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="wins">Wins</Label>
                    <Input
                        id="wins"
                        type="number"
                        value={currentResult.wins}
                        onChange={(e) => handleInputChange("wins", Number.parseInt(e.target.value))}
                        min={0}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="losses">Losses</Label>
                    <Input
                        id="losses"
                        type="number"
                        value={currentResult.losses}
                        onChange={(e) => handleInputChange("losses", Number.parseInt(e.target.value))}
                        min={0}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="draws">Draws</Label>
                    <Input
                        id="draws"
                        type="number"
                        value={currentResult.draws}
                        onChange={(e) => handleInputChange("draws", Number.parseInt(e.target.value))}
                        min={0}
                    />
                </div>
            </div>

            <Button onClick={handleAddResult} className="w-full">
                Add Result
            </Button>

            {results.length > 0 && (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Position</TableHead>
                            <TableHead>Team</TableHead>
                            <TableHead>Wins</TableHead>
                            <TableHead>Losses</TableHead>
                            <TableHead>Draws</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {results.map((result, index) => (
                            <TableRow key={index}>
                                <TableCell>{result.position}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className="relative w-6 h-6">
                                            <Image
                                                src={result.team.teamImage || "/placeholder.svg"}
                                                alt={result.team.teamName}
                                                fill
                                                className="rounded-full object-cover"
                                            />
                                        </div>
                                        <span>{result.team.teamName}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{result.wins}</TableCell>
                                <TableCell>{result.losses}</TableCell>
                                <TableCell>{result.draws}</TableCell>
                                <TableCell>
                                    <Button variant="destructive" onClick={() => handleRemoveResult(index)}>
                                        <Trash2Icon/>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
            <Button onClick={handleSaveResults} className="w-full">
                Save Results
            </Button>
        </div>
    )
}
