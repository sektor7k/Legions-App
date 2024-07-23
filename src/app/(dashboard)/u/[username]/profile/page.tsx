"use client"

import { Breadcrumbs } from '@/components/breadcrumbs';
import { useSession } from 'next-auth/react';
import User from './_components/profile';


export default function Page() {
  const { data: session } = useSession();
  const username = session?.user?.username || 'defaultUsername';

  const breadcrumbItems = [
    { title: 'Dashboard', link: `/u/${username}` }, // Dinamik dashboard linki
    { title: 'Profile', link: `/u/${username}/profile/` } // Dinamik profile linki
  ];

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <Breadcrumbs items={breadcrumbItems} />

      <User/>

      
    </div>
  );
}
