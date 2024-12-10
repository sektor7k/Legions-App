"use client"
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

interface StreamProp {
    _id: string;
    username: string;
    userAvatar: string;
    message: string;
    createdAt: string | number | Date;
}

function timeAgo(date: string | number | Date): string {
    const now = new Date();
    const past = new Date(date); // string, number veya Date kabul edilir
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 60) {
        return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) { // 60 * 60 = 3600
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) { // 24 * 60 * 60 = 86400
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 604800) { // 7 * 24 * 60 * 60 = 604800
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 2629800) { // 30.44 * 24 * 60 * 60 = 2629800 (ortalama 1 ay)
        const weeks = Math.floor(diffInSeconds / 604800);
        return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else {
        const months = Math.floor(diffInSeconds / 2629800); // Ortalama 1 ay 30.44 gün
        return `${months} month${months > 1 ? 's' : ''} ago`;
    }
}


export default function ActivityFeed() {

    const [streams, setStream] = useState<StreamProp[]>([]);

    useEffect(() => {
        const getStream = async () => {
            try {
                const response = await axios.post('/api/bet/getStream');
                const sortedStreams = response.data.data.sort((a: StreamProp, b: StreamProp) => 
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setStream(sortedStreams);
            } catch (error) {
                console.error("Sometimes error", error);
            }
        }
        getStream();
    }, []) 


    return (
        <div className="flex flex-col h-full overflow-y-scroll p-4 ">
            {streams.map((stream) => (
                <div key={stream._id} className=" flex flex-row items-center justify-between">
                    <div
                        className="flex flex-row items-center shadow-sm rounded-lg p-3 mb-2 space-x-3"
                    >
                        {/* Avatar */}
                        <Image
                            src={stream.userAvatar}
                            alt={stream.username}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-full"
                        />

                        {/* Message */}
                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-300">
                                {stream.username}
                            </span>
                            <p className="text-sm text-gray-400">{stream.message}</p>
                        </div>
                    </div>
                    {/* Timestamp */}
                    <time className="text-xs opacity-60 text-nowrap">
                        {timeAgo(stream.createdAt)}
                    </time>

                </div>
            ))}
        </div>
    );
}
