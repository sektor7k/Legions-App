"use client"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import TCard from "./_components/Cards";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function Page({ params }: { params: { id: string } }) {
    const [bracket, setBracket] = useState<any>(null);
 

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Bracket verisini çek
                const bracketResponse = await axios.post('/api/tournament/bracket/getBracket', {
                    tournamentId: params.id,
                });
                console.log(bracketResponse.data)
    
                if (bracketResponse.status === 200) {
                    setBracket(bracketResponse.data);
                } else {
                    console.error('Error fetching bracket', bracketResponse.data.message);
                }
    
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
        fetchData();
    }, [params.id]);


    const generateRounds = (teamCount: number) => {
        const rounds = [];
        let currentTeamCount = teamCount;

        while (currentTeamCount >= 2) {
            rounds.push(currentTeamCount);
            currentTeamCount = Math.floor(currentTeamCount / 2);
        }

        return rounds;
    };


    const rounds = bracket ? generateRounds(bracket.teams.length) : [];

    return (
        <div className="flex flex-col items-center mt-10 pl-10 overflow-x-auto">
            
            {bracket && (
                <div className="flex flex-row justify-center mr-3 mt-8">
                    {rounds.map((teamsInRound, roundIndex) => (
                        <ol
                            key={roundIndex}
                            className="flex flex-1 flex-col justify-around mr-20 ml-10 round space-y-3"
                        >
                            {bracket.teams
                                .filter((team: any) => team.round === roundIndex + 1)
                                .map((team: any, index: number) => (
                                    <TCard
                                        key={index}
                                        team={team}   />
                                ))}
                        </ol>
                    ))}
                    <ol className="flex flex-1 flex-col justify-around mr-20 ml-10 round round-winner">
                        {/* Kazanan */}
                        <TCard
                            team={bracket.teams.find((team: any) => team.round === rounds.length + 1)}
                        />
                    </ol>
                </div>
            )}
        </div>
    );
}
