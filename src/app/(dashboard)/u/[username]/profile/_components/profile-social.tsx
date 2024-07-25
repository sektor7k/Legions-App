import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaDiscord, FaTelegram, FaXTwitter } from "react-icons/fa6";

export default function ProfileSocial() {
    return (
        <div className="flex flex-col items-center space-y-4">
            <h2 className="scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight first:mt-0">
                Social handle
            </h2>
            <div className="flex items-center space-x-2">
                <FaXTwitter />
                <Input type="text" placeholder="Twitter" disabled value={"@sektor7k"} />
            </div>

            <div className="flex items-center space-x-2">
                <FaDiscord />
                <Input type="text" placeholder="Dsicord" disabled value={"@sektor7k"} />
            </div>

            <div className="flex items-center space-x-2">
                <FaTelegram />
                <Input type="text" placeholder="telegram" disabled value={"@sektor7k"} />
            </div>
            <Button variant={"secondary"} className=" mt-4 ">Edit <span className="ml-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
            </span>
            </Button>
        </div>
    )
}