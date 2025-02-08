"use client"
import axios from "axios";
import { AlarmClock, AlarmClockCheck, Calendar, Check, Info, Play, Trophy } from "lucide-react"
import Image from "next/image"
import Countdown from "./_components/Countdown";
import React, { useEffect, useMemo, useState } from "react";
import RegisterTournament from "./_components/RegisterTournament";
import { parse } from "date-fns";
import useSWR from 'swr';
import LoadingAnimation from "@/components/loadingAnimation";
import ErrorAnimation from "@/components/errorAnimation";
import TournamentDialog from "./_components/TournamentResult";

interface Tournament {
    id: string;
    tname: string;
    tdescription: string;
    thumbnail: string;
    currentphase: 'Drafting' | 'Registration' | 'checkin' | 'live' | 'Finished';
    checkin: string;
    checkinTime: string;
    starts: string;
    startsTime: string;
    ends: string;
    endsTime: string;
    teamsize: number;
    teamcount: number;
    region: string;
    bracket: string;
    sponsors: string[];
    prizePool: { _id: string; key: string; value: number }[];
    tournamentStatus: string;
    registerStatus: string;
    chatStatus: string;
    resultStatus: string;
}

const fetcher = (url: string, id: any) => axios.post(url, { id }).then(res => res.data);

export default function TournamentPage({ params }: { params: { id: string } }) {

    //  Turnuva verisini çek
    const { data: tournament, error } = useSWR<Tournament>(['/api/tournament/getTournamentDetail', params.id] as const,
        ([url, id]) => fetcher(url, id)
    );

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        if (tournament?.resultStatus === "open") {
            setIsDialogOpen(true);
        }
    }, [tournament?.resultStatus]);

    function formatTime(timeString: string): string {
        if (timeString.length === 4) {
            const hours = timeString.slice(0, 2);
            const minutes = timeString.slice(2);
            return `${hours}:${minutes}`;
        }
        return timeString;
    }

    const formattedTournament = useMemo(() => {
        if (!tournament) return null;
        return {
            ...tournament,
            checkinTime: formatTime(tournament.checkinTime),
            startsTime: formatTime(tournament.startsTime),
            endsTime: formatTime(tournament.endsTime),
        };
    }, [tournament]);

    function removeOrdinalSuffix(dateStr: string) {
        return dateStr.replace(/(\d+)(st|nd|rd|th)/, '$1');
    }
    // Tarih işlemleri
    function getCombinedDate(startDate: string, startTime: string): Date {
        const dateFormat = 'MMMM d, yyyy';
        const timeFormat = 'HH:mm';
        const combinedDateTimeFormat = `${dateFormat} ${timeFormat}`;
        const combinedDateTimeString = `${removeOrdinalSuffix(startDate)} ${startTime}`;
        const combinedDate = parse(combinedDateTimeString, combinedDateTimeFormat, new Date());

        if (isNaN(combinedDate.getTime())) {
            console.error('Invalid date:', combinedDateTimeString);
            return new Date();
        }

        return combinedDate;
    }



    const startDateTime = useMemo(() => {
        if (!formattedTournament) return new Date();
        if (!formattedTournament.starts) return new Date();
        const startTime = formattedTournament.startsTime ?? '00:00';
        return getCombinedDate(formattedTournament.starts, startTime);
    }, [formattedTournament]);



    const phases = ["Drafting", "Registration", "checkin", "live", "Finished"];
    const currentPhase = tournament?.currentphase as "Drafting" | "Registration" | "checkin" | "live" | "Finished";

    const getPhaseBgClass = (phase: string) => {
        const phaseIndex = phases.indexOf(phase);
        const currentPhaseIndex = phases.indexOf(currentPhase);
        return phaseIndex <= currentPhaseIndex ? "bg-green-900" : "bg-red-900";
    };

    const getPhaseIcon = (phase: string) => {
        const phaseIndex = phases.indexOf(phase);
        const currentPhaseIndex = phases.indexOf(currentPhase);
        return phaseIndex <= currentPhaseIndex ? <AlarmClockCheck className="text-green-600" /> : <AlarmClock className="text-red-600" />;
    };

    const getLineBgClass = (index: number) => {
        const currentPhaseIndex = phases.indexOf(currentPhase);
        return index <= currentPhaseIndex - 1 ? "border-green-400" : "border-gray-400";
    };

    if (error) return <div className=" flex h-screen justify-center items-center"><ErrorAnimation /></div>;
    if (!tournament) return <div className=" flex h-screen justify-center items-center"><LoadingAnimation /></div>;

    return (
        <div className=" flex flex-col w-full justify-center items-center space-y-3">
            <div className=" flex flex-col justify-start space-y-3 bg-black mt-6 w-5/6 bg-opacity-60 backdrop-blur-sm p-3 px-8 rounded-lg">
                <p className=" text-red-700 font-semibold">
                    CURRENT PHASE
                </p>
                <div className="flex justify-start w-full md:justify-center">
                    <div className="flex flex-col w-5/6 items-start justify-center space-y-2 md:flex-row md:items-center md:space-y-0">
                        {phases.map((phase, index) => (
                            <React.Fragment key={phase}>
                                <div
                                    className={`flex flex-row space-x-3 items-center justify-center ${getPhaseBgClass(
                                        phase
                                    )} px-5 p-2 rounded-full bg-opacity-80`}
                                >
                                    {getPhaseIcon(phase)} {" "}
                                    <div className="font-medium text-nowrap">{phase === "checkin" ? "Check In" : phase === "live" ? "Live" : phase}</div>
                                </div>
                                {index < phases.length - 1 && (
                                    <p className={`w-full border mx-3 rounded-full hidden md:flex ${getLineBgClass(index)}`}></p>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
            <div className=" flex flex-col justify-between w-5/6 space-y-4 md:flex-row md:space-y-0 ">

                <div className="flex flex-col justify-start space-y-6 bg-black w-full bg-opacity-60 backdrop-blur-sm p-6 px-8 rounded-lg md:w-[calc((2/4*100%)-1rem)] ">

                    <Image
                        src={`${tournament.thumbnail}`}
                        alt={""}
                        width={920}
                        height={80}
                        objectFit="cover"
                        className="transition-opacity duration-800 group-hover/card:opacity-0 rounded-2xl"
                    />
                    <p className=" text-3xl font-bold">
                        {tournament.tname}
                    </p>

                    <div className="prose" style={{ whiteSpace: "pre-line" }}>
                        {/* HTML içeriğini render etmek için */}
                        <div dangerouslySetInnerHTML={{ __html: tournament.tdescription }} />
                    </div>


                </div>

                <div className="flex flex-col w-full space-y-4 sm:w-full md:w-2/4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start bg-black bg-opacity-60 backdrop-blur-sm rounded-lg p-4 sm:p-6 w-full">
                        <div className="flex items-center space-x-4 w-full sm:w-40 mb-4 sm:mb-0">
                            <Play className="text-red-700 w-6 h-6 sm:w-9 sm:h-9" />
                            <p className="text-red-700 font-semibold uppercase text-sm sm:text-base">Starts in</p>
                        </div>
                        <div className="hidden sm:block w-px h-16 sm:h-full bg-gray-600 mx-4 sm:mx-6" />
                        <div className="flex flex-col justify-center items-center space-y-4 w-full sm:w-auto">
                            {startDateTime ? (
                                <Countdown targetDate={startDateTime} />
                            ) : (
                                <div className="text-white text-sm sm:text-base">Loading countdown...</div>
                            )}
                            <RegisterTournament id={params.id} registerStatus={tournament.registerStatus} />

                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start bg-black bg-opacity-60 backdrop-blur-sm rounded-lg p-4 sm:p-6 w-full">
                        <div className="flex items-center space-x-4 w-full sm:w-40 mb-4 sm:mb-0">
                            <Trophy className="text-red-700 w-6 h-6 sm:w-9 sm:h-9" />
                            <p className="text-red-700 font-semibold uppercase text-sm sm:text-base">Prize Pool</p>
                        </div>
                        <div className="hidden sm:block w-px h-16 sm:h-full self-stretch bg-gray-600 mx-4 sm:mx-6" />
                        <div className="flex flex-col items-start space-y-3 w-full sm:w-auto">
                            {tournament.prizePool.map((item: any) => (
                                <div key={item._id} className="flex justify-between w-full">
                                    <span className="text-red-700 text-sm sm:text-base">{item.key} PLACE</span>
                                    <span className="text-white font-bold text-sm sm:text-base">${item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start bg-black bg-opacity-60 backdrop-blur-sm rounded-lg p-4 sm:p-6 w-full">
                        <div className="flex items-center space-x-4 w-full sm:w-40 mb-4 sm:mb-0">
                            <Calendar className="text-red-700 w-6 h-6 sm:w-9 sm:h-9" />
                            <p className="text-red-700 font-semibold uppercase text-sm sm:text-base">Dates</p>
                        </div>
                        <div className="hidden sm:block w-px h-16 sm:h-full self-stretch bg-gray-600 mx-4 sm:mx-6" />
                        <div className="flex flex-col items-start space-y-3 w-full sm:w-auto">
                            <div className="flex flex-col sm:flex-row justify-start items-start sm:items-center w-full gap-1">
                                <span className="text-red-700 text-sm sm:text-base">CHECK IN:</span>
                                <span className="text-white text-xs sm:text-sm font-medium">
                                    {tournament.checkin} ({formatTime(tournament.checkinTime)} GMT+3)
                                </span>
                            </div>
                            <div className="flex flex-col sm:flex-row justify-start items-start sm:items-center w-full gap-1">
                                <span className="text-red-700 text-sm sm:text-base">STARTS:</span>
                                <span className="text-white text-xs sm:text-sm font-medium">
                                    {tournament.starts} ({formatTime(tournament.startsTime)} GMT+3)
                                </span>
                            </div>
                            <div className="flex flex-col sm:flex-row justify-start items-start sm:items-center w-full gap-1">
                                <span className="text-red-700 text-sm sm:text-base">ENDS:</span>
                                <span className="text-white text-xs sm:text-sm font-medium">
                                    {tournament.ends} ({formatTime(tournament.endsTime)} GMT+3)
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start bg-black bg-opacity-60 backdrop-blur-sm rounded-lg p-4 sm:p-6 w-full">
                        <div className="flex items-center space-x-4 w-full sm:w-40 mb-4 sm:mb-0">
                            <Info className="text-red-700 w-6 h-6 sm:w-9 sm:h-9" />
                            <p className="text-red-700 font-semibold uppercase text-sm sm:text-base">Info</p>
                        </div>
                        <div className="hidden sm:block w-px h-16 sm:h-full self-stretch bg-gray-600 mx-4 sm:mx-6" />
                        <div className="flex flex-col items-start space-y-3 w-full sm:w-auto">
                            <div className="flex justify-start w-full gap-2">
                                <span className="text-red-700 font-semibold text-sm sm:text-base">TEAM SIZE:</span>
                                <span className="text-white font-bold text-sm sm:text-base">{tournament.teamsize}</span>
                            </div>
                            <div className="flex justify-start gap-2 w-full">
                                <span className="text-red-700 font-semibold text-sm sm:text-base">TEAM COUNT:</span>
                                <span className="text-white font-bold text-sm sm:text-base">{tournament.teamcount}s</span>
                            </div>
                            <div className="flex justify-start gap-2 w-full">
                                <span className="text-red-700 font-semibold text-sm sm:text-base">REGION:</span>
                                <span className="text-white font-bold text-sm sm:text-base">{tournament.region}</span>
                            </div>
                            <div className="flex justify-start gap-2 w-full">
                                <span className="text-red-700 font-semibold text-sm sm:text-base">BRACKET:</span>
                                <span className="text-white font-bold text-sm sm:text-base">{tournament.bracket}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-items-center bg-black mt-6 w-5/6 bg-opacity-60 backdrop-blur-sm py-16 px-8 rounded-lg md:flex-row md:space-x-32">

                {tournament.sponsors && tournament.sponsors.map((sponsorUrl: any, index: any) => (
                    <Image
                        key={index}
                        src={sponsorUrl}
                        alt={`Sponsor`}
                        width={300}
                        height={20}
                        className="mt-4 md:mt-0"
                    />
                ))}
            </div>
            {tournament?.resultStatus === "open" && (
                <div className="fixed bottom-4 right-4 z-50">
                    <TournamentDialog id={params.id} isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} />
                </div>
            )}
        </div>
    )
}
