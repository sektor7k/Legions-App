'use client';
import { DashboardNav, DashboardNavTournament } from '@/components/dashboard-nav';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { getNavItemsBrowse, getNavItemsTournament } from '@/constants/data';
import { MenuIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

import { useState } from 'react';
 
type TournamentHeaderProps = {
  id: string;
};


export function MobileSidebar({ id }: TournamentHeaderProps) {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const navItems = getNavItemsTournament({id});
  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <MenuIcon />
        </SheetTrigger>
        <SheetContent side="left" className="!px-0 bg-black bg-opacity-40 border-none">
          <div className=" py-4 ">
            <div className="px-3 py-2 space-y-4">
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
              <div className="space-y-1">
                <DashboardNavTournament
                  items={navItems}
                  isMobileNav={true}
                  setOpen={setOpen}
                />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}