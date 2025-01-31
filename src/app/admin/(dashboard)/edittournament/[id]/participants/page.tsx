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
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { toast } from '@/components/ui/use-toast';
import { DialogClose } from '@radix-ui/react-dialog';
import useSWR from 'swr';
import ErrorAnimation from '@/components/errorAnimation';
import LoadingAnimation from '@/components/loadingAnimation';
import { Input } from '@/components/ui/input';
import { UploadButton } from '@/utils/uploadthing';
import { Switch } from '@/components/ui/switch';



const fetcher = (url: string, params: any) => axios.post(url, params).then((res) => res.data);


export default function ParticipantsPage({ params }: { params: { id: string } }) {


    const { data: session } = useSession()
    const closeRef = useRef<ElementRef<"button">>(null);
    const [teamName, setTeamName] = useState("");
    const [teamImage, setTeamImage] = useState("");
    const [status, setStatus] = useState("")


    const { data: teams, error: teamsError, mutate: teamsMutate } = useSWR(
        params?.id ? ['/api/tournament/team/getTeam', { tournamentId: params.id }] : null,
        ([url, params]) => fetcher(url, params)
    );






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


    const handleRemoveMember = async (teamId: string, memberId: string) => {
        try {
            const response = await axios.post('/api/tournament/team/deleteuserTeam', {
                teamId,
                memberId,
            });
            showToast("Member removed successfully");
            teamsMutate();
        } catch (error) {
            showErrorToast("Error removing member");
            console.error('Error removing member:', error);
        }
    };

    const handleDeleteTeam = async (teamId: string) => {
        try {
            const response = await axios.post('/api/tournament/team/deleteTeam', { teamId });
            showToast("Team deleted successfully");

            teamsMutate();
  
        } catch (error) {
            showErrorToast("Error deleting team");
            console.error('Error deleting team:', error);
        }
    };

    const handleEditTeam = async (teamId: string) => {
        try {
            const response = await axios.post('/api/tournament/team/editTeam', { teamId, teamName, teamImage, status })
            showToast("Edit team successfully");
            teamsMutate();
        } catch (error) {
            showErrorToast("Error edit team");
            console.error('Error edit team:', error);
        }
    }
    function handleSwitchChange(checked: boolean) {
        const newStatus = checked ? "private" : "public"
        setStatus(newStatus)
    }

    if (teamsError?.response?.status === 404) return <div className=" flex h-screen z-20 justify-center items-center bg-black/40 backdrop-blur-xl ">
        <p className="text-4xl text-gray-400">Team not yet created </p>
    </div>;
    if (teamsError) return <div className=" flex h-screen justify-center items-center"><ErrorAnimation /></div>;
    if (!teams) return <div className=" flex h-screen justify-center items-center"><LoadingAnimation /></div>;

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
                                            <DialogTitle>Edit Team</DialogTitle>
                                            <DialogDescription>
                                                Manage your team members or delete the team.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <Tabs defaultValue="account" >
                                            <TabsList className="grid w-full grid-cols-2 bg-gray-900">
                                                <TabsTrigger value="members">Memebers</TabsTrigger>
                                                <TabsTrigger value="detail">Team Detail</TabsTrigger>
                                            </TabsList>
                                            <TabsContent value="members">
                                                <div className="grid gap-4 py-5">
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
                                            </TabsContent>
                                            <TabsContent value="detail">
                                                <div className='flex flex-col gap-3 py-5'>
                                                    <div className='flex flex-row items-center gap-2'>
                                                        <p className='text-gray-300 font-medium'>Team Name:</p>
                                                        <Input onChange={(e) => setTeamName(e.target.value)} defaultValue={team.teamName} className='h-7' />
                                                    </div>
                                                    <div className='flex flex-row items-center gap-4'>
                                                        <p className='text-gray-300 font-medium'>Team Logo:</p>
                                                        <div className="rounded-md b">
                                                            <UploadButton
                                                                onClientUploadComplete={(res) => {
                                                                    console.log(res);
                                                                    const uploadedUrl = res?.[0]?.url;
                                                                    setTeamImage(uploadedUrl);
                                                                }} endpoint={"imageUploader"} />
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-start justify-center space-y-4">
                                                        <div className="flex flex-row items-center justify-between rounded-lg  p-4 space-x-6 w-60">
                                                            <div className="text-lg">{status === "public" ? "Public" : "Private"}</div>
                                                            <Switch
                                                                defaultChecked={team.status === "private"}
                                                                onCheckedChange={handleSwitchChange}
                                                            />
                                                        </div>

                                                    </div>
                                                </div>

                                            </TabsContent>
                                        </Tabs>


                                        <DialogFooter >
                                            <div className='flex w-full justify-between'>
                                                <DialogClose ref={closeRef} asChild>
                                                    <Button
                                                        variant={"destructive"}
                                                        onClick={() => handleDeleteTeam(team._id)}
                                                    >
                                                        Delete Team
                                                    </Button>
                                                </DialogClose>
                                                <Button onClick={() => handleEditTeam(team._id)} >
                                                    Save
                                                </Button>
                                            </div>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>



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
