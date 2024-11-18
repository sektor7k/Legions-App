"use client"
import Link from 'next/link';

import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { getNavItemsBrowse } from '@/constants/data';
import AvatarDemo from './AvatarDemo';




export default function BetHeader() {

    const { data: session } = useSession();
    const navItems = getNavItemsBrowse(session);


    return (
        <div className="supports-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-20 border-b bg-black bg-opacity-30 backdrop-blur">
            <nav className="flex h-24 items-center justify-between px-4">
                <div className="hidden lg:block">
                    <Link
                        href={'/'}
                    >
                        <Image
                            src={"/betlogo.png"}
                            alt="Logo"
                            width={190}
                            height={100}
                        />

                    </Link>
                </div>

                

                <div className="flex flex-row bg-indigo-950 bg-opacity-40 justify-center items-center space-x-6 rounded-l-sm pl-6">
                    <div className='flex flex-col'>
                        <div className='text-xs font-extrabold pl-3'>
                            Balance
                        </div>
                        <div className='text-2xl font-extrabold'>
                            <span className='text-indigo-700'>$</span>553.1
                        </div>
                    </div>
                    <AvatarDemo/>
                </div>
            </nav>
        </div>
    );
}