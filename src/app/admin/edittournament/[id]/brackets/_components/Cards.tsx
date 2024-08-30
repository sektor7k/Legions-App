import { HiPencil } from "react-icons/hi2";
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
interface TCardProps {
    team?: {
        teamName?: string;
        teamImage?: string;
        score?: number;
        _id:string
    };
}

export default function TCard({ team }: TCardProps) {
    return (
        <div className="h-16 w-32 bg-red-800 bg-opacity-50 border-2 border-red-800 backdrop-blur-sm rounded-sm relative with-connector grid grid-cols-3">
            <Dialog>
                <DialogTrigger asChild>
                    <button className="absolute top-0 left-0 z-50 bg-gray-800 bg-opacity-60 hover:bg-opacity-80 text-white p-1 rounded-full rounded-t-none rounded-l-none transition duration-300">
                        <HiPencil className="w-4 h-4" />
                    </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        
                    </div>
                    <DialogFooter>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <div className="col-span-2 flex flex-col items-center justify-center">
                <img
                    src={team?.teamImage || "/defaultteam.png"}
                    alt={team?.teamName || "No Team"}
                    width={42}
                />
                <p className="text-xs font-bold">{team?.teamName || "No Team"}</p>
            </div>
            <div className="col-span-1 border-l-2 border-gray-800 flex items-center justify-center">
                <p className="text-3xl font-bold">{team?.score !== undefined ? team.score : "-"}</p>
            </div>
        </div>
    )
}
