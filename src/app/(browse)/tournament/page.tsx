"use client"
import { useRouter } from "next/navigation";
import { CardDemo } from "./_components/Card";
import { useEffect, useState } from "react";
import axios from "axios";


export default function Tournaments() {

    const router = useRouter()

    const [tournaments, setTournaments] = useState([]);

    useEffect(() => {
      const fetchTournaments = async () => {
        try {
          const response = await axios.get("/api/tournament/getAllTournament");
          console.log(response)
          setTournaments(response.data.tournaments);
        } catch (error) {
          console.error("Failed to fetch tournaments:", error);
        }
      };
  
      fetchTournaments();
    }, []);

    // const tournaments = [
    //     {
    //         id: 1,
    //         name: "Counter Strike 2 Cup #1",
    //         thumbnail: "https://i.ibb.co/z70Q72C/csbg.jpg",
    //         thumbnailGif: "https://i.ibb.co/BLjbB8w/csHover.gif",
    //         organizer: "Counter Strike",
    //         organizerAvatar: "https://i.ibb.co/YTHNh27/csAvatar.jpg",
    //         participants: 50,
    //         capacity: 64,
    //         date: "2024-08-10T18:00:00Z"


    //     },
    //     {
    //         id: 2,
    //         name: "Castrum x Valorant Cup #1",
    //         thumbnail: "https://i.ibb.co/DM0fs9S/valobg.jpg",
    //         thumbnailGif: "https://i.ibb.co/nMz84jn/valo-Hover.gif",
    //         organizer: "Valorant",
    //         organizerAvatar: "https://i.ibb.co/bLDkjXJ/valo-Avatar.png",
    //         participants: 50,
    //         capacity: 64,
    //         date: "2024-08-10T18:00:00Z"


    //     },
    //     {
    //         id: 3,
    //         name: "Castrum x The Finals #1",
    //         thumbnail: "https://i.ibb.co/tCwYyrG/finalsbg.jpg",
    //         thumbnailGif: "https://i.ibb.co/HLZ38Cv/finals-Hover.gif",
    //         organizer: "The Finals",
    //         organizerAvatar: "https://i.ibb.co/Kys9pGZ/finals-Avatar.jpg",
    //         participants: 50,
    //         capacity: 64,
    //         date: "2024-08-10T18:00:00Z"


    //     },
    //     {
    //         id: 4,
    //         name: "Castrum x Pubg #1",
    //         thumbnail: "https://i.ibb.co/cx8tDGj/img-og-pubg.jpg",
    //         thumbnailGif: "https://i.ibb.co/ZcHbTZ1/giphy.gif",
    //         organizer: "Pubg",
    //         organizerAvatar: "https://i.ibb.co/Hd5Bd1p/1r-LKCN21-400x400.jpg",
    //         participants: 50,
    //         capacity: 64,
    //         date: "2024-08-10T18:00:00Z"


    //     },
    //     {
    //         id: 5,
    //         name: "Castrum x Pubg #1",
    //         thumbnail: "https://i.ibb.co/cx8tDGj/img-og-pubg.jpg",
    //         thumbnailGif: "https://i.ibb.co/ZcHbTZ1/giphy.gif",
    //         organizer: "Pubg",
    //         organizerAvatar: "https://i.ibb.co/Hd5Bd1p/1r-LKCN21-400x400.jpg",
    //         participants: 50,
    //         capacity: 64,
    //         date: "2024-08-10T18:00:00Z"


    //     },
    //     {
    //         id: 6,
    //         name: "Castrum x The Finals #1",
    //         thumbnail: "https://i.ibb.co/tCwYyrG/finalsbg.jpg",
    //         thumbnailGif: "https://i.ibb.co/HLZ38Cv/finals-Hover.gif",
    //         organizer: "The Finals",
    //         organizerAvatar: "https://i.ibb.co/Kys9pGZ/finals-Avatar.jpg",
    //         participants: 50,
    //         capacity: 64,
    //         date: "2024-08-10T18:00:00Z"


    //     },
    //     {
    //         id: 7,
    //         name: "Castrum x Valorant Cup #1",
    //         thumbnail: "https://i.ibb.co/DM0fs9S/valobg.jpg",
    //         thumbnailGif: "https://i.ibb.co/nMz84jn/valo-Hover.gif",
    //         organizer: "Valorant",
    //         organizerAvatar: "https://i.ibb.co/bLDkjXJ/valo-Avatar.png",
    //         participants: 50,
    //         capacity: 64,
    //         date: "2024-08-10T18:00:00Z"


    //     },
    //     {
    //         id: 8,
    //         name: "Counter Strike 2 Cup #1",
    //         thumbnail: "https://i.ibb.co/z70Q72C/csbg.jpg",
    //         thumbnailGif: "https://i.ibb.co/BLjbB8w/csHover.gif",
    //         organizer: "Counter Strike",
    //         organizerAvatar: "https://i.ibb.co/YTHNh27/csAvatar.jpg",
    //         participants: 50,
    //         capacity: 64,
    //         date: "2024-08-10T18:00:00Z"


    //     },
    //     {
    //         id: 9,
    //         name: "Castrum x Valorant Cup #1",
    //         thumbnail: "https://i.ibb.co/DM0fs9S/valobg.jpg",
    //         thumbnailGif: "https://i.ibb.co/nMz84jn/valo-Hover.gif",
    //         organizer: "Valorant",
    //         organizerAvatar: "https://i.ibb.co/bLDkjXJ/valo-Avatar.png",
    //         participants: 50,
    //         capacity: 64,
    //         date: "2024-08-10T18:00:00Z"


    //     },
    //     {
    //         id: 10,
    //         name: "Counter Strike 2 Cup #1",
    //         thumbnail: "https://i.ibb.co/z70Q72C/csbg.jpg",
    //         thumbnailGif: "https://i.ibb.co/BLjbB8w/csHover.gif",
    //         organizer: "Counter Strike",
    //         organizerAvatar: "https://i.ibb.co/YTHNh27/csAvatar.jpg",
    //         participants: 50,
    //         capacity: 64,
    //         date: "2024-08-10T18:00:00Z"


    //     },

    // ];



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
                                <button onClick={()=>router.push(`/t/${tournament._id}`)} key={tournament.id}>
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

