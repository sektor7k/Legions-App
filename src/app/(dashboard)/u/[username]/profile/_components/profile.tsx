

import { Button } from "@/components/ui/button"
import AvatarDemo from "@/components/layout/avatarDemo"
import { useSession } from 'next-auth/react';
import { Input } from "@/components/ui/input";
import { FaDiscord, FaTelegram, FaXTwitter } from "react-icons/fa6";


export default function User() {

  const { data: session } = useSession();
  const username = session?.user?.username || 'defaultUsername';
  const email = session?.user?.email || 'defaultEmail';
  return (
    <div className="grid max-w-7xl min-h-screen gap-6 px-4 mx-auto lg:grid-cols-[250px_1fr_300px] lg:px-6 xl:gap-10">

      <div className="py-10 space-y-20 border-r flex flex-col justify-center items-center lg:block ">
        <div className="flex flex-col items-center space-y-2">

          <div className="relative">
            <AvatarDemo classname={'w-48 h-48'} img={'https://github.com/sektor7k.png'} username={"user"} />
            <div className="absolute inset-0 bg-black bg-opacity-0 rounded-full flex items-center justify-center hover:bg-opacity-50 cursor-pointer group">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
              </svg>
            </div>
          </div>


          <div className="text-center">
            <h1 className="text-xl font-bold">{username}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{email}</p>
            <Button variant={"secondary"} className=" mt-4 ">Edit <span className="ml-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                <path stroke-Linecap="round" stroke-Linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>
            </span>
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <h2 className="scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight first:mt-0">
            Social handle
          </h2>
          <div className="flex items-center space-x-2">
            <FaXTwitter />
            <Input type="text" placeholder="Twitter" disabled value={"@sektor7k"} />
          </div>

          <div className="flex items-center space-x-2">
            <FaDiscord />
            <Input type="text" placeholder="Dsicord" disabled value={"@sektor7k"} />
          </div>

          <div className="flex items-center space-x-2">
            <FaTelegram />
            <Input type="text" placeholder="telegram" disabled value={"@sektor7k"} />
          </div>
          <Button variant={"secondary"} className=" mt-4 ">Edit <span className="ml-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
              <path stroke-Linecap="round" stroke-Linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
          </span>
          </Button>
        </div>
      </div >

      {/* Wallet addres */}

      <div className="space-y-6 lg:space-y-10">
        <div className="flex flex-col space-y-2 lg:space-y-4">
          <div className="flex items-center space-x-2">
            <h2 className="scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight first:mt-0">
              SUB-WALLET ADDRESS
            </h2>
          </div>
        </div>


        <div className="flex flex-col items-center space-y-6">

          <div className="flex flex-col">
            <p className="text-lg text-muted-foreground mb-3">EVM Adress</p>
            <div className="flex items-center ">
              <img src="https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=032" alt="" className="w-4 mr-2" />
              <Input type="text" placeholder="Twitter" disabled value={"0xd40F6f3CeCb2b601744019b5aBEDb78809327011"} className="rounded-r-none w-96" />
              <Button variant={"secondary"} className=" rounded-r-3xl rounded-l-none ">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </Button>
            </div>
          </div>
          <div className="flex flex-col">
            <p className="text-lg text-muted-foreground mb-3">BTC Adress</p>
            <div className="flex items-center ">
              <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=032" alt="" className="w-4 mr-2" />
              <Input type="text" placeholder="Twitter" disabled value={"0xd40F6f3CeCb2b601744019b5aBEDb78809327011"} className="rounded-r-none w-96" />
              <Button variant={"secondary"} className=" rounded-r-3xl rounded-l-none ">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </Button>
            </div>
          </div>
          <div className="flex flex-col">
            <p className="text-lg text-muted-foreground mb-3">Solana Adress</p>
            <div className="flex items-center ">
              <img src="https://cryptologos.cc/logos/solana-sol-logo.svg?v=032" alt="" className="w-4 mr-2" />
              <Input type="text" placeholder="Twitter" disabled value={"0xd40F6f3CeCb2b601744019b5aBEDb78809327011"} className="rounded-r-none w-96" />
              <Button variant={"secondary"} className=" rounded-r-3xl rounded-l-none ">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </Button>
            </div>
          </div>
          <div className="flex flex-col">
            <p className="text-lg text-muted-foreground mb-3">Sei Adress</p>
            <div className="flex items-center ">
              <img src="https://cryptologos.cc/logos/sei-sei-logo.svg?v=032" alt="" className="w-4 mr-2" />
              <Input type="text" placeholder="Twitter" disabled value={"0xd40F6f3CeCb2b601744019b5aBEDb78809327011"} className="rounded-r-none w-96" />
              <Button variant={"secondary"} className=" rounded-r-3xl rounded-l-none ">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </Button>
            </div>
          </div>
          <div className="flex flex-col">
            <p className="text-lg text-muted-foreground mb-3">Aptos Adress</p>
            <div className="flex items-center ">
              <img src="https://cryptologos.cc/logos/aptos-apt-logo.svg?v=032" alt="" className="w-4 mr-2" />
              <Input type="text" placeholder="Twitter" disabled value={"0xd40F6f3CeCb2b601744019b5aBEDb78809327011"} className="rounded-r-none w-96" />
              <Button variant={"secondary"} className=" rounded-r-3xl rounded-l-none ">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </Button>
            </div>
          </div>
          <div className="flex flex-col">
            <p className="text-lg text-muted-foreground mb-3">Sui Adress</p>
            <div className="flex items-center ">
              <img src="https://cryptologos.cc/logos/sui-sui-logo.svg?v=032" alt="" className="w-4 mr-2" />
              <Input type="text" placeholder="Twitter" disabled value={"0xd40F6f3CeCb2b601744019b5aBEDb78809327011"} className="rounded-r-none w-96" />
              <Button variant={"secondary"} className=" rounded-r-3xl rounded-l-none ">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </Button>
            </div>
          </div>



        </div>
      </div>
    </div >
  )
}

