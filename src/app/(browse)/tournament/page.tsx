"use client"
import { CardDemo } from "./_components/Card";
import axios from "axios";
import { useRouter } from "next/navigation";
import useSWR from "swr";

interface TournamentsProps {
    _id: string
    name: string;
    thumbnail: string;
    thumbnailGif: string;
    organizer: string;
    organizerAvatar: string;
    participants: number;
    capacity: number;
    date: string;
}
const fetcher = (url: string) => axios.get(url).then(res => res.data.tournaments);

export default function Tournaments() {

    const { data: tournaments = [], error } = useSWR<TournamentsProps[]>('/api/tournament/getAllTournament', fetcher);

    const router = useRouter();

    if (error) return <div>Failed to load tournaments</div>;
    if (!tournaments) return <div>Loading...</div>;
    return (
        <div className="flex flex-col items-center justify-center mt-8 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-center items-center">
                <p className="text-4xl font-extrabold border-gradient-bottom px-8 p-1">TOURNAMENTS</p>
                <p className="text-gray-400 text-sm font-semibold">View tournaments powered by Castrum Legions!</p>
            </div>
            <div className="w-full max-w-7xl mt-6 mx-4 lg:mx-8">
                <div className="bg-black p-4 bg-opacity-50 backdrop-blur-md border-gradient rounded-lg min-h-[calc(80vh-2rem)]">
                    <div className="overflow-y-auto max-h-[calc(80vh-5rem)] p-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {tournaments.map((tournament:any) => (
                                <button onClick={()=>router.push(`/t/${tournament._id}`)} key={tournament._id}>
                                    <CardDemo name={tournament.tname} thumbnail={tournament.thumbnail} thumbnailGif={tournament.thumbnailGif} organizer={tournament.organizer} organizerAvatar={tournament.organizerAvatar} participants={tournament.participants} capacity={tournament.capacity} date={tournament.starts} />

                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

