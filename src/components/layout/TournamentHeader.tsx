"use client"
import { cn } from '@/lib/utils';
import { MobileSidebar } from './mobile-sidebar-tournament';
import { UserNav } from './user-nav';
import Link from 'next/link';

import Image from 'next/image';
import { DashboardNavTournament } from '../dashboard-nav';
import { useSession } from 'next-auth/react';
import { getNavItemsTournament } from '@/constants/data';
import NotificationButton from '../notifications/NotificationButton';

type TournamentHeaderProps = {
    id: string;
  };

export default function TournamentHeader({ id }: TournamentHeaderProps) {

    const navItems = getNavItemsTournament({id});


    return (
        <div className="supports-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-20 border-b bg-black bg-opacity-30 backdrop-blur">
            <nav className="flex h-14 items-center justify-between px-4">
                <div className="hidden lg:block">
                    <Link
                        href={'/'}
                    >
                        <Image
                            src={"/logoDark.png"}
                            alt="Logo"
                            width={130}
                            height={100}
                        /> 

                    </Link>
                </div>

                <div className="hidden lg:block gap-2">
                    <DashboardNavTournament
                        items={navItems}
                    />
                </div>

                <div className={cn('block lg:!hidden')}>
                    <MobileSidebar id={id} />
                </div>

                <div className="flex items-center gap-4">
                    <NotificationButton/>
                    <UserNav />
                </div>
            </nav>
        </div>
    );
}