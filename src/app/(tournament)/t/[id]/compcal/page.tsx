"use client"
import axios from "axios";
import { useEffect, useState } from "react";

interface Team {
    teamName: string;
    teamImage: string;
}

interface Match {
    team1Id: Team;
    team2Id: Team;
    matchDate: string;
    matchTime: string;
}

export default function CompcalPage({ params }: { params: { id: string } }) {

    const [matches, setMatches] = useState<Match[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const matchResponse = await axios.post('/api/tournament/match/getMatch', { tournamentId: params.id });

                setMatches(matchResponse.data.data);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [params.id]);

    return (
        <div className=" max-w-6xl mx-auto p-8 space-y-8">
            <div className="flex flex-col justify-center items-center">
                <p className="text-4xl font-extrabold border-gradient-bottom px-8 p-1">Compcal</p>
                <p className="text-gray-400 text-sm font-semibold">Check match dates in the tournament.</p>
            </div>

            <div className="space-y-6">
                {matches.map((match, index) => (
                    <div
                        key={index}
                        className="flex flex-row justify-between items-center bg-black rounded-md min-h-20 bg-opacity-40 backdrop-blur-sm p-4 px-0"
                    >
                        {/* Team 1 */}
                        <div className="flex flex-col items-center justify-center w-1/4">
                            <img
                                src={match.team1Id.teamImage || "/defaultteam.png"}
                                alt={match.team1Id.teamName}
                                className="w-16 h-16 rounded-full"
                            />
                            <div className="font-bold text-center">{match.team1Id.teamName || "Team"}</div>
                        </div>

                        {/* Match Time and Date */}
                        <div className="flex flex-col justify-center items-center w-1/2">
                            <p className="text-3xl font-extrabold font-mono border-gradient-bottom w-40 text-center">
                                {`${match.matchTime.slice(0, 2)}:${match.matchTime.slice(2)}`}
                            </p>
                            <div className="font-bold pt-1 text-sm text-center w-full">
                                {match.matchDate}
                            </div>
                        </div>

                        {/* Team 2 */}
                        <div className="flex flex-col items-center justify-center w-1/4">
                            <img
                                src={match.team2Id.teamImage || "/defaultteam.png"}
                                alt={match.team2Id.teamName}
                                className="w-16 h-16 rounded-full"
                            />
                            <div className="font-bold text-center">{match.team2Id.teamName || "Team"}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

    )
}