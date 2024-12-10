"use string"
import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { FaForward } from "react-icons/fa6";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

interface Bet {
    createdAt: string | number | Date;
    _id: string;
    founderId: User;
    tournamentId: Tournament;
    matchId: Match;
    founderTeamId: string;
    stake: Number;
    opponentId?: User;
    opponentTeamId?: string;
    betstatus: string;
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

export default function MyBetsCards() {


    const { data: session } = useSession();
    const [myBets, mySetBets] = useState<Bet[]>([]);

    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggleDetails = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    useEffect(() => {
        const getUserBet = async () => {
            try {
                const response = await axios.post("/api/bet/getUserBet");
                if (response.data.data && Array.isArray(response.data.data)) {
                    const sortedBets = response.data.data.sort((a: Bet, b: Bet) => {

                        if (a.betstatus === "ongoing" && b.betstatus !== "ongoing") return -1;
                        if (a.betstatus !== "ongoing" && b.betstatus === "ongoing") return 1;


                        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                    });
                    mySetBets(sortedBets);
                } else {
                    console.error("Invalid data format from API:", response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch user bets:", error);
            }
        };
        getUserBet();
    }, []);


    const getStatusClass = (status: string) => {
        switch (status) {
            case "ongoing":
                return "from-blue-700/70 via-blue-700/20";
            case "won":
                return "from-green-700/70 via-green-700/20";
            case "lost":
                return "from-red-700/70 via-red-700/20";
            default:
                return "from-gray-700/70 via-gray-700/20";
        }
    };
    const getStatusForward = (status: string) => {
        switch (status) {
            case "ongoing":
                return "bg-blue-600 ";
            case "won":
                return "bg-green-600 ";
            case "lost":
                return "bg-red-600 ";
            default:
                return "bg-gray-600 ";
        }
    };
    const getStatusDateClass = (status: string) => {
        switch (status) {
            case "ongoing":
                return "text-blue-400 ";
            case "won":
                return "text-green-400 ";
            case "lost":
                return "text-red-400 ";
            default:
                return "text-gray-400 ";
        }
    }

    return (
        <div className="flex flex-col justify-center space-y-4 overflow-y-auto  ">
            {/* Bet Block */}
            {
                myBets.map((bet) => (
                    <div key={bet._id} className="flex flex-col bg-gray-900 rounded-lg overflow-hidden transition-all duration-500">
                        {/* Header */}
                        <div className="flex flex-row justify-between">
                            <div className="flex flex-row p-4 items-center space-x-2 pb-0">
                                <Image
                                    src={bet.tournamentId.organizerAvatar}
                                    alt={""}
                                    width={40}
                                    height={40}
                                    className="h-5 w-5 rounded-full"
                                />
                                <p className="font-bold text-xs text-gray-500">
                                    {bet.tournamentId.organizer}
                                    <br />
                                    {bet.tournamentId.tname}
                                </p>
                            </div>
                            <div className="bg-gray-700/50 p-4 rounded-tr-lg flex flex-col justify-center items-center py-1">
                                <p className="text-blue-700 font-bold text-sm">REWARD</p>
                                <p className="font-bold text-lg">${bet.stake.toString()}</p>
                            </div>
                        </div>

                        {/* Collapsible Details */}
                        <div
                            className={`transition-max-height duration-500 ease-in-out overflow-hidden ${expandedId === bet._id ? "max-h-40" : "max-h-0"
                                }`}
                        >
                            <div className="flex flex-row justify-between bg-gray-900 p-4">
                                <div className="flex flex-row">
                                    <div className={`flex flex-col justify-center items-center border ${session?.user?.id ===
                                        (bet.matchId.team1Id._id === bet.founderTeamId
                                            ? bet.founderId._id
                                            : bet.opponentId?._id)
                                        ? "border-blue-700"
                                        : "border-gray-700"
                                        } p-3 py-1 rounded-l-lg`}>
                                        <Image
                                            src={
                                                bet.matchId.team1Id._id === bet.founderTeamId
                                                    ? bet.founderId.image
                                                    : bet.opponentId?.image
                                                        ? bet.opponentId?.image
                                                        : "/green.png"
                                            }
                                            alt={""}
                                            width={40}
                                            height={40}
                                            className="h-7 w-7 rounded-full"
                                        />
                                        <p className=" font-bold text-gray-500 text-xs">
                                            {
                                                bet.matchId.team1Id._id === bet.founderTeamId
                                                    ? bet.founderId.username
                                                    : bet.opponentId?.username
                                                        ? bet.opponentId?.username
                                                        : "user"
                                            }
                                        </p>
                                        <p className=" font-bold">
                                        ${
                                                bet.matchId.team1Id._id === bet.founderTeamId
                                                    ? bet.stake.toString()
                                                    : bet.opponentId?._id
                                                        ? bet.stake.toString()
                                                        : "--"
                                            }
                                        </p>

                                    </div>
                                    <div className={`px-6 border ${session?.user?.id ===
                                        (bet.matchId.team1Id._id === bet.founderTeamId
                                            ? bet.founderId._id
                                            : bet.opponentId?._id)
                                        ? "border-blue-700"
                                        : "border-gray-700"
                                        } border-l-0 rounded-r-lg bg-gray-700/30 backdrop-blur-sm  flex flex-col justify-center items-center w-32`}>
                                        <Image
                                            src={bet.matchId.team1Id.teamImage}
                                            alt={""}
                                            width={40}
                                            height={40}
                                            className="h-10 w-10 rounded-full"
                                        />
                                        <p className="font-extrabold text-lg text-nowrap">
                                            {bet.matchId.team1Id.teamName}
                                        </p>
                                    </div>

                                </div>
                                <p className="text-gray-500 text-xs self-center">VS</p>
                                <div className="flex flex-row">
                                    <div className={`px-6 border ${session?.user?.id ===
                                        (bet.matchId.team2Id._id === bet.founderTeamId
                                            ? bet.founderId._id
                                            : bet.opponentId?._id)
                                        ? "border-blue-700"
                                        : "border-gray-700"
                                        } border-r-0 rounded-l-lg bg-gray-700/30 backdrop-blur-sm  flex flex-col justify-center items-center w-32`}>
                                        <Image
                                            src={bet.matchId.team2Id.teamImage}
                                            alt={""}
                                            width={40}
                                            height={40}
                                            className="h-10 w-10 rounded-full"
                                        />
                                        <p className="font-extrabold text-lg text-nowrap">
                                            {bet.matchId.team2Id.teamName}
                                        </p>
                                    </div>
                                    <div
                                        className={`flex flex-col justify-center items-center border ${session?.user?.id ===
                                            (bet.matchId.team2Id._id === bet.founderTeamId
                                                ? bet.founderId._id
                                                : bet.opponentId?._id)
                                            ? "border-blue-700"
                                            : "border-gray-700"
                                            } p-3 py-1 rounded-r-lg`}
                                    >
                                        <Image
                                            src={
                                                bet.matchId.team2Id._id === bet.founderTeamId
                                                    ? bet.founderId.image
                                                    : bet.opponentId?.image
                                                        ? bet.opponentId?.image
                                                        : "/green.png"
                                            }
                                            alt={""}
                                            width={40}
                                            height={40}
                                            className="h-7 w-7 rounded-full"
                                        />
                                        <p className=" font-bold text-gray-500 text-xs">
                                            {
                                                bet.matchId.team2Id._id === bet.founderTeamId
                                                    ? bet.founderId.username
                                                    : bet.opponentId?.username
                                                        ? bet.opponentId?.username
                                                        : "/user"
                                            }
                                        </p>
                                        <p className=" font-bold">
                                        ${
                                                bet.matchId.team2Id._id === bet.founderTeamId
                                                    ? bet.stake.toString()
                                                    : bet.opponentId?._id
                                                        ? bet.stake.toString()
                                                        : "--"
                                            }
                                        </p>

                                    </div>


                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex flex-row">
                            <div className={`p-4 rounded-bl-md text-white bg-gradient-to-r ${getStatusClass(bet.betstatus)} to-blue-700/0 flex flex-row space-x-2 w-1/2`}>
                                <FaForward className={`${getStatusForward(bet.betstatus)}p-1 w-5 h-5 rounded-md`} />
                                <span className={`text-sm font-semibold ${getStatusDateClass(bet.betstatus)}`}>
                                    {bet.betstatus === "ongoing" ? bet.matchId.matchDate : bet.betstatus.toString().toUpperCase()}
                                </span>
                            </div>
                            <div className="flex flex-row items-center justify-between w-1/2 pr-3">
                                <button onClick={() => toggleDetails(bet._id)}>
                                    {expandedId === bet._id ? <ChevronUp /> : <ChevronDown />}
                                </button>
                                {bet.betstatus === "won" ? (
                                    <button className=" bg-green-600 py-1 p-4 rounded-lg bg-gradient-to-r from-green-800 via-green-500/40 to-green-800 hover:bg-opacity-50 "
                                    >
                                        Claim
                                    </button>
                                ) : (
                                    <div></div>
                                )}
                            </div>

                        </div>
                    </div>
                ))
            }

        </div>
    );
}