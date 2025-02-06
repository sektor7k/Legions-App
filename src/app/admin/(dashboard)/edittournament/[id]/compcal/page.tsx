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
import { Pencil, Play } from "lucide-react"
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
import ErrorAnimation from "@/components/errorAnimation";
import LoadingAnimation from "@/components/loadingAnimation";

interface Team {
    _id: string
    teamName: string
    teamImage: string
}

interface Match {
    _id: string
    team1Id: Team
    team2Id: Team
    matchDate: string
    matchTime: string
    status: "incoming" | "ongoing" | "played"
    team1Score?: string
    team2Score?: string
    winnerTeam?: string
}


const fetcherTeam = (url: string, params: any) => axios.post(url, params).then((res) => res.data)
const fetcher = (url: string, params: any) =>
    axios.post(url, params).then((res) => res.data)

// Tarih formatını "YYYY-MM-DD" formatına dönüştür
const convertDateToISO = (dateString: string) => {
    try {
        // `February 24th, 2025` gibi bir tarihi düzgün bir hale getir
        const cleanDateString = dateString.replace(/(\d+)(st|nd|rd|th)/, "$1"); // "24th" -> "24"

        const parts = cleanDateString.match(/([A-Za-z]+) (\d{1,2}), (\d{4})/);
        if (!parts) {
            console.error(`Geçersiz tarih formatı: ${dateString}`);
            return null;
        }

        const monthNames: { [key: string]: string } = {
            January: "01", February: "02", March: "03", April: "04",
            May: "05", June: "06", July: "07", August: "08",
            September: "09", October: "10", November: "11", December: "12"
        };

        const month = monthNames[parts[1]]; // "February" -> "02"
        const day = parts[2].padStart(2, "0"); // "9" -> "09"
        const year = parts[3];

        return `${year}-${month}-${day}`; // "YYYY-MM-DD"
    } catch (error) {
        console.error("Tarih dönüştürme hatası:", error);
        return null;
    }
};


// Maç tarihini Date objesine çevir
const parseMatchDate = (match: Match) => {
    const formattedDate = convertDateToISO(match.matchDate);
    if (!formattedDate) return new Date(); // Hata durumunda geçerli bir tarih döndür

    const formattedTime = match.matchTime.replace(/^(\d{2})(\d{2})$/, "$1:$2");

    return new Date(`${formattedDate}T${formattedTime}:00`);
};

// Sıralama fonksiyonları
const sortAscending = (a: Match, b: Match) => {
    return parseMatchDate(a).getTime() - parseMatchDate(b).getTime();
}

const sortDescending = (a: Match, b: Match) => {
    return parseMatchDate(b).getTime() - parseMatchDate(a).getTime();
}
export default function CompcalPage({ params }: { params: { id: string } }) {

    const { data: matches, error, mutate } = useSWR<Match[]>(
        params.id ? ["/api/tournament/match/getMatch", { tournamentId: params.id }] : null,
        ([url, params]) => fetcher(url, params),
    )
    const { data: teams, error: teamsError } = useSWR(['/api/tournament/team/getTeam', { tournamentId: params.id }], ([url, params]) => fetcherTeam(url, params));


    const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([])
    const [playedMatches, setPlayedMatches] = useState<Match[]>([])
    const [team1, setTeam1] = useState("");
    const [team2, setTeam2] = useState("");

    const [date, setDate] = useState<Date | undefined>(new Date())
    const [time, setTime] = useState("")

    const [winnerTeam, setwinnerTeam] = useState("");

    const [team1Score, setTeam1Score] = useState("");
    const [team2Score, setTeam2Score] = useState("");


    const closeRef = useRef<ElementRef<"button">>(null);

    useEffect(() => {
        if (matches) {
            matches.forEach((match) => {
                console.log(
                    `Raw Date: ${match.matchDate}, Cleaned Date: ${convertDateToISO(match.matchDate)}, Raw Time: ${match.matchTime}, Parsed: ${parseMatchDate(match)}`
                );
            });

            const ongoing = matches.filter((m) => m.status === "ongoing").sort(sortAscending);
            const incoming = matches.filter((m) => m.status === "incoming").sort(sortAscending);
            const played = matches.filter((m) => m.status === "played").sort(sortDescending);

            setUpcomingMatches([...ongoing, ...incoming]);
            setPlayedMatches(played);
        }
    }, [matches]);

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
            const response = await axios.post('/api/admin/tournament/setWinnerMatch', { id, winnerTeam, team1Score, team2Score });
            showToast("Match set winner successfully");
            await mutate();
            closeRef?.current?.click();
        } catch (error) {
            showErrorToast("Error setWinner match");
            console.error("Error setWinner match:", error);
        }
    }

    const setStatusMatch = async (id: string, status: string) => {
        try {
            const response = await axios.post('/api/admin/tournament/setStatusMatch', { id, status });
            showToast("Match set status successfully");
            await mutate();
        } catch (error) {
            showErrorToast("Error set status match");
            console.error("Error set status match:", error);
        }
    }

    if (error) {
        return (
            <div className="flex h-screen justify-center items-center">
                <ErrorAnimation />
            </div>
        )
    }

    if (!matches) {
        return (
            <div className="flex h-screen justify-center items-center">
                <LoadingAnimation />
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
            <div className="flex flex-col justify-center items-center mb-8">
                <p className="text-3xl md:text-4xl font-extrabold border-gradient-bottom px-8 p-1">Compcal</p>
                <p className="text-gray-400 text-sm font-semibold text-center">
                    Check match dates and results in the tournament.
                </p>
            </div>
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

            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/2 space-y-4">
                    <h2 className="text-2xl font-bold text-center mb-4">Ongoing & Upcoming Matches</h2>
                    {upcomingMatches.map((match, index) => (
                        <div key={index} className="flex flex-row justify-between items-center bg-black bg-opacity-40 rounded-md min-h-20 backdrop-blur-sm p-4 px-2 transition-all duration-300 hover:scale-105">
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
                                            <Input onChange={(e) => setTeam1Score(e.target.value)} defaultValue={match.team1Score}/>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <img src={match.team2Id.teamImage} alt={match.team2Id.teamName} className="w-5 h-5 rounded-full" />
                                            <span>{match.team2Id.teamName} :</span>
                                            <Input onChange={(e) => setTeam2Score(e.target.value)} defaultValue={match.team2Score} />
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
                                            <Select onValueChange={(value) => setStatusMatch(match._id, value)}>
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
                                <img src={match.team1Id.teamImage || "/defaultteam.png"} className="w-12 h-12 md:w-16 md:h-16 rounded-full" />
                                <div className="font-bold text-center text-xs md:text-sm">{match.team1Id.teamName}</div>
                            </div>

                            <div className="flex flex-col justify-center items-center w-1/2">
                                {match.status === "ongoing" ? (
                                    <div className="flex items-center space-x-2 bg-blue-500 px-3 py-1 rounded-full">
                                        <Play size={16} />
                                        <span className="text-sm font-bold">Ongoing</span>
                                    </div>
                                ) : (
                                    <p className="text-xl md:text-3xl font-extrabold font-mono w-32 md:w-40 text-center">
                                        {`${match.matchTime.slice(0, 2)}:${match.matchTime.slice(2)}`}
                                    </p>
                                )}
                                <div className="font-bold pt-1 text-xs md:text-sm text-center">{match.matchDate}</div>
                            </div>

                            <div className="flex flex-col items-center justify-center w-1/4">
                                <img src={match.team2Id.teamImage || "/defaultteam.png"} className="w-12 h-12 md:w-16 md:h-16 rounded-full" />
                                <div className="font-bold text-center text-xs md:text-sm">{match.team2Id.teamName}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="w-full md:w-1/2 space-y-4">
                    <h2 className="text-2xl font-bold text-center mb-4">Completed Matches</h2>
                    {playedMatches.map((match, index) => (
                        <div key={index} className="flex flex-row justify-between items-center rounded-md p-4 overflow-hidden relative">
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
                                            <Input onChange={(e) => setTeam1Score(e.target.value)} defaultValue={match.team1Score}/>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <img src={match.team2Id.teamImage} alt={match.team2Id.teamName} className="w-5 h-5 rounded-full" />
                                            <span>{match.team2Id.teamName} :</span>
                                            <Input onChange={(e) => setTeam2Score(e.target.value)} defaultValue={match.team2Score}/>
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
                                            <Select onValueChange={(value) => setStatusMatch(match._id, value)}>
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
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50"></div>
                            <div
                                className={`absolute inset-y-0 left-0 w-1/2 ${match.team1Score === match.team2Score ? "bg-yellow-500" : match.winnerTeam === match.team1Id._id ? "bg-green-500" : "bg-red-500"} opacity-50`}
                                style={{ clipPath: "polygon(0 0, 100% 0, 80% 100%, 0% 100%)" }}
                            ></div>
                            <div
                                className={`absolute inset-y-0 right-0 w-1/2 ${match.team1Score === match.team2Score ? "bg-yellow-500" : match.winnerTeam === match.team2Id._id ? "bg-green-500" : "bg-red-500"} opacity-50`}
                                style={{ clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)" }}
                            ></div>

                            <div className="flex flex-col items-center w-1/4 z-10">
                                <img src={match.team1Id.teamImage || "/defaultteam.png"} className="w-12 h-12 md:w-16 md:h-16 rounded-full" />
                                <div className="font-bold text-center text-xs md:text-sm">{match.team1Id.teamName}</div>
                            </div>

                            <div className="flex flex-col items-center z-10">
                                <p className="text-2xl font-bold">
                                    {match.team1Score} - {match.team2Score}
                                </p>
                                <p className="text-sm">
                                    {match.matchDate} - {match.matchTime.slice(0, 2)}:{match.matchTime.slice(2)}
                                </p>
                            </div>

                            <div className="flex flex-col items-center w-1/4 z-10">
                                <img src={match.team2Id.teamImage || "/defaultteam.png"} className="w-12 h-12 md:w-16 md:h-16 rounded-full" />
                                <div className="font-bold text-center text-xs md:text-sm">{match.team2Id.teamName}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )

    return (
        <div className=" max-w-6xl mx-auto p-8 space-y-8 w-screen">
            <div className="flex flex-col justify-center items-center">
                <p className="text-4xl font-extrabold border-gradient-bottom px-8 p-1">Compcal</p>
                <p className="text-gray-400 text-sm font-semibold">Check match dates in the tournament.</p>
            </div>
            <div>

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
                                            <Input onChange={(e) => setTeam1Score(e.target.value)} />
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <img src={match.team2Id.teamImage} alt={match.team2Id.teamName} className="w-5 h-5 rounded-full" />
                                            <span>{match.team2Id.teamName} :</span>
                                            <Input onChange={(e) => setTeam2Score(e.target.value)} />
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
                                            <Select onValueChange={(value) => setStatusMatch(match._id, value)}>
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




