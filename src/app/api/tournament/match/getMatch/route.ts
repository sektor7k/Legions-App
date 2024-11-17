import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import Match from "@/models/Matches"; // Matches modelini import edin
import Team from "@/models/Team";

export async function POST(request: Request) {
    try {
        await connectDB();

        if (!Match) {
            return NextResponse.json({ message: 'Model not registered yet' }, { status: 500 });
        }
        if (!Team) {
            return NextResponse.json({ message: 'Model not registered yet' }, { status: 500 });
        }

        const reqBody = await request.json();
        const { tournamentId } = reqBody;

        const matches = await Match.find({ tournamentId })
            .populate({
                path: "team1Id",
                select: "teamName teamImage",
            })
            .populate({
                path: "team2Id",
                select: "teamName teamImage",
            });

        return NextResponse.json(
            { message: "getMatches successfully", data: matches },
            { status: 200 }
        );

    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            return NextResponse.json(
                { message: error.message },
                { status: 400 }
            );
        } else {
            console.error("Error during match fetching:", error);
            return NextResponse.error();
        }
    }
}
