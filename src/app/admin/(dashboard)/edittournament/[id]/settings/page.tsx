"use client"

import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import axios from "axios";
import useSWR from "swr";

interface Tournament {
    visibleStatus: string;
    tournamentStatus: string;
    chatStatus: string;
    registerStatus: string;
    resultStatus: string;
}

const fetcher = (url: string, id: any) => axios.post(url, { id }).then(res => res.data);

export default function SettingsPage({ params }: { params: { id: string } }) {
    const { data: tournament, error, mutate } = useSWR<Tournament>(
        ['/api/tournament/getTournamentDetail', params.id] as const,
        ([url, id]) => fetcher(url, id)
    );

    const [visibleStatus, setVisibleStatus] = useState(false);
    const [tournamentStatus, setTournamentStatus] = useState(false);
    const [chatStatus, setChatStatus] = useState(false);
    const [userRegisterStatus, setUserRegisterStatus] = useState(false);
    const [resultStatus, setResultStatus] = useState(false);

    // SWR'den gelen verileri başlangıç state olarak ayarla
    useEffect(() => {
        if (tournament) {
            setVisibleStatus(tournament.visibleStatus === "open");
            setTournamentStatus(tournament.tournamentStatus === "open");
            setChatStatus(tournament.chatStatus === "open");
            setUserRegisterStatus(tournament.registerStatus === "open");
            setResultStatus(tournament.resultStatus === "open");
        }
    }, [tournament]);

    const handleStatusChange = async (field: keyof Tournament, value: boolean) => {
        const newValue = value ? "open" : "closed";

        try {
            await axios.post("/api/admin/tournament/settings/update", {
                id: params.id,
                [field]: newValue,
            });


        } catch (error) {
            console.error(`Failed to update ${field}:`, error);
        }
    };

    if (!tournament) return <div>Loading...</div>;

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Settings</h1>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Label htmlFor="visible-status" className="text-lg">
                        Visible Status
                    </Label>
                    <Switch
                        id="visible-status"
                        checked={visibleStatus}
                        onCheckedChange={(value) => {
                            setVisibleStatus(value);
                            handleStatusChange("visibleStatus", value);
                        }}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="tournament-status" className="text-lg">
                        Tournament Status
                    </Label>
                    <Switch
                        id="tournament-status"
                        checked={tournamentStatus}
                        onCheckedChange={(value) => {
                            setTournamentStatus(value);
                            handleStatusChange("tournamentStatus", value);
                        }}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="chat-status" className="text-lg">
                        Chat
                    </Label>
                    <Switch
                        id="chat-status"
                        checked={chatStatus}
                        onCheckedChange={(value) => {
                            setChatStatus(value);
                            handleStatusChange("chatStatus", value);
                        }}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="user-register-status" className="text-lg">
                        User Register
                    </Label>
                    <Switch
                        id="user-register-status"
                        checked={userRegisterStatus}
                        onCheckedChange={(value) => {
                            setUserRegisterStatus(value);
                            handleStatusChange("registerStatus", value);
                        }}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="match-result-status" className="text-lg">
                        Match Result
                    </Label>
                    <Switch
                        id="match-result-status"
                        checked={resultStatus}
                        onCheckedChange={
                            (value) => {
                                setResultStatus(value);
                                handleStatusChange("resultStatus", value);
                            }
                        }
                    />
                </div>
            </div>
        </div>
    );
}
