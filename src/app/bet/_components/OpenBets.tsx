"use client"
import axios from "axios";
import Image from "next/image"
import { useEffect, useState } from "react";
import { FaForward } from "react-icons/fa";

interface Bet {
    _id: string;
    founderId: Founder;
    tournamentId: Tournament;
    matchId: Match;
    selectedTeamId: string;
    stake: Number;
}

interface Founder {
    _id: string;
    username: string;
    image: string;
}

interface Tournament {
    _id: string;
    thumbnail: string,
    tname: string,
    organizer: string,
    organizerAvatar: string
}
interface Match {
    _id: string;
    team1Id: Team,
    team2Id: Team,
    matchDate: string,
    matchTime: string
}
interface Team {
    _id: string;
    teamName: string;
    teamImage: string;
}


export default function OpenBets() {

    const [bets, setBets] = useState<Bet[]>([]);

    useEffect(() => {
        const getOpenBet = async () => {
            try {
                const response = await axios.post('/api/bet/getOpenBet', {})
                setBets(response.data.data)
            } catch (error) {
                console.error(error);
            }
        }
        getOpenBet();
    }, [])
    return (
        <div className="w-full flex flex-col space-y-4">
            {bets.map((bet) => (
                <div key={bet._id} className="flex flex-row bg-gray-900  rounded-md">
                    <div className="flex flex-col w-4/5  pr-8">
                        <div className="relative flex flex-row items-center space-x-1 z-10 p-4">
                            <Image
                                src={bet.tournamentId.organizerAvatar}
                                height="20"
                                width="20"
                                alt="Organizer Avatar"
                                className="h-6 w-6 rounded-full border-2 object-cover"
                            />
                            <p className="font-bold text-sm text-gray-500">{bet.tournamentId.organizer}: {bet.tournamentId.tname}</p>
                        </div>
                        <div className="flex flex-row justify-between">
                            <div
                                className="p-4 rounded-bl-md text-white bg-gradient-to-r from-green-700/70 via-green-700/20 to-green-700/0 flex flex-row space-x-2"
                            >
                                <FaForward className=" bg-green-600 p-1 w-6 h-6 rounded-md" /> <span className=" font-semibold text-green-400">{bet.matchId.matchDate} / {`${bet.matchId.matchTime.slice(0, 2)}:${bet.matchId.matchTime.slice(2)}`}</span>
                            </div>
                            <div className="flex flex-row items-center justify-center space-x-4 transform -translate-y-6">
                                <div className="relative flex flex-row items-center space-x-1 bg-green-700 bg-opacity-30 backdrop-blur-sm p-4 py-1 rounded-lg border-2 border-green-700 min-w-40">
                                    <Image
                                        src={bet.matchId.team1Id.teamImage}
                                        height="100"
                                        width="100"
                                        alt="Team1"
                                        className="h-12 w-12 rounded-full border-2 object-cover"
                                    />
                                    <p className="font-bold text-lg text-gray-100">{bet.matchId.team1Id.teamName}</p>
                                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                                        <Image
                                            src={bet.matchId.team1Id._id === bet.selectedTeamId ? bet.founderId.image:"/green.png"}
                                            height="100"
                                            width="100"
                                            alt="Team1"
                                            className="h-6 w-6 rounded-full border-2 object-cover border-gray-900"
                                        />
                                    </div>
                                </div>
                                <div className="font-bold text-lg">
                                    vs
                                </div>
                                <div className="relative flex flex-row items-center space-x-2  bg-red-700 bg-opacity-30 backdrop-blur-sm p-4 py-1 rounded-lg border-2 border-red-700">
                                    <Image
                                        src={bet.matchId.team2Id.teamImage}
                                        height="100"
                                        width="100"
                                        alt="Team2"
                                        className="h-12 w-12 rounded-full border-2 object-cover"
                                    />
                                    <p className="font-bold text-lg text-gray-100">{bet.matchId.team2Id.teamName}</p>
                                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                                        <Image
                                            src={bet.matchId.team2Id._id === bet.selectedTeamId ? bet.founderId.image:"/green.png"}
                                            height="100"
                                            width="100"
                                            alt="Team1"
                                            className="h-6 w-6 rounded-full border-2 object-cover border-gray-900"
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="relative w-1/5 flex flex-col items-center justify-center space-y-1">
                        <div className="absolute left-0 top-3 bottom-3 w-0.5 bg-gray-600 rounded-full"></div>
                        <div className="relative flex flex-row items-center space-x-1  ">
                            <Image
                                src={bet.founderId.image}
                                height="100"
                                width="100"
                                alt="user"
                                className="h-8 w-8 rounded-full border-2 object-cover"
                            />
                            <p className="font-semibold text-sm text-gray-100">{bet.founderId.username}</p>
                        </div>
                        <button className="bg-blue-950 bg-opacity-50 hover:bg-none flex flex-col items-center p-2 rounded-md relative group transition-all duration-300 min-h-[60px] min-w-[120px]">
                            <div className="text-center transition-opacity duration-300 opacity-100 group-hover:opacity-0 absolute">
                                <p className="text-xs font-bold">PLACED BET OF</p>
                                <p className="text-2xl font-extrabold text-blue-700">${bet.stake.toString()}</p>
                            </div>
                            <p className="text-2xl font-bold  text-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Play
                            </p>
                        </button>


                    </div>


                </div>
            ))}

        </div>
    )
}