"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import axios from "axios"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

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
      const response = await axios.post("/api/auth/forgotpassword", values)
      console.log("Send email", response.data.message)
      showToast("Password renewal link has been sent to your e-mail address.")
    } catch (error: any) {
      const errorMessage = error.response.data.message
      showErrorToast(errorMessage)
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
   <div className=" w-full h-screen flex justify-center items-center">
     <Card className="w-full max-w-md mx-auto bg-black/40 backdrop-blur-sm border-none">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
        <CardDescription>Enter your email to receive a password reset link.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormDescription className="text-sm text-gray-500">
                    We&apos;ll send a password reset link to this email.
                  </FormDescription>
                  <FormMessage>{fieldState.error?.message}</FormMessage>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Send Reset Link
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-500">
          Remember your password?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Log in
          </a>
        </p>
      </CardFooter>
    </Card>
   </div>
  )
}

