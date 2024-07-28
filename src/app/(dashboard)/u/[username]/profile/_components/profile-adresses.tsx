import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label";

export default function ProfileAdresses() {
    return (
        <div className="space-y-6 lg:space-y-10">
            <div className="flex flex-col space-y-2 lg:space-y-4">
                <div className="flex items-center space-x-2">
                    <h2 className="scroll-m-20  pb-2 text-2xl font-bold tracking-tight first:mt-0">
                        SUB-WALLET ADDRESS
                    </h2>
                </div>
            </div>


            <div className="flex flex-col items-center space-y-6">
                <div className="flex flex-col">
                    <p className="text-lg text-muted-foreground mb-3">EVM Adress</p>
                    <div className="flex items-center ">
                        <div className="bg-black bg-opacity-30 p-3 rounded-l-xl ">
                            <img src="https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=032" alt="" className="w-6" />
                        </div>
                        <p className="rounded-r-none w-full bg-black bg-opacity-30 p-3 text-gray-300">0xd40F6f3CeCb2b601744019b5aBEDb78809327011</p>
                        <Sheet >
                            <SheetTrigger>
                                <Button variant={"ghost"} className=" rounded-r-xl rounded-l-none ">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-7">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side={"bottom"}>
                                <SheetHeader>
                                    <SheetTitle>EVM Adress</SheetTitle>
                                    <SheetDescription>
                                        Please enter your EVM wallet address.
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">
                                        Adress
                                    </Label>
                                    <Input id="name" placeholder="0xd40F6*************************************" className="col-span-3" />
                                </div>
                                <SheetFooter>
                                    <SheetClose asChild>
                                        <Button type="submit">Save changes</Button>
                                    </SheetClose>
                                </SheetFooter>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
                <div className="flex flex-col">
                    <p className="text-lg text-muted-foreground mb-3">BTC Adress</p>
                    <div className="flex items-center ">
                        <div className="bg-black bg-opacity-30 p-3 rounded-l-xl ">
                            <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=032" alt="" className="w-6" />
                        </div>
                        <p className="rounded-r-none w-full bg-black bg-opacity-30 p-3 text-gray-300">0xd40F6f3CeCb2b601744019b5aBEDb78809327011</p>
                        <Sheet >
                            <SheetTrigger>
                            <Button variant={"ghost"} className=" rounded-r-xl rounded-l-none ">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-7">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side={"bottom"}>
                                <SheetHeader>
                                    <SheetTitle>BTC Adress</SheetTitle>
                                    <SheetDescription>
                                        Please enter your BTC wallet address.
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">
                                        Adress
                                    </Label>
                                    <Input id="name" placeholder="0xd40F6*************************************" className="col-span-3" />
                                </div>
                                <SheetFooter>
                                    <SheetClose asChild>
                                        <Button type="submit">Save changes</Button>
                                    </SheetClose>
                                </SheetFooter>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
                <div className="flex flex-col">
                    <p className="text-lg text-muted-foreground mb-3">Solana Adress</p>
                    <div className="flex items-center ">
                        <div className="bg-black bg-opacity-30 p-3 rounded-l-xl ">
                            <img src="https://cryptologos.cc/logos/solana-sol-logo.svg?v=032" alt="" className="w-6" />
                        </div>
                        <p className="rounded-r-none w-full bg-black bg-opacity-30 p-3 text-gray-300">0xd40F6f3CeCb2b601744019b5aBEDb78809327011</p>

                        <Sheet >
                            <SheetTrigger>
                            <Button variant={"ghost"} className=" rounded-r-xl rounded-l-none ">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-7">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side={"bottom"}>
                                <SheetHeader>
                                    <SheetTitle>SOL Adress</SheetTitle>
                                    <SheetDescription>
                                        Please enter your Solana wallet address.
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">
                                        Adress
                                    </Label>
                                    <Input id="name" placeholder="0xd40F6*************************************" className="col-span-3" />
                                </div>
                                <SheetFooter>
                                    <SheetClose asChild>
                                        <Button type="submit">Save changes</Button>
                                    </SheetClose>
                                </SheetFooter>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
                <div className="flex flex-col">
                    <p className="text-lg text-muted-foreground mb-3">Sei Adress</p>
                    <div className="flex items-center ">
                        <div className="bg-black bg-opacity-30 p-3 rounded-l-xl ">
                            <img src="https://cryptologos.cc/logos/sei-sei-logo.svg?v=032" alt="" className="w-6" />
                        </div>
                        <p className="rounded-r-none w-full bg-black bg-opacity-30 p-3 text-gray-300">0xd40F6f3CeCb2b601744019b5aBEDb78809327011</p>
                        <Sheet >
                            <SheetTrigger>
                            <Button variant={"ghost"} className=" rounded-r-xl rounded-l-none ">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-7">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side={"bottom"}>
                                <SheetHeader>
                                    <SheetTitle>Sei Adress</SheetTitle>
                                    <SheetDescription>
                                        Please enter your Sei wallet address.
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">
                                        Adress
                                    </Label>
                                    <Input id="name" placeholder="0xd40F6*************************************" className="col-span-3" />
                                </div>
                                <SheetFooter>
                                    <SheetClose asChild>
                                        <Button type="submit">Save changes</Button>
                                    </SheetClose>
                                </SheetFooter>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
                <div className="flex flex-col">
                    <p className="text-lg text-muted-foreground mb-3">Aptos Adress</p>
                    <div className="flex items-center ">
                        <div className="bg-black bg-opacity-30 p-3 rounded-l-xl ">
                            <img src="/aptoslogo.svg" alt="" className="w-6" />
                        </div>
                        <p className="rounded-r-none w-full bg-black bg-opacity-30 p-3 text-gray-300">0xd40F6f3CeCb2b601744019b5aBEDb78809327011</p>
                        <Sheet >
                            <SheetTrigger>
                            <Button variant={"ghost"} className=" rounded-r-xl rounded-l-none ">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-7">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side={"bottom"}>
                                <SheetHeader>
                                    <SheetTitle>Aptos Adress</SheetTitle>
                                    <SheetDescription>
                                        Please enter your Aptos wallet address.
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">
                                        Adress
                                    </Label>
                                    <Input id="name" placeholder="0xd40F6*************************************" className="col-span-3" />
                                </div>
                                <SheetFooter>
                                    <SheetClose asChild>
                                        <Button type="submit">Save changes</Button>
                                    </SheetClose>
                                </SheetFooter>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
                <div className="flex flex-col">
                    <p className="text-lg text-muted-foreground mb-3">Sui Adress</p>
                    <div className="flex items-center ">
                    <div className="bg-black bg-opacity-30 p-3 rounded-l-xl ">
                            <img src="https://cryptologos.cc/logos/sui-sui-logo.svg?v=032" alt="" className="w-6" />
                        </div>
                        <p className="rounded-r-none w-full bg-black bg-opacity-30 p-3 text-gray-300">0xd40F6f3CeCb2b601744019b5aBEDb78809327011</p>   
                        <Sheet >
                            <SheetTrigger>
                            <Button variant={"ghost"} className=" rounded-r-xl rounded-l-none ">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-7">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side={"bottom"}>
                                <SheetHeader>
                                    <SheetTitle>Sui Adress</SheetTitle>
                                    <SheetDescription>
                                        Please enter your Sui wallet address.
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">
                                        Adress
                                    </Label>
                                    <Input id="name" placeholder="0xd40F6*************************************" className="col-span-3" />
                                </div>
                                <SheetFooter>
                                    <SheetClose asChild>
                                        <Button type="submit">Save changes</Button>
                                    </SheetClose>
                                </SheetFooter>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </div>
    )
}