"use client"
import { Button } from "@/components/ui/button"
import { CalendarIcon, Check } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation";
import Countdown from "./_components/Countdown";
import { parse, format } from 'date-fns';
import { HiPencil } from "react-icons/hi2";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
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
import { Calendar } from "@/components/ui/calendar"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UploadDropzone } from "@/utils/uploadthing";
import { ElementRef, useEffect, useRef, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import * as React from "react"
import { ChevronsUpDown } from "lucide-react"

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"

const frameworks = [
    {
        value: "Drafting",
        label: "Drafting",
    },
    {
        value: "Registration",
        label: "Registration",
    },
    {
        value: "checkin",
        label: "checkin",
    },
    {
        value: "live",
        label: "live",
    },
    {
        value: "Finished",
        label: "Finished",
    },
]

interface PrizePool {
    key: string;
    value: string;
}

export default function TournamentPage({ params }: { params: { id: string } }) {

    const [tournament, setTournament] = useState<any>(null);
    const closeRef = useRef<ElementRef<"button">>(null);
    const router = useRouter();
    const [startDateTime, setStartDateTime] = useState<Date | null>(null);
    const [tdescription, setDescription] = useState('');
    const [prizePool, setPrizePool] = useState<PrizePool[]>([{ key: "", value: "" }]);

    const [checkin, setCheckin] = useState<Date | undefined>(undefined);
    const [checkinTime, setCheckinTime] = useState("");
    const [starts, setStarts] = useState<Date | undefined>(undefined);
    const [startsTime, setStartsTime] = useState("");
    const [ends, setEnds] = useState<Date | undefined>(undefined);
    const [endsTime, setEndsTime] = useState("");

    const [teamsize, setTeamsize] = useState('');
    const [teamcount, setTeamcount] = useState('');
    const [region, setRegion] = useState('');
    const [bracket, setBracket] = useState('');

    const [open, setOpen] = useState(false)
    const [currentphase, setValue] = useState("")


    useEffect(() => {
        // ID'yi URL'den al
        const fetchTournament = async () => {
            try {
                const res = await axios.post(`/api/tournament/getTournamentDetail`, { id: params.id });

                const formattedData = {
                    ...res.data,
                    checkinTime: formatTime(res.data.checkinTime),
                    startsTime: formatTime(res.data.startsTime),
                    endsTime: formatTime(res.data.endsTime),
                };
                console.log(res.data)
                setTournament(formattedData);
            } catch (error) {
                console.error('Error fetching tournament:', error);
            }
        };

        fetchTournament();
    }, [params.id]);

    function formatTime(timeString: string): string {
        if (timeString.length === 4) {
            const hours = timeString.slice(0, 2);
            const minutes = timeString.slice(2);
            return `${hours}:${minutes}`;
        }
        return timeString;
    }

    function removeOrdinalSuffix(dateStr: any) {
        return dateStr.replace(/(\d+)(st|nd|rd|th)/, '$1');
    }

    function getCombinedDate(startDate: string, startTime: string): Date {
        const dateFormat = 'MMMM d, yyyy'; // For example: August 23, 2024
        const timeFormat = 'HH:mm'; // For example: 14:30
        const combinedDateTimeFormat = `${dateFormat} ${timeFormat}`;

        // Remove ordinal suffix from the date
        const cleanDate = removeOrdinalSuffix(startDate);
        // Combine cleaned date and time into a single string
        const combinedDateTimeString = `${cleanDate} ${startTime}`;

        // Parse the combined date and time string
        const combinedDate = parse(combinedDateTimeString, combinedDateTimeFormat, new Date());

        // Check if the result is invalid
        if (isNaN(combinedDate.getTime())) {
            console.error('Invalid date:', combinedDateTimeString);
            return new Date(); // or handle the error as needed
        }

        return combinedDate;
    }

    useEffect(() => {
        if (tournament && tournament.starts) {
            const startDate = tournament.starts;
            const startTime = tournament.startsTime ?? '00:00'; // Varsayılan saat
            const combinedDateTime = getCombinedDate(startDate, startTime);
            setStartDateTime(combinedDateTime); // State güncelleme
        } else {
            console.error("tournament veya tournament.starts değeri mevcut değil.");
        }
    }, [tournament]);



    if (!tournament) return <div>Loading...</div>;


    // Edit Tournament

    function showErrorToast(message: string): void {
        toast({
            variant: "destructive",
            title: "Edit Username failed",
            description: message,
        })
    }

    function showToast(message: string): void {
        toast({
            variant: "default",
            title: "Social Handle Update",
            description: message,
        })
    }

    const editDescription = async () => {
        try {
            const response = await axios.post('/api/tournament/editDescription', { id: params.id, tdescription });
            showToast("Edit description successfully")
            router.refresh();
            closeRef?.current?.click();

        } catch (error) {
            showErrorToast("Error Edit description")
            console.error("Error Edit description:", error);

        }
    };

    const handlePrizePoolChange = (index: number, field: keyof PrizePool, value: string) => {
        const updatedPrizePool = [...prizePool];
        updatedPrizePool[index][field] = value;
        setPrizePool(updatedPrizePool);
    };

    // Function to add a new prize entry
    const addPrizePoolEntry = () => {
        setPrizePool([...prizePool, { key: "", value: "" }]);
    };

    // Function to remove a prize entry
    const removePrizePoolEntry = (index: number) => {
        const updatedPrizePool = prizePool.filter((_, i) => i !== index);
        setPrizePool(updatedPrizePool);
    };

    const editPrizePool = async () => {
        try {
            const response = await axios.post('/api/tournament/editPrizepool', { id: params.id, prizePool });
            showToast("Edit prize pool successfully")
            router.refresh();
            closeRef?.current?.click();

        } catch (error) {
            showErrorToast("Error Edit prize pool")
            console.error("Error Edit prize pool:", error);

        }
    }

    const editDates = async () => {
        try {
            const response = await axios.post('/api/tournament/editDates', { id: params.id, checkin, checkinTime, starts, startsTime, ends, endsTime });
            showToast("Edit dates successfully")
            router.refresh();
            closeRef?.current?.click();

        } catch (error) {
            showErrorToast("Error Edit dates")
            console.error("Error Edit dates:", error);

        }
    };

    const editDetail = async () => {
        try {
            const response = await axios.post('/api/tournament/editDetail', { id: params.id, teamsize, teamcount, region, bracket });
            showToast("Edit detail successfully")
            router.refresh();
            closeRef?.current?.click();

        } catch (error) {
            showErrorToast("Error Edit detail")
            console.error("Error Edit detail:", error);

        }
    }

    const editCurrentphase = async () => {
        try {
            const response = await axios.post('/api/tournament/editCurrentphase', { id: params.id, currentphase });
            showToast("Edit current phase successfully")
            router.refresh();
            closeRef?.current?.click();

        } catch (error) {
            showErrorToast("Error Edit current phase")
            console.error("Error Edit current phase:", error);

        }
    }
    const phases = ["Drafting", "Registration", "checkin", "live", "Finished"];

    const currentPhase = tournament.currentphase;

    const getPhaseBgClass = (phase: string) => {
        const phaseIndex = phases.indexOf(phase);
        const currentPhaseIndex = phases.indexOf(currentPhase);
        return phaseIndex <= currentPhaseIndex ? "bg-green-900" : "bg-red-900";
    };

    const getPhaseBgClassCheck = (phase: string) => {
        const phaseIndex = phases.indexOf(phase);
        const currentPhaseIndex = phases.indexOf(currentPhase);
        return phaseIndex <= currentPhaseIndex ? "bg-green-600" : "bg-red-600";
    };

    const getLineBgClass = (index: number) => {
        const currentPhaseIndex = phases.indexOf(currentPhase);
        return index <= currentPhaseIndex - 1 ? "border-green-400" : "border-gray-400";
    };


    return (
        <div className=" flex flex-col w-full justify-center items-center space-y-3">
            <div className=" flex flex-col justify-start space-y-3 bg-black mt-6 w-5/6 bg-opacity-60 backdrop-blur-sm p-3 px-8 rounded-lg">
                <p className=" text-red-700 font-semibold">
                    CURRENT PHASE
                </p>
                <Dialog>
                    <DialogTrigger asChild>
                        <button className="absolute top-2 right-2 z-50 bg-gray-800 bg-opacity-60 hover:bg-opacity-80 text-white p-2 rounded-full transition duration-300">
                            <HiPencil className="w-5 h-5" />
                        </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Edit Tournament Prize Pool</DialogTitle>
                        </DialogHeader>

                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className="w-[200px] justify-between"
                                >
                                    {currentphase
                                        ? frameworks.find((framework) => framework.value === currentphase)?.label
                                        : "Select framework..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                                <Command>
                                    <CommandInput placeholder="Search framework..." />
                                    <CommandList>
                                        <CommandEmpty>No framework found.</CommandEmpty>
                                        <CommandGroup>
                                            {frameworks.map((framework) => (
                                                <CommandItem
                                                    key={framework.value}
                                                    value={framework.value}
                                                    onSelect={(currentValue) => {
                                                        setValue(currentValue === currentphase ? "" : currentValue)
                                                        setOpen(false)
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            currentphase === framework.value ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    {framework.label}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>


                        <DialogFooter>
                            <div className="flex justify-between ">
                                <DialogClose ref={closeRef} asChild>
                                    <Button type="button" variant={"ghost"}>
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button onClick={editCurrentphase} type="submit">Save changes</Button>
                            </div>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <div className="flex justify-start w-full md:justify-center">
                    <div className="flex flex-col w-5/6 items-start justify-center space-y-2 md:flex-row md:items-center md:space-y-0">
                        {phases.map((phase, index) => (
                            <React.Fragment key={phase}>
                                <div
                                    className={`flex flex-row space-x-3 items-center justify-center ${getPhaseBgClass(
                                        phase
                                    )} px-5 p-2 rounded-full bg-opacity-80`}
                                >
                                    <Check className={`${getPhaseBgClassCheck(
                                        phase
                                    )} rounded-full text-slate-700`} />{" "}
                                    <div className="font-medium text-nowrap">{phase === "checkin" ? "Check In" : phase === "live" ? "Live" : phase}</div>
                                </div>
                                {index < phases.length - 1 && (
                                    <p className={`w-full border mx-3 rounded-full hidden md:flex ${getLineBgClass(index)}`}></p>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
            <div className=" flex flex-col justify-between w-5/6 space-y-4 md:flex-row md:space-y-0 ">

                <div className="flex flex-col justify-start space-y-6 bg-black w-full bg-opacity-60 backdrop-blur-sm p-6 px-8 rounded-lg md:w-[calc((2/3*100%)-1rem)] ">

                    <Image
                        src={`${tournament.thumbnail}`}
                        alt={""}
                        width={920}
                        height={80}
                        objectFit="cover"
                        className="transition-opacity duration-800 group-hover/card:opacity-0 rounded-2xl"
                    />
                    <p className=" text-3xl font-bold">
                        {tournament.tname}
                    </p>
                    <p className="font-medium">
                        <Dialog>
                            <DialogTrigger asChild>
                                <button className="absolute right-2 z-50 bg-gray-800 bg-opacity-60 hover:bg-opacity-80 text-white p-2 rounded-full transition duration-300">
                                    <HiPencil className="w-5 h-5" />
                                </button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Edit Tournament Description</DialogTitle>
                                </DialogHeader>
                                <div className="flex flex-col py-4 ">
                                    <Textarea
                                        placeholder="Tell us a little bit about yourself"
                                        className="resize-none h-48"
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>
                                <DialogFooter>
                                    <div className="flex justify-between ">
                                        <DialogClose ref={closeRef} asChild>
                                            <Button type="button" variant={"ghost"}>
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                        <Button onClick={editDescription} type="submit">Save changes</Button>
                                    </div>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        {tournament.tdescription}
                    </p>

                </div>

                <div className=" flex flex-col w-full space-y-4 md:w-1/3">
                    <div className="  flex flex-col justify-center items-start space-y-2 bg-black w-full bg-opacity-60 backdrop-blur-sm rounded-lg p-6">
                        <p className="text-red-700 font-semibold">STARTS IN</p>
                        <div className="w-full flex flex-col justify-center items-center space-y-12">
                            {startDateTime ? (
                                <Countdown targetDate={startDateTime} />
                            ) : (
                                <div>Loading countdown...</div>
                            )}
                            <Button variant={"destructive"} className="font-semibold text-lg">
                                Resgister
                            </Button>
                        </div>
                    </div>

                    <div className="  flex flex-col justify-center items-start space-y-2 bg-black w-full bg-opacity-60 backdrop-blur-sm rounded-lg p-6">
                        <p className="text-red-700 font-semibold">PRIZE POOL</p>
                        <Dialog>
                            <DialogTrigger asChild>
                                <button className="absolute top-2 right-2 z-50 bg-gray-800 bg-opacity-60 hover:bg-opacity-80 text-white p-2 rounded-full transition duration-300">
                                    <HiPencil className="w-5 h-5" />
                                </button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Edit Tournament Prize Pool</DialogTitle>
                                </DialogHeader>

                                {/* Prize Pool Fields */}
                                <div className="flex flex-col space-y-2">
                                    {prizePool.map((field, index) => (
                                        <div key={index} className="flex space-x-2">
                                            <Input
                                                placeholder="Position (e.g., 1st)"
                                                value={field.key}
                                                onChange={(e) =>
                                                    handlePrizePoolChange(index, "key", e.target.value)
                                                }
                                            />
                                            <Input
                                                placeholder="Prize (e.g., 200)"
                                                value={field.value}
                                                onChange={(e) =>
                                                    handlePrizePoolChange(index, "value", e.target.value)
                                                }
                                            />
                                            <Button type="button" onClick={() => removePrizePoolEntry(index)}>
                                                Remove
                                            </Button>
                                        </div>
                                    ))}
                                    <Button type="button" onClick={addPrizePoolEntry}>
                                        Add Prize
                                    </Button>
                                </div>

                                {/* Footer with Save and Cancel Buttons */}
                                <DialogFooter>
                                    <div className="flex justify-between ">
                                        <DialogClose ref={closeRef} asChild>
                                            <Button type="button" variant={"ghost"}>
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                        <Button onClick={editPrizePool} type="submit">Save changes</Button>
                                    </div>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <div className="w-full flex flex-col justify-center items-start space-y-3">
                            {tournament.prizePool.map((item: any) => (
                                <div key={item._id} className=" text-red-700">{item.key} PLACE<span className="text-white ml-3 font-bold">${item.value}</span></div>
                            ))}


                        </div>
                    </div>

                    <div className="  flex flex-col justify-center items-start space-y-2 bg-black w-full bg-opacity-60 backdrop-blur-sm rounded-lg p-6">
                        <p className="text-red-700 font-semibold">DATES</p>
                        <Dialog>
                            <DialogTrigger asChild>
                                <button className="absolute top-2 right-2 z-50 bg-gray-800 bg-opacity-60 hover:bg-opacity-80 text-white p-2 rounded-full transition duration-300">
                                    <HiPencil className="w-5 h-5" />
                                </button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Edit Tournament Dates</DialogTitle>
                                </DialogHeader>

                                {/* Check-in Date */}
                                <div className="flex flex-row items-center justify-between">
                                    <div className="flex flex-col">
                                        <label>Check In</label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-[240px] pl-3 text-left font-normal",
                                                        !checkin && "text-muted-foreground"
                                                    )}
                                                >
                                                    {checkin ? (
                                                        format(checkin, "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={checkin}
                                                    onSelect={setCheckin}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div className="flex flex-col">
                                        <label>Check In Time</label>
                                        <InputOTP maxLength={4} value={checkinTime} onChange={setCheckinTime}>
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

                                {/* Starts Date */}
                                <div className="flex flex-row items-center justify-between">
                                    <div className="flex flex-col">
                                        <label>Starts</label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-[240px] pl-3 text-left font-normal",
                                                        !starts && "text-muted-foreground"
                                                    )}
                                                >
                                                    {starts ? (
                                                        format(starts, "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={starts}
                                                    onSelect={setStarts}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div className="flex flex-col">
                                        <label>Starts Time</label>
                                        <InputOTP maxLength={4} value={startsTime} onChange={setStartsTime}>
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

                                {/* Ends Date */}
                                <div className="flex flex-row items-center justify-between">
                                    <div className="flex flex-col">
                                        <label>Ends</label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-[240px] pl-3 text-left font-normal",
                                                        !ends && "text-muted-foreground"
                                                    )}
                                                >
                                                    {ends ? (
                                                        format(ends, "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={ends}
                                                    onSelect={setEnds}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div className="flex flex-col">
                                        <label>Ends Time</label>
                                        <InputOTP maxLength={4} value={endsTime} onChange={setEndsTime}>
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

                                {/* Footer with Save and Cancel Buttons */}
                                <DialogFooter>
                                    <div className="flex justify-between ">
                                        <DialogClose ref={closeRef} asChild>
                                            <Button type="button" variant={"ghost"}>
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                        <Button onClick={editDates} type="submit">Save changes</Button>
                                    </div>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <div className="w-full flex flex-col justify-center items-start space-y-3">
                            <div className=" text-red-700">CHECH IN :<span className="text-white text-sm ml-1 font-medium">{tournament.checkin} ({tournament.checkinTime} GMT+3)</span></div>
                            <div className=" text-red-700">STARTS :<span className="text-white text-sm ml-3 font-medium">{tournament.starts} ({tournament.startsTime} GMT+3)</span></div>
                            <div className=" text-red-700">ENDS :<span className="text-white text-sm ml-3 font-medium">{tournament.ends} ({tournament.endsTime} GMT+3)</span></div>
                        </div>
                    </div>
                    <div className="  flex flex-col justify-center items-start space-y-2 bg-black w-full bg-opacity-60 backdrop-blur-sm rounded-lg p-6">

                        <Dialog>
                            <DialogTrigger asChild>
                                <button className="absolute top-2 right-2 z-50 bg-gray-800 bg-opacity-60 hover:bg-opacity-80 text-white p-2 rounded-full transition duration-300">
                                    <HiPencil className="w-5 h-5" />
                                </button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Edit Tournament Detail</DialogTitle>
                                </DialogHeader>
                                <div className="">
                                    <div className="">
                                        <Label htmlFor="teamsize" className="text-right">
                                            Team Size
                                        </Label>
                                        <Input
                                            id="teamsize"
                                            className="col-span-3"
                                            onChange={(e) => setTeamsize(e.target.value)}

                                        />
                                    </div>
                                    <div className="">
                                        <Label htmlFor="teamcount" className="text-right">
                                            Team Count
                                        </Label>
                                        <Input
                                            id="teamcount"
                                            className="col-span-3"
                                            onChange={(e) => setTeamcount(e.target.value)}

                                        />
                                    </div>
                                    <div className="">
                                        <Label htmlFor="username" className="text-right">
                                            Region
                                        </Label>
                                        <Input
                                            id="username"
                                            className="col-span-3"
                                            onChange={(e) => setRegion(e.target.value)}

                                        />
                                    </div>
                                    <div className="">
                                        <Label htmlFor="username" className="text-right">
                                            Bracket
                                        </Label>
                                        <Input
                                            id="username"
                                            className="col-span-3"
                                            onChange={(e) => setBracket(e.target.value)}

                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <div className="flex justify-between ">
                                        <DialogClose ref={closeRef} asChild>
                                            <Button type="button" variant={"ghost"}>
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                        <Button onClick={editDetail} type="submit">Save changes</Button>
                                    </div>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <div className="w-full flex flex-col justify-center items-start space-y-3">
                            <div className=" text-red-700 font-semibold">TEAM SIZE :<span className="text-white ml-1 font-bold">{tournament.teamsize}</span></div>
                            <div className=" text-red-700 font-semibold">TEAM COUNT :<span className="text-white ml-1 font-bold">{tournament.teamcount}s</span></div>
                            <div className=" text-red-700 font-semibold">REGION :<span className="text-white ml-1 font-bold">{tournament.region}</span></div>
                            <div className=" text-red-700 font-semibold">BRACKET :<span className="text-white ml-1 font-bold">{tournament.bracket}</span></div>

                        </div>
                    </div>

                </div>
            </div>
            <div className=" flex flex-col justify-center items-center bg-black mt-6 w-5/6 bg-opacity-60 backdrop-blur-sm p-3 px-8 rounded-lg  md:flex-row md:space-x-32 ">
                <Image src={"/logoDark.png"} alt={""} width={300} height={20} />
                <Image src={"/valoDark.png"} alt={""} width={300} height={20} />

            </div>
        </div>
    )
}
