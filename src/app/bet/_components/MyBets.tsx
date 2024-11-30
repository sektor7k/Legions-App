import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { FaForward } from "react-icons/fa6";
import { useState } from "react";

export default function MyBets() {
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const toggleDetails = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const bets = [
        {
            id: 1,
            game: "Valorant",
            event: "Castrum X Valorant Cup 1",
            reward: "$40",
            date: "November 21st, 2024",
            betstatus: "ongoing",
            avatar: "https://utfs.io/f/9cbfacf8-1c8f-403c-887a-ef975a277763-1yxrb.png",
            teamA: {
                name: "Cookie3",
                avatar: "https://utfs.io/f/1f2352f6-a562-438f-9b36-8fe0278f97e5-bjb48d.jpg",
                player: { username: "sektor7k", avatar: "https://utfs.io/f/82168ae8-54cd-41c5-bf38-b7aefb6abec2-22uz0h.png", stake: "$30" },
            },
            teamB: {
                name: "OT Team",
                avatar: "https://utfs.io/f/ad1e0468-8d3e-4de6-8610-8b48f15bd78c-fq7esz.webp",
                player: { username: "sabitcan", avatar: "https://utfs.io/f/a871e06a-5b0d-422f-89a8-46e85f63f534-d6ph0f.41.42.png", stake: "$30" },
            },
        },
        {
            id: 2,
            game: "Counter Strike",
            event: "Conter Strike 2.0",
            reward: "$100",
            date: "November 21st, 2024",
            betstatus: "won",
            avatar: "https://utfs.io/f/ea1cf575-d555-4cd8-9a84-8bcbb18a9f99-s1tm21.jpg",
            teamA: {
                name: "Castrum",
                avatar: "https://utfs.io/f/61058261-496f-493e-8b08-e8bc36354b07-2drm.jpg",
                player: { username: "sektor7k", avatar: "https://utfs.io/f/82168ae8-54cd-41c5-bf38-b7aefb6abec2-22uz0h.png", stake: "$30" },
            },
            teamB: {
                name: "CBU Team",
                avatar: "https://utfs.io/f/cc031436-7333-4346-8688-37dd5fb7ac31-1zbfv.jpg",
                player: { username: "sabitcan", avatar: "https://utfs.io/f/a871e06a-5b0d-422f-89a8-46e85f63f534-d6ph0f.41.42.png", stake: "$30" },
            },
        },
        {
            id: 3,
            game: "Valorant",
            event: "Castrum X Valorant Cup 1",
            reward: "$152",
            date: "November 21st, 2024",
            betstatus: "lost",
            avatar: "https://utfs.io/f/9cbfacf8-1c8f-403c-887a-ef975a277763-1yxrb.png",
            teamA: {
                name: "Cookie3",
                avatar: "https://utfs.io/f/1f2352f6-a562-438f-9b36-8fe0278f97e5-bjb48d.jpg",
                player: { username: "sektor7k", avatar: "https://utfs.io/f/82168ae8-54cd-41c5-bf38-b7aefb6abec2-22uz0h.png", stake: "$30" },
            },
            teamB: {
                name: "OT Team",
                avatar: "https://utfs.io/f/ad1e0468-8d3e-4de6-8610-8b48f15bd78c-fq7esz.webp",
                player: { username: "sabitcan", avatar: "https://utfs.io/f/a871e06a-5b0d-422f-89a8-46e85f63f534-d6ph0f.41.42.png", stake: "$30" },
            },
        },
    ];

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
        <div className="flex flex-col justify-center space-y-4">
            {/* Bet Block */}
            {
                bets.map((bet) => (
                    <div key={bet.id} className="flex flex-col bg-gray-900 rounded-lg overflow-hidden transition-all duration-500">
                        {/* Header */}
                        <div className="flex flex-row justify-between">
                            <div className="flex flex-row p-4 items-center space-x-2 pb-0">
                                <Image
                                    src={bet.avatar}
                                    alt={""}
                                    width={40}
                                    height={40}
                                    className="h-5 w-5 rounded-full"
                                />
                                <p className="font-bold text-xs text-gray-500">
                                    {bet.game}
                                    <br />
                                    {bet.event}
                                </p>
                            </div>
                            <div className="bg-gray-700/50 p-4 rounded-tr-lg flex flex-col justify-center items-center py-1">
                                <p className="text-blue-700 font-bold text-sm">REWARD</p>
                                <p className="font-bold text-lg">{bet.reward}</p>
                            </div>
                        </div>

                        {/* Collapsible Details */}
                        <div
                            className={`transition-max-height duration-500 ease-in-out overflow-hidden ${expandedId === bet.id ? "max-h-40" : "max-h-0"
                                }`}
                        >
                            <div className="flex flex-row justify-between bg-gray-900 p-4">
                                <div className="flex flex-row">
                                    <div className="flex flex-col justify-center items-center border border-blue-700 p-3 py-1 rounded-l-lg">
                                        <Image
                                            src={bet.teamA.player.avatar}
                                            alt={""}
                                            width={40}
                                            height={40}
                                            className="h-7 w-7 rounded-full"
                                        />
                                        <p className=" font-bold text-gray-500 text-xs">
                                            {bet.teamA.player.username}
                                        </p>
                                        <p className=" font-bold">
                                            {bet.teamA.player.stake}
                                        </p>

                                    </div>
                                    <div className="px-6 border border-blue-700 border-l-0 rounded-r-lg bg-gray-700/30 backdrop-blur-sm  flex flex-col justify-center items-center w-32">
                                        <Image
                                            src={bet.teamA.avatar}
                                            alt={""}
                                            width={40}
                                            height={40}
                                            className="h-10 w-10 rounded-full"
                                        />
                                        <p className="font-extrabold text-lg text-nowrap">
                                            {bet.teamA.name}
                                        </p>
                                    </div>

                                </div>
                                <p className="text-gray-500 text-xs self-center">VS</p>
                                <div className="flex flex-row">
                                    <div className="px-6 border border-gray-700 border-r-0 rounded-l-lg bg-gray-700/30 backdrop-blur-sm  flex flex-col justify-center items-center w-32">
                                        <Image
                                            src={bet.teamB.avatar}
                                            alt={""}
                                            width={40}
                                            height={40}
                                            className="h-10 w-10 rounded-full"
                                        />
                                        <p className="font-extrabold text-lg text-nowrap">
                                            {bet.teamB.name}
                                        </p>
                                    </div>
                                    <div className="flex flex-col justify-center items-center border border-gray-700 p-3 py-1 rounded-r-lg">
                                        <Image
                                            src={bet.teamB.player.avatar}
                                            alt={""}
                                            width={40}
                                            height={40}
                                            className="h-7 w-7 rounded-full"
                                        />
                                        <p className=" font-bold text-gray-500 text-xs">
                                            {bet.teamB.player.username}
                                        </p>
                                        <p className=" font-bold">
                                            {bet.teamB.player.stake}
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
                                    {bet.betstatus === "ongoing" ? bet.date : bet.betstatus.toString().toUpperCase()}
                                </span>
                            </div>
                            <div className="flex flex-row items-center justify-between w-1/2 pr-3">
                                <button onClick={() => toggleDetails(bet.id)}>
                                    {expandedId === bet.id ? <ChevronUp /> : <ChevronDown />}
                                </button>
                                {bet.betstatus === "won" ? (
                                    <button > Claim</button>
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
