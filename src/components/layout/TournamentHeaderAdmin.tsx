"use client"
import { cn } from '@/lib/utils';
import { MobileSidebar } from './mobile-sidebar-tournament';
import { DashboardNavTournament } from '../dashboard-nav';
import { getNavItemsTournamentAdmin } from '@/constants/data';

type TournamentHeaderProps = {
    id: string;
  };

export default function TournamentHeaderAdmin({ id }: TournamentHeaderProps) {

    const navItems = getNavItemsTournamentAdmin({id});


    return (
        <div className="fixed left-0 right-0 top-0  border-b z-50 bg-black bg-opacity-30 backdrop-blur">
            <nav className="flex h-14 items-center justify-center px-4">
               

                <div className="hidden lg:block gap-2">
                    <DashboardNavTournament
                        items={navItems}
                    />
                </div>

                <div className={cn('block lg:!hidden')}>
                    <MobileSidebar id={id} />
                </div>

               
            </nav>
        </div>
    );
}