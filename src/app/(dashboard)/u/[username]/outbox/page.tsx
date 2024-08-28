"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Badge } from "@/components/ui/badge";
import { useSession } from 'next-auth/react';

export default function OutboxPage() {
    const [invites, setInvites] = useState<any[]>([]);
    const { data: session, status } = useSession();

    useEffect(() => {
        const fetchInvites = async () => {
            if (status === 'authenticated' && session?.user?.id) {
                try {
                    const userId = session.user.id;

                    // API'den davetleri alın
                    const response = await axios.post(`/api/tournament/invite/getOutbox`, { userId });
                    console.log(response.data);

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

    return (
        <div className="max-w-4xl mx-auto p-8 space-y-8">
            <h1 className="text-3xl font-semibold text-center mb-8">Outbox</h1>
            {invites.length === 0 ? (
                <p className="text-center text-gray-500">No outbox available.</p>
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
                                        src={invite.teamId.teamImage}
                                        alt={invite.teamId.teamName}
                                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                                    />
                                    <div className="flex-1 text-white">
                                        <h2 className="text-lg font-semibold">{invite.teamId.teamName}</h2>
                                    </div>
                                    <div className="flex justify-end">
                                        <Badge
                                            variant="default"
                                            className={`${invite.status === 'accepted' ? 'bg-green-500 text-white' :
                                                invite.status === 'rejected' ? 'bg-red-500 text-white' :
                                                    'bg-yellow-500 text-white'} px-4 py-2 rounded-full`}
                                        >
                                            {invite.status.charAt(0).toUpperCase() + invite.status.slice(1)}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
}
