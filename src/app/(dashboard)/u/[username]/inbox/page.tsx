"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Badge } from "@/components/ui/badge";
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

export default function InboxPage() {
    const [invites, setInvites] = useState<any[]>([]); // invites için başlangıç değeri boş dizi
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        const fetchInvites = async () => {
            if (status === 'authenticated' && session?.user?.id) {
                try {
                    const leadId = session.user.id;

                    // API'den davetleri alın
                    const response = await axios.post(`/api/tournament/invite/getInvite`, { leadId });
                    console.log(response.data)

                    // Gelen verinin bir dizi olduğundan emin olun
                    if (Array.isArray(response.data)) {
                        setInvites(response.data);
                    } else {
                        console.error('Unexpected response format:', response.data);
                    }
                } catch (error) {
                    console.error('Error fetching invites:', error);
                }
            }
        };

        fetchInvites();
    }, [session, status]);

    function showErrorToast(message: string): void {
        toast({
            variant: "destructive",
            title: "Invite Reject",
            description: message,
        })
    }

    function showToast(message: string): void {
        toast({
            variant: "default",
            title: "Invite Accept",
            description: message,
        })
    }

    const handleAcceptInvite = async (inviteId: string) => {
        try {

            // API'den davetleri alın
            const response = await axios.post(`/api/tournament/invite/replyInvite`, { id: inviteId, reply: "accept" });
            showToast("")
            router.refresh();
            console.log(response.data)

        } catch (error) {
            showErrorToast("Error Invite reply")
            console.error('Error fetching invites:', error);
        }
    }

    const handleRejectInvite = async (inviteId: string) => {
        try {

            // API'den davetleri alın
            const response = await axios.post(`/api/tournament/invite/replyInvite`, { id: inviteId, reply: "reject" });
            showErrorToast("")
            router.refresh();
            console.log(response.data)

        } catch (error) {
            showErrorToast("Error Invite reply")
            console.error('Error fetching invites:', error);
        }
    }


    return (
        <div className="max-w-4xl mx-auto p-8 space-y-8 ">
            <h1 className="text-3xl font-semibold text-center mb-8">Inbox</h1>
            {invites.length === 0 ? (
                <p className="text-center text-gray-500">No inbox available.</p>
            ) : (
                <div className="space-y-4 overflow-y-auto max-h-[80vh]">
                    {invites
                        .sort((a: any, b: any) => {
                            if (a.status === 'pending' && b.status !== 'pending') return -1;
                            if (a.status !== 'pending' && b.status === 'pending') return 1;
                            return new Date(b.invitedAt).getTime() - new Date(a.invitedAt).getTime();
                        })
                        .map((invite: any, index) => (
                            <div key={index} className="p-6 rounded-lg bg-black bg-opacity-40 backdrop-blur-sm">
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={invite.userId.image}
                                        alt={invite.userId.username}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div className="flex-1">
                                        <h2 className="text-lg font-semibold">{invite.userId.username}</h2>
                                        <p className="text-sm text-gray-500">
                                            Wants to join your team: <span className="font-semibold">{invite.teamId.teamName}</span>
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            Sent at: {new Date(invite.invitedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                                        </p>
                                    </div>
                                    <div>
                                        <img
                                            src={invite.teamId.teamImage}
                                            alt={invite.teamId.teamName}
                                            className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-2 mt-4">
                                    {invite.status === 'pending' ? (
                                        <>
                                            <Button
                                                variant="outline"
                                                className="text-green-500 border-green-500"
                                                onClick={() => handleAcceptInvite(invite._id)}
                                            >
                                                Accept
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="text-red-500 border-red-500"
                                                onClick={() => handleRejectInvite(invite._id)}
                                            >
                                                Reject
                                            </Button>
                                        </>
                                    ) : (
                                        <Badge variant="default" className={`${invite.status === 'accepted' ? 'bg-green-500' : 'bg-red-500'
                                            }`}>
                                            {invite.status.charAt(0).toUpperCase() + invite.status.slice(1)}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </div>


    );
}
