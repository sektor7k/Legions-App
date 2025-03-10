"use client";
import React from 'react';
import axios from 'axios';
import { Badge } from "@/components/ui/badge";
import { useSession } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import { toast } from '@/components/ui/use-toast';
import useSWR from 'swr';
import ErrorAnimation from '@/components/errorAnimation';
import LoadingAnimation from '@/components/loadingAnimation';

const fetcher = (url: string, params: any) =>
    axios.post(url, params).then(res =>
        res.data.sort((a: any, b: any) => {
            if (a.status === 'pending' && b.status !== 'pending') return -1;
            if (a.status !== 'pending' && b.status === 'pending') return 1;
            return new Date(b.invitedAt).getTime() - new Date(a.invitedAt).getTime();
        })
    );

export default function OutboxPage() {
    const { data: session } = useSession();
    const { data: invites, error, mutate } = useSWR(
        session?.user.id
            ? [`${process.env.NEXT_PUBLIC_API_URL}/tournament/invite/getOutbox`, { userId: session.user.id }]
            : null,
        ([url, params]) => fetcher(url, params)
    );

    function formatTime(date: Date): string {
        const now = new Date()
        const diff = now.getTime() - date.getTime()
        const minutes = Math.floor(diff / 60000)
        const hours = Math.floor(minutes / 60)
        const days = Math.floor(hours / 24)
        const weeks = Math.floor(days / 7)

        if (weeks > 0) return `${weeks}w ago`
        if (days > 0) return `${days}d ago`
        if (hours > 0) return `${hours}h ago`
        if (minutes > 0) return `${minutes}m ago`
        return "Just now"
    }


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

    const handleDeleteInvite = async (inviteId: string) => {
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/tournament/invite/deleteInvite`, { inviteId });
            mutate();
            showToast("Invite deleted successfully");
        } catch (error) {
            showErrorToast("Failed to delete invite");
            console.error('Error deleting invite:', error);
        }
    };
    if (error?.response?.status === 404) return <div className=" flex  justify-center items-center ">
    <p className="text-xl text-gray-400 pt-12">Outbox Empty </p>
</div>;

    if (error) return <div className=" flex h-screen justify-center items-center"><ErrorAnimation /></div>;
    if (!invites) return <div className=" flex h-screen justify-center items-center"><LoadingAnimation /></div>;

    return (
        <div className="max-w-4xl mx-auto p-8 space-y-8">
            <h1 className="text-3xl font-semibold text-center mb-8">Outbox</h1>
            {invites.length === 0 ? (
                <p className="text-center text-gray-500">No outbox available.</p>
            ) : (
                <div className="space-y-4 overflow-y-auto max-h-[80vh]">
                    {invites.map((invite: any, index: any) => (
                        <div key={index} className="p-6 rounded-lg bg-black bg-opacity-40 backdrop-blur-sm">
                            <div className="flex items-center space-x-4">
                                <img
                                    src={invite.teamId.teamImage}
                                    alt={invite.teamId.teamName}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                                />
                                <div className="flex-1 text-white">
                                    <h2 className="text-lg font-semibold">{invite.teamId.teamName}</h2>
                                    <p className="text-xs text-gray-400">
                                        Sent to: {invite.userId.username}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                    {formatTime(new Date(invite.invitedAt))}                                    </p>
                                </div>
                                <div className="flex justify-end items-center space-x-2">
                                    {invite.status === 'pending' && (
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDeleteInvite(invite._id)}
                                        >
                                            Delete
                                        </Button>
                                    )}
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
