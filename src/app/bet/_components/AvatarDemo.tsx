
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSession } from 'next-auth/react';



export default function AvatarDemo(){

  const session = useSession()
    return(
        <>
        <Avatar className="rounded-sm border-gray-300 w-16 h-16">
              <AvatarImage
                src={session.data?.user.image ?? 'https://github.com/shadcn.png'}
                alt={session.data?.user.username ?? ''}
              />
              <AvatarFallback>{session.data?.user.username}</AvatarFallback>
            </Avatar>
        </>
    )
}