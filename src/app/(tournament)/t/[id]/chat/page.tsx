"use client";
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

// Sabit roomId tanımı
const roomId = "defaultRoomId"; // Bu sabit değeri daha sonra dinamik hale getirebilirsiniz.

// Socket.io bağlantısı
const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5001");

export default function ChatPage({ params }: { params: { id: string } }) {
    const [messages, setMessages] = useState<{ userName: string; text: string; createdAt: string, avatar: string }[]>([]);
    const [currentMsg, setCurrentMsg] = useState("");

    const { data: session } = useSession();
    const messagesEndRef = useRef<HTMLDivElement>(null);


    // Bağlantı ve olay dinleyicileri
    useEffect(() => {
        if (!params.id) return;

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rooms/${params.id}/messages`)
            .then(response => response.json())
            .then(data => {
                setMessages(data);
            })
            .catch(error => console.error('Mesajları alma hatası:', error));

        socket.emit("join_room", params.id);

        socket.on("receive_msg", (msgData) => {
            setMessages(prevMessages => [...prevMessages, msgData]);
        });

        return () => {
            socket.off("receive_msg");
        };
    }, [params.id, socket]);
    useEffect(() => {
        scrollToBottom(); // Her yeni mesajda en alta kaydır
    }, [messages]);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const sendData = async () => {
        if (currentMsg === "" || !session?.user?.username) return;

        const msgData = {
            roomId: params.id,
            userName: session.user.username,
            text: currentMsg,
            createdAt: new Date().toISOString(),
            avatar: session.user.image,
        };

        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rooms/${params.id}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(msgData),
        });

        setCurrentMsg("");
    };

    return (
        <div className="flex items-center justify-center mt-2 px-4 sm:px-6 lg:px-4 overflow-y-hidden">
            <div className="w-full max-w-7xl mt-4 mx-4 lg:mx-8">
                <div className="bg-black p-4 bg-opacity-50 backdrop-blur-md border-gradient rounded-lg min-h-[calc(90vh-2rem)]">
                    <div className="overflow-y-auto h-[calc(87vh-5rem)] p-2 px-6">
                        <div className="space-y-4">
                            {messages.map((message, index) => {
                                const isCurrentUser = message.userName === session?.user?.username;
                                return (
                                    <div
                                        key={index}
                                        className={`chat ${isCurrentUser ? "chat-end" : "chat-start"}`}
                                    >
                                        <div className="chat-image avatar">
                                            <div className="w-10 rounded-full">
                                                <img
                                                    src={message.avatar}
                                                    alt={message.userName}
                                                />
                                            </div>
                                        </div>
                                        <div className="chat-header font-bold">
                                            {message.userName}
                                        </div>
                                        <div className={`chat-bubble ${isCurrentUser ? "bg-gray-800 text-white" : "bg-gray-200 text-black"}`}>
                                            {message.text}
                                        </div>
                                        {/* <div className="chat-footer opacity-50">Delivered</div> */}
                                        <div className="chat-footer ">
                                            <time className="text-xs opacity-60">
                                                {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                                            </time>
                                        </div>
                                    </div>
                                );
                            })}
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
                                        e.preventDefault(); // Varsayılan enter davranışını engelle
                                        sendData(); // Mesajı gönder
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
