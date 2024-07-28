import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaDiscord, FaTelegram, FaXTwitter } from "react-icons/fa6";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label";

export default function ProfileSocial() {
    return (
        <div className="flex flex-col items-center space-y-4">
            <div className=" flex flex-row justify-start items-center w-full">
                <h2 className="scroll-m-20 pb-2 text-2xl font-semibold tracking-tight first:mt-0 w-64">
                    Social Handle
                </h2>
                <button className="border border-1 border-gray-500 w-full h-0"></button>

            </div>
            <div className="flex items-center justify-center w-full ">
                <div className="p-3 bg-black rounded-l-lg">
                    <FaXTwitter className="w-6 h-6" />
                </div>
                <p className=" bg-black bg-opacity-40 p-3 w-full  rounded-r-lg px-8">
                    @sektor7K
                </p>
            </div>

            <div className="flex items-center justify-center w-full ">
                <div className="p-3 bg-black rounded-l-lg">
                    <FaDiscord className="w-6 h-6" />
                </div>
                <p className=" bg-black bg-opacity-40 p-3 w-full  rounded-r-lg px-8">
                    @sektor7K
                </p>
            </div>

            <div className="flex items-center justify-center w-full ">
                <div className="p-3 bg-black rounded-l-lg">
                    <FaTelegram className="w-6 h-6" />
                </div>
                <p className=" bg-black bg-opacity-40 p-3 w-full  rounded-r-lg px-8">
                    @sektor7K
                </p>
            </div>
            <div className="flex justify-end w-full">
                <Sheet >
                    <SheetTrigger>
                        <Button variant={"destructive"} className=" mt-4 ">Edit <span className="ml-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                        </span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side={"left"}>
                        <SheetHeader>
                            <SheetTitle>Edit Social Handle</SheetTitle>
                            <SheetDescription>
                                You can update your social media links here
                            </SheetDescription>
                        </SheetHeader>
                        <div className="flex flex-col items-center space-y-4 mt-5 mb-5">
                            <div className="flex items-center space-x-2">
                                <FaXTwitter />
                                <Input type="text" placeholder="Twitter" disabled />
                            </div>

                            <div className="flex items-center space-x-2">
                                <FaDiscord />
                                <Input type="text" placeholder="Dsicord" disabled />
                            </div>

                            <div className="flex items-center space-x-2">
                                <FaTelegram />
                                <Input type="text" placeholder="telegram" disabled />
                            </div>
                        </div>
                        <SheetFooter>
                            <SheetClose asChild>
                                <Button type="submit">Save changes</Button>
                            </SheetClose>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            </div>

        </div>
    )
}