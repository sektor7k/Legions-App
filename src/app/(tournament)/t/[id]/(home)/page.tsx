"use client"
import { Button } from "@/components/ui/button"
import axios from "axios";
import { Check } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Countdown from "./_components/Countdown";
import { parse, format } from 'date-fns';
import React from "react";
import RegisterTournament from "./_components/RegisterTournament";

export default function TournamentPage({ params }: { params: { id: string } }) {

    const [tournament, setTournament] = useState<any>(null);
    const router = useRouter();
    const [startDateTime, setStartDateTime] = useState<Date | null>(null);

    useEffect(() => {
        // ID'yi URL'den al
        const fetchTournament = async () => {
            try {
                const res = await axios.post(`/api/tournament/getTournamentDetail`, { id: params.id });

                const formattedData = {
                    ...res.data,
                    checkinTime: formatTime(res.data.checkinTime),
                    startsTime: formatTime(res.data.startsTime),
                    endsTime: formatTime(res.data.endsTime),
                };
                console.log(res.data)
                setTournament(formattedData);
            } catch (error) {
                console.error('Error fetching tournament:', error);
            }
        };

        fetchTournament();
    }, [params.id]);

    function formatTime(timeString: string): string {
        if (timeString.length === 4) {
            const hours = timeString.slice(0, 2);
            const minutes = timeString.slice(2);
            return `${hours}:${minutes}`;
        }
        return timeString;
    }

    function removeOrdinalSuffix(dateStr: any) {
        return dateStr.replace(/(\d+)(st|nd|rd|th)/, '$1');
    }

    function getCombinedDate(startDate: string, startTime: string): Date {
        const dateFormat = 'MMMM d, yyyy'; // For example: August 23, 2024
        const timeFormat = 'HH:mm'; // For example: 14:30
        const combinedDateTimeFormat = `${dateFormat} ${timeFormat}`;

        // Remove ordinal suffix from the date
        const cleanDate = removeOrdinalSuffix(startDate);
        // Combine cleaned date and time into a single string
        const combinedDateTimeString = `${cleanDate} ${startTime}`;

        // Parse the combined date and time string
        const combinedDate = parse(combinedDateTimeString, combinedDateTimeFormat, new Date());

        // Check if the result is invalid
        if (isNaN(combinedDate.getTime())) {
            console.error('Invalid date:', combinedDateTimeString);
            return new Date(); // or handle the error as needed
        }

        return combinedDate;
    }


    useEffect(() => {
        if (tournament && tournament.starts) {
            const startDate = tournament.starts;
            const startTime = tournament.startsTime ?? '00:00'; // Varsayılan saat
            const combinedDateTime = getCombinedDate(startDate, startTime);
            setStartDateTime(combinedDateTime); // State güncelleme
        } else {
            console.error("tournament veya tournament.starts değeri mevcut değil.");
        }
    }, [tournament]);



    if (!tournament) return <div>Loading...</div>;

    const phases = ["Drafting", "Registration", "checkin", "live", "Finished"];

    const currentPhase = tournament.currentphase;

    const getPhaseBgClass = (phase: string) => {
        const phaseIndex = phases.indexOf(phase);
        const currentPhaseIndex = phases.indexOf(currentPhase);
        return phaseIndex <= currentPhaseIndex ? "bg-green-900" : "bg-red-900";
    };

    const getPhaseBgClassCheck = (phase: string) => {
        const phaseIndex = phases.indexOf(phase);
        const currentPhaseIndex = phases.indexOf(currentPhase);
        return phaseIndex <= currentPhaseIndex ? "bg-green-600" : "bg-red-600";
    };

    const getLineBgClass = (index: number) => {
        const currentPhaseIndex = phases.indexOf(currentPhase);
        return index <= currentPhaseIndex - 1 ? "border-green-400" : "border-gray-400";
    };

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
                                    <Check className={`${getPhaseBgClassCheck(
                                        phase
                                    )} rounded-full text-slate-700`} />{" "}
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

                <div className="flex flex-col justify-start space-y-6 bg-black w-full bg-opacity-60 backdrop-blur-sm p-6 px-8 rounded-lg md:w-[calc((2/3*100%)-1rem)] ">

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
                    <p className="font-medium">
                        {tournament.tdescription}
                    </p>

                </div>

                <div className=" flex flex-col w-full space-y-4 md:w-1/3">
                    <div className="  flex flex-col justify-center items-start space-y-2 bg-black w-full bg-opacity-60 backdrop-blur-sm rounded-lg p-6">
                        <p className="text-red-700 font-semibold">STARTS IN</p>
                        <div className="w-full flex flex-col justify-center items-center space-y-12">
                            {startDateTime ? (
                                <Countdown targetDate={startDateTime} />
                            ) : (
                                <div>Loading countdown...</div>
                            )}
                            <RegisterTournament id={params.id} />
                        </div>
                    </div>

                    <div className="  flex flex-col justify-center items-start space-y-2 bg-black w-full bg-opacity-60 backdrop-blur-sm rounded-lg p-6">
                        <p className="text-red-700 font-semibold">PRIZE POOL</p>
                        <div className="w-full flex flex-col justify-center items-start space-y-3">
                            {tournament.prizePool.map((item: any) => (
                                <div key={item._id} className=" text-red-700">{item.key} PLACE<span className="text-white ml-3 font-bold">${item.value}</span></div>
                            ))}


                        </div>
                    </div>

                    <div className="  flex flex-col justify-center items-start space-y-2 bg-black w-full bg-opacity-60 backdrop-blur-sm rounded-lg p-6">
                        <p className="text-red-700 font-semibold">DATES</p>
                        <div className="w-full flex flex-col justify-center items-start space-y-3">
                            <div className=" text-red-700">CHECH IN :<span className="text-white text-sm ml-1 font-medium">{tournament.checkin} ({tournament.checkinTime} GMT+3)</span></div>
                            <div className=" text-red-700">STARTS :<span className="text-white text-sm ml-3 font-medium">{tournament.starts} ({tournament.startsTime} GMT+3)</span></div>
                            <div className=" text-red-700">ENDS :<span className="text-white text-sm ml-3 font-medium">{tournament.ends} ({tournament.endsTime} GMT+3)</span></div>
                        </div>
                    </div>
                    <div className="  flex flex-col justify-center items-start space-y-2 bg-black w-full bg-opacity-60 backdrop-blur-sm rounded-lg p-6">
                        <div className="w-full flex flex-col justify-center items-start space-y-3">
                            <div className=" text-red-700 font-semibold">TEAM SIZE :<span className="text-white ml-1 font-bold">{tournament.teamsize}</span></div>
                            <div className=" text-red-700 font-semibold">TEAM COUNT :<span className="text-white ml-1 font-bold">{tournament.teamcount}s</span></div>
                            <div className=" text-red-700 font-semibold">REGION :<span className="text-white ml-1 font-bold">{tournament.region}</span></div>
                            <div className=" text-red-700 font-semibold">BRACKET :<span className="text-white ml-1 font-bold">{tournament.bracket}</span></div>

                        </div>
                    </div>

                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-items-center bg-black mt-6 w-5/6 bg-opacity-60 backdrop-blur-sm py-16 px-8 rounded-lg md:flex-row md:space-x-32">

                {tournament.sponsors && tournament.sponsors.map((sponsorUrl:any, index:any) => (
                    <Image
                        key={index} // Benzersiz anahtar
                        src={sponsorUrl} // Sponsor URL'si
                        alt={`Sponsor`} // Alternatif metin
                        width={300} // Genişlik
                        height={20} // Yükseklik
                        className="mt-4 md:mt-0" // Mobilde alt kısımda boşluk bırak
                    />
                ))}
            </div>
        </div>
    )
}
