"use client"
import { Button } from "@/components/ui/button"
import { CalendarIcon, Check } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation";
import { parse, format } from 'date-fns';
import { HiMiniUserGroup, HiPencil } from "react-icons/hi2";
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
import { ElementRef, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";
import * as React from "react"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import useSWR from "swr";

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

interface Tournament {
    id: string;
    tname: string;
    tdescription: string;
    thumbnail: string;
    thumbnailGif: string;
    organizer: string;
    organizerAvatar: string;
    participants: number;
    capacity: number;
    currentphase: 'Drafting' | 'Registration' | 'checkin' | 'live' | 'Finished';
    checkin: string;
    checkinTime: string;
    starts: string;
    startsTime: string;
    ends: string;
    endsTime: string;
    teamsize: number;
    teamcount: number;
    region: string;
    bracket: string;
    sponsors: string[];
    prizePool: { _id: string; key: string; value: number }[];
}

const fetcher = (url: string, id: any) => axios.post(url, { id }).then(res => res.data);

export default function TournamentPage({ params }: { params: { id: string } }) {

    //  Turnuva verisini çek
    const { data: tournament, error, mutate } = useSWR<Tournament>(['/api/tournament/getTournamentDetail', params.id] as const,
        ([url, id]) => fetcher(url, id)
    );



    const closeRef = useRef<ElementRef<"button">>(null);
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
    const [currentphase, setValue] = useState("")
    const [sponsors, setSponsors] = useState<string[]>([]); // Resimleri tutmak için state

    const [thumbnail2, setThumbnail] = useState('');
    const [thumbnailGif2, setThumbnailGif] = useState('');
    const [organizer2, setOrganizer] = useState('');
    const [organizerAvatar2, setOrganizerAvatar] = useState('');
    const [name2, setName] = useState('');
    const [capacity2, setCapacity] = useState('');


    const handleSaveChanges = async () => {
        const editCard: Partial<Record<string, string>> = {};
        if (thumbnail2) editCard.thumbnail2 = thumbnail2;
        if (thumbnailGif2) editCard.thumbnailGif2 = thumbnailGif2;
        if (organizer2) editCard.organizer2 = organizer2;
        if (organizerAvatar2) editCard.organizerAvatar2 = organizerAvatar2;
        if (name2) editCard.name2 = name2;
        if (capacity2) editCard.capacity2 = capacity2;


        try {
            const response = await axios.post('/api/admin/tournament/editCard', { editCard, id:params.id });
            showToast("Card successfully updated")
            mutate();
            closeRef?.current?.click();

        } catch (error) {
            showErrorToast("Error updating Card")
            console.error("Error updating Card:", error);

        }
    };


    const addSponsor = (url: string) => {
        setSponsors((prevSponsors) => [...prevSponsors, url]);
    };

    const removeSponsor = (index: number) => {
        setSponsors((prevSponsors) => prevSponsors.filter((_, i) => i !== index));
    };



    if (!tournament) return <div>Loading...</div>;


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

    const editDescription = async () => {
        try {
            const response = await axios.post('/api/admin/tournament/editDescription', { id: params.id, tdescription });
            showToast("Edit description successfully")
            mutate();
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
            const response = await axios.post('/api/admin/tournament/editPrizepool', { id: params.id, prizePool });
            showToast("Edit prize pool successfully")
            mutate();
            closeRef?.current?.click();

        } catch (error) {
            showErrorToast("Error Edit prize pool")
            console.error("Error Edit prize pool:", error);

        }
    }
    const editDates = async () => {
        try {
            const response = await axios.post('/api/admin/tournament/editDates', { id: params.id, checkin, checkinTime, starts, startsTime, ends, endsTime });
            showToast("Edit dates successfully")
            mutate();
            closeRef?.current?.click();

        } catch (error) {
            showErrorToast("Error Edit dates")
            console.error("Error Edit dates:", error);

        }
    };

    const editDetail = async () => {
        try {
            const response = await axios.post('/api/admin/tournament/editDetail', { id: params.id, teamsize, teamcount, region, bracket });
            showToast("Edit detail successfully")
            mutate();
            closeRef?.current?.click();

        } catch (error) {
            showErrorToast("Error Edit detail")
            console.error("Error Edit detail:", error);

        }
    }

    const editCurrentphase = async () => {
        try {
            const response = await axios.post('/api/admin/tournament/editCurrentphase', { id: params.id, currentphase });
            showToast("Edit current phase successfully")
            mutate();
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

    const editSponsors = async () => {
        try {
            const response = await axios.post('/api/admin/tournament/editSponsors', { id: params.id, sponsors });
            showToast("Edit Sponsors successfully")
            mutate();
            closeRef?.current?.click();

        } catch (error) {
            showErrorToast("Error Edit Sponsors")
            console.error("Error Edit Sponsors:", error);

        }
    };


    return (
        <div className=" flex flex-col w-full justify-center items-center space-y-3 relative z-auto">
            <div className=" flex flex-col justify-start space-y-3 bg-black mt-6 w-5/6 bg-opacity-60 backdrop-blur-sm p-3 px-8 rounded-lg">
                <p className=" text-gray-700 font-semibold">
                    CURRENT PHASE
                </p>
                <Dialog>
                    <DialogTrigger asChild>
                        <button className="absolute top-2 right-2 z-50 bg-gray-800 bg-opacity-60 hover:bg-opacity-80 text-white p-2 rounded-full transition duration-300">
                            <HiPencil className="w-5 h-5" />
                        </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-gray-950">
                        <DialogHeader>
                            <DialogTitle>Edit Current Phase</DialogTitle>
                        </DialogHeader>

                        <Select
                            onValueChange={(value) => setValue(value)}
                            defaultValue={currentphase}
                        >
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Select a phase" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Phases</SelectLabel>
                                    {frameworks.map((framework) => (
                                        <SelectItem key={framework.value} value={framework.value}>

                                            {framework.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>


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
                            <DialogContent className="sm:max-w-[425px] bg-gray-950">
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
                    <div className="max-w-xs md:max-w-sm w-full group/card mx-auto">
                        <div className="relative cursor-pointer overflow-hidden h-96 rounded-md shadow-xl max-w-sm mx-auto flex flex-col justify-between">
                            {/* Edit Button */}
                            <Dialog>
                                <DialogTrigger asChild>
                                    <button className="absolute top-2 right-2 z-50 bg-gray-800 bg-opacity-60 hover:bg-opacity-80 text-white p-2 rounded-full transition duration-300">
                                        <HiPencil className="w-5 h-5" />
                                    </button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[625px] bg-gray-950">
                                    <DialogHeader>
                                        <DialogTitle>Edit Card</DialogTitle>

                                    </DialogHeader>
                                    <div className="grid gap-4 py-4 grid-cols-2">
                                        <div className="border rounded-md outline-dashed  w-auto h-72">
                                            <Label htmlFor="name" className="text-right">
                                                Thumbnail
                                            </Label>
                                            <UploadDropzone
                                                appearance={{
                                                    label: {
                                                        color: "#FFFFFF"
                                                    },
                                                    allowedContent: {
                                                        color: "#FFFFFF"
                                                    }
                                                }}
                                                onClientUploadComplete={(res) => {
                                                    console.log(res);
                                                    const uploadedUrl = res?.[0]?.url;
                                                    setThumbnail(uploadedUrl);
                                                }} endpoint={"imageUploader"} />
                                        </div>
                                        <div className="border rounded-md outline-dashed  w-auto h-72">
                                            <Label htmlFor="tgif" className="text-right">
                                                Thumbnail Gif
                                            </Label>
                                            <UploadDropzone
                                                appearance={{
                                                    label: {
                                                        color: "#FFFFFF"
                                                    },
                                                    allowedContent: {
                                                        color: "#FFFFFF"
                                                    }
                                                }}
                                                onClientUploadComplete={(res) => {
                                                    console.log(res);
                                                    const uploadedUrl = res?.[0]?.url;
                                                    setThumbnailGif(uploadedUrl);
                                                }} endpoint={"imageUploader"} />
                                        </div>
                                        <div className="flex flex-col items-center justify-center space-y-4">
                                            <Label htmlFor="name" className="text-right">
                                                Organizer Name
                                            </Label>
                                            <Input
                                                id="name"
                                                defaultValue={tournament.organizer}
                                                type="text"
                                                className="w-full"
                                                onChange={(e) => setOrganizer(e.target.value)}
                                            />
                                        </div>
                                        <div className="border rounded-full outline-dashed w-72 h-72">
                                            <UploadDropzone
                                                appearance={{
                                                    label: {
                                                        color: "#FFFFFF"
                                                    },
                                                    allowedContent: {
                                                        color: "#FFFFFF"
                                                    }
                                                }}
                                                onClientUploadComplete={(res) => {
                                                    console.log(res);
                                                    const uploadedUrl = res?.[0]?.url;
                                                    setOrganizerAvatar(uploadedUrl);
                                                }} endpoint={"imageUploader"} />
                                        </div>
                                        <div className="flex flex-col items-center justify-center space-y-4">
                                            <Label htmlFor="name" className="text-right">
                                                Tournament Name
                                            </Label>
                                            <Input
                                                id="name"
                                                defaultValue={tournament.tname}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex flex-col items-center justify-center space-y-4">
                                            <Label htmlFor="name" className="text-right">
                                                Tournament Capacity
                                            </Label>
                                            <Input
                                                type="number"
                                                id="name"
                                                defaultValue={tournament.capacity}
                                                onChange={(e) => setCapacity(e.target.value)}
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
                                            <Button onClick={handleSaveChanges} type="submit">Save changes</Button>
                                        </div>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            {/* Static Thumbnail */}
                            <Image
                                src={tournament.thumbnail}
                                alt={`${name} Thumbnail`}
                                layout="fill"
                                objectFit="cover"
                                className="transition-opacity duration-500 group-hover/card:opacity-0"
                            />
                            {/* GIF Thumbnail */}
                            <Image
                                src={tournament.thumbnailGif}
                                alt={` Thumbnail GIF`}
                                layout="fill"
                                objectFit="cover"
                                className="absolute inset-0 transition-opacity duration-500 opacity-0 group-hover/card:opacity-100"
                            />
                            <div className="absolute inset-0 bg-black opacity-0 group-hover/card:opacity-50 transition-opacity duration-300"></div>
                            <div className="relative flex flex-row items-center space-x-4 z-10 p-4">
                                <Image
                                    src={tournament.organizerAvatar}
                                    height="40"
                                    width="40"
                                    alt="Organizer Avatar"
                                    className="h-10 w-10 rounded-full border-2 object-cover"
                                />
                                <div className="flex flex-col">
                                    <p className="font-normal text-base text-gray-50">{tournament.organizer}</p>
                                </div>
                            </div>
                            
                                <div className="relative text content w-full flex flex-col space-y-2 mt-4 p-4 bg-black bg-opacity-50 backdrop-blur-sm">
                                    <h1 className="font-bold text-lg md:text-xl text-gray-50">{tournament.tname}</h1>
                                    <div className="flex flex-row justify-end items-center space-x-2">
                                        <HiMiniUserGroup className="w-5 h-5 text-gray-200" />
                                        <p className="text-slate-200 font-medium">
                                            {tournament.participants}/{tournament.capacity}
                                        </p>
                                    </div>
                                    <p className="inline-flex h-8 items-center justify-center rounded-md border border-slate-500 px-4 text-sm font-semibold text-slate-200">
                                    {tournament.starts} ({tournament.startsTime} GMT+3)
                                    </p>
                                </div>
                            
                        </div>
                    </div>

                    <div className="  flex flex-col justify-center items-start space-y-2 bg-black w-full bg-opacity-60 backdrop-blur-sm rounded-lg p-6">
                        <p className="text-gray-700 font-semibold">PRIZE POOL</p>
                        <Dialog>
                            <DialogTrigger asChild>
                                <button className="absolute top-2 right-2 z-50 bg-gray-800 bg-opacity-60 hover:bg-opacity-80 text-white p-2 rounded-full transition duration-300">
                                    <HiPencil className="w-5 h-5" />
                                </button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px] bg-gray-950">
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
                                <div key={item._id} className=" text-gray-700">{item.key} PLACE<span className="text-white ml-3 font-bold">${item.value}</span></div>
                            ))}


                        </div>
                    </div>

                    <div className="  flex flex-col justify-center items-start space-y-2 bg-black w-full bg-opacity-60 backdrop-blur-sm rounded-lg p-6">
                        <p className="text-gray-700 font-semibold">DATES</p>
                        <Dialog>
                            <DialogTrigger asChild>
                                <button className="absolute top-2 right-2 z-50 bg-gray-800 bg-opacity-60 hover:bg-opacity-80 text-white p-2 rounded-full transition duration-300">
                                    <HiPencil className="w-5 h-5" />
                                </button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[625px] bg-gray-950 max-h-screen overflow-auto">
                                <DialogHeader>
                                    <DialogTitle>Edit Tournament Dates</DialogTitle>
                                </DialogHeader>

                                {/* Check-in Date */}
                                <div className="flex flex-row items-center justify-between">
                                    <div className="flex flex-col">
                                        <label>Check In</label>
                                        {/* <Popover>
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
                                            <PopoverContent className="" align="start"> */}
                                                <Calendar
                                                    mode="single"
                                                    selected={checkin}
                                                    onSelect={setCheckin}
                                                    initialFocus
                                                />
                                            {/* </PopoverContent>
                                        </Popover> */}
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
                                        {/* <Popover>
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
                                            <PopoverContent className="w-auto p-0" align="start"> */}
                                                <Calendar
                                                    mode="single"
                                                    selected={starts}
                                                    onSelect={setStarts}
                                                    initialFocus
                                                />
                                            {/* </PopoverContent>
                                        </Popover> */}
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
                                        {/* <Popover>
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
                                            <PopoverContent className="w-auto p-0" align="start"> */}
                                                <Calendar
                                                    mode="single"
                                                    selected={ends}
                                                    onSelect={setEnds}
                                                    initialFocus
                                                />
                                            {/* </PopoverContent>
                                        </Popover> */}
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
                            <div className=" text-gray-700">CHECH IN :<span className="text-white text-sm ml-1 font-medium">{tournament.checkin} ({tournament.checkinTime} GMT+3)</span></div>
                            <div className=" text-gray-700">STARTS :<span className="text-white text-sm ml-3 font-medium">{tournament.starts} ({tournament.startsTime} GMT+3)</span></div>
                            <div className=" text-gray-700">ENDS :<span className="text-white text-sm ml-3 font-medium">{tournament.ends} ({tournament.endsTime} GMT+3)</span></div>
                        </div>
                    </div>
                    <div className="  flex flex-col justify-center items-start space-y-2 bg-black w-full bg-opacity-60 backdrop-blur-sm rounded-lg p-6">

                        <Dialog>
                            <DialogTrigger asChild>
                                <button className="absolute top-2 right-2 z-50 bg-gray-800 bg-opacity-60 hover:bg-opacity-80 text-white p-2 rounded-full transition duration-300">
                                    <HiPencil className="w-5 h-5" />
                                </button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px] bg-gray-950">
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
                            <div className=" text-gray-700 font-semibold">TEAM SIZE :<span className="text-white ml-1 font-bold">{tournament.teamsize}</span></div>
                            <div className=" text-gray-700 font-semibold">TEAM COUNT :<span className="text-white ml-1 font-bold">{tournament.teamcount}s</span></div>
                            <div className=" text-gray-700 font-semibold">REGION :<span className="text-white ml-1 font-bold">{tournament.region}</span></div>
                            <div className=" text-gray-700 font-semibold">BRACKET :<span className="text-white ml-1 font-bold">{tournament.bracket}</span></div>

                        </div>
                    </div>

                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-items-center bg-black mt-6 w-5/6 bg-opacity-60 backdrop-blur-sm py-16 px-8 rounded-lg md:flex-row md:space-x-32">
                <Dialog>
                    <DialogTrigger asChild>
                        <button className="absolute right-2 z-50 bg-gray-800 bg-opacity-60 hover:bg-opacity-80 text-white p-2 rounded-full transition duration-300">
                            <HiPencil className="w-5 h-5" />
                        </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-gray-950">
                        <DialogHeader>
                            <DialogTitle>Edit Tournament Sponsors</DialogTitle>
                        </DialogHeader>
                        <div className="flex flex-col items-center justify-center space-y-9 w-auto">
                            {sponsors.map((url, index) => (
                                <div key={index} className="flex space-x-2 items-center">
                                    <div className="border overflow-hidden">
                                        <img
                                            src={url || "/default-logo.png"} // Resim URL'sini göster
                                            alt="Sponsor Logo"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <Button type="button" onClick={() => removeSponsor(index)}>Remove</Button>
                                </div>
                            ))}
                        </div>

                        <UploadDropzone
                            appearance={{
                                label: {
                                    color: "#FFFFFF"
                                },
                                allowedContent: {
                                    color: "#FFFFFF"
                                }
                            }}
                            onClientUploadComplete={(res) => {
                                const uploadedUrl = res?.[0]?.url;
                                if (uploadedUrl) {
                                    addSponsor(uploadedUrl); // Yeni resim URL'sini ekle
                                }
                            }}
                            endpoint={"imageUploader"} // Resim yükleme endpoint'i
                        />

                        <DialogFooter>
                            <div className="flex justify-between">
                                <DialogClose asChild>
                                    <Button type="button" variant={"ghost"}>
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button onClick={editSponsors} type="button">Save changes</Button>
                            </div>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                {tournament.sponsors && tournament.sponsors.map((sponsorUrl: any, index: any) => (
                    <Image
                        key={index} // Benzersiz anahtar
                        src={sponsorUrl} // Sponsor URL'si
                        alt={`Sponsor`} // Alternatif metin
                        width={300} // Genişlik
                        height={20} // Yükseklik
                        className="mt-4 md:mt-0" // Mobilde alt kısımda boşluk bırak
                    />
                ))}
            </div>

        </div>
    )
}
