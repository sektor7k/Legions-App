
import ProfileUser from "./profile-user";
import ProfileSocial from "./profile-social";
import ProfileAdresses from "./profile-adresses";


export default function User() {


  return (
    <div className="grid max-w-7xl min-h-screen gap-6 px-4 mx-auto lg:grid-cols-[250px_1fr_300px] lg:px-6 xl:gap-10">

      <div className="py-10 space-y-20 border-r flex flex-col justify-center items-center lg:block ">
        <ProfileUser />

        <ProfileSocial />
      </div >
      
      <ProfileAdresses />
    </div >
  )
}

