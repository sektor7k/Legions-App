"use client";
import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";
import axios from "axios";
import useSWR, {mutate} from 'swr';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

const MessageItem = React.memo(({ message, isCurrentUser }: { message: { userId: string; userName: string; text: string; createdAt: string; avatar: string }, isCurrentUser: boolean }) => (
        <div className={`chat ${isCurrentUser ? "chat-end" : "chat-start"}`}>
            <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                    <img src={message.avatar} alt={message.userName} />
                </div>
            </div>
            <div className="chat-header font-bold">{message.userName}</div>
            <div className={`chat-bubble ${isCurrentUser ? "bg-gray-800 text-white" : "bg-gray-200 text-black"}`}>{message.text}</div>
            <div className="chat-footer">
                <time className="text-xs opacity-60">{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</time>
            </div>
        </div>
    ));

export default function ChatPage({ params }: { params: { id: string } }) {
    const [currentMsg, setCurrentMsg] = useState("");
    const { data: session } = useSession();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const socketRef = useRef<Socket | null>(null);

    const { data: messages = [], error } = useSWR(
        `${process.env.NEXT_PUBLIC_API_URL}/api/rooms/${params.id}/messages`,
        fetcher
    );

    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5001");

            socketRef.current.on("receive_msg", (msgData) => {
                mutate(`${process.env.NEXT_PUBLIC_API_URL}/api/rooms/${params.id}/messages`, 
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



    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendData = useCallback(async () => {
        if (currentMsg === "" || !session?.user?.username) return;

        const msgData = {
            roomId: params.id,
            userId: session.user.id,
            userName: session.user.username,
            text: currentMsg,
            createdAt: new Date().toISOString(),
            avatar: session.user.image,
        };

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/rooms/${params.id}/messages`, msgData);
            setCurrentMsg(""); // Sadece input'u temizle
        } catch (error) {
            console.error('Mesaj gönderme hatası:', error);
        }
    }, [currentMsg, session, params.id]);

    

    const renderedMessages = useMemo(() => {
        return messages.map((message: { userId: string; userName: string; text: string; createdAt: string; avatar: string }, index: number) => (
            <MessageItem 
                key={index} 
                message={message} 
                isCurrentUser={message.userId === session?.user?.id} 
            />
        ));
    }, [messages, session?.user?.id]);

    return (
        <div className="flex items-center justify-center mt-2 px-4 sm:px-6 lg:px-4 overflow-y-hidden">
            <div className="w-full max-w-7xl mt-4 mx-4 lg:mx-8">
                <div className="bg-black p-4 bg-opacity-50 backdrop-blur-md border-gradient rounded-lg min-h-[calc(90vh-2rem)]">
                    <div className="overflow-y-auto h-[calc(87vh-5rem)] p-2 px-6">
                        <div className="space-y-4">
                            {renderedMessages}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>
                    <div>
                        <div className="relative w-full p-2 px-6 flex items-center justify-center">
                            <input
                                className="w-full p-2 pl-4 pr-12 border rounded-full border-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
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
                                onClick={sendData}
                                className="absolute right-10 top-0 bottom-0 text-white rounded-full flex items-center justify-center"
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




