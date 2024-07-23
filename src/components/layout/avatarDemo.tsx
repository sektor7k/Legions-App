import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AvatarProb {
    classname: string,
    img: string,
    username: string,
}
export default function AvatarDemo({classname, img, username}:AvatarProb){
    return(
        <>
        <Avatar className={classname}>
              {/* <AvatarImage
                src={session.user?.image ?? ''}
                alt={session.user?.name ?? ''}
              /> */}
              <AvatarImage
                src={img}
                alt={"Avatar"}
              /> 
              <AvatarFallback>{username}</AvatarFallback>
            </Avatar>
        </>
    )
}