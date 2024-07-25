import AvatarDemo from "@/components/layout/avatarDemo";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";


export default function ProfileUser() {

    const { data: session } = useSession();
    const username = session?.user?.username || 'defaultUsername';
    const email = session?.user?.email || 'defaultEmail';

    return (
        <div className="flex flex-col items-center space-y-2">

            <div className="relative">
                <AvatarDemo classname={'w-48 h-48'} img={'https://github.com/sektor7k.png'} username={"user"} />
                <div className="absolute inset-0 bg-black bg-opacity-0 rounded-full flex items-center justify-center hover:bg-opacity-50 cursor-pointer group">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                    </svg>
                </div>
            </div>


            <div className="text-center">
                <h1 className="text-xl font-bold">{username}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">{email}</p>
                <Button variant={"secondary"} className=" mt-4 ">Edit <span className="ml-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                </span>
                </Button>
            </div>
        </div>
    )
}