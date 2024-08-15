
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
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"


const formSchema = z.object({
    tname: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    tdescription: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
})

export default function createTournament() {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            tname: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {

        console.log(values)
    }

    return (
        <div className=" flex items-center justify-center w-full ">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-2/5">
                    <FormField
                        control={form.control}
                        name="tname"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tournament Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="shadcn" {...field} className="" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="tdescription"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tournament Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Tell us a little bit about yourself"
                                        className="resize-none h-48"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </div>
    )
}
