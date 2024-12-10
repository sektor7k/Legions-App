"use client"
import axios from "axios";
import Image from "next/image"
import { ElementRef, useEffect, useRef, useState } from "react";
import { FaForward } from "react-icons/fa";
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { SquareArrowOutUpRight } from "lucide-react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import Link from "next/link";
import { TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, createTransferInstruction, getAccount, getAssociatedTokenAddress } from "@solana/spl-token";
import { useSession } from "next-auth/react";

interface Bet {
    createdAt: string | number | Date;
    _id: string;
    founderId: User;
    tournamentId: Tournament;
    matchId: Match;
    founderTeamId: string;
    stake: number;
}

interface User {
    _id: string;
    username: string;
    image: string;
}

interface Tournament {
    _id: string;
    thumbnail: string,
    tname: string,
    organizer: string,
    organizerAvatar: string
}
interface Match {
    _id: string;
    team1Id: Team,
    team2Id: Team,
    matchDate: string,
    matchTime: string
}
interface Team {
    _id: string;
    teamName: string;
    teamImage: string;
}


export default function OpenBets() {

    const [bets, setBets] = useState<Bet[]>([]);
    const router = useRouter();

    const closeRef = useRef<ElementRef<"button">>(null);

    const { publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();
    const { data: session } = useSession();

    useEffect(() => {
        const getOpenBet = async () => {
            try {
                const response = await axios.post('/api/bet/getOpenBet', { status: 'open' });

                if (response.data.data && Array.isArray(response.data.data)) {
                    // Zamana göre sıralama: En yeni en üstte
                    const sortedBets = response.data.data.sort((a: Bet, b: Bet) =>
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    );

                    setBets(sortedBets);
                } else {
                    console.error("Invalid data format from API:", response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch open bets:", error);
            }
        };

        getOpenBet();
    }, []);


    function showErrorToast(message: string): void {
        toast({
            variant: "destructive",
            title: message,
            description: "",
        })
    }

    function showToast(message: string, txHash: string): void {
        toast({
            variant: "default",
            title: message,
            description: (
                <Link
                    href={`https://solscan.io/tx/${txHash}?cluster=devnet`}
                    className="text-gray-100 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    https://solscan.io/tx/{txHash.slice(0, 10)}...
                </Link>
            ),
        })
    }

    const sendUsdc = async (stake: number) => {
        if (!publicKey) {
            console.error("Wallet not connected");
            return;
        }

        try {
            const recipientPubKey = new PublicKey("W8aVm1tZCgCjDc9butDHSuuhXUrQ6FYYG5SveF9x7dC"); // Alıcının cüzdan adresi
            const usdcMintAddress = new PublicKey("Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr"); // USDC mint adresi
            const amount = stake * 10 ** 6; // 1 USDC = 10^6 lamports

            // Gönderenin token hesabını alın
            const senderTokenAddress = await getAssociatedTokenAddress(
                usdcMintAddress,
                publicKey // Gönderen cüzdan adresi
            );

            // Gönderen token hesabını kontrol et
            const senderAccountInfo = await getAccount(connection, senderTokenAddress);
            if (!senderAccountInfo) {
                throw new Error("Gönderenin token hesabı bulunamadı");
            }

            // Alıcının token hesabını alın
            const recipientTokenAddress = await getAssociatedTokenAddress(
                usdcMintAddress,
                recipientPubKey // Alıcının cüzdan adresi
            );

            const transaction = new Transaction();

            // Alıcının token hesabı yoksa oluştur
            const recipientAccountInfo = await connection.getAccountInfo(recipientTokenAddress);
            if (!recipientAccountInfo) {
                transaction.add(
                    createAssociatedTokenAccountInstruction(
                        publicKey,
                        recipientTokenAddress,
                        recipientPubKey,
                        usdcMintAddress
                    )
                );
            }

            // Transfer talimatını ekle
            transaction.add(
                createTransferInstruction(
                    senderTokenAddress,
                    recipientTokenAddress,
                    publicKey,
                    amount,
                    [],
                    TOKEN_PROGRAM_ID
                )
            );

            // İşlem ücret ödeyicisini belirt
            transaction.feePayer = publicKey;

            // İşlemi gönder
            const signature = await sendTransaction(transaction, connection);
            console.log(`Transaction signature: ${signature}`);
            return signature;
        } catch (error) {
            console.error("İşlem başarısız:", error);
            throw error; // Hata fırlat
        }
    };


    const joinBet = async (betId: string, opponentTeamId: string, stake: number) => {

        if (!betId || !opponentTeamId || !stake) {
            showErrorToast("Please fill in all fields.");
            return;
        }

        // Ödeme işlemi
        const paymentSuccessful = await sendUsdc(stake);

        if (!paymentSuccessful) {
            showErrorToast("Payment failed. Please try again.");
            return;
        }

        try {
            const response = await axios.post('/api/bet/joinBet', {
                id: betId,
                opponentTeamId
            })
            showToast("Successful joining Bet", paymentSuccessful);

            try {
                await axios.post('/api/bet/stream', {
                    status: 'join',
                    amount: stake,
                    username: session?.user.username,
                    userAvatar: session?.user.image
                });
            } catch (activityError) {
                console.error("Error adding to activity feed:", activityError);
            }

            closeRef?.current?.click();
        } catch (error) {
            router.refresh()
            showErrorToast("Error placing bet")
            console.error('Error placing bet:', error);
        }
    }
    return (
        <div className="w-full flex flex-col space-y-4">
            {bets.map((bet) => (
                <div key={bet._id} className="flex flex-row bg-gray-900  rounded-md">
                    <div className="flex flex-col w-4/5  pr-8">
                        <div className="relative flex flex-row items-center space-x-1 z-10 p-4">
                            <Image
                                src={bet.tournamentId.organizerAvatar}
                                height="20"
                                width="20"
                                alt="Organizer Avatar"
                                className="h-6 w-6 rounded-full border-2 object-cover"
                            />
                            <p className="font-bold text-sm text-gray-500">{bet.tournamentId.organizer}: {bet.tournamentId.tname}</p>
                        </div>
                        <div className="flex flex-row justify-between">
                            <div
                                className="p-4 rounded-bl-md text-white bg-gradient-to-r from-green-700/70 via-green-700/20 to-green-700/0 flex flex-row space-x-2"
                            >
                                <FaForward className=" bg-green-600 p-1 w-6 h-6 rounded-md" /> <span className=" font-semibold text-green-400">{bet.matchId.matchDate} / {`${bet.matchId.matchTime.slice(0, 2)}:${bet.matchId.matchTime.slice(2)}`}</span>
                            </div>
                            <div className="flex flex-row items-center justify-center space-x-4 transform -translate-y-6">
                                <div className="relative flex flex-row items-center space-x-1 bg-green-700 bg-opacity-30 backdrop-blur-sm p-4 py-1 rounded-lg border-2 border-green-700 min-w-40">
                                    <Image
                                        src={bet.matchId.team1Id.teamImage}
                                        height="100"
                                        width="100"
                                        alt="Team1"
                                        className="h-12 w-12 rounded-full border-2 object-cover"
                                    />
                                    <p className="font-bold text-lg text-gray-100">{bet.matchId.team1Id.teamName}</p>
                                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                                        <Image
                                            src={bet.matchId.team1Id._id === bet.founderTeamId ? bet.founderId.image : "/green.png"}
                                            height="100"
                                            width="100"
                                            alt="Team1"
                                            className="h-6 w-6 rounded-full border-2 object-cover border-gray-900"
                                        />
                                    </div>
                                </div>
                                <div className="font-bold text-lg">
                                    vs
                                </div>
                                <div className="relative flex flex-row items-center space-x-2  bg-red-700 bg-opacity-30 backdrop-blur-sm p-4 py-1 rounded-lg border-2 border-red-700">
                                    <Image
                                        src={bet.matchId.team2Id.teamImage}
                                        height="100"
                                        width="100"
                                        alt="Team2"
                                        className="h-12 w-12 rounded-full border-2 object-cover"
                                    />
                                    <p className="font-bold text-lg text-gray-100">{bet.matchId.team2Id.teamName}</p>
                                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                                        <Image
                                            src={bet.matchId.team2Id._id === bet.founderTeamId ? bet.founderId.image : "/green.png"}
                                            height="100"
                                            width="100"
                                            alt="Team1"
                                            className="h-6 w-6 rounded-full border-2 object-cover border-gray-900"
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="relative w-1/5 flex flex-col items-center justify-center space-y-1">
                        <div className="absolute left-0 top-3 bottom-3 w-0.5 bg-gray-600 rounded-full"></div>
                        <div className="relative flex flex-row items-center space-x-1  ">
                            <Image
                                src={bet.founderId.image}
                                height="100"
                                width="100"
                                alt="user"
                                className="h-8 w-8 rounded-full border-2 object-cover"
                            />
                            <p className="font-semibold text-sm text-gray-100">{bet.founderId.username}</p>
                        </div>

                        <Dialog>
                            <DialogTrigger asChild>
                                <button className="bg-blue-950 bg-opacity-50 hover:bg-none flex flex-col items-center p-2 rounded-md relative group transition-all duration-300 min-h-[60px] min-w-[120px]">
                                    <div className="text-center transition-opacity duration-300 opacity-100 group-hover:opacity-0 absolute">
                                        <p className="text-xs font-bold">PLACED BET OF</p>
                                        <p className="text-2xl font-extrabold text-blue-700">${bet.stake.toString()}</p>
                                    </div>
                                    <p className="text-2xl font-bold  text-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        Play
                                    </p>
                                </button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[800px] bg-gray-950">
                                <DialogHeader>
                                    <DialogTitle>
                                        <div className="relative flex flex-row items-center space-x-1 ">
                                            <Image
                                                src={bet.tournamentId.organizerAvatar}
                                                height="20"
                                                width="20"
                                                alt="Organizer Avatar"
                                                className="h-8 w-8 rounded-full border-2 object-cover"
                                            />
                                            <p className="font-bold text-base text-gray-500">{bet.tournamentId.organizer}: {bet.tournamentId.tname}</p>
                                        </div>
                                    </DialogTitle>

                                </DialogHeader>
                                <div className="flex flex-col space-y-5">
                                    <div className="flex flex-row items-center justify-center space-x-12">
                                        <div className="relative flex flex-row items-center space-x-4">
                                            <div className="relative">
                                                <Image
                                                    src={bet.matchId.team1Id.teamImage}
                                                    height="100"
                                                    width="100"
                                                    alt="Team2"
                                                    className="h-24 w-24 rounded-full border-2 object-cover"
                                                />
                                                <div className="absolute bottom-0 right-0 transform translate-x-1/2 translate-y-2 flex flex-row items-center   px-2 space-x-1">
                                                    <Image
                                                        src={bet.matchId.team1Id._id === bet.founderTeamId ? bet.founderId.image : "/green.png"}
                                                        height="100"
                                                        width="100"
                                                        alt="founder"
                                                        className="h-7 w-7 rounded-full border-2 object-cover border-gray-900"
                                                    />
                                                    <p className="text-sm text-gray-400 font-semibold">{bet.matchId.team1Id._id === bet.founderTeamId ? bet.founderId.username : "Avaliable"}</p>
                                                </div>
                                            </div>
                                            <p className="font-bold text-3xl text-gray-100">{bet.matchId.team1Id.teamName}</p>

                                        </div>
                                        <div className="text-lg font-semibold text-gray-500">
                                            VS
                                        </div>
                                        <div className="relative flex flex-row items-center space-x-4">
                                            <div className="relative">
                                                <Image
                                                    src={bet.matchId.team2Id.teamImage}
                                                    height="100"
                                                    width="100"
                                                    alt="Team2"
                                                    className="h-24 w-24 rounded-full border-2 object-cover"
                                                />
                                                <div className="absolute bottom-0 right-0 transform translate-x-1/2 translate-y-2 flex flex-row items-center   px-2 space-x-1">
                                                    <Image
                                                        src={bet.matchId.team2Id._id === bet.founderTeamId ? bet.founderId.image : "/green.png"}
                                                        height="100"
                                                        width="100"
                                                        alt="founder"
                                                        className="h-7 w-7 rounded-full border-2 object-cover border-gray-900"
                                                    />
                                                    <p className="text-sm text-gray-400 font-semibold">{bet.matchId.team2Id._id === bet.founderTeamId ? bet.founderId.username : "Avaliable"}</p>
                                                </div>
                                            </div>
                                            <p className="font-bold text-3xl text-gray-100">{bet.matchId.team2Id.teamName}</p>
                                        </div>

                                    </div>
                                    <div
                                        className="p-4 rounded-bl-md text-white bg-gradient-to-t from-green-700/0 via-blue-700/30 to-green-700/0 flex flex-row space-x-2 items-center justify-center"
                                    >
                                        <FaForward className="bg-blue-700 p-1 w-6 h-6 rounded-md" />
                                        <span className="font-semibold text-blue-400">
                                            {bet.matchId.matchDate} / {`${bet.matchId.matchTime.slice(0, 2)}:${bet.matchId.matchTime.slice(2)}`}
                                        </span>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex flex-row space-x-2">
                                            <p className="text-base font-semibold text-blue-700">Bet status:</p>
                                            <p className="text-base font-semibold text-gray-300">Open</p>
                                        </div>
                                        <div className="flex flex-row space-x-2">
                                            <p className="text-base font-semibold text-blue-700">Team to Bet On:</p>
                                            <p className="text-base font-semibold text-gray-300">{bet.founderTeamId === bet.matchId.team1Id._id ? bet.matchId.team2Id.teamName : bet.matchId.team1Id.teamName}</p>
                                        </div>
                                        <div className="flex flex-row space-x-2">
                                            <p className="text-base font-semibold text-blue-700">Stake amount:</p>
                                            <p className="text-base font-semibold text-gray-300">${bet.stake.toString()}</p>
                                        </div>
                                        <div className="flex flex-row space-x-2 items-center">
                                            <p className="text-base font-semibold text-blue-700">Go the tournament:</p>
                                            <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/t/${bet.tournamentId._id}`}><SquareArrowOutUpRight className="h-5" /></Link>
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>

                                </DialogFooter>
                                <DialogFooter>
                                    <div className="flex justify-between w-full">
                                        <DialogClose ref={closeRef} asChild>
                                            <Button type="button" variant={"ghost"}>
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                        <Button onClick={() => joinBet(bet._id, bet.founderTeamId === bet.matchId.team1Id._id ? bet.matchId.team2Id._id : bet.matchId.team1Id._id, bet.stake)} type="submit">Place a bet</Button>

                                    </div>

                                </DialogFooter>
                            </DialogContent>
                        </Dialog>


                    </div>


                </div>
            ))}

        </div>
    )
}