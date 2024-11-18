import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Bet from "@/models/Bet";

export async function POST(request: NextRequest) {

    try {

        await connectDB();

        const reqBody = await request.json();
        const { id, opponentTeamId } = reqBody;

        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }


        const playBets = await Bet.findByIdAndUpdate(id, { status: 'closed', opponentId: session?.user.id, opponentTeamId });

        if (!playBets) {
            return NextResponse.json({ message: "Bet not found" }, { status: 404 });
        }

        return NextResponse.json(
            { message: "join bet successfully" },
            { status: 201 }
        )

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