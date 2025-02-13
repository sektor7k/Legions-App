"use client";
import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";
import axios from "axios";
import useSWR, { mutate } from 'swr';
import { Button } from "@/components/ui/button";
import { Ghost, Menu } from "lucide-react";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import LoadingAnimation from "@/components/loadingAnimation";

interface Tournament {
    registerStatus: string;
    chatStatus: string;
}

const fetcher = (url: string) => axios.get(url).then(res => res.data);
const fetcher2 = (url: string, params: any) => axios.post(url, params).then(res => res.data);
const fetcher3 = (url: string, id: any) => axios.post(url, { id }).then(res => res.data);

export default function ChatPage({ params }: { params: { id: string } }) {
    const [currentMsg, setCurrentMsg] = useState("");
    const { data: session } = useSession();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const socketRef = useRef<Socket | null>(null);

    const { data: tournament, error: errorTourrnament } = useSWR<Tournament>(
        ['/api/tournament/getTournamentDetail', params.id] as const,
        ([url, id]) => fetcher3(url, id)
    );

    const { data: messages = [], error } = useSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/api/rooms/${params.id}/messages`,
        fetcher
    );

    const { data: checkUser, error: errorCheck, mutate: checkUserMutate } = useSWR(
        session?.user.id
            ? ['/api/tournament/checkRegistration', { userId: session?.user.id, tournamentId: params.id }]
            : null,
        ([url, params]) => fetcher2(url, params)
    );

    const { data: myTeam, error: errorTeam } = useSWR(
        session?.user.id
            ? ['/api/tournament/team/getTeamLead', { tournamentId: params.id, leadId: session.user.id }]
            : null,
        ([url, params]) => fetcher2(url, params)
    );

    const rStatus = tournament?.registerStatus === "open" ? false : true;
    const cStatus = tournament?.chatStatus === "open" ? false : true;

    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5001");

            socketRef.current.on("receive_msg", (msgData) => {
                mutate(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/rooms/${params.id}/messages`,
                    (currentData: { userId: string; userName: string; text: string; createdAt: string; avatar: string }[] | undefined) =>
                        [...(currentData || []), msgData],
                    false
                );
            });
        }

        socketRef.current.emit("join_room", params.id);

        return () => {
            socketRef.current?.off("receive_msg");
            socketRef.current?.disconnect();
            socketRef.current = null;
        };
    }, [params.id]);

    // scrollToBottom: messages bağımlılığı kaldırıldı
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    // scrollToBottom'ı dependency dizisine ekledik
    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    const sendData = useCallback(async () => {
        if (currentMsg === "" || !session?.user?.username) return;

        const msgData = {
            roomId: params.id,
            userId: session.user.id,
            userName: session.user.username,
            text: currentMsg,
            createdAt: new Date().toISOString(),
            avatar: session.user.image,
            messageType: 'text'
        };

        try {
            if (cStatus) {
                return console.error("Chat Error");
            }
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/rooms/${params.id}/messages`, msgData);
            setCurrentMsg("");
        } catch (error) {
            console.error('Mesaj gönderme hatası:', error);
        }
    }, [currentMsg, session, params.id, cStatus]); // cStatus eklendi

    const sendSteamMessage = useCallback(async () => {
        if (!session?.user?.username || !myTeam) {
            console.warn('myTeam bilgisi eksik:', myTeam);
            return;
        }

        const msgData = {
            roomId: params.id,
            userId: session.user.id,
            userName: session.user.username,
            createdAt: new Date().toISOString(),
            avatar: session.user.image,
            teamId: myTeam._id,
            messageType: 'steam',
            teamName: myTeam.teamName,
            teamAvatar: myTeam.teamImage
        };

        try {
            if (cStatus || rStatus) {
                return console.error("Chat Error");
            }
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/rooms/${params.id}/messages`, msgData);
        } catch (error) {
            console.error('Steam mesaj gönderme hatası:', error);
        }
    }, [session, params.id, myTeam, checkUser, cStatus, rStatus]); // cStatus ve rStatus eklendi

    const sendSmemberMessage = useCallback(async () => {
        const msgData = {
            roomId: params.id,
            userId: session?.user.id,
            userName: session?.user.username,
            createdAt: new Date().toISOString(),
            avatar: session?.user.image,
            messageType: 'smember',
        };

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/rooms/${params.id}/messages`, msgData);
        } catch (error) {
            console.error('Steam mesaj gönderme hatası:', error);
        }
    }, [session, params.id]);

    function showErrorToast(message: string): void {
        toast({
            variant: "destructive",
            title: message,
            description: "",
        });
    }

    function showToast(message: string): void {
        toast({
            variant: "default",
            title: message,
            description: "",
        });
    }

    const sendInvite = async (teamId: string | undefined, userId: string, leadId: string, inviteType: string) => {
        try {
            if (cStatus || rStatus) {
                return console.error("Chat Error");
            }
            const response = await axios.post('/api/tournament/invite/sendInvite', { teamId, userId, leadId, inviteType });
            await checkUserMutate();
            showToast("A request to join the team has been sent.");
        } catch (error: any) {
            if (error.response) {
                console.error("Response error:", error.response.data);
            } else if (error.request) {
                console.error("Request error:", error.request);
            } else {
                console.error("Error message:", error.message);
            }
            showErrorToast(error.response?.data?.message || "An error occurred.");
        }
    };

    const MessageItem = React.memo(({ message, isCurrentUser }: { message: { userId: string; userName: string; text?: string; createdAt: string; avatar: string, messageType: string, teamId?: string, teamName?: string, teamAvatar?: string }, isCurrentUser: boolean }) => (
        <div className={`chat ${isCurrentUser ? "chat-end" : "chat-start"}`}>
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                    <img src={message.avatar} alt={message.userName} />
                </div>
            </div>
            <div className="chat-header font-bold">{message.userName}</div>
            <div className={`chat-bubble ${isCurrentUser ? "bg-gray-800 text-white" : "bg-gray-200 text-black"}`}>
                {message.messageType === 'text' && message.text}
                {message.messageType === 'steam' && (
                    <div className="p-4 max-w-lg">
                        <div className="flex items-center mb-3">
                            <img src={message.teamAvatar} alt={message.teamName} className="w-12 h-12 rounded-full mr-4" />
                            <div>
                                <div className="font-bold text-lg">Teammate Wanted!</div>
                                <div className="text-sm">Team Name: <span className="font-semibold">{message.teamName}</span></div>
                            </div>
                        </div>
                        <p className="text-sm mb-3">
                            Our team is looking for a new teammate. Would you like to join our team? Send your application by clicking the button below.
                        </p>
                        <Button
                            onClick={() => sendInvite(message.teamId, session?.user.id, message.userId, 'leader')}
                            disabled={checkUser?.isRegistered || checkUser?.hasPendingInvite || rStatus || cStatus}
                        >
                            Join Team
                        </Button>
                    </div>
                )}
                {message.messageType === 'smember' && (
                    <div className="p-4 max-w-lg">
                        <div className="flex items-center mb-3">
                            <img src={message.avatar} alt={message.userName} className="w-12 h-12 rounded-full mr-4" />
                            <div>
                                <div className="font-bold text-lg">Team Wanted!</div>
                                <div className="text-sm font-semibold">{message.userName}</div>
                            </div>
                        </div>
                        <p className="text-sm mb-3">
                            I&apos;m looking for a team to join the tournament. Invite me to join your team by clicking the button below.
                        </p>
                        <Button
                            onClick={() => sendInvite(myTeam._id, message.userId, session?.user.id, 'member')}
                            disabled={!myTeam || rStatus || cStatus}
                        >
                            Invite Team
                        </Button>
                    </div>
                )}
            </div>
            <div className="chat-footer">
                <time className="text-xs opacity-60">{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</time>
            </div>
        </div>
    ));
    MessageItem.displayName = "MessageItem"; // Display name tanımlandı

    const renderedMessages = useMemo(() => {
        return messages.map((message: { userId: string; userName: string; text: string; createdAt: string; avatar: string, messageType: string, teamId: string, teamName?: string, teamAvatar?: string }, index: number) => (
            <MessageItem
                key={index}
                message={message}
                isCurrentUser={message.userId === session?.user?.id}
            />
        ));
    }, [messages, session?.user?.id, myTeam, checkUser]);

    return (
        <div className="flex items-center justify-center md:mt-2 md:px-4 px-0 sm:px-6 lg:px-4 overflow-y-hidden">
            <div className="w-full md:max-w-7xl md:mt-4 lg:mx-8">
                <div className="bg-black p-4 bg-opacity-50 backdrop-blur-md md:border-gradient rounded-lg md:min-h-[calc(90vh-2rem)] min-h-full">
                    <div className="overflow-y-auto h-[calc(87vh-5rem)] p-2 px-6">
                        <div className="space-y-4">
                            {renderedMessages}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>
                    <div>
                        <div className="relative w-full pt-3 px-6 flex items-center justify-center">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        disabled={cStatus || rStatus}
                                        size={"icon"}
                                        variant={"ghost"}
                                        className={`mr-3 border border-gray-500 ${cStatus || rStatus ? "opacity-40" : "opacity-100"}`}>
                                        <Menu />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent align="start" className="w-80 bg-transparent border-none">
                                    <div className="flex flex-row justify-center items-center gap-8">
                                        <Button
                                            size={"sm"}
                                            className="rounded-full"
                                            onClick={sendSmemberMessage}
                                            disabled={checkUser?.isRegistered || checkUser?.hasPendingInvite}
                                        >
                                            Search Team
                                        </Button>
                                        <Button
                                            size={"sm"}
                                            className="rounded-full"
                                            onClick={sendSteamMessage}
                                            disabled={!myTeam}
                                        >
                                            Search Member
                                        </Button>
                                    </div>
                                </PopoverContent>
                            </Popover>
                            <input
                                disabled={cStatus}
                                className={`w-full p-2 pl-4 pr-12 border rounded-lg rounded-r-3xl border-gray-500 ${cStatus ? "opacity-40" : "opacity-100"} focus:outline-none focus:ring-2 focus:ring-white`}
                                type="text"
                                value={currentMsg}
                                placeholder="Type your message..."
                                onChange={(e) => setCurrentMsg(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        sendData();
                                    }
                                }}
                            />
                            <button
                                disabled={cStatus}
                                onClick={sendData}
                                className={`absolute right-10 text-white rounded-full flex items-center justify-center ${cStatus ? "opacity-40" : "opacity-100"}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
