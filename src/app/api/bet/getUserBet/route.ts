import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Bet from "@/models/Bet";
import Match from "@/models/Matches";
import Team from "@/models/Team";
import Tournament from "@/models/Tournament";
import User from "@/models/User";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {

    try {
        await connectDB()

        const session = await getServerSession(authOptions)


        if (!Bet && !Match && !Team && !Tournament && !User) {
            return NextResponse.json({ message: 'Model not registered yet' }, { status: 500 });
        }


        const bets = await Bet.find({
            $or: [
                { founderId: session?.user.id },
                { opponentId: session?.user.id },
            ]
        }).populate({
            path: 'founderId',
            select: 'username image'
        })
            .populate({
                path: 'tournamentId',
                select: 'thumbnail tname organizer organizerAvatar'
            })
            .populate({
                path: 'matchId',
                select: 'team1Id team2Id matchDate matchTime',
                populate: [
                    {
                        path: 'team1Id',
                        select: 'teamName teamImage'
                    },
                    {
                        path: 'team2Id',
                        select: 'teamName teamImage'
                    }
                ]
            })
            .populate({
                path: 'opponentId',
                select: 'username image'
            });

        const betsWithStatus = bets.map((bet) => {
            let betstatus = "ongoing"; // Default durum
            if (bet.winnerId) {
                betstatus = bet.winnerId.toString() === session?.user.id ? "won" : "lost";
            }
            return {
                ...bet.toObject(), // Bet verisini düz obje haline getir
                betstatus, // Hesaplanan betstatus ekle
            };
        });



        return NextResponse.json({ data: betsWithStatus }, { status: 201 })

    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            return NextResponse.json(
                { message: error.message },
                { status: 400 }
            );
        } else {
            console.error("Error during match creation:", error);
            return NextResponse.error();
        }
    }
}

