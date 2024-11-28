"use client";
import Link from "next/link";
import Image from "next/image";
import BetDashboard from "./BetDashboard";


export default function BetHeader() {


    

    return (
        <div className="supports-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-20 border-b bg-black bg-opacity-30 backdrop-blur">
            <nav className="flex h-24 items-center justify-between px-4">
                <div className="hidden lg:block">
                    <Link href={"/"}>
                        <Image src={"/betlogo.png"} alt="Logo" width={190} height={100} />
                    </Link>
                </div>

                <div className="flex flex-row space-x-5">
                <BetDashboard/>
                    
                </div>
            </nav>
        </div>
    );
}
