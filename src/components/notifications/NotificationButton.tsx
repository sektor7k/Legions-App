// components/NotificationButton.tsx
"use client";

import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, X } from "lucide-react";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import axios from "axios";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Import modüler sekme bileşenleri
import InboxTab from "./InboxTab";
import OutboxTab from "./OutboxTab";
import MessageTab from "./MessageTab";

const fetcher = (url: string, params: any) =>
    axios.post(url, params).then((res) =>
        res.data.sort((a: any, b: any) => {
            if (a.status === "pending" && b.status !== "pending") return -1;
            if (a.status !== "pending" && b.status === "pending") return 1;
            return new Date(b.invitedAt).getTime() - new Date(a.invitedAt).getTime();
        })
    );

export default function NotificationButton() {
    const { data: session } = useSession();

    const [open, setOpen] = useState(false);

    const { data: invites, error, mutate } = useSWR(
        session?.user?.id
            ? [
                `${process.env.NEXT_PUBLIC_API_URL}/tournament/invite/getInvite`,
                { leadId: session.user.id, userId: session.user.id },
            ]
            : null,
        ([url, params]) => fetcher(url, params)
    );

    const pendingInvites = invites ? invites.filter((invite: any) => invite.status === "pending") : [];

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button className="relative  rounded-xl hover:bg-gray-800">
                    <Bell className=" h-10 w-10 p-2 " />
                    {pendingInvites.length > 0 && (
                        <Badge className="absolute top-0 right-0 rounded-full bg-red-500 w-5 h-5 p-1.5">
                            {pendingInvites.length}
                        </Badge>
                    )}
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-4 bg-black border border-gray-900 rounded-3xl">
                {/* Header alanı: Başlık ve Çarpı Butonu */}
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold">Notifications</h3>

                    <button onClick={() => setOpen(false)}>
                        <X className="h-5 w-5" />
                    </button>

                </div>
                {/* İnce gri divider - tüm genişliği kaplar */}
                <hr className="h-px bg-gray-900 border-0 mb-3" />
                <Tabs defaultValue="inbox">
                    <TabsList className="bg-transparent mb-3">
                        <TabsTrigger
                            value="inbox"
                            className="py-2 px-4 border-b-2 rounded-none border-transparent transition ease-in-out duration-150 transform hover:scale-105 hover:shadow-md data-[state=active]:border-red-600 data-[state=active]:bg-transparent hover:bg-transparent"
                        >
                            Inbox
                        </TabsTrigger>
                        <TabsTrigger
                            value="outbox"
                            className="py-2 px-4 border-b-2 rounded-none border-transparent transition ease-in-out duration-150 transform hover:scale-105 hover:shadow-md data-[state=active]:border-red-600 data-[state=active]:bg-transparent hover:bg-transparent"
                        >
                            Outbox
                        </TabsTrigger>
                        <TabsTrigger
                            disabled
                            value="message"
                            className="py-2 px-4 border-b-2 rounded-none border-transparent transition ease-in-out duration-150 transform hover:scale-105 hover:shadow-md data-[state=active]:border-red-600 data-[state=active]:bg-transparent hover:bg-transparent"
                        >
                            Message
                        </TabsTrigger>
                    </TabsList>
                    {/* Divider between tabs header and tabs content */}
                    <hr className="h-px bg-gray-900 border-0 " />
                    <TabsContent value="inbox">
                        <InboxTab invites={invites} error={error} mutate={mutate} />
                    </TabsContent>
                    <TabsContent value="outbox">
                        <OutboxTab />
                    </TabsContent>
                    <TabsContent value="message">
                        <MessageTab />
                    </TabsContent>
                </Tabs>
            </PopoverContent>
        </Popover>
    );
}
