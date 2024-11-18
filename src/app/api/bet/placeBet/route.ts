import { connectDB } from "@/lib/mongodb";
import Bet from "@/models/Bet";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const reqBody = await request.json();
        const { tournamentId, matchId, founderTeamId, stake } = reqBody;

        if (!tournamentId || !matchId || !founderTeamId || !stake) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        const founderId = session.user.id

        const bet = new Bet({
            founderId,
            tournamentId,
            matchId,
            founderTeamId,
            stake
        })

        const savedBet = await bet.save();

        return NextResponse.json({ data: savedBet }, { status: 201 })

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