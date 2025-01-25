
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { useFieldArray } from "react-hook-form";


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
import axios from "axios"
import { toast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"



const formSchema = z.object({
    thumbnail: z.string().min(2, { message: "Thumbnail must be at least 2 characters." }),
    thumbnailGif: z.string().min(2, { message: "Thumbnail GIF must be at least 2 characters." }),
    tname: z.string().min(2, { message: "Tournament name must be at least 2 characters." }),
    tdescription: z.string().min(2, { message: "Description must be at least 2 characters." }),
    organizer: z.string().min(2, { message: "Organizer name must be at least 2 characters." }),
    organizerAvatar: z.string().min(2, { message: "Organizer avatar must be at least 2 characters." }),
    capacity: z.string(),
    checkin: z.date({ required_error: "Check-in date is required." }),
    checkinTime: z.string().min(4, { message: "Check-in time must be at least 4 characters." }),
    starts: z.date({ required_error: "Start date is required." }),
    startsTime: z.string().min(4, { message: "Start time must be at least 4 characters." }),
    ends: z.date({ required_error: "End date is required." }),
    endsTime: z.string().min(4, { message: "End time must be at least 4 characters." }),
    teamsize: z.string().min(2, { message: "Team size must be at least 2 characters." }),
    teamcount: z.string().min(2, { message: "Team count must be at least 2 characters." }),
    region: z.string().min(2, { message: "Region must be at least 2 characters." }),
    bracket: z.string().min(2, { message: "Bracket must be at least 2 characters." }),
    prizePool: z.array(z.object({ key: z.string(), value: z.string() })).optional(),
    sponsors: z.array(z.string()).min(1, { message: "At least one sponsor is required." }).optional(),
})

export default function CreateTournament() {


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            // tname: "",
        },
    })

    const { fields, append, remove } = useFieldArray({
        name: "prizePool",
        control: form.control
    });

    const [sponsors, setSponsors] = useState<string[]>([]); // Resimleri tutmak için state

    const addSponsor = (url: string) => {
        setSponsors((prevSponsors) => {
            const updatedSponsors = [...prevSponsors, url];
            form.setValue("sponsors", updatedSponsors); // sponsors dizisini form verisine ekle
            return updatedSponsors;
        });
    };

    const removeSponsor = (index: number) => {
        setSponsors((prevSponsors) => {
            const updatedSponsors = prevSponsors.filter((_, i) => i !== index);
            form.setValue("sponsors", updatedSponsors); // Güncellenmiş diziyi form verisine ekle
            return updatedSponsors;
        });
    };

    async function onSubmit(values: z.infer<typeof formSchema>) {

        try {

            const formattedValues = {
                ...values,
                checkin: values.checkin ? format(values.checkin, "PPP") : null,
                starts: values.checkin ? format(values.starts, "PPP") : null,
                ends: values.checkin ? format(values.ends, "PPP") : null,
            };

            const response = await axios.post("/api/admin/addtournament", formattedValues);

            console.log("Tournament created successfully:", response.data);
            form.reset();
            showToast("Tournament created successfully!");

            // Başarılı mesaj gösterme veya yönlendirme gibi işlemler yapabilirsiniz
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Failed to create tournament:", error.response?.data);
                // Hata mesajı gösterme işlemi yapabilirsiniz
            } else {
                console.error("Unexpected error:", error);
                showErrorToast("Unexpected error")
            }
        }
    }

    function showErrorToast(message: string): void {
        toast({
            variant: "destructive",
            title: "Signup failed",
            description: message,
        })
    }


    function showToast(message: string): void {
        toast({
            variant: "default",
            title: "Tournament Created",
            description: message,
        })
    }

    return (
        <div className=" flex flex-col items-center justify-center w-screen  ">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-2/5">
                    <FormField
                        control={form.control}
                        name="thumbnail"
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
                        name="thumbnailGif"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel> Thumbnail Gif</FormLabel>
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
                    <FormField
                        control={form.control}
                        name="organizer"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Organizer Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="shadcn" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="organizerAvatar"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel> Organizer Avatar</FormLabel>
                                <FormControl>
                                    <div className="border rounded-full outline-dashed w-72 h-72">
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
                        name="capacity"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Capacity</FormLabel>
                                <FormControl>
                                    <Input placeholder="shadcn" {...field} type="number" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="prizePool"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex flex-col items-center justify-center space-y-9 w-auto">
                                    <FormLabel><span className="text-xl">Prize Pool</span></FormLabel>
                                    {fields.map((field, index) => (
                                        <div key={field.id} className="flex space-x-2">
                                            <FormControl>
                                                <Input
                                                    placeholder="Position (e.g., 1st)"
                                                    {...form.register(`prizePool.${index}.key` as const)}
                                                />
                                            </FormControl>
                                            <FormControl>
                                                <Input
                                                    placeholder="Prize (e.g., 200)"
                                                    {...form.register(`prizePool.${index}.value` as const)}
                                                />
                                            </FormControl>
                                            <Button type="button" onClick={() => remove(index)}>Remove</Button>
                                        </div>
                                    ))}
                                    <Button type="button" onClick={() => append({ key: "", value: "" })}>
                                        Add Prize
                                    </Button>
                                </div>
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
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a region" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Asia">Asia</SelectItem>
                                        <SelectItem value="Europe">Europe</SelectItem>
                                    </SelectContent>
                                </Select>
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
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a bracket type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Single">Single</SelectItem>
                                        <SelectItem value="Team">Team</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex flex-col items-center justify-center space-y-9 w-auto">
                        <FormLabel><span className="text-xl">Sponsors</span></FormLabel>
                        {sponsors.map((url, index) => (
                            <div key={index} className="flex space-x-2 items-center">
                                <div className=" border overflow-hidden">
                                    <img
                                        src={url || "/default-logo.png"} // Resim URL'sini göster
                                        alt="Sponsor Logo"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <Button type="button" onClick={() => removeSponsor(index)}>Remove</Button>
                            </div>
                        ))}
                    </div>

                    <FormField
                        control={form.control}
                        name="sponsors"
                        render={() => (
                            <FormItem>
                                <FormLabel>Add Sponsor Logo</FormLabel>
                                <FormControl>
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
                                            const uploadedUrl = res?.[0]?.url;
                                            if (uploadedUrl) {
                                                addSponsor(uploadedUrl); // Yeni resim URL'sini ekle
                                            }
                                        }}
                                        endpoint={"imageUploader"} // Resim yükleme endpoint'i
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </div>
    )
}
