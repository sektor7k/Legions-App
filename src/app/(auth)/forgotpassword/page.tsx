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
import { useToast } from "@/components/ui/use-toast"
import axios from "axios" 


// E-posta için Zod doğrulama şeması
const formSchema = z.object({
  email: z.string().min(1, "Please enter your email address.").email("Invalid email address."),
})

export default function ForgotPasswordForm() {

    const { toast } = useToast()
  
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          email: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            
            const response = await axios.post("/api/auth/forgotpassword", values);
            console.log("Send email", response.data.message);
            showToast("Password renewal link has been sent to your e-mail address.");

        } catch (error: any) {
            const errorMessage = error.response.data.message;
            showErrorToast(errorMessage);
           
        }
    }

    function showErrorToast(message: string): void {
        toast({
            variant: "destructive",
            title: "Forgot password failed",
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
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field, fieldState }) => (
                        <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="you@example.com" {...field} />
                            </FormControl>
                            <FormDescription>
                                Please enter the email address associated with your account to receive a password reset link.
                            </FormDescription>
                            <FormMessage>
                                {fieldState.error?.message}
                            </FormMessage>
                        </FormItem>
                    )}
                />
                <Button type="submit">Send Reset Link</Button>
            </form>
        </Form>
    )
}
