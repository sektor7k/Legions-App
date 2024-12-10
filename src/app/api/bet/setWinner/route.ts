import { connectDB } from "@/lib/mongodb";
import Bet from "@/models/Bet";
import User from "@/models/User";
import axios from "axios";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    try { 

        await connectDB();

        const reqBody = await request.json();
        const { winnerId, betId, stake } = reqBody;


        const setWinner = await Bet.findByIdAndUpdate(betId, { winnerId, status: "completed" });

        const winnerUser = await User.findById(winnerId, 'username image');


        if (!winnerUser) {
            return NextResponse.json({ message: "Winner user not found" }, { status: 404 });
        }

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_APP_URL}/api/bet/stream`, {
                status: 'won',
                amount: stake,
                username: winnerUser.username,
                userAvatar: winnerUser.image 
            });
        } catch (error) {
            console.error("Error adding to activity feed:", error);
        }


        return NextResponse.json({ data: null }, { status: 201 })

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