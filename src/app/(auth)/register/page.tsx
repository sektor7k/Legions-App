"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
    IconBrandCashapp,
    IconBrandGithub,
    IconBrandGoogle,
    IconBrandOnlyfans,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import { ethers } from "ethers";

declare global {
    interface Window {
        ethereum?: any;
    }
}

export default function RegisterPage() {

    const router = useRouter();
    const { data: session } = useSession();
    const [user, setUser] = useState({
        username: "",
        email: "",
        password: "",
        password2: ""
    })

    useEffect(() => {
        if (session) {
            router.push("/"); 
        }
    }, [session, router]);

    const onSignup = async () => {

        // Şifre uyumunu kontrol et
        if (user.password !== user.password2) {
            showErrorToast("Passwords do not match.")
            return;
        }

        // Şifrenin uzunluğunu kontrol et
        if (user.password.length < 6) {
            showErrorToast("Password must be at least 6 characters.")
            return;
        }
        try {

            const response = await axios.post(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/signup`, user);
            console.log("Signup success", response);
            router.push("/verifyemail");
            showToast("Signup successfully!");

        } catch (error: any) {
            const errorMessage = error.response.data.message;
            showErrorToast(errorMessage);

        }
    }

    function showErrorToast(message: string): void {
        toast({
            variant: "destructive",
            title: "Signup failed",
            description: message,
        })
    }
    function showToastWallet(message: string): void {
        toast({
            variant: "default",
            title: "Please",
            description: message,
        })
    }

    function showToast(message: string): void {
        toast({
            variant: "default",
            title: "Please Check email",
            description: message,
        })
    }



    return (

        <div className="flex flex-row justify-center items-center w-full h-screen md:justify-between">
            <div className="relative flex-col justify-center h-full w-1/2 hidden md:flex">
                Lottie
            </div>
            <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 backdrop-blur-sm border-gradient">
                <h1 className="font-bold text-2xl text-neutral-800 dark:text-neutral-200">
                    SIGNUP
                </h1>
                <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
                    Castrum Legions a hoş geldiniz unutmayın biz bir aileyiz
                </p>

                <div className="my-8" >
                    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
                        <LabelInputContainer>
                            <Label htmlFor="username">User name</Label>
                            <Input
                                className=" rounded opacity-80"
                                id="username"
                                placeholder="Tyler"
                                type="text"
                                value={user.username}
                                onChange={(e) => setUser({ ...user, username: e.target.value })}
                            />
                        </LabelInputContainer>
                    </div>
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            className=" rounded opacity-80"
                            id="email"
                            placeholder="projectmayhem@fc.com"
                            type="email"
                            value={user.email}
                            onChange={(e) => setUser({ ...user, email: e.target.value })}
                        />
                    </LabelInputContainer>
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            className=" rounded opacity-80"
                            id="password"
                            placeholder="••••••••"
                            type="password"
                            value={user.password}
                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                        />
                    </LabelInputContainer>
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="password2">Password confirm</Label>
                        <Input
                            className=" rounded opacity-80"
                            id="password2"
                            placeholder="••••••••"
                            type="password"
                            value={user.password2}
                            onChange={(e) => setUser({ ...user, password2: e.target.value })}
                        />
                    </LabelInputContainer>

                    <button onClick={onSignup}
                        className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                        type="submit"
                    >
                        Sign up &rarr;
                        <BottomGradient />
                    </button>
                    <Button variant={"link"} onClick={() => router.push("/login")} className=" text-gray-500 mt-3">
                        Already a member? Login
                    </Button>
                    <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

                    <div className="flex flex-col space-y-4">
                        
                        {/* <button
                            onClick={() => signIn("github")}
                            className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                            type="submit"
                        >
                            <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                                Github
                            </span>
                            <BottomGradient />
                        </button> */}
                        <button
                            onClick={() => signIn("google")}
                            className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                            type="submit"
                        >
                            <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                                Google
                            </span>
                            <BottomGradient />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const BottomGradient = () => {
    return (
        <>
            <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
        </>
    );
};

const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={cn("flex flex-col space-y-2 w-full", className)}>
            {children}
        </div>
    );
};

