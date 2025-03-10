"use client"


import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import axios from "axios"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"




export default function EnterUsername() {

    const router = useRouter()
    const { data: session, update } = useSession();
    const username = session?.user?.username || 'Username';
    const [newUsername, setNewUsername] = useState(username);
    const { toast } = useToast()

 
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
            router.push("/");
            router.refresh();


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
        <div className=" flex justify-center items-center flex-col h-screen space-y-4">
            <div className="flex flex-col">
                <div className="flex flex-row items-center justify-start space-x-3">
                    <Label htmlFor="username" className="text-right">
                        New Username
                    </Label>
                    <Input
                        id="username"
                        className=""
                        placeholder="alex"
                        onChange={(e) => setNewUsername(e.target.value)}
                    />
                </div>
            </div>

            <Button onClick={editUsername}
                variant={"default"}
            >
                Save
            </Button>
        </div>
    )
}
