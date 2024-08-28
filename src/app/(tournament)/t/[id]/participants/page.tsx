"use client"
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';


export default function ParticipantsPage({ params }: { params: { id: string } }) {

    const [teams, setTeams] = useState([]);
    const {data:session} = useSession()
    const router = useRouter();
    const [isRegistered, setIsRegistered] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Takımları çek
                const teamsResponse = await axios.post('/api/tournament/getTeam', { tournamentId: params.id });
                setTeams(teamsResponse.data);
    
                // Kayıt durumunu kontrol et
                const registrationResponse = await axios.post('/api/tournament/checkRegistration', {
                    userId: session?.user.id,
                    tournamentId: params.id
                });
                console.log(registrationResponse.data);
    
                setIsRegistered(registrationResponse.data.isRegistered);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
        if (session?.user.id) {
            fetchData();
        }
    }, [session, params.id]);
    

    function showErrorToast(message: string): void {
        toast({
            variant: "destructive",
            title: "Invite team failed",
            description: message,
        })
    }

    function showToast(message: string): void {
        toast({
            variant: "default",
            title: "Invite Team",
            description: message,
        })
    }

    const handleJoinTeam = async (teamId: string, leadId: string) => {

        const userId = session?.user.id
        
        try {
            const response = await axios.post('/api/tournament/invite/sendInvite', {
                teamId,
                userId,
                leadId,
            });
            showToast("Invite team successfully")
            router.refresh();
        } catch (error) {
            showErrorToast("Error Invite team")
            console.error('Error sending invite:', error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-8 space-y-8">
            <div className="flex flex-col justify-center items-center">
                <p className="text-4xl font-extrabold border-gradient-bottom px-8 p-1">Participants</p>
                <p className="text-gray-400 text-sm font-semibold">Find the best team to fight and join.</p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {teams?.map((team: any, index) => (
                    <div key={index} className="p-6 bg-black bg-opacity-40 backdrop-blur-sm rounded-md shadow-lg space-y-2">
                        <div className="flex flex-wrap items-center justify-between mb-4 border-gradient-bottom pb-4">
                            <div className="flex items-center space-x-4">
                                <div className="w-auto">
                                    <img src={team.teamImage} alt={team.teamName} className="w-12 h-12 rounded-full object-cover" />
                                </div>
                                <div className="w-auto">
                                    <h2 className="text-lg font-semibold text-coolGray-900">{team.teamName}</h2>
                                </div>
                            </div>
                            <div className="w-auto">
                                {team.status === "private" ? (
                                    <Badge variant="default">Private</Badge>

                                ) : (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button 
                                                variant="ghost"
                                                 className='rounded-full w-10 h-10 p-0'
                                                 disabled={isRegistered}
                                                 onClick={() => {
                                                    const leadMember = team.members.find((member: any) => member.isLead);
                                                    handleJoinTeam(team._id, leadMember ? leadMember.memberId : '');
                                                }}                                                 >
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                                        <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                                                    </svg>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Join the team</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            {team.members
                                 .sort((a: any, b: any) => (b.isLead ? 1 : 0) - (a.isLead ? 1 : 0)) // Lead olanı başa getir
                                .map((member: any, idx: any) => (
                                    <div key={idx} className="flex flex-row items-center justify-between space-x-3">
                                        <div className='flex flex-row items-center justify-center space-x-3'>
                                            <div className="w-auto">
                                                <img
                                                    src={member.memberId.image}
                                                    alt={member.memberId.username}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                            </div>
                                            <div className="w-auto">
                                                <span
                                                    className={"text-base font-medium text-coolGray-900"}
                                                >
                                                    {member.memberId.username}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={`text-sm font-medium ${member.isLead ? 'flex' : 'hidden'}`}>
                                            <Badge variant="destructive">Lead</Badge>

                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
