import { HiMiniUserGroup, HiPencil } from "react-icons/hi2";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UploadDropzone } from "@/utils/uploadthing";
import { ElementRef, useRef, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";

interface TournamentsCardProps {
    id: string;
    name: string;
    thumbnail: string;
    thumbnailGif: string;
    organizer: string;
    organizerAvatar: string;
    participants: number;
    capacity: number;
    date: string;
}

export function CardDemo({
    id,
    name,
    thumbnail,
    thumbnailGif,
    organizer,
    organizerAvatar,
    participants,
    capacity,
    date,
}: TournamentsCardProps) {

    const router = useRouter();

    const [thumbnail2, setThumbnail] = useState('');
    const [thumbnailGif2, setThumbnailGif] = useState('');
    const [organizer2, setOrganizer] = useState('');
    const [organizerAvatar2, setOrganizerAvatar] = useState('');
    const [name2, setName] = useState('');
    const [capacity2, setCapacity] = useState('');
    const closeRef = useRef<ElementRef<"button">>(null);


    const handleSaveChanges = async () => {
        const editCard: Partial<Record<string, string>> = {};
        if (thumbnail2) editCard.thumbnail2 = thumbnail2;
        if (thumbnailGif2) editCard.thumbnailGif2 = thumbnailGif2;
        if (organizer2) editCard.organizer2 = organizer2;
        if (organizerAvatar2) editCard.organizerAvatar2 = organizerAvatar2;
        if (name2) editCard.name2 = name2;
        if (capacity2) editCard.capacity2 = capacity2;
        editCard.id = id;


        try {
            const response = await axios.post('/api/tournament/editCard', { editCard });
            showToast("Card successfully updated")
            router.refresh();
            closeRef?.current?.click();

        } catch (error) {
            showErrorToast("Error updating Card")
            console.error("Error updating Card:", error);

        }
    };

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

    return (
        <div className="max-w-xs md:max-w-sm w-full group/card mx-auto">
            <div className="relative cursor-pointer overflow-hidden h-96 rounded-md shadow-xl max-w-sm mx-auto flex flex-col justify-between">
                {/* Edit Button */}
                <Dialog>
                    <DialogTrigger asChild>
                        <button className="absolute top-2 right-2 z-50 bg-gray-800 bg-opacity-60 hover:bg-opacity-80 text-white p-2 rounded-full transition duration-300">
                            <HiPencil className="w-5 h-5" />
                        </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[625px]">
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
                                    defaultValue={organizer}
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
                                    defaultValue={name}
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
                                    defaultValue={capacity}
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
                    src={thumbnail}
                    alt={`${name} Thumbnail`}
                    layout="fill"
                    objectFit="cover"
                    className="transition-opacity duration-500 group-hover/card:opacity-0"
                />
                {/* GIF Thumbnail */}
                <Image
                    src={thumbnailGif}
                    alt={`${name} Thumbnail GIF`}
                    layout="fill"
                    objectFit="cover"
                    className="absolute inset-0 transition-opacity duration-500 opacity-0 group-hover/card:opacity-100"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover/card:opacity-50 transition-opacity duration-300"></div>
                <div className="relative flex flex-row items-center space-x-4 z-10 p-4">
                    <Image
                        src={organizerAvatar}
                        height="40"
                        width="40"
                        alt="Organizer Avatar"
                        className="h-10 w-10 rounded-full border-2 object-cover"
                    />
                    <div className="flex flex-col">
                        <p className="font-normal text-base text-gray-50">{organizer}</p>
                    </div>
                </div>
                <button onClick={() => router.push(`/admin/edittournament/${id}`)}>
                    <div className="relative text content w-full flex flex-col space-y-2 mt-4 p-4 bg-black bg-opacity-50 backdrop-blur-sm">
                        <h1 className="font-bold text-lg md:text-xl text-gray-50">{name}</h1>
                        <div className="flex flex-row justify-end items-center space-x-2">
                            <HiMiniUserGroup className="w-5 h-5 text-gray-200" />
                            <p className="text-slate-200 font-medium">
                                {participants}/{capacity}
                            </p>
                        </div>
                        <p className="inline-flex h-8 items-center justify-center rounded-md border border-slate-500 px-4 text-sm font-semibold text-slate-200">
                            {date}
                        </p>
                    </div>
                </button>
            </div>
        </div>
    );
}
