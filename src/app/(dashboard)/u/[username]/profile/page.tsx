"use client"

import { Breadcrumbs } from '@/components/breadcrumbs';
import { useSession } from 'next-auth/react';
import ProfileUser from './_components/profile-user';
import ProfileSocial from './_components/profile-social';
import ProfileAdresses from './_components/profile-adresses';
import axios from 'axios';
import useSWR from 'swr';
import ErrorAnimation from '@/components/errorAnimation';
import LoadingAnimation from '@/components/loadingAnimation';

interface UserProps {
  id: string;
  username: string;
  email: string;
  image: string;
  socialMedia: SocialMedia;
  wallets: Adress;
}
interface Adress {
  evm: string;
  solana:string;
}
interface SocialMedia {
  twitter: string;
  discord: string;
  telegram: string;

}

const fetcher = (url: string,params:any) => axios.post(url,params).then((res) => res.data);

export default function Page() {
  const { data: session } = useSession();
  const username = session?.user?.username || 'defaultUsername';
  const { data: user, error, mutate } = useSWR<UserProps>(['/api/user/getUser'], ([url,params]) => fetcher(url,params));


  const breadcrumbItems = [
    { title: 'Dashboard', link: `/u/${username}/profile` }, // Dinamik dashboard linki
    { title: 'Profile', link: `/u/${username}/profile/` } // Dinamik profile linki
  ];

  if (error) return <div className=" flex h-screen justify-center items-center"><ErrorAnimation /></div>;
    if (!user) return <div className=" flex h-screen justify-center items-center"><LoadingAnimation /></div>;

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


            <ProfileUser id={user?.id} username={user?.username} email={user?.email} image={user?.image} />

            <ProfileSocial twitter={user?.socialMedia.twitter} discord={user?.socialMedia.discord} telegram={user?.socialMedia.telegram} />
          </div>

        </div>
      </div>

      <div className='border-l min min-h-screen w-full p-8'>
        <ProfileAdresses evm={user?.wallets.evm} solana={user?.wallets.solana} />
      </div>

    </div>
  );
}
