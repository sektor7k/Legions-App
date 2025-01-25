import { HiMiniUserGroup } from "react-icons/hi2";
import Image from "next/image";

interface TournamentsCardProps {
    name: string;
    thumbnail: string;
    thumbnailGif: string;
    organizer: string;
    organizerAvatar: string;
    participants: number;
    capacity: number;
    date: string;
    status:string
}

export function CardDemo({
    name,
    thumbnail,
    thumbnailGif,
    organizer,
    organizerAvatar,
    participants,
    capacity,
    date,
    status

}: TournamentsCardProps) {
    return (
        <div className="max-w-xs w-full group/card mx-auto">
            <div className="relative cursor-pointer overflow-hidden h-96 rounded-md shadow-xl max-w-sm mx-auto flex flex-col justify-between">
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
                {/* Overlay */}
                <div className="absolute inset-0 bg-black opacity-0 group-hover/card:opacity-50 transition-opacity duration-300"></div>

                {/* Organizer Info */}
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

                {/* Content */}
                <div className="relative text content w-full flex flex-col space-y-2 mt-4 p-4 bg-black bg-opacity-50 backdrop-blur-sm">
                    <h1 className="font-bold text-lg md:text-xl text-gray-50">{name}</h1>
                    <div className="flex flex-row justify-end items-center space-x-2">
                        <HiMiniUserGroup className="w-5 h-5 text-gray-200" />
                        <p className="text-slate-200 font-medium">{participants}/{capacity}</p>
                    </div>
                    <p className="inline-flex h-8 items-center justify-center rounded-md border border-slate-500 px-4 text-sm font-semibold text-slate-200">
                        {date}
                    </p>
                </div>
                { status === "open" ?(


                <div className="absolute top-2 right-2">
                    <Image
                        src="/greendot.gif"
                        alt="Green Dot"
                        height={40} 
                        width={40} 
                        className="rounded-full"
                    />
                </div>
                ):(

                <div className="absolute top-2 right-2">
                    <Image
                        src="/closedgif.gif" 
                        alt="Green Dot"
                        height={40} 
                        width={40} 
                        className="rounded-full"
                    />
                </div>
                )}
            </div>
        </div>
    );
}
