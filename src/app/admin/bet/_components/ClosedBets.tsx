"use client"
import axios from "axios";
import Image from "next/image"
import { useEffect, useState } from "react";
import { FaForward } from "react-icons/fa";
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import Link from "next/link";
import { SquareArrowOutUpRight } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
interface Bet {
    _id: string;
    founderId: User;
    tournamentId: Tournament;
    matchId: Match;
    founderTeamId: string;
    stake: Number;
    opponentId: User;
    opponentTeamId: string;
}

interface User {
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


export default function ClosedBets() {

    const [bets, setBets] = useState<Bet[]>([]);
    const [winnerId, setWinnerId] = useState<string>("")

    useEffect(() => {
        const getOpenBet = async () => {
            try {
                const response = await axios.post('/api/bet/getClosedBet', { status: 'closed' })
                setBets(response.data.data)
            } catch (error) {
                console.error(error);
            }
        }
        getOpenBet();
    }, [])

    const setWinner = async (betId: string) => {
        try {
            const response = await axios.post('/api/bet/setWinner',{
                betId,
                winnerId
            });
            console.log(response.data);
            
        } catch (error) {
            console.error("Something error", error);
        }
    }
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
                                className="p-4 rounded-bl-md text-white bg-gradient-to-r from-red-700/70 via-red-700/20 to-red-700/0 flex flex-row space-x-2"
                            >
                                <FaForward className=" bg-red-600 p-1 w-6 h-6 rounded-md" /> <span className=" font-semibold text-red-400">{bet.matchId.matchDate} / {`${bet.matchId.matchTime.slice(0, 2)}:${bet.matchId.matchTime.slice(2)}`}</span>
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
                                            src={bet.matchId.team1Id._id === bet.founderTeamId ? bet.founderId.image : bet.opponentId.image}
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
                                            src={bet.matchId.team2Id._id === bet.founderTeamId ? bet.founderId.image : bet.opponentId.image}
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
                        <div className="flex flex-col items-center p-2 border-gradient-bottom ">
                            <div className="text-center ">
                                <p className="text-xs font-bold">REWARD POOL</p>
                                <p className="text-2xl font-extrabold text-blue-700">${(Number(bet.stake) * 2).toString()}</p>
                            </div>

                        </div>

                        <Dialog>
                            <DialogTrigger asChild>
                                <Button size={"sm"} variant={"link"}>
                                    See Detail
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[800px] bg-gray-950">
                                <DialogHeader>
                                    <DialogTitle>
                                        <div className="relative flex flex-row items-center space-x-1 ">
                                            <Image
                                                src={bet.tournamentId.organizerAvatar}
                                                height="20"
                                                width="20"
                                                alt="Organizer Avatar"
                                                className="h-8 w-8 rounded-full border-2 object-cover"
                                            />
                                            <p className="font-bold text-base text-gray-500">{bet.tournamentId.organizer}: {bet.tournamentId.tname}</p>
                                        </div>
                                    </DialogTitle>

                                </DialogHeader>
                                <div className="flex flex-col space-y-5">
                                    <div className="flex flex-row items-center justify-center space-x-12">
                                        <div className="relative flex flex-row items-center space-x-4">
                                            <div className="relative">
                                                <Image
                                                    src={bet.matchId.team1Id.teamImage}
                                                    height="100"
                                                    width="100"
                                                    alt="Team2"
                                                    className="h-24 w-24 rounded-full border-2 object-cover"
                                                />
                                                <div className="absolute bottom-0 right-0 transform translate-x-1/2 translate-y-2 flex flex-row items-center   px-2 space-x-1">
                                                    <Image
                                                        src={bet.matchId.team1Id._id === bet.founderTeamId ? bet.founderId.image : bet.opponentId.image}
                                                        height="100"
                                                        width="100"
                                                        alt="founder"
                                                        className="h-7 w-7 rounded-full border-2 object-cover border-gray-900"
                                                    />
                                                    <p className="text-sm text-gray-400 font-semibold">{bet.matchId.team1Id._id === bet.founderTeamId ? bet.founderId.username : bet.opponentId.username}</p>
                                                </div>
                                            </div>
                                            <p className="font-bold text-3xl text-gray-100">{bet.matchId.team1Id.teamName}</p>

                                        </div>
                                        <div className="text-lg font-semibold text-gray-500">
                                            VS
                                        </div>
                                        <div className="relative flex flex-row items-center space-x-4">
                                            <div className="relative">
                                                <Image
                                                    src={bet.matchId.team2Id.teamImage}
                                                    height="100"
                                                    width="100"
                                                    alt="Team2"
                                                    className="h-24 w-24 rounded-full border-2 object-cover"
                                                />
                                                <div className="absolute bottom-0 right-0 transform translate-x-1/2 translate-y-2 flex flex-row items-center   px-2 space-x-1">
                                                    <Image
                                                        src={bet.matchId.team2Id._id === bet.founderTeamId ? bet.founderId.image : bet.opponentId.image}
                                                        height="100"
                                                        width="100"
                                                        alt="founder"
                                                        className="h-7 w-7 rounded-full border-2 object-cover border-gray-900"
                                                    />
                                                    <p className="text-sm text-gray-400 font-semibold">{bet.matchId.team2Id._id === bet.founderTeamId ? bet.founderId.username : bet.opponentId.username}</p>
                                                </div>
                                            </div>
                                            <p className="font-bold text-3xl text-gray-100">{bet.matchId.team2Id.teamName}</p>
                                        </div>

                                    </div>
                                    <div
                                        className="p-4 rounded-bl-md text-white bg-gradient-to-t from-green-700/0 via-blue-700/30 to-green-700/0 flex flex-row space-x-2 items-center justify-center"
                                    >
                                        <FaForward className="bg-blue-700 p-1 w-6 h-6 rounded-md" />
                                        <span className="font-semibold text-blue-400">
                                            {bet.matchId.matchDate} / {`${bet.matchId.matchTime.slice(0, 2)}:${bet.matchId.matchTime.slice(2)}`}
                                        </span>
                                    </div>
                                    <div className="flex flex-row justify-between" >
                                        <div className="flex flex-col">
                                            <div className="flex flex-row space-x-2">
                                                <p className="text-base font-semibold text-blue-700">Bet status:</p>
                                                <p className="text-base font-semibold text-gray-300">Closed</p>
                                            </div>
                                            <div className="flex flex-row space-x-2">
                                                <p className="text-base font-semibold text-blue-700">Reward pool:</p>
                                                <p className="text-base font-semibold text-gray-300">${(Number(bet.stake) * 2).toString()}</p>
                                            </div>
                                            <div className="flex flex-row space-x-2 items-center">
                                                <p className="text-base font-semibold text-blue-700">Go the tournament:</p>
                                                <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/t/${bet.tournamentId._id}`}><SquareArrowOutUpRight className="h-5" /></Link>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end space-y-3 ">
                                            <Select onValueChange={(value) => setWinnerId(value)}>
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Select a fruit" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Select Winner</SelectLabel>
                                                        <SelectItem value={bet.founderId._id} >
                                                            <div className="flex flex-row space-x-2">
                                                                <Image
                                                                    width={100}
                                                                    height={100}
                                                                    src={bet.founderId.image} alt={""}
                                                                    className="h-6 w-6 rounded-full"
                                                                />
                                                                <p className=" text-base text-gray-400">
                                                                    {bet.founderId.username}
                                                                </p>
                                                            </div>
                                                        </SelectItem>
                                                        <SelectItem value={bet.opponentId._id} >
                                                            <div className="flex flex-row space-x-2">
                                                                <Image
                                                                    width={100}
                                                                    height={100}
                                                                    src={bet.opponentId.image} alt={""}
                                                                    className="h-6 w-6 rounded-full"
                                                                />
                                                                <p className=" text-base text-gray-400">
                                                                    {bet.opponentId.username}
                                                                </p>
                                                            </div>
                                                        </SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            <Button onClick={()=>setWinner(bet._id)} size={"sm"}>Set Winner</Button>
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>


                                </DialogFooter>
                            </DialogContent>
                        </Dialog>


                    </div>


                </div>
            ))}

        </div>
    )
}