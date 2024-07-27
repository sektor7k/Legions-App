"use client";
import React from "react";
import { PinContainer } from "@/components/ui/3d-pin";
import AvatarDemo from "@/components/layout/avatarDemo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Team() {
    return (

        <section
            id="team"
            className="container py-24 sm:py-32"
        >
            <h2 className="text-3xl md:text-4xl font-bold">
                <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                    OUR
                </span>
                TEAM
            </h2>

            <p className="mt-4 mb-10 text-xl text-muted-foreground">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veritatis
                dolor pariatur sit!
            </p>

            <div className="h-auto w-full flex flex-col items-center justify-center sm:flex-row sm:flex-wrap ">
                <PinContainer title="github.com/sektor7k" href="https://github.com/sektor7k">
                    <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/3 w-[20rem] h-[20rem] justify-center items-center">
                        <h3 className="max-w-xs !pb-2 !m-0 font-bold text-base text-slate-100">
                            Sektor7K
                        </h3>
                        <div className="text-base !m-0 !p-0 font-normal">
                            <span className="text-slate-500">Fullstack Developer</span>
                        </div>

                        <Avatar className="flex flex-1 w-3/4 rounded-full mt-4 ">
                            <AvatarImage
                                src="https://github.com/sektor7k.png"
                                alt="user"
                            />
                            <AvatarFallback>user</AvatarFallback>
                        </Avatar>
                    </div>
                </PinContainer>

                <PinContainer title="x.com/BerkayFall" href="https://x.com/BerkayFall">
                    <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/3 w-[20rem] h-[20rem] justify-center items-center">
                        <h3 className="max-w-xs !pb-2 !m-0 font-bold text-base text-slate-100">
                            Fall
                        </h3>
                        <div className="text-base !m-0 !p-0 font-normal">
                            <span className="text-slate-500">Desinger - Marketing</span>
                        </div>
                        <Avatar className="flex flex-1 w-3/4 rounded-full mt-4 ">
                            <AvatarImage
                                src="https://pbs.twimg.com/profile_images/1664014334337470467/DNxDdOua_400x400.jpg"
                                alt="user"
                            />
                            <AvatarFallback>user</AvatarFallback>
                        </Avatar>
                    </div>
                </PinContainer>

                <PinContainer title="x.com/rabbitcoinhole" href="https://x.com/rabbitcoinhole">
                    <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/3 w-[20rem] h-[20rem] justify-center items-center">
                        <h3 className="max-w-xs !pb-2 !m-0 font-bold text-base text-slate-100">
                            Rabbitcoinhole
                        </h3>
                        <div className="text-base !m-0 !p-0 font-normal">
                            <span className="text-slate-500">Influcer</span>
                        </div>
                        <Avatar className="flex flex-1 w-3/4 rounded-full mt-4 ">
                            <AvatarImage
                                src="https://pbs.twimg.com/profile_images/1755154072728940544/QSEWR0OS_400x400.jpg"
                                alt="user"
                            />
                            <AvatarFallback>user</AvatarFallback>
                        </Avatar>
                    </div>
                </PinContainer>
            </div>



        </section>
    );
}
