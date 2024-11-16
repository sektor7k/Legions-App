import Image from "next/image"
import { FaForward } from "react-icons/fa";

export default function OpenBets(){
    return(
        <div className="w-full flex flex-col space-y-4">
                <div className="flex flex-row bg-gray-900  rounded-md">
                    <div className="flex flex-col w-4/5  pr-8">
                        <div className="relative flex flex-row items-center space-x-1 z-10 p-4">
                            <Image
                                src={"https://utfs.io/f/9cbfacf8-1c8f-403c-887a-ef975a277763-1yxrb.png"}
                                height="20"
                                width="20"
                                alt="Organizer Avatar"
                                className="h-6 w-6 rounded-full border-2 object-cover"
                            />
                            <p className="font-bold text-sm text-gray-500">Valorant: Castrum X Valorant Cup 1</p>
                        </div>
                        <div className="flex flex-row justify-between">
                            <div
                                className="p-4 rounded-bl-md text-white bg-gradient-to-r from-green-700/70 via-green-700/20 to-green-700/0 flex flex-row space-x-2"
                            >
                                <FaForward className=" bg-green-600 p-1 w-6 h-6 rounded-md" /> <span className=" font-semibold text-green-400">1 OCTOBER / 01:00</span>
                            </div>
                            <div className="flex flex-row items-center justify-center space-x-4 transform -translate-y-6">
                                <div className="relative flex flex-row items-center space-x-1 bg-green-700 bg-opacity-30 backdrop-blur-sm p-4 py-1 rounded-lg border-2 border-green-700">
                                    <Image
                                        src={"https://utfs.io/f/pc2uFj4UDvXVi3LATGBhkQG94m1xPtRgq7ezCElBV6Md5bSU"}
                                        height="100"
                                        width="100"
                                        alt="Organizer Avatar"
                                        className="h-12 w-12 rounded-full border-2 object-cover"
                                    />
                                    <p className="font-bold text-lg text-gray-100">FUT Esport</p>
                                </div>
                                <div className="font-bold text-lg">
                                    vs
                                </div>
                                <div className="relative flex flex-row items-center space-x-2  bg-red-700 bg-opacity-30 backdrop-blur-sm p-4 py-1 rounded-lg border-2 border-red-700">
                                    <Image
                                        src={"https://utfs.io/f/ad1e0468-8d3e-4de6-8610-8b48f15bd78c-fq7esz.webp"}
                                        height="100"
                                        width="100"
                                        alt="Organizer Avatar"
                                        className="h-12 w-12 rounded-full border-2 object-cover"
                                    />
                                    <p className="font-bold text-lg text-gray-100">BBL Esport</p>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="relative w-1/5 flex flex-col items-center justify-center space-y-1">
                        <div className="absolute left-0 top-3 bottom-3 w-0.5 bg-gray-600 rounded-full"></div>
                        <div className="relative flex flex-row items-center space-x-1  ">
                            <Image
                                src={"https://utfs.io/f/82168ae8-54cd-41c5-bf38-b7aefb6abec2-22uz0h.png"}
                                height="100"
                                width="100"
                                alt="Organizer Avatar"
                                className="h-8 w-8 rounded-full border-2 object-cover"
                            />
                            <p className="font-semibold text-sm text-gray-100">Sektor7K</p>
                        </div>
                        <button className="bg-blue-950 bg-opacity-50 hover:bg-none flex flex-col items-center p-2 rounded-md relative group transition-all duration-300 min-h-[60px] min-w-[120px]">
                            <div className="text-center transition-opacity duration-300 opacity-100 group-hover:opacity-0 absolute">
                                <p className="text-xs font-bold">PLACED BET OF</p>
                                <p className="text-2xl font-extrabold text-blue-700">$500</p>
                            </div>
                            <p className="text-2xl font-bold  text-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Play
                            </p>
                        </button>


                    </div>


                </div>
                <div className="flex flex-row bg-gray-900  rounded-md">
                    <div className="flex flex-col w-4/5  pr-8">
                        <div className="relative flex flex-row items-center space-x-1 z-10 p-4">
                            <Image
                                src={"https://utfs.io/f/24a8d009-3c7b-44e0-a9de-79a884ed6abb-nbvj3q.jpg"}
                                height="20"
                                width="20"
                                alt="Organizer Avatar"
                                className="h-6 w-6 rounded-full border-2 object-cover"
                            />
                            <p className="font-bold text-sm text-gray-500">The Finals: The Finals x Cookie3 Cup 1#</p>
                        </div>
                        <div className="flex flex-row justify-between">
                            <div
                                className="p-4 rounded-bl-md text-white bg-gradient-to-r from-green-700/70 via-green-700/20 to-green-700/0 flex flex-row space-x-2"
                            >
                                <FaForward className=" bg-green-600 p-1 w-6 h-6 rounded-md" /> <span className=" font-semibold text-green-400">3 OCTOBER / 20:30</span>
                            </div>
                            <div className="flex flex-row items-center justify-center space-x-4 transform -translate-y-6">
                                <div className="relative flex flex-row items-center space-x-1 bg-green-700 bg-opacity-30 backdrop-blur-sm p-4 py-1 rounded-lg border-2 border-green-700">
                                    <Image
                                        src={"https://utfs.io/f/61058261-496f-493e-8b08-e8bc36354b07-2drm.jpg"}
                                        height="100"
                                        width="100"
                                        alt="Organizer Avatar"
                                        className="h-12 w-12 rounded-full border-2 object-cover"
                                    />
                                    <p className="font-bold text-lg text-gray-100">Castrum GO</p>
                                </div>
                                <div className="font-bold text-lg">
                                    vs
                                </div>
                                <div className="relative flex flex-row items-center space-x-2  bg-red-700 bg-opacity-30 backdrop-blur-sm p-4 py-1 rounded-lg border-2 border-red-700">
                                    <Image
                                        src={"https://utfs.io/f/cc031436-7333-4346-8688-37dd5fb7ac31-1zbfv.jpg"}
                                        height="100"
                                        width="100"
                                        alt="Organizer Avatar"
                                        className="h-12 w-12 rounded-full border-2 object-cover"
                                    />
                                    <p className="font-bold text-lg text-gray-100">CBU Esport</p>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="relative w-1/5 flex flex-col items-center justify-center space-y-1">
                        <div className="absolute left-0 top-3 bottom-3 w-0.5 bg-gray-600 rounded-full"></div>
                        <div className="relative flex flex-row items-center space-x-1  ">
                            <Image
                                src={"https://utfs.io/f/a871e06a-5b0d-422f-89a8-46e85f63f534-d6ph0f.41.42.png"}
                                height="100"
                                width="100"
                                alt="Organizer Avatar"
                                className="h-8 w-8 rounded-full border-2 object-cover"
                            />
                            <p className="font-semibold text-sm text-gray-100">SabitCan</p>
                        </div>
                        <button className="bg-blue-950 bg-opacity-50 hover:bg-none flex flex-col items-center p-2 rounded-md relative group transition-all duration-300 min-h-[60px] min-w-[120px]">
                            <div className="text-center transition-opacity duration-300 opacity-100 group-hover:opacity-0 absolute">
                                <p className="text-xs font-bold">PLACED BET OF</p>
                                <p className="text-2xl font-extrabold text-blue-700">$150</p>
                            </div>
                            <p className="text-2xl font-bold  text-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Play
                            </p>
                        </button>


                    </div>


                </div>
                
            </div>
    )
}