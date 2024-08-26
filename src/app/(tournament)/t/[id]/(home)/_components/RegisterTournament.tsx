import { ElementRef, useRef, useState } from "react";
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

    const [teamImage, setTeamImage] = useState("public")
    const [teamName, setTeamName] = useState("public")
    const [status, setStatus] = useState("public")

    const closeRef = useRef<ElementRef<"button">>(null);
    const router = useRouter();
    const { data: session } = useSession();




    const openSecondDialog = () => {
        setIsFirstDialogOpen(false);
        setIsSecondDialogOpen(true);
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
            title: "Create team failed",
            description: message,
        })
    }

    function showToast(message: string): void {
        toast({
            variant: "default",
            title: "Create Team",
            description: message,
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
                        name: session?.user.username,
                        avatar: session?.user.image,
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

    return (
        <div>
            {/* First Dialog */}
            <Dialog open={isFirstDialogOpen} onOpenChange={setIsFirstDialogOpen}>
                <DialogTrigger asChild>
                    <Button
                        variant="destructive"
                        className="font-semibold text-lg"
                        onClick={() => setIsFirstDialogOpen(true)}
                    >
                        Register
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
        </div>
    );
}
