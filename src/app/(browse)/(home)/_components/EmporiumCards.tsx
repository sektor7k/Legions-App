"use client"

import { Card } from "@/components/ui/card"

interface GameCard {
    platform: string
    amount: string
    primaryColor: string
    secondaryColor: string
    icon: string
    price: string
}

const cards: GameCard[] = [
    {
        platform: "VALORANT",
        amount: "1400 VP",
        primaryColor: "rgb(255, 70, 85)",
        secondaryColor: "#1a1a1a",
        icon: "https://utfs.io/f/9cbfacf8-1c8f-403c-887a-ef975a277763-1yxrb.png",
        price: "$25"
    },
    {
        platform: "STEAM",
        amount: "200$",
        primaryColor: "rgb(28, 78, 216)",
        secondaryColor: "#1a1a1a",
        icon: "https://images.seeklogo.com/logo-png/27/1/steam-logo-png_seeklogo-270306.png?v=1956237638703008512",
        price: "$200"
    },
    {
        platform: "XBOX",
        amount: "200$",
        primaryColor: "rgb(22, 163, 74)",
        secondaryColor: "#1a1a1a",
        icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Xbox_one_logo.svg/1200px-Xbox_one_logo.svg.png",
        price: "$200"
    },
    {
        platform: "PUPG",
        amount: "400 UC",
        primaryColor: "rgb(189, 142, 0)",
        secondaryColor: "#1a1a1a",
        icon: "https://i.pinimg.com/474x/bb/36/2d/bb362d3f75ba265a352843a19dbb8b1e.jpg",
        price: "$10"
    },

]

export default function EmporiumCards() {
    return (
        <div className="p-8 pt-20">
            <h1 className="text-2xl font-bold text-white mb-8 ">Emporium Cards</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 ">
                {cards.map((card, index) => (
                    <div key={index} className="relative w-full aspect-[3/4] max-w-[280px] mx-auto">
                        <Card
                            className="w-full h-full overflow-hidden relative bg-transparent transition-all duration-300 ease-in-out hover:scale-105 hover:z-10"
                            style={{ borderColor: card.primaryColor, borderWidth: "2px" }}
                        >
                            {/* Background split design */}
                            <div
                                className="absolute inset-0"
                                style={{
                                    background: `linear-gradient(135deg, 
                    ${card.secondaryColor} 0%, 
                    ${card.secondaryColor} 50%, 
                    ${card.primaryColor} 50%, 
                    ${card.primaryColor} 100%)`,
                                }}
                            />

                            {/* Top rounded rectangle cutout */}
                            <div
                                className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-12 rounded-full"
                                style={{ marginTop: "-1px", background: "var(--background)" }}
                            />

                            {/* Content */}
                            <div className="relative h-full flex flex-col items-center justify-center pt-16 pb-4 px-4">
                                {/* Icon container */}
                                <div className="w-36 h-36 mb-4 rounded-2xl flex items-center justify-center">
                                    <img
                                        src={card.icon || "/placeholder.svg"}
                                        alt={`${card.platform} icon`}
                                        className="w-28 h-28 object-contain rounded-full bg-zinc-900"
                                        style={{ borderColor: card.secondaryColor, borderWidth: "5px" }}
                                    />
                                </div>

                                {/* Text content */}
                                <div className="text-center space-y-1 mb-auto">
                                    <h2 className="text-white font-semibold text-base">{card.platform}</h2>
                                    <p className="text-gray-200 font-bold text-2xl">{card.amount}</p>
                                </div>

                                {/* Review button */}
                                <button className="bg-zinc-900 text-gray-200 w-32 py-2 rounded-lg flex justify-center items-center overflow-hidden relative group">
                                    <span className="relative z-10 font-semibold group-hover:-translate-x-[350%] transition-transform duration-300 ease-in-out">
                                        {card.price}
                                    </span>
                                    <span className="absolute font-semibold text-nowrap inset-0 flex items-center justify-center translate-x-[350%] group-hover:translate-x-0 transition-transform duration-300 ease-in-out">
                                        Comming Soon
                                    </span>
                                </button>
                            </div>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    )
}

