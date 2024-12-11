"use client"
import TCard from "./_components/Cards";
import {  useMemo } from "react";
import axios from "axios";
import useSWR from "swr";

const fetcher = (url: string, tournamentId: any) => axios.post(url, { tournamentId }).then((res) => res.data)
export default function Page({ params }: { params: { id: string } }) {

    const { data: bracket, error, mutate } = useSWR(
        params.id ? ['/api/tournament/bracket/getBracket',  params.id ] : null,
        ([url, params]) => fetcher(url, params)
    );

    const generateRounds = (teamCount: number) => {
        const rounds = [];
        let currentTeamCount = teamCount;

        while (currentTeamCount >= 2) {
            rounds.push(currentTeamCount);
            currentTeamCount = Math.floor(currentTeamCount / 2);
        }

        return rounds;
    };


    const rounds = useMemo(() => (bracket ? generateRounds(bracket.teams.length) : []), [bracket]);

    if (error?.response?.status === 404) return <div></div>;
    if (error) return <div>Hata oluştu: {error.message}</div>;
    if (!bracket) return <div>Yükleniyor...</div>;
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
                                        team={team} />
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
