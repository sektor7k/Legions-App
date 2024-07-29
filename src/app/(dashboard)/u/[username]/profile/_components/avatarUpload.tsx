"use client"

import { useState, useRef, ElementRef } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { UploadDropzone } from "@/utils/uploadthing";
import { Button } from "@/components/ui/button";


import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";
import Image from "next/image";
import AvatarDemo from "@/components/layout/avatarDemo";
import { useSession } from "next-auth/react";
interface InfoModalProps {
  initialAvatarUrl: string | null;
};

export default function AvatarUpload({
  initialAvatarUrl
}: InfoModalProps) {

  const {data,update} = useSession();
  const router = useRouter();
  const closeRef = useRef<ElementRef<"button">>(null);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  

  const getUser = async() => {
    
    console.log("Session",data?.user)
   
    console.log(avatarUrl)
  }
  

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="relative h-40 w-40 rounded-full">
          <AvatarDemo classname={'w-40 h-40'}/>
          <div className="absolute inset-0 bg-black bg-opacity-0 rounded-full flex items-center justify-center hover:bg-opacity-50 cursor-pointer group">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
            </svg>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Edit Avatar
          </DialogTitle>
        </DialogHeader>
        <div className=" space-y-14" >
          <div className="space-y-2  flex justify-center items-center">
            {avatarUrl ? (
              <div className="relative overflow-hidden border aspect-video rounded-full border-white/10 w-72 h-72">
                <div className=" absolute top-2 right-2 z-[10]">
                  <Button
                    type="button"
                    className=" h-auto w-auto p-1.5"
                  >
                    <Trash className="w-4 h-4 " />
                  </Button>
                </div>
                <Image
                  alt="Thumbnail"
                  src={avatarUrl}
                  fill
                  className="object-cover "
                />
              </div>

            ) : (
              <div className="border rounded-full outline-dashed outline-muted w-72 h-72">
                <UploadDropzone

                  appearance={{
                    label: {
                      color: "#FFFFFF"
                    },
                    allowedContent: {
                      color: "#FFFFFF"
                    }
                  }}
                  onClientUploadComplete={(res) => {
                    setAvatarUrl(res?.[0]?.url);
                    update({image:res?.[0]?.url})
                    router.refresh();
                    closeRef?.current?.click();
                  }} endpoint={"imageUploader"} />
              </div>
            )}
          </div>
          <div className="flex justify-between ">
            <DialogClose ref={closeRef} asChild>
              <Button type="button" variant={"ghost"}>
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={getUser}
              variant={"primary"}
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}