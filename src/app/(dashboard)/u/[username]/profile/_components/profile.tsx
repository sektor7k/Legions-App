

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import AvatarDemo from "@/components/layout/avatarDemo"
import { useSession } from 'next-auth/react';
export default function User() {

  const { data: session } = useSession();
  const username = session?.user?.username || 'defaultUsername';
  const email = session?.user?.email || 'defaultEmail';
  return (
    <div className="grid max-w-7xl min-h-screen gap-6 px-4 mx-auto lg:grid-cols-[250px_1fr_300px] lg:px-6 xl:gap-10">
      <div className="hidden py-10 space-y-4 border-r lg:block">
        <div className="flex flex-col items-center space-y-2">
          <div className="relative">
            <AvatarDemo classname={'w-48 h-48'} img={'https://github.com/sektor7k.png'} username={"user"} />
            <div className="absolute inset-0 bg-black bg-opacity-0 rounded-full flex items-center justify-center hover:bg-opacity-50 cursor-pointer">
              <svg className="w-6 h-6 text-white hidden" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold">{username}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{email}</p>
          </div>
        </div>
        <div className="space-y-2">
          <p className="font-semibold">Bio</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Product designer. Coffee lover. On a mission to make the web a beautiful place.
          </p>
        </div>
        <div className="grid gap-1 text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">Followers</div>
          <div className="font-semibold">1.2k</div>
        </div>
        <div className="grid gap-1 text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">Following</div>
          <div className="font-semibold">543</div>
        </div>

      </div>
      <div className="space-y-6 lg:space-y-10">
        <div className="flex flex-col space-y-2 lg:space-y-4">
          <div className="flex items-center space-x-2">
            <p>Wallet Address</p>
          </div>
        </div>
        <div className="space-y-4">
          
          


        </div>
      </div>
    </div>
  )
}

