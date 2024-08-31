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
    const [teamvalue, setteamValue] = useState("");
    const [bracket, setBracket] = useState<any>(null);
    const [allteams, setTeams] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Bracket verisini çek
                const bracketResponse = await axios.post('/api/tournament/bracket/getBracket', {
                    tournamentId: params.id,
                });

                if (bracketResponse.status === 200) {
                    setBracket(bracketResponse.data);
                } else {
                    console.error('Error fetching bracket', bracketResponse.data.message);
                }

                // Takımları çek
                const teamsResponse = await axios.post('/api/tournament/getTeam', { tournamentId: params.id });
                setTeams(teamsResponse.data);


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

    const createBracket = async () => {
        if (!teamvalue) {
            console.error('Please select a team count');
            return;
        }

        try {
            const response = await axios.post('/api/tournament/bracket/createBracket', {
                teamCount: teamvalue,
                tournamentId: params.id,
            });

            if (response.status === 200) {
                console.log('Bracket created successfully', response.data);
                setBracket(response.data);
                 window.location.reload()
            } else {
                console.error('Error creating bracket', response.data.message);
            }
        } catch (error) {
            console.error('Error creating bracket:', error);
        }
    };

    const deleteBracket = async () => {
        try {
            const response = await axios.post('/api/tournament/bracket/deleteBracket', {
                bracketId: bracket._id
            })
            window.location.reload()
        } catch (error) {
            console.error('Error creating bracket:', error);
        }
    }

    const rounds = bracket ? generateRounds(bracket?.teams?.length) : [];

    return (
        <div className="flex flex-col items-center mt-10 pl-10 overflow-x-auto">
            {bracket ? (
                <div>
                    <Button 
                    variant={"destructive"}
                    onClick={deleteBracket}
                    >Delete Bracket</Button>
                </div>
            ) :
                (
                    <div className="flex flex-row space-x-2">
                        <Select onValueChange={(value: any) => setteamValue(value)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a team count" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="4">4</SelectItem>
                                    <SelectItem value="8">8</SelectItem>
                                    <SelectItem value="16">16</SelectItem>
                                    <SelectItem value="32">32</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Button onClick={createBracket}>Create Bracket</Button>
                    </div>
                )}
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
                                        team={team} tournamentId={params.id} allteams={allteams} />
                                ))}
                        </ol>
                    ))}
                    <ol className="flex flex-1 flex-col justify-around mr-20 ml-10 round round-winner">
                        {/* Kazanan */}
                        <TCard
                            team={bracket.teams?.find((team: any) => team.round === rounds.length + 1)} tournamentId={params.id} allteams={allteams}
                        />
                    </ol>
                </div>
            )}
        </div>
    );
}
