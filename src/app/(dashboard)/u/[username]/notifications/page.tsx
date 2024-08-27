"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Badge } from "@/components/ui/badge";

export default function NotificationsPage() {
    const [invites, setInvites] = useState([]);

    // useEffect(() => {
    //     const fetchInvites = async () => {
    //         try {
    //             // Şu anki kullanıcının leadId'sini alın
    //             const leadId = 'currentLeadId'; // Bunu gerçek kullanıcının leadId'si ile değiştirin

    //             // API'den davetleri alın
    //             const response = await axios.post(`/api/invites/lead/`, { leadId });
    //             setInvites(response.data);
    //         } catch (error) {
    //             console.error('Error fetching invites:', error);
    //         }
    //     };

    //     fetchInvites();
    // }, []);

    return (
        <div className="max-w-4xl mx-auto p-8 space-y-8">
            <h1 className="text-3xl font-semibold text-center mb-8">Notifications</h1>
            {invites.length === 0 ? (
                <p className="text-center text-gray-500">No notifications available.</p>
            ) : (
                <div className="space-y-4">
                    {invites?.map((invite:any, index) => (
                        <div key={index} className="p-4 bg-white rounded-md shadow-md">
                            <div className="flex items-center space-x-4">
                                <img
                                    src={invite.userAvatar}
                                    alt={invite.userName}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div>
                                    <h2 className="text-lg font-semibold">{invite.userName}</h2>
                                    <p className="text-sm text-gray-500">
                                        wants to join your team: <span className="font-semibold">{invite.teamName}</span>
                                    </p>
                                </div>
                                <div className="ml-auto">
                                    <img
                                        src={invite.teamLogo}
                                        alt={invite.teamName}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
