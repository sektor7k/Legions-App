"use client"

import { useSession } from "next-auth/react";

import LambDemo from "@/components/Lamb"

export default function Home() {
  const { data ,status } = useSession();



  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <LambDemo data={data?.user.username}/>
    

     
    </main>
  );
}
