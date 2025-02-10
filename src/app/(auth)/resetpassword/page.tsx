"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast";
import axios from "axios"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"



const formSchema = z.object({
    password: z.string().min(6, "Password must be at least 8 characters long."),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export default function ResetPasswordForm() {

    const [token, setToken] = useState("");
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const urlToken = window.location.search.split("=")[1];
        setToken(urlToken || "");
        console.log(urlToken)
    }, [])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {

        const password = values.password
        try {

            const response = await axios.post('/api/auth/resetpassword', {
                token,
                password
            });
            showToast(response.data.message)
            setSuccess(true);
            router.push("/login")
            

        } catch (error: any) {
            showErrorToast('Failed to reset password');
            console.error(error.data);
        }
    }

    function showErrorToast(message: string): void {
        toast({
            variant: "destructive",
            title: "Error",
            description: message,
        })
    }

    function showToast(message: string): void {
        toast({
            variant: "default",
            title: "Password reset successfully!",
            description: message,
        })
    }

    return (
       <div className=" w-full h-screen flex items-center justify-center">
         <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 md:w-1/2 bg-black/40 backdrop-blur-sm p-14  rounded-2xl">
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field, fieldState }) => (
                        <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="Enter new password" {...field} />
                            </FormControl>
                            <FormMessage>
                                {fieldState.error?.message}
                            </FormMessage>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field, fieldState }) => (
                        <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="Confirm new password" {...field} />
                            </FormControl>
                            <FormMessage>
                                {fieldState.error?.message}
                            </FormMessage>
                        </FormItem>
                    )}
                />
                <Button type="submit">Reset Password</Button>
            </form>
        </Form>
       </div>
    )
}
