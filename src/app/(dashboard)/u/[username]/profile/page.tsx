"use client"

import { Breadcrumbs } from '@/components/breadcrumbs';
import { useSession } from 'next-auth/react';
import ProfileUser from './_components/profile-user';
import ProfileSocial from './_components/profile-social';
import ProfileAdresses from './_components/profile-adresses';


export default function Page() {
  const { data: session } = useSession();
  const username = session?.user?.username || 'defaultUsername';

  const breadcrumbItems = [
    { title: 'Dashboard', link: `/u/${username}` }, // Dinamik dashboard linki
    { title: 'Profile', link: `/u/${username}/profile/` } // Dinamik profile linki
  ];

  return (
    <div className="flex flex-col justify-between lg:flex-row">
      <div className='flex flex-col  justify-start pt-6 p-6 w-full'>
        <Breadcrumbs items={breadcrumbItems} />

        <div className='flex flex-col justify-center items-center pt-5'>
          <div className=' flex justify-start w-full ml-24 pb-5'>
            <p className=' font-bold text-4xl '>
              Profile
            </p>
          </div>

          <div className=' felx space-y-12 p-8 rounded-lg backdrop-blur-lg overflow-hidden border-gradient'>
          

            <ProfileUser />

            <ProfileSocial />
          </div>

        </div>
      </div>

      <div className='border-l min min-h-screen w-full p-8'>
        <ProfileAdresses />
      </div>


    </div>
  );
}
