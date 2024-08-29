import { ElementRef, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { UploadDropzone } from "@/utils/uploadthing";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";


interface RegisterTournamentProps {
    id: string
}

export default function RegisterTournament({ id }: RegisterTournamentProps) {
    const [isFirstDialogOpen, setIsFirstDialogOpen] = useState(false);
    const [isSecondDialogOpen, setIsSecondDialogOpen] = useState(false);
    const [isthreeialogOpen, setthreeDialogOpen] = useState(false);

    const [teamImage, setTeamImage] = useState("")
    const [teamName, setTeamName] = useState("public")
    const [status, setStatus] = useState("public")

    const closeRef = useRef<ElementRef<"button">>(null);
    const router = useRouter();
    const { data: session } = useSession();

    const [teams, setTeams] = useState([]);

    const [isRegistered, setIsRegistered] = useState(false);
    const [hasPendingInvite, setHasPendingInvite] = useState(false);





    const openSecondDialog = () => {
        setIsFirstDialogOpen(false);
        setIsSecondDialogOpen(true);
    };

    const openThreeDialog = async () => {
        setIsFirstDialogOpen(false);
        setthreeDialogOpen(true);
        try {
            const response = await axios.post('/api/tournament/getTeamPublic', { tournamentId: id, status: "public" });
            setTeams(response.data);
            console.log(response.data)
        } catch (error) {
            console.error('Error fetching teams:', error);
        }
    };

    const closeSecondDialog = () => {
        setIsSecondDialogOpen(false);
    };

    function handleSwitchChange(checked: boolean) {
        const newStatus = checked ? "private" : "public"
        setStatus(newStatus)
    }

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

    const createTeam = async () => {
        try {
            const response = await axios.post('/api/tournament/createTeam', {
                tournamentId: id,
                teamName: teamName,
                teamImage: teamImage,
                status: status,
                members: [
                    {
                        memberId: session?.user.id,
                        isLead: true
                    },
                ]
            });
            showToast("Create team successfully")
            router.refresh();
            closeRef?.current?.click();

        } catch (error) {
            showErrorToast("Error Create team")
            console.error("Error Create team:", error);

        }
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
            setHasPendingInvite(true)
        } catch (error) {
            showErrorToast("Error Invite team")
            console.error('Error sending invite:', error);
        }
    };

    useEffect(() => {
        const checkRegistrationStatus = async () => {
                try {
                    const response = await axios.post('/api/tournament/checkRegistration', {
                        userId: session?.user.id,
                        tournamentId: id
                    });
                    console.log(response.data)

                    setIsRegistered(response.data.isRegistered);
                    setHasPendingInvite(response.data.hasPendingInvite);
                } catch (error) {
                    console.error('Error checking registration status:', error);
                }
            }

        checkRegistrationStatus();
    }, [session, status, id]);

    return (
        <div>
            {/* First Dialog */}
            <Dialog open={isFirstDialogOpen} onOpenChange={setIsFirstDialogOpen}>
                <DialogTrigger asChild>
                    <Button
                        variant="destructive"
                        className="font-semibold text-lg"
                        onClick={() => setIsFirstDialogOpen(true)}
                        disabled={isRegistered || hasPendingInvite}
                    >
                        {isRegistered || hasPendingInvite ? "Registered" : "Register"}
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Register Tournament</DialogTitle>
                        <DialogDescription>
                            When participating in the tournament, you can create a team or
                            join an existing team.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-row justify-center items-center space-x-9 ">
                        <Button
                            variant="secondary"
                            className="font-semibold text-lg"
                            onClick={openSecondDialog}
                        >
                            Create Team
                        </Button>
                        <Button
                            variant="destructive"
                            className="font-semibold text-lg"
                            onClick={openThreeDialog}
                        >
                            Join Team
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* create team */}
            <Dialog open={isSecondDialogOpen} onOpenChange={setIsSecondDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Create Team</DialogTitle>
                        <DialogDescription>
                            Enter team information to create a team.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col justify-center items-center space-y-4">
                        <div className="border rounded-md outline-dashed w-60 h-60">
                            <UploadDropzone
                                appearance={{
                                    label: {
                                        color: "#FFFFFF"
                                    },
                                    allowedContent: {
                                        color: "#FFFFFF"
                                    }
                                }}
                                onClientUploadComplete={(res) => {
                                    console.log(res);
                                    const uploadedUrl = res?.[0]?.url;
                                    setTeamImage(uploadedUrl);
                                }} endpoint={"imageUploader"} />
                        </div>
                        <div className="flex flex-col items-start justify-center space-y-4">
                            <Label htmlFor="name" className="text-right">
                                Team Name
                            </Label>
                            <Input
                                id="name"
                                type="text"
                                className="w-60"
                                onChange={(e) => setTeamName(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col items-start justify-center space-y-4">
                            <div className="flex flex-row items-center justify-between rounded-lg  p-4 space-x-6 w-60">
                                <div className="text-lg">{status === "public" ? "Public" : "Private"}</div>
                                <Switch
                                    checked={status === "private"}
                                    onCheckedChange={handleSwitchChange}
                                />
                            </div>

                        </div>
                    </div>
                    <DialogFooter>
                        <div className="flex justify-between w-full ">
                            <DialogClose ref={closeRef} asChild>
                                <Button type="button" variant={"ghost"}>
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button onClick={createTeam} type="submit">Save changes</Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* join team */}
            <Dialog open={isthreeialogOpen} onOpenChange={setthreeDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Join Team</DialogTitle>
                        <DialogDescription>
                            Enter team information to create a team.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col justify-center items-center space-y-4">
                        {teams?.map((team: any, index) => (
                            <div key={index} className="p-3 rounded-md shadow-lg space-y-2 ">
                                <div className="flex flex-wrap items-center justify-between space-x-4 ">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-auto">
                                            <img src={team.teamImage} alt={team.teamName} className="w-12 h-12 rounded-full object-cover" />
                                        </div>
                                        <div className="w-auto">
                                            <h2 className="text-lg font-semibold text-coolGray-900">{team.teamName}</h2>
                                        </div>
                                    </div>
                                    <div className="w-auto">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>

                                                    <DialogClose ref={closeRef} asChild>
                                                        <Button
                                                            variant="ghost"
                                                            className='rounded-full w-10 h-10 p-0'
                                                            onClick={() => {
                                                                const leadMember = team.members.find((member: any) => member.isLead);
                                                                handleJoinTeam(team._id, leadMember ? leadMember.memberId : '');
                                                            }} >
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                                                <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                                                            </svg>
                                                        </Button>
                                                    </DialogClose>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Join the team</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </div>


                            </div>
                        ))}
                    </div>

                </DialogContent>
            </Dialog>
        </div>
    );
}
