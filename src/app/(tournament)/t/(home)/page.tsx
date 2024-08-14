import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Image from "next/image"

export default function Page() {
    return (
        <div className=" flex flex-col w-full justify-center items-center space-y-3">
            <div className=" flex flex-col justify-start space-y-3 bg-black mt-6 w-5/6 bg-opacity-60 backdrop-blur-sm p-3 px-8 rounded-lg">
                <p className=" text-red-700 font-semibold">
                    CURRENT PHASE
                </p>
                <div className=" flex justify-start w-full md:justify-center">
                    <div className="flex flex-col w-5/6 items-start justify-center space-y-2 md:flex-row md:items-center md:space-y-0">
                        <div className=" flex flex-row space-x-3 items-center justify-center bg-red-900 px-5 p-2 rounded-full bg-opacity-80">
                            <Check className="bg-red-500 rounded-full text-slate-700" /> <div className=" font-medium">Drafting</div>
                        </div>
                        <p className="w-full border border-gray-400 mx-3 rounded-full hidden md:flex"></p>

                        <div className=" flex flex-row space-x-3 items-center justify-center bg-red-900 px-5 p-2 rounded-full bg-opacity-80">
                            <Check className="bg-red-500 rounded-full text-slate-700" /> <div className=" font-medium">Registration</div>
                        </div>
                        <p className="w-full border border-gray-400 mx-3 rounded-full hidden md:flex"></p>
                        <div className=" flex flex-row space-x-3 items-center justify-center bg-red-900 px-5 p-2 rounded-full bg-opacity-80">
                            <Check className="bg-red-500 rounded-full text-slate-700" /> <div className=" font-medium text-nowrap">Check In</div>
                        </div>
                        <p className="w-full border border-gray-400 mx-3 rounded-full hidden md:flex"></p>
                        <div className=" flex flex-row space-x-3 items-center justify-center bg-red-900 px-5 p-2 rounded-full bg-opacity-80">
                            <Check className="bg-red-500 rounded-full text-slate-700" /> <div className=" font-medium">Live</div>
                        </div>
                        <p className="w-full border border-gray-400 mx-3 rounded-full hidden md:flex"></p>
                        <div className=" flex flex-row space-x-3 items-center justify-center bg-red-900 px-5 p-2 rounded-full bg-opacity-80">
                            <Check className="bg-red-500 rounded-full text-slate-700" /> <div className=" font-medium">Finished</div>
                        </div>


                    </div>
                </div>
            </div>
            <div className=" flex flex-col justify-between w-5/6 space-y-4 md:flex-row md:space-y-0 ">

                <div className="flex flex-col justify-start space-y-6 bg-black w-full bg-opacity-60 backdrop-blur-sm p-6 px-8 rounded-lg md:w-[calc((2/3*100%)-1rem)] ">

                    <Image
                        src={"https://i.ibb.co/DM0fs9S/valobg.jpg"}
                        alt={""}
                        width={920}
                        height={80}
                        objectFit="cover"
                        className="transition-opacity duration-800 group-hover/card:opacity-0 rounded-2xl"
                    />
                    <p className=" text-3xl font-bold">
                        Castrum x Valorant Cup #1
                    </p>
                    <p className="font-medium">
                        Get ready for an intense Valorant showdown! We are thrilled to announce our upcoming Valorant tournament, where teams from all over will compete for glory and a grand prize. This event promises exciting matches, skilled plays, and a chance to showcase your strategic prowess. Whether you're a seasoned player or a new challenger, this tournament offers a platform for everyone. Gather your team, practice your strategies, and prepare for battle. Don't miss out on this opportunity to prove your skills and claim victory. Register now and be part of an unforgettable gaming experience!
                    </p>

                </div>

                <div className=" flex flex-col w-full space-y-4 md:w-1/3">
                    <div className="  flex flex-col justify-center items-start space-y-2 bg-black w-full bg-opacity-60 backdrop-blur-sm rounded-lg p-6">
                        <p className="text-red-700 font-semibold">STARTS IN</p>
                        <div className="w-full flex flex-col justify-center items-center space-y-12">
                            <div className="flex flex-row items-center justify-center space-x-3">
                                <div className="flex flex-col items-center justify-center  bg-red-950 bg-opacity-70 px-1 p-2 rounded-lg">
                                    <p className="text-3xl font-extrabold font-mono">00</p>
                                    <p className="text-red-700 font-bold font-mono text-sm">DAYS</p>
                                </div>
                                <div className="flex flex-col items-center justify-center  bg-red-950 bg-opacity-70 px-1 p-2 rounded-lg">
                                    <p className="text-3xl font-extrabold font-mono">00</p>
                                    <p className="text-red-700 font-bold font-mono text-sm">HRS</p>
                                </div>
                                <div className="flex flex-col items-center justify-center  bg-red-950 bg-opacity-70 px-1 p-2 rounded-lg">
                                    <p className="text-3xl font-extrabold font-mono">00</p>
                                    <p className="text-red-700 font-bold font-mono text-sm">MINS</p>
                                </div>
                                <div className="flex flex-col items-center justify-center  bg-red-950 bg-opacity-70 px-1 p-2 rounded-lg">
                                    <p className="text-3xl font-extrabold font-mono">00</p>
                                    <p className="text-red-700 font-bold font-mono text-sm">SECS</p>
                                </div>
                            </div>
                            <Button variant={"destructive"} className="font-semibold text-lg">
                                Resgister
                            </Button>
                        </div>
                    </div>

                    <div className="  flex flex-col justify-center items-start space-y-2 bg-black w-full bg-opacity-60 backdrop-blur-sm rounded-lg p-6">
                        <p className="text-red-700 font-semibold">PRIZE POOL</p>
                        <div className="w-full flex flex-col justify-center items-start space-y-3">
                            <div className=" text-red-700">1ST PLACE <span className="text-white ml-3 font-bold">$50.000</span></div>
                            <div className=" text-red-700">2ST PLACE <span className="text-white ml-3 font-bold">$20.000</span></div>
                            <div className=" text-red-700">3ST PLACE <span className="text-white ml-3 font-bold">$10.000</span></div>
                        </div>
                    </div>

                    <div className="  flex flex-col justify-center items-start space-y-2 bg-black w-full bg-opacity-60 backdrop-blur-sm rounded-lg p-6">
                        <p className="text-red-700 font-semibold">DATES</p>
                        <div className="w-full flex flex-col justify-center items-start space-y-3">
                            <div className=" text-red-700">CHECH IN :<span className="text-white text-sm ml-1 font-medium">1 JULY 2024(20:00 - 20:59 GMT+3)</span></div>
                            <div className=" text-red-700">STARTS :<span className="text-white text-sm ml-3 font-medium">1 JULY 2024(20:00 - 20:59 GMT+3)</span></div>
                            <div className=" text-red-700">ENDS :<span className="text-white text-sm ml-3 font-medium">1 JULY 2024(20:00 - 20:59 GMT+3)</span></div>
                        </div>
                    </div>
                    <div className="  flex flex-col justify-center items-start space-y-2 bg-black w-full bg-opacity-60 backdrop-blur-sm rounded-lg p-6">
                        <div className="w-full flex flex-col justify-center items-start space-y-3">
                            <div className=" text-red-700 font-semibold">TEAM SIZE :<span className="text-white ml-1 font-bold">5 Players</span></div>
                            <div className=" text-red-700 font-semibold">TEAM COUNT :<span className="text-white ml-1 font-bold">4 - 32 Teams</span></div>
                            <div className=" text-red-700 font-semibold">REGION :<span className="text-white ml-1 font-bold">Europe</span></div>
                            <div className=" text-red-700 font-semibold">BRACKET :<span className="text-white ml-1 font-bold">Single Elimination</span></div>
                            
                        </div>
                    </div>
                    
                </div>
            </div>
            <div className=" flex flex-col justify-center items-center bg-black mt-6 w-5/6 bg-opacity-60 backdrop-blur-sm p-3 px-8 rounded-lg  md:flex-row md:space-x-32 ">
                <Image src={"/logoDark.png"} alt={""} width={300} height={20}/>
                <Image src={"/valoDark.png"} alt={""} width={300} height={20}/>
                
            </div>
        </div>
    )
}