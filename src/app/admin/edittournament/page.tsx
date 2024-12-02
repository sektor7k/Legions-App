"use client"
import { useRouter } from "next/navigation";
import { CardDemo } from "./_components/Card";
import { useEffect, useState } from "react";
import axios from "axios";


export default function EditTournaments() {

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

    

    return (
        <div className="flex flex-col items-center justify-center mt-8 px-4 sm:px-6 lg:px-8 ">
            <div className="flex flex-col justify-center items-center">
                <p className="text-4xl font-extrabold border-gradient-bottom px-8 p-1">EDIT TOURNAMENTS</p>
                <p className="text-gray-400 text-sm font-semibold">View tournaments powered by Castrum Legions!</p>
            </div>
            <div className="w-full max-w-7xl mt-6 mx-4 lg:mx-8">
                <div className="bg-black p-4 bg-opacity-50 backdrop-blur-md border-gradient rounded-lg min-h-[calc(80vh-2rem)]">
                    <div className="overflow-y-auto max-h-[calc(80vh-5rem)] p-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {tournaments.map((tournament:any) => (
                                <div  key={tournament.id}>
                                    <CardDemo id={tournament._id} name={tournament.tname} thumbnail={tournament.thumbnail} thumbnailGif={tournament.thumbnailGif} organizer={tournament.organizer} organizerAvatar={tournament.organizerAvatar} participants={tournament.participants} capacity={tournament.capacity} date={tournament.starts} />

                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

