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
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import { ethers } from "ethers";

declare global {
    interface Window {
        ethereum?: any;
    }
}


export default function LoginPage() {

    const router = useRouter();
    const { data: session } = useSession();
    const { toast } = useToast()



    const [user, setUser] = useState({
        email: "",
        password: "",
        redirect: false,
    })

    useEffect(() => {
        if (session?.user) {
            router.push("/");
        }
    }, [session, router]);

    const onLogin = async () => {
        try {
            const response = await signIn("credentials", user);
            console.log(response)
            if (response?.error) {
                showErrorToast(response.error);
            } else {
                showToast("Welcome");
            }
        } catch (error: any) {
            console.log(error)
            showErrorToast("Error");

        }
    }


    function showErrorToast(message: string): void {
        toast({
            variant: "destructive",
            title: "Logion failed",
            description: message,
        })
    }

    function showToast(message: string): void {
        toast({
            variant: "default",
            title: "Login Succesfuly",
            description: message,
        })
    }

    async function loginMetamask() {
        try {
            if (!window.ethereum) {
                window.alert("Please install MetaMask first.");
                return;
            }

            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const publicAddress = await signer.getAddress();
            console.log("PUBLIC ADDRESS", publicAddress);

            // Nonce oluşturma API'sine istek gönder
            const response = await axios.post('/api/auth/crypto/generateNonce', { publicAddress });
            console.log("RESPONSE", response.data);

            if (!response.data.nonce) {
                console.error("Failed to fetch nonce");
                return;
            }

            // Nonce'u imzala
            const signedNonce = await signer.signMessage(response.data.nonce);
            console.log("SIGNED NONCE", signedNonce);

            await signIn("crypto", {
                publicAddress,
                signedNonce,
                callbackUrl: "/",
            });
            showToast("Welcome");

        } catch (error: any) {
            const errorMessage = error.response.data.message;
            showErrorToast(errorMessage);
        }
    }


    return (
        <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black border border-gray-700 ">
            <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
                LOGIN
            </h2>
            <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
                Castrum Legionsa hoş geldiniz. Unutmayın biz bir aileyiz
            </p>

            <div className="my-8" >
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">

                </div>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
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
                        id="password"
                        placeholder="••••••••"
                        type="password"
                        value={user.password}
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                    />
                </LabelInputContainer>


                <button onClick={onLogin}
                    className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                    type="submit"
                >
                    Login &rarr;
                    <BottomGradient />
                </button>

                <Button variant={"link"} onClick={() => router.push("/register")} className=" text-gray-500 mt-3">
                    Don&apos;t have an account? Register
                </Button>
                <Button variant={"link"} onClick={() => router.push("/forgotpassword")} className=" text-gray-500 mt-3">
                    Forgot password
                </Button>

                <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

                <div className="flex flex-col space-y-4">
                    <button
                        onClick={loginMetamask}
                        className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                        type="submit"
                    >
                        <svg viewBox="0 0 64 64" className=" h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#f8f7f7">
                            <g id="SVGRepo_bgCarrier" stroke-width="0">
                            </g>
                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round">
                            </g>
                            <g id="SVGRepo_iconCarrier">
                                <path d="m54 26 2 2-4 4 4 12-2 10-12-4-6 4h-8l-6-4-12 4-2-10 4-12-4-4 2-2-2-10 2-8 14 8h16l14-8 2 8-2 10z">
                                </path>
                                <path d="m40 16-2 8-2 16h-8l-2-16-2-8">
                                </path>
                                <path d="m28 40-6 10">
                                </path>
                                <path d="m36 40 6 10">
                                </path>
                                <path d="M32 48v6">
                                </path>
                                <path d="m12 32 14-8">
                                </path>
                                <path d="m38 24 14 8">
                                </path>
                                <path d="m28 40-10-4">
                                </path>
                                <path d="m36 40 10-4">
                                </path>
                            </g>
                        </svg>
                        <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                            Metamask
                        </span>
                        <BottomGradient />
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            signIn("github")
                        }}
                        className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                        type="submit"
                    >
                        <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                        <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                            GitHub
                        </span>
                        <BottomGradient />
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            signIn("google")
                        }}
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

