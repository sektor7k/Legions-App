import { connectDB } from "@/lib/mongodb";
import Bet from "@/models/Bet";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    try {

        await connectDB();

        const reqBody = await request.json();
        const { winnerId, betId } = reqBody;


        const setWinner = await Bet.findByIdAndUpdate(betId, { winnerId });

        console.log(setWinner)

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