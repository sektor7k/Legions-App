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
import axios from "axios";
import { ElementRef, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { mutate } from "swr";

interface Adress {
    evm: string | undefined;
    solana: string | undefined;
}

export default function ProfileAdresses({ evm, solana }: Adress) {

    const [walletAddress, setWalletAddress] = useState('');
    const closeRef = useRef<ElementRef<"button">>(null);
    const { toast } = useToast()


    const handleSaveChanges = async (walletType: string) => {
        try {
            const response = await axios.post('/api/user/wallets', { walletType, address: walletAddress });
            showToast(`${walletType.toUpperCase()} adress updated successfully`)
            await mutate(['/api/user/getUser'])
            closeRef?.current?.click();
        } catch (error) {
            showErrorToast("Error updating wallet address")
            console.error("Error updating wallet address:", error);
        }
    };

    function showErrorToast(message: string): void {
        toast({
            variant: "destructive",
            title: message,
            description: "",
        })
    }

    function showToast(message: string): void {
        toast({
            variant: "default",
            title: message,
            description: "",
        })
    }

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
                <div className="flex flex-col w-full">
                    <p className="text-lg text-muted-foreground mb-3">EVM Adress</p>
                    <div className="flex items-center ">
                        <div className="bg-black bg-opacity-30 p-3 rounded-l-xl ">
                            <img src="https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=032" alt="" className="w-5" />
                        </div>
                        <p className="rounded-r-none w-full bg-black bg-opacity-30 p-3 text-gray-300">{evm || "No Address"}</p>
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
                                <div className="grid grid-cols-3 items-center gap-4">
                                    <Label htmlFor="evm" className="text-right col-span-1">
                                        Adress
                                    </Label>
                                    <Input
                                        id="evm"
                                        placeholder="0xd40F6*************************************"
                                        className="col-span-2"
                                        onChange={(e) => setWalletAddress(e.target.value)}
                                    />
                                </div>
                                <SheetFooter>
                                    <div className="flex justify-between w-full ">
                                        <SheetClose ref={closeRef} asChild>
                                            <Button type="button" variant={"ghost"}>
                                                Cancel
                                            </Button>
                                        </SheetClose>
                                        <Button onClick={() => handleSaveChanges("evm")}
                                            variant={"secondary"}
                                        >
                                            Save
                                        </Button>
                                    </div>
                                </SheetFooter>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>

                <div className="flex flex-col w-full">
                    <p className="text-lg text-muted-foreground mb-3">Solana Adress</p>
                    <div className="flex items-center ">
                        <div className="bg-black bg-opacity-30 p-3 rounded-l-xl ">
                            <img src="https://cryptologos.cc/logos/solana-sol-logo.svg?v=032" alt="" className="w-9" />
                        </div>
                        <p className="rounded-r-none w-full bg-black bg-opacity-30 p-3 text-gray-300">{solana || "No Address"}</p>

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
                                    <Label htmlFor="solana" className="text-right">
                                        Adress
                                    </Label>
                                    <Input
                                        id="solana"
                                        placeholder="0xd40F6*************************************"
                                        className="col-span-3"
                                        onChange={(e) => setWalletAddress(e.target.value)}
                                    />
                                </div>
                                <SheetFooter>
                                    <div className="flex justify-between w-full ">
                                        <SheetClose ref={closeRef} asChild>
                                            <Button type="button" variant={"ghost"}>
                                                Cancel
                                            </Button>
                                        </SheetClose>
                                        <Button onClick={() => handleSaveChanges("solana")}
                                            variant={"secondary"}
                                        >
                                            Save
                                        </Button>
                                    </div>
                                </SheetFooter>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </div>
    )
}