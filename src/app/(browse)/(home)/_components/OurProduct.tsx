"use client"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"
import { ShoppingBag, Swords, Clock, CircleDollarSign, TypeIcon as type, type LucideIcon } from "lucide-react"
import Link from "next/link"

type FeatureItem = {
    title: string
    description: string
    icon: LucideIcon
    color: string
    borderColor: string
    link:string
}

const features: FeatureItem[] = [
    {
        title: "Tournaments",
        description: "Castrum Legions Hub",
        icon: Swords,
        color: "text-red-500",
        borderColor: "border-red-500",
        link:"/tournament"
    },
    {
        title: "Emporium",
        description: "Castrum Legions Hub",
        icon: ShoppingBag,
        color: "text-orange-500",
        borderColor: "border-orange-500",
        link:"/#"
    },
    {
        title: "PVP Arena",
        description: "Castrum Legions Hub",
        icon: CircleDollarSign,
        color: "text-blue-800",
        borderColor: "border-blue-800",
        link:"/bet"
    },
    {
        title: "Coming Soon",
        description: "Castrum Legions Hub",
        icon: Clock,
        color: "text-gray-500",
        borderColor: "border-gray-500",
        link:"/#"
    },
]

const Card = ({
    className,
    children,
    borderColor,
}: {
    className?: string
    children: React.ReactNode
    borderColor: string
}) => {
    return (
        <div
            className={cn(
                "rounded-lg h-full w-full p-4 overflow-hidden bg-white dark:bg-gray-950 border-2 relative z-20",
                borderColor,
                className,
            )}
        >
            <div className="relative z-50">
                <div className="p-4">{children}</div>
            </div>
        </div>
    )
}

const CardContent = ({
    className,
    icon: Icon,
    title,
    description,
    color,
    link
}: {
    className?: string
    icon: LucideIcon
    title: string
    description: string
    color: string
    link:string
}) => {
    return (
        <div className={cn("flex items-center space-x-4", className)}>
            <Icon className={cn("w-8 h-8", color)} />
            <div>
                <h4 className={cn("font-semibold", color)}>{title}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
            </div>
        </div>
    )
}

export default function FeatureCards() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

    return (
        <>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white  mt-12 pl-10 ">Our Products</h2>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-10">
                    {features.map((item, idx) => (
                        <Link
                        href={item.link}
                            key={item.title}
                            className="relative group block p-2 h-full w-full"
                            onMouseEnter={() => setHoveredIndex(idx)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            <AnimatePresence>
                                {hoveredIndex === idx && (
                                    <motion.span
                                        className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block rounded-lg"
                                        layoutId="hoverBackground"
                                        initial={{ opacity: 0 }}
                                        animate={{
                                            opacity: 1,
                                            transition: { duration: 0.15 },
                                        }}
                                        exit={{
                                            opacity: 0,
                                            transition: { duration: 0.15, delay: 0.2 },
                                        }}
                                    />
                                )}
                            </AnimatePresence>
                            <Card borderColor={item.borderColor}>
                                <CardContent icon={item.icon} title={item.title} description={item.description} color={item.color} link={item.link} />
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    )
}
