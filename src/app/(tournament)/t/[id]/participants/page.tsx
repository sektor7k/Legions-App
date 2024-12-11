"use client"
import React, { ElementRef, useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { toast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { DialogClose } from '@radix-ui/react-dialog';
import useSWR from 'swr';

const fetcher = (url: string, params: any) => axios.post(url, params).then((res) => res.data);

export default function ParticipantsPage({ params }: { params: { id: string } }) {


    const { data: session } = useSession()
    const closeRef = useRef<ElementRef<"button">>(null);

    const { data: teams, error: teamsError, mutate: teamsMutate } = useSWR(
        params?.id ? ['/api/tournament/getTeam', { tournamentId: params.id }] : null,
        ([url, params]) => fetcher(url, params)
    );

    const { data: registrationData, error: registrationError, mutate: registrationMutate } = useSWR(
        session?.user?.id && params.id
            ? ['/api/tournament/checkRegistration', { userId: session.user.id, tournamentId: params.id }]
            : null,
        ([url, params]) => fetcher(url, params)
    );

    const isRegistered = registrationData?.isRegistered ?? false;
    const hasPendingInvite = registrationData?.hasPendingInvite ?? false;



    function showErrorToast(message: string): void {
        toast({
            variant: "destructive",
            title: message,
            description: "",
        })
    }

    function showToast(message: string): void {
        toast({
            variant: "default",
            title: message,
            description: "",
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
            registrationMutate();

        } catch (error) {
            showErrorToast("Error Invite team")
            console.error('Error sending invite:', error);
        }
    };

    const handleRemoveMember = async (teamId: string, memberId: string) => {
        try {
            const response = await axios.post('/api/tournament/deleteuserTeam', {
                teamId,
                memberId,
            });
            showToast("Member removed successfully");
            teamsMutate();
            registrationMutate();
        } catch (error) {
            showErrorToast("Error removing member");
            console.error('Error removing member:', error);
        }
    };

    const handleDeleteTeam = async (teamId: string) => {
        try {
            const response = await axios.post('/api/tournament/deleteTeam', { teamId });
            showToast("Team deleted successfully");

            teamsMutate();
            registrationMutate();
        } catch (error) {
            showErrorToast("Error deleting team");
            console.error('Error deleting team:', error);
        }
    };

    if (teamsError) return <div>Takım verileri yüklenirken hata oluştu: {teamsError.message}</div>;
    if (registrationError) return <div>Kayıt verileri yüklenirken hata oluştu: {registrationError.message}</div>;

    if (!teams || !registrationData) return <div>Yükleniyor...</div>;

    return (
        <div className="max-w-6xl mx-auto p-8 space-y-8">
            <div className="flex flex-col justify-center items-center">
                <p className="text-4xl font-extrabold border-gradient-bottom px-8 p-1">Participants</p>
                <p className="text-gray-400 text-sm font-semibold">Find the best team to fight and join.</p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {teams?.map((team: any, index: any) => (
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

                                    session?.user.id === team.members.find((member: any) => member.isLead)?.memberId._id ? (
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                className='rounded-full w-10 h-10 p-0'
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                                                    <path d="M4.293 18.293a1 1 0 0 1 0 1.414l-1.414 1.414a1 1 0 0 1-1.414-1.414l1.414-1.414a1 1 0 0 1 1.414 0zM5 13.5V16h2.5L18.207 5.293l-2.5-2.5L5 13.5zm9.207-10.207l2.5 2.5 1.586-1.586a1 1 0 0 0-1.414-1.414L14.207 3.293z" />
                                                                </svg>
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="sm:max-w-[425px]">
                                                            <DialogHeader>
                                                                <DialogTitle>Edit Team: {team.teamName}</DialogTitle>
                                                                <DialogDescription>
                                                                    Manage your team members or delete the team.
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <div className="grid gap-4 py-4">
                                                                {team.members.map((member: any, idx: any) => (
                                                                    <div key={idx} className="flex items-center justify-between">
                                                                        <div className="flex items-center space-x-3">
                                                                            <img
                                                                                src={member.memberId.image}
                                                                                alt={member.memberId.username}
                                                                                className="w-10 h-10 rounded-full object-cover"
                                                                            />
                                                                            <span className="text-base font-medium text-coolGray-900">
                                                                                {member.memberId.username}
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex items-center space-x-2">
                                                                            {member.isLead && (
                                                                                <Badge variant="destructive">Lead</Badge>
                                                                            )}
                                                                            {!member.isLead && (

                                                                                <DialogClose ref={closeRef} asChild>
                                                                                    <Button
                                                                                        variant="default"
                                                                                        size="sm"
                                                                                        onClick={() => handleRemoveMember(team._id, member.memberId._id)}
                                                                                    >
                                                                                        Drop
                                                                                    </Button>
                                                                                </DialogClose>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <DialogFooter>
                                                                <DialogClose ref={closeRef} asChild>
                                                                    <Button
                                                                        variant={"destructive"}
                                                                        onClick={() => handleDeleteTeam(team._id)}
                                                                    >
                                                                        Delete Team
                                                                    </Button>
                                                                </DialogClose>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Edit Team</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    ) : (
                                        <Badge variant="default">Private</Badge>
                                    )
                                ) : (
                                    session?.user.id === team.members.find((member: any) => member.isLead)?.memberId._id ? (
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                className='rounded-full w-10 h-10 p-0'
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                                                    <path d="M4.293 18.293a1 1 0 0 1 0 1.414l-1.414 1.414a1 1 0 0 1-1.414-1.414l1.414-1.414a1 1 0 0 1 1.414 0zM5 13.5V16h2.5L18.207 5.293l-2.5-2.5L5 13.5zm9.207-10.207l2.5 2.5 1.586-1.586a1 1 0 0 0-1.414-1.414L14.207 3.293z" />
                                                                </svg>
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="sm:max-w-[425px]">
                                                            <DialogHeader>
                                                                <DialogTitle>Edit Team: {team.teamName}</DialogTitle>
                                                                <DialogDescription>
                                                                    Manage your team members or delete the team.
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <div className="grid gap-4 py-4">
                                                                {team.members.map((member: any, idx: any) => (
                                                                    <div key={idx} className="flex items-center justify-between">
                                                                        <div className="flex items-center space-x-3">
                                                                            <img
                                                                                src={member.memberId.image}
                                                                                alt={member.memberId.username}
                                                                                className="w-10 h-10 rounded-full object-cover"
                                                                            />
                                                                            <span className="text-base font-medium text-coolGray-900">
                                                                                {member.memberId.username}
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex items-center space-x-2">
                                                                            {member.isLead && (
                                                                                <Badge variant="destructive">Lead</Badge>
                                                                            )}
                                                                            {!member.isLead && (

                                                                                <DialogClose ref={closeRef} asChild>
                                                                                    <Button
                                                                                        variant="default"
                                                                                        size="sm"
                                                                                        onClick={() => handleRemoveMember(team._id, member.memberId._id)}
                                                                                    >
                                                                                        Drop
                                                                                    </Button>
                                                                                </DialogClose>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <DialogFooter>
                                                                <DialogClose ref={closeRef} asChild>
                                                                    <Button
                                                                        variant={"destructive"}
                                                                        onClick={() => handleDeleteTeam(team._id)}
                                                                    >
                                                                        Delete Team
                                                                    </Button>
                                                                </DialogClose>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Edit Team</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    ) : (
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        className='rounded-full w-10 h-10 p-0'
                                                        disabled={isRegistered || hasPendingInvite}
                                                        onClick={() => {
                                                            const leadMember = team.members.find((member: any) => member.isLead);
                                                            handleJoinTeam(team._id, leadMember ? leadMember.memberId : '');
                                                        }}
                                                    >
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
                                    )
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
                                        <div className="flex items-center space-x-2">
                                            <div className={`text-sm font-medium ${member.isLead ? 'flex' : 'hidden'}`}>
                                                <Badge variant="destructive">Lead</Badge>
                                            </div>
                                            {/* Kullanıcı lider değilse ve kendisi ise, Drop butonunu göster */}
                                            {session?.user.id === member.memberId._id && !member.isLead && (

                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => handleRemoveMember(team._id, member.memberId._id)}
                                                            >
                                                                Quit
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Quit the team</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )}
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
