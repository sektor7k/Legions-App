import { connectDB } from "@/lib/mongodb";
import BetStream from "@/models/BetStream";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

type StatusType = 'join' | 'open' | 'won';

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const reqBody = await request.json();
        const { status, amount, username, userAvatar } = reqBody;

        if (!status || !amount || !userAvatar || !username) {
            return NextResponse.json({ message: "Data is not complete" }, { status: 400 });
        }


        if (!['join', 'open', 'won'].includes(status)) {
            return NextResponse.json({ message: "Invalid status" }, { status: 400 });
        }


        const statusMessages: Record<StatusType, string> = {
            join: `joined the bet with $${amount}!`,
            open: `has opened a bet with $${amount}!`,
            won: `won $${amount} from the bet! Congratulations!`
        };

        const message = statusMessages[status as StatusType];

        const betStream = new BetStream({
            username,
            userAvatar,
            message
        });

       
        const savedBetStream = await betStream.save();

 
        return NextResponse.json({ data: savedBetStream }, { status: 201 });

    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            return NextResponse.json(
                { message: error.message },
                { status: 400 }
            );
        } else {
            console.error("Error during bet stream creation:", error);
            return NextResponse.json({ message: "Server error" }, { status: 500 });
        }
    }
}
