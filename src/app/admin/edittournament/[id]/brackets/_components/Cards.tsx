import { HiPencil } from "react-icons/hi2";
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ElementRef, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
interface TCardProps {
    tournamentId: string;
    team?: {
        teamId?: {
            teamName?: string;
            teamImage?: string;
        }
        score?: number;
        _id: string
    };
    allteams: any[];
}

export default function TCard({ tournamentId, team, allteams }: TCardProps) {


    const closeRef = useRef<ElementRef<"button">>(null);
    const [selectTeam, setSelectTeam] = useState("");
    const [teamscore, setTeamScore] = useState(0);
    const router = useRouter();

    function showErrorToast(message: string): void {
        toast({
            variant: "destructive",
            title: message,
            description: "",
        })
    }

    function showToast(message: string): void {
        toast({
            variant: "default",
            title: message,
            description: "",
        })
    }

    const addTeamBracket = async () => {
        try {
            const response = await axios.post('/api/tournament/bracket/updateBracket', {
                bracketTeamId: team?._id,
                teamId: selectTeam,
                score: teamscore
            });
            showToast("Update bracket successfully")
            router.refresh();
            closeRef?.current?.click();

        } catch (error) {
            showErrorToast("Error update bracket")
            console.error("Error update bracket:", error);
        }
    }

    return (
        <div className="h-16 w-32 bg-red-800 bg-opacity-50 border-2 border-red-800 backdrop-blur-sm rounded-sm relative with-connector grid grid-cols-3">

            <Dialog >
                <DialogTrigger asChild>
                    <button className="absolute top-0 left-0 z-50 bg-gray-800 bg-opacity-60 hover:bg-opacity-80 text-white p-1 rounded-full rounded-t-none rounded-l-none transition duration-300">
                        <HiPencil className="w-4 h-4" />
                    </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add Bracket Teams</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col justify-center items-center space-y-4">
                        <div className=" flex flex-row justify-between w-ful">
                            <div className="flex flex-row">
                                <p>TeamId:</p>
                                <p>{selectTeam}</p>
                            </div>

                        </div>
                        {allteams?.map((team: any, index) => (
                            <div key={index} className="p-3 rounded-md shadow-lg space-y-2 ">
                                <div className="flex flex-wrap items-center justify-between space-x-4 ">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-auto">
                                            <img src={team.teamImage} alt={team.teamName} className="w-12 h-12 rounded-full object-cover" />
                                        </div>
                                        <div className="w-auto">
                                            <h2 className="text-lg font-semibold text-coolGray-900">{team.teamName}</h2>
                                        </div>
                                    </div>
                                    <div className="w-auto">
                                        <Button
                                            variant="ghost"
                                            className='rounded-full w-10 h-10 p-0'
                                            onClick={() => setSelectTeam(team?._id)} >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                                <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                                            </svg>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <Label>Score</Label>
                        <Input
                            type="number"
                            onChange={(e) => setTeamScore(parseInt(e.target.value))}
                        />
                    </div>
                    <DialogFooter>
                        <div className="flex flex-row justify-between w-full">
                            <DialogClose ref={closeRef}>
                                <Button variant="ghost" >
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button onClick={addTeamBracket}  >
                                Add
                            </Button>
                        </div>
                    </DialogFooter>

                </DialogContent>
            </Dialog>
            <div className="col-span-2 flex flex-col items-center justify-center">
                <img
                    src={team?.teamId?.teamImage || "/defaultteam.png"}
                    alt={team?.teamId?.teamImage || "No Team"}
                    width={42}
                />
                <p className="text-xs font-bold">{team?.teamId?.teamName || "No Team"}</p>
            </div>
            <div className="col-span-1 border-l-2 border-gray-800 flex items-center justify-center">
                <p className="text-3xl font-bold">{team?.score !== undefined ? team.score : "-"}</p>
            </div>
        </div>
    )
}
