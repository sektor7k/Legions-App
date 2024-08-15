
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { UploadDropzone } from "@/utils/uploadthing"
import { useState } from "react"


const formSchema = z.object({
    thumnail: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    tname: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    tdescription: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    checkin: z.date({
        required_error: "A date of birth is required.",
    }),
    checkinTime: z.string().min(4, {
        message: "Clock",
    }),
    starts: z.date({
        required_error: "A date of birth is required.",
    }),
    startsTime: z.string().min(4, {
        message: "Clock",
    }),
    ends: z.date({
        required_error: "A date of birth is required.",
    }),
    endsTime: z.string().min(4, {
        message: "Clock",
    }),
    teamsize: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    teamcount: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    region: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    bracket: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
})

export default function createTournament() {

    const [avatarUrl, setAvatarUrl] = useState("");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            tname: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
console.log("sasa")
        console.log(values)
    }

    return (
        <div className=" flex items-center justify-center w-full ">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-2/5">
                    <FormField
                        control={form.control}
                        name="thumnail"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tournament Thumbnail</FormLabel>
                                <FormControl>
                                    <div className="border rounded-md outline-dashed  w-auto h-72">
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
                                                setAvatarUrl(uploadedUrl); 
                                                field.onChange(uploadedUrl);
                                            }} endpoint={"imageUploader"} />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="tname"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tournament Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="shadcn" {...field} />
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
                    <div className=" flex flex-row items-center justify-between ">
                        <FormField
                            control={form.control}
                            name="checkin"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Check In</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-[240px] pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="checkinTime"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Check In Time</FormLabel>
                                    <FormControl>
                                        <InputOTP maxLength={4} {...field}>
                                            <InputOTPGroup>
                                                <InputOTPSlot index={0} />
                                                <InputOTPSlot index={1} />
                                            </InputOTPGroup>
                                            <InputOTPSeparator />
                                            <InputOTPGroup>
                                                <InputOTPSlot index={2} />
                                                <InputOTPSlot index={3} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className=" flex items-center justify-between">
                        <FormField
                            control={form.control}
                            name="starts"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Starts</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-[240px] pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="startsTime"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Starts Time</FormLabel>
                                    <FormControl>
                                        <InputOTP maxLength={4} {...field}>
                                            <InputOTPGroup>
                                                <InputOTPSlot index={0} />
                                                <InputOTPSlot index={1} />
                                            </InputOTPGroup>
                                            <InputOTPSeparator />
                                            <InputOTPGroup>
                                                <InputOTPSlot index={2} />
                                                <InputOTPSlot index={3} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <FormField
                            control={form.control}
                            name="ends"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Ends</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-[240px] pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="endsTime"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ends Time</FormLabel>
                                    <FormControl>
                                        <InputOTP maxLength={4} {...field}>
                                            <InputOTPGroup>
                                                <InputOTPSlot index={0} />
                                                <InputOTPSlot index={1} />
                                            </InputOTPGroup>
                                            <InputOTPSeparator />
                                            <InputOTPGroup>
                                                <InputOTPSlot index={2} />
                                                <InputOTPSlot index={3} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="teamsize"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Team Size</FormLabel>
                                <FormControl>
                                    <Input placeholder="shadcn" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="teamcount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Team Count</FormLabel>
                                <FormControl>
                                    <Input placeholder="shadcn" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="region"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Region</FormLabel>
                                <FormControl>
                                    <Input placeholder="shadcn" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="bracket"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bracket</FormLabel>
                                <FormControl>
                                    <Input placeholder="shadcn" {...field} />
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
