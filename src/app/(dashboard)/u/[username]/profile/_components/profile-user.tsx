import AvatarDemo from "@/components/layout/avatarDemo";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import {
    Dialog,
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

export default function ProfileUser() {

    const { data: session } = useSession();
    const username = session?.user?.username || 'defaultUsername';
    const email = session?.user?.email || 'defaultEmail';

    return (
        <div className="flex flex-col items-center space-y-2">

            <div className="relative">

                <AvatarUpload initialAvatarUrl={null} />

            </div>
            <div className="text-center">
                <h1 className="text-xl font-bold">{username}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">{email}</p>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant={"secondary"} className=" mt-4 ">Edit <span className="ml-2">
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
                                Make changes to your profile here. Click save when you're done.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col">
                            <div className="flex flex-row items-center justify-start space-x-3">
                                <Label htmlFor="name" className="text-right">
                                    New Username
                                </Label>
                                <Input
                                    id="name"
                                    className=""
                                    placeholder="alex"
                                />
                            </div>
                            <div className="flex flex-row items-center justify-start space-x-11">
                                <Label htmlFor="username" className="text-right">
                                    New Email
                                </Label>
                                <Input
                                    id="username"
                                    className=""
                                    placeholder="alex@gmail.com"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Save changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </div>
        </div>
    )
}