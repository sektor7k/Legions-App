"use client"
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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import axios from "axios"
import { ElementRef, useEffect, useRef, useState } from "react"
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { MdDelete } from "react-icons/md";

interface Team {
    teamName: string;
    teamImage: string;
}

interface Match {
    _id: string;
    team1Id: Team;
    team2Id: Team;
    matchDate: string;
    matchTime: string;
}

export default function CompcalPage({ params }: { params: { id: string } }) {

    const [teams, setTeams] = useState([]);
    const [team1, setTeam1] = useState("");
    const [team2, setTeam2] = useState("");

    const [date, setDate] = useState<Date | undefined>(new Date())
    const [time, setTime] = useState("")

    const closeRef = useRef<ElementRef<"button">>(null);
    const router = useRouter();

    const [matches, setMatches] = useState<Match[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [teamsResponse, matchResponse] = await Promise.all([
                    axios.post('/api/tournament/getTeam', { tournamentId: params.id }),
                    axios.post('/api/tournament/match/getMatch', { tournamentId: params.id })
                ]);

                setTeams(teamsResponse.data);
                setMatches(matchResponse.data.data);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [params.id]);


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

    const addMatch = async () => {
        if (!params.id || !team1 || !team2 || !date || !time) {
            showErrorToast("Please fill in all fields.");
            return;
        }
        let dateStr: string | Date | undefined = format(date, "PPP")
        try {
            const response = await axios.post('/api/tournament/match/createMatch', {
                tournamentId: params.id,
                team1Id: team1,
                team2Id: team2,
                matchDate: dateStr,
                matchTime: time,
            });
            const newMatch = response.data.match;

            console.log(newMatch)
            setMatches((prevMatches) => [...prevMatches, newMatch]);
            showToast("Create Match successfully")
            router.refresh();
            closeRef?.current?.click();

        } catch (error) {
            showErrorToast("Error Create Match")
            console.error("Error Create Match:", error);

        }
    }

    const deleteMatch = async (id: string) => {
        try {
            const response = axios.post('/api/tournament/match/deleteMatch', { id });
            setMatches((prevMatches) => prevMatches.filter((match) => match._id !== id));
            showToast("Delete Match successfully")
            router.refresh();
        } catch (error) {
            showErrorToast("Error delete Match")
            console.error("Error delete Match:", error);
        }
    }

    return (
        <div className=" max-w-6xl mx-auto p-8 space-y-8 w-screen">
            <div className="flex flex-col justify-center items-center">
                <p className="text-4xl font-extrabold border-gradient-bottom px-8 p-1">Compcal</p>
                <p className="text-gray-400 text-sm font-semibold">Check match dates in the tournament.</p>
            </div>
            <div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="default">Add Match</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add Match</DialogTitle>
                        </DialogHeader>

                        <div className="flex flex-col space-y-4">
                            <div className="flex flex-row justify-center items-center space-x-4">
                                <div className="w-full">
                                    <Select onValueChange={(value) => { setTeam1(value) }}>
                                        <SelectTrigger className="w-full bg-bg-auth">
                                            <SelectValue placeholder="Select Team" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-bg-auth">
                                            <SelectGroup>
                                                <SelectLabel>Teams</SelectLabel>
                                                {teams?.map((team: any, index) => (
                                                    <SelectItem key={index} value={team._id}>
                                                        <div className="flex items-center space-x-2">
                                                            <img src={team.teamImage} alt={team.teamName} className="w-5 h-5 rounded-full" />
                                                            <span>{team.teamName}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="w-full">
                                    <Select onValueChange={(value) => { setTeam2(value) }}>
                                        <SelectTrigger className="w-full bg-bg-auth">
                                            <SelectValue placeholder="Select Team" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-bg-auth">
                                            <SelectGroup>
                                                <SelectLabel>Teams</SelectLabel>
                                                {teams?.map((team: any, index) => (
                                                    <SelectItem key={index} value={team._id}>
                                                        <div className="flex items-center space-x-2">
                                                            <img src={team.teamImage} alt={team.teamName} className="w-5 h-5 rounded-full" />
                                                            <span>{team.teamName}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div >
                                <Popover>
                                    <PopoverTrigger asChild>

                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[240px] pl-3 text-left font-normal bg-bg-auth",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            {date ? (
                                                format(date, "PPP")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}

                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>

                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 bg-bg-auth" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            className="rounded-md border bg-bg-auth"
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div>
                                <InputOTP maxLength={4} value={time}
                                    onChange={(value) => setTime(value)}>
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                    </InputOTPGroup>
                                    <InputOTPSeparator />
                                    <InputOTPGroup>
                                        <InputOTPSlot index={2} />
                                        <InputOTPSlot index={3} />
                                    </InputOTPGroup>
                                </InputOTP>
                            </div>

                        </div>

                        <DialogFooter>
                            <div className="flex justify-between w-full ">
                                <DialogClose ref={closeRef} asChild>
                                    <Button type="button" variant={"ghost"}>
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button onClick={addMatch} type="submit">Save changes</Button>
                            </div>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="space-y-6">
                {matches.map((match, index) => (
                    <div
                        key={index}
                        className="flex flex-row justify-between items-center bg-black rounded-md min-h-20 bg-opacity-40 backdrop-blur-sm p-4 px-0"
                    >
                        <Button onClick={() => deleteMatch(match._id)} variant={"destructive"} className="absolute top-2 right-2 z-50 bg-gray-800 bg-opacity-60 hover:bg-opacity-80 text-white p-2 rounded-full transition duration-300">
                            <MdDelete className="w-5 h-5" />
                        </Button>
                        {/* Team 1 */}
                        <div className="flex flex-col items-center justify-center w-1/4">
                            <img
                                src={match.team1Id.teamImage || "/defaultteam.png"}
                                alt={match.team1Id.teamName}
                                className="w-16 h-16 rounded-full"
                            />
                            <div className="font-bold text-center">{match.team1Id.teamName || "Team"}</div>
                        </div>

                        {/* Match Time and Date */}
                        <div className="flex flex-col justify-center items-center w-1/2">
                            <p className="text-3xl font-extrabold font-mono border-gradient-bottom w-40 text-center">
                                {`${match.matchTime.slice(0, 2)}:${match.matchTime.slice(2)}`}
                            </p>
                            <div className="font-bold pt-1 text-sm text-center w-full">
                                {match.matchDate}
                            </div>
                        </div>

                        {/* Team 2 */}
                        <div className="flex flex-col items-center justify-center w-1/4">
                            <img
                                src={match.team2Id.teamImage || "/defaultteam.png"}
                                alt={match.team2Id.teamName}
                                className="w-16 h-16 rounded-full"
                            />
                            <div className="font-bold text-center">{match.team2Id.teamName || "Team"}</div>
                        </div>
                    </div>
                ))}
            </div>

        </div>

    )
}