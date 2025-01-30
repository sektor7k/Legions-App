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
import { Pencil } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import axios from "axios"
import { ElementRef, useEffect, useRef, useState } from "react"
import { toast } from "@/components/ui/use-toast";
import useSWR from "swr";
import { Input } from "@/components/ui/input";

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
const fetcher = (url: string, params: any) =>
    axios.post(url, params).then(res =>
        res.data.sort((a: Match, b: Match) => {
            // Parse matchDate into a standard date format to ensure accurate sorting
            const parseDateTime = (date: string, time: string) => {
                const [month, day, year] = date.replace(/(st|nd|rd|th),/g, '').split(' ');
                const formattedDate = `${month} ${day}, ${year} ${time.slice(0, 2)}:${time.slice(2, 4)}`;
                return new Date(formattedDate);
            };

            const dateA = parseDateTime(a.matchDate, a.matchTime);
            const dateB = parseDateTime(b.matchDate, b.matchTime);
            return dateA.getTime() - dateB.getTime(); // Sort ascending by date and time
        })
    );

const fetcherTeam = (url: string, params: any) => axios.post(url, params).then((res) => res.data)

export default function CompcalPage({ params }: { params: { id: string } }) {

    const { data: matches = [], error, mutate } = useSWR<Match[]>(params.id ? ['/api/tournament/match/getMatch', { tournamentId: params.id }] : null, ([url, params]) => fetcher(url, params));
    const { data: teams, error: teamsError } = useSWR(['/api/tournament/team/getTeam', { tournamentId: params.id }], ([url, params]) => fetcherTeam(url, params));

    const [team1, setTeam1] = useState("");
    const [team2, setTeam2] = useState("");

    const [date, setDate] = useState<Date | undefined>(new Date())
    const [time, setTime] = useState("")

    const [winnerTeam, setwinnerTeam] = useState("");

    const [team1Score, setTeam1Score] = useState("");
    const [team2Score, setTeam2Score] = useState("");


    const closeRef = useRef<ElementRef<"button">>(null);



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
            const response = await axios.post('/api/admin/tournament/createMatch', {
                tournamentId: params.id,
                team1Id: team1,
                team2Id: team2,
                matchDate: dateStr,
                matchTime: time,
            });
            const newMatch = response.data.match;

            console.log(newMatch)
            showToast("Create Match successfully")
            await mutate();
            closeRef?.current?.click();

        } catch (error) {
            showErrorToast("Error Create Match")
            console.error("Error Create Match:", error);

        }
    }

    const deleteMatch = async (id: string) => {
        try {
            const response = axios.post('/api/admin/tournament/deleteMatch', { id });
            showToast("Delete Match successfully")
            await mutate();
            closeRef?.current?.click();

        } catch (error) {
            showErrorToast("Error delete Match")
            console.error("Error delete Match:", error);
        }
    }

    const editMatch = async (id: string) => {
        const dateStr: string | undefined = date ? format(date, "PPP") : undefined;

        try {
            const payload: any = {
                matchId: id,
            };

            if (team1) payload.team1Id = team1;
            if (team2) payload.team2Id = team2;
            if (dateStr) payload.matchDate = dateStr;
            if (time) payload.matchTime = time;

            const response = await axios.post('/api/admin/tournament/editMatch', payload);
            showToast("Match updated successfully");
            await mutate();
            closeRef?.current?.click();
        } catch (error) {
            showErrorToast("Error updating match");
            console.error("Error updating match:", error);
        }
    };

    const setWinnerMatch = async (id: string) => {
        try {
            const response = await axios.post('/api/admin/tournament/setWinnerMatch', { id, winnerTeam,team1Score, team2Score });
            showToast("Match set winner successfully");
            await mutate();
            closeRef?.current?.click();
        } catch (error) {
            showErrorToast("Error setWinner match");
            console.error("Error setWinner match:", error);
        }
    }

    const setStatusMatch = async(id:string, status:string)=>{
        try {
            const response = await axios.post('/api/admin/tournament/setStatusMatch', { id, status });
            showToast("Match set status successfully");
            await mutate();
        } catch (error) {
            showErrorToast("Error set status match");
            console.error("Error set status match:", error);
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
                    <DialogContent className="sm:max-w-[425px] bg-gray-950">
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
                                                {teams?.map((team: any, index: any) => (
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
                                                {teams?.map((team: any, index: any) => (
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

                            <div className=" flex items-center">

                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    className="rounded-md border "
                                />

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
                {matches?.map((match: any) => (
                    <div
                        key={match._id}
                        className="flex flex-row justify-between items-center bg-black rounded-md min-h-20 bg-opacity-40 backdrop-blur-sm p-4 px-0"
                    >
                        {/* Edit Match */}
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant={"destructive"} className="absolute top-2 right-2 z-50 bg-gray-800 bg-opacity-60 hover:bg-opacity-80 text-white  rounded-full transition duration-300">
                                    <Pencil className="w-5 h-5" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px] bg-gray-950">
                                <DialogHeader>
                                    <DialogTitle>Edit Compcal</DialogTitle>
                                </DialogHeader>
                                <Tabs defaultValue="info" className="w-[400px]">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="info">Compcal Info</TabsTrigger>
                                        <TabsTrigger value="status">Status</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="info" className="w-full space-y-5">
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
                                                                {teams?.map((team: any, index: any) => (
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
                                                                {teams?.map((team: any, index: any) => (
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
                                            <div className="flex items-center">

                                                <Calendar
                                                    mode="single"
                                                    selected={date}
                                                    onSelect={setDate}
                                                    className="rounded-md border"
                                                />
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
                                                <Button onClick={() => deleteMatch(match._id)} variant={"destructive"}>Delete</Button>
                                                <Button onClick={() => editMatch(match._id)} type="submit">Save changes</Button>

                                            </div>
                                        </DialogFooter>
                                    </TabsContent>
                                    <TabsContent value="status" className="w-full space-y-5">
                                        <div className="flex items-center space-x-2">
                                            <img src={match.team1Id.teamImage} alt={match.team1Id.teamName} className="w-5 h-5 rounded-full" />
                                            <span>{match.team1Id.teamName} :</span>
                                            <Input onChange={(e)=>setTeam1Score(e.target.value)}/>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <img src={match.team2Id.teamImage} alt={match.team2Id.teamName} className="w-5 h-5 rounded-full" />
                                            <span>{match.team2Id.teamName} :</span>
                                            <Input onChange={(e)=>setTeam2Score(e.target.value)}/>
                                        </div>
                                        <div className="flex flex-row justify-center items-center  space-x-4">
                                            <div className="text-nowrap">
                                                Select Winner:
                                            </div>
                                            <Select onValueChange={(value) => { setwinnerTeam(value) }}>
                                                <SelectTrigger className="w-full bg-bg-auth">
                                                    <SelectValue placeholder="Select Team" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-bg-auth">
                                                    <SelectGroup>
                                                        <SelectLabel>Teams</SelectLabel>
                                                        <SelectItem value={match.team1Id._id}>
                                                            <div className="flex items-center space-x-2">
                                                                <img src={match.team1Id.teamImage} alt={match.team1Id.teamName} className="w-5 h-5 rounded-full" />
                                                                <span>{match.team1Id.teamName}</span>
                                                            </div>
                                                        </SelectItem>
                                                        <SelectItem value={match.team2Id._id}>
                                                            <div className="flex items-center space-x-2">
                                                                <img src={match.team2Id.teamImage} alt={match.team2Id.teamName} className="w-5 h-5 rounded-full" />
                                                                <span>{match.team2Id.teamName}</span>
                                                            </div>
                                                        </SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>

                                        </div>
                                        <div className="flex flex-row justify-center items-center  space-x-4">
                                            <div className="text-nowrap">
                                                Match Status:
                                            </div>
                                            <Select onValueChange={(value) => setStatusMatch(match._id,value)}>
                                                <SelectTrigger className="w-full bg-bg-auth">
                                                    <SelectValue placeholder="Select Status" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-bg-auth">
                                                    <SelectGroup>
                                                        <SelectLabel>Status</SelectLabel>
                                                        <SelectItem value={"incoming"}>
                                                            <p>Incoming</p>
                                                        </SelectItem>
                                                        <SelectItem value={"ongoing"}>
                                                            <p>Ongoing</p>
                                                        </SelectItem>
                                                        <SelectItem value={"played"}>
                                                            <p>Played</p>
                                                        </SelectItem>
                                                        
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>

                                        </div>
                                        <DialogFooter>
                                            <div className="flex justify-between w-full ">
                                                <DialogClose ref={closeRef} asChild>
                                                    <Button type="button" variant={"ghost"}>
                                                        Cancel
                                                    </Button>
                                                </DialogClose>
                                                <Button onClick={() => setWinnerMatch(match._id)} className="bg-green-600">Save Winner</Button>

                                            </div>
                                        </DialogFooter>
                                    </TabsContent>
                                </Tabs>


                            </DialogContent>
                        </Dialog>

                        <div className="flex flex-col items-center justify-center w-1/4">
                            <img
                                src={match.team1Id.teamImage || "/defaultteam.png"}
                                alt={match.team1Id.teamName}
                                className="w-16 h-16 rounded-full"
                            />
                            <div className="font-bold text-center">{match.team1Id.teamName || "Team"}</div>
                        </div>


                        <div className="flex flex-col justify-center items-center w-1/2">
                            <p className="text-3xl font-extrabold font-mono border-gradient-bottom w-40 text-center">
                                {`${match.matchTime.slice(0, 2)}:${match.matchTime.slice(2)}`}
                            </p>
                            <div className="font-bold pt-1 text-sm text-center w-full">
                                {match.matchDate}
                            </div>
                        </div>


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