import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AvatarUpload from "./avatarUpload";
import { ElementRef, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { mutate } from "swr";

interface UserProps {
    id: string | undefined;
    username: string | undefined;
    email: string | undefined;
    image: string | undefined;
}

export default function ProfileUser({ id, username, email, image }: UserProps) {

    const name = username || 'Username';
    const mail = email || 'user@gmail.com';
    const closeRef = useRef<ElementRef<"button">>(null);
    const [newUsername, setNewUsername] = useState(mail);
    const { toast } = useToast()
    const {data: session, update} =useSession();



    const editUsername = async () => {
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/user/editUser`,
                { newUsername },
                {
                    headers: {
                        Authorization: `Bearer ${session?.accessToken || ""}`,
                        "Content-Type": "application/json",
                      },
                }
            ); 
            update({ username: response.data.user.username })
            showToast("your username has been successfully updated")
            await mutate([`${process.env.NEXT_PUBLIC_API_URL}/user/getUser`, {}])
            closeRef?.current?.click();

        } catch (error) {
            console.log(error)
            showErrorToast("Error")
        }


    }

    function showErrorToast(message: string): void {
        toast({
            variant: "destructive",
            title: "Edit Username failed",
            description: message,
        })
    }

    function showToast(message: string): void {
        toast({
            variant: "default",
            title: `New Username ${newUsername}`,
            description: message,
        })
    }


    return (
        <div className="flex flex-row items-center space-x-4">

            <div className="relative">

                <AvatarUpload initialAvatarUrl={null} />

            </div>
            <div className="flex flex-col justify-start">
                <h1 className="text-3xl font-bold">{name}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">{mail}</p>

                <div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant={"destructive"} className=" mt-4 ">Edit <span className="ml-2 ">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                </svg>
                            </span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Edit profile</DialogTitle>
                                <DialogDescription>
                                    Make changes to your profile here. Click save when you&apos;re done.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col">
                                <div className="flex flex-row items-center justify-start space-x-3">
                                    <Label htmlFor="username" className="text-right">
                                        New Username
                                    </Label>
                                    <Input
                                        id="username"
                                        className=""
                                        placeholder="alex"
                                        defaultValue={name}
                                        onChange={(e) => setNewUsername(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-between ">
                                <DialogClose ref={closeRef} asChild>
                                    <Button type="button" variant={"ghost"}>
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button onClick={editUsername}
                                    variant={"secondary"}
                                >
                                    Save
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

            </div>
        </div>
    )
}