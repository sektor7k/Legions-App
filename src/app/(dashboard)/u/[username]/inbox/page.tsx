"use client";
import React from 'react';
import axios from 'axios';
import { Badge } from "@/components/ui/badge";
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
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

export default function InboxPage() {
    const { data: session, status } = useSession();

    const { data: invites, error, mutate } = useSWR(session?.user.id ? [`${process.env.NEXT_PUBLIC_API_URL}/tournament/invite/getInvite`, { leadId: session.user.id, userId: session.user.id }] : null, ([url, params]) => fetcher(url, params));


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

    const handleAcceptInvite = async (inviteId: string) => { 
        try {
            // API'den davetleri alın
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/tournament/invite/replyInvite`, { id: inviteId, reply: "accept" });
            showToast("Invite accepted");
            mutate()

        } catch (error: any) {
            if (error.response) {
                // Sunucudan dönen hata
                console.error("Response error:", error.response.data);
            } else if (error.request) {
                // İstek gönderildi ama cevap alınamadı
                console.error("Request error:", error.request);
            } else {
                // Hata isteğin oluşturulması sırasında meydana geldi
                console.error("Error message:", error.message);
            }
            showErrorToast(error.response?.data?.message || "An error occurred.");
        }
    };


    const handleRejectInvite = async (inviteId: string) => {
        try {
            // API'den davetleri alın
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/tournament/invite/replyInvite`, { id: inviteId, reply: "reject" });
            showErrorToast("Invite rejected successfully");
            mutate();

        } catch (error) {
            showErrorToast("Error rejecting invite");
            console.error('Error processing invite:', error);
        }
    };

    if (error?.response?.status === 404) return <div className=" flex  justify-center items-center ">
        <p className="text-xl text-gray-400 pt-12">Inbox Empty </p>
    </div>;

    if (error) return <div className=" flex h-screen justify-center items-center"><ErrorAnimation /></div>;
    if (!invites) return <div className=" flex h-screen justify-center items-center"><LoadingAnimation /></div>;

    return (
        <div className="max-w-4xl mx-auto p-8 space-y-8">
            <h1 className="text-3xl font-semibold text-center mb-8">Inbox</h1>

            {invites.length === 0 ? (
                <p className="text-center text-gray-500">No inbox available.</p>
            ) : (
                <div className="space-y-4 overflow-y-auto max-h-[80vh] scrollbar-hide">
                    {invites.map((invite: any, index: any) => (
                        <div key={index}>
                            {invite.inviteType === 'leader' && (
                                <div className="p-6 rounded-lg bg-black bg-opacity-40 backdrop-blur-sm mb-4">
                                    <div className="flex items-center space-x-4">
                                        <img
                                            src={invite.userId.image}
                                            alt={invite.userId.username}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div className="flex-1">
                                            <h2 className="text-lg font-semibold">{invite.userId.username}</h2>
                                            <p className="text-sm text-gray-200">
                                                Wants to join your team: <span className="font-bold text-yellow-400">{invite.teamId.teamName}</span>
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {formatTime(new Date(invite.invitedAt))}
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
                                            <Badge
                                                variant="default"
                                                className={`${invite.status === 'accepted' ? 'bg-green-500' : 'bg-red-500'}`}
                                            >
                                                {invite.status.charAt(0).toUpperCase() + invite.status.slice(1)}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            )}

                            {invite.inviteType === 'member' && (
                                <div className="p-6 rounded-lg bg-black bg-opacity-40 backdrop-blur-sm mb-4">
                                    <h2 className="text-xl font-bold text-white mb-2">
                                        🌟 New Team Invitation!
                                    </h2>
                                    <div className="flex items-center space-x-4">
                                        <img
                                            src={invite.leadId.image}
                                            alt={invite.leadId.username}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-200 mb-4">
                                                You have been invited to join the team
                                                <span className="font-bold text-yellow-400"> {invite.teamId.teamName} </span>
                                                as a <span className="font-bold text-green-400">Member</span>.
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {formatTime(new Date(invite.invitedAt))}
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
                                            <Badge
                                                variant="default"
                                                className={`${invite.status === 'accepted' ? 'bg-green-500' : 'bg-red-500'}`}
                                            >
                                                {invite.status.charAt(0).toUpperCase() + invite.status.slice(1)}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>


    );
}
