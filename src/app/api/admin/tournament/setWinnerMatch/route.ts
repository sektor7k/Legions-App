import { connectDB } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Match from "@/models/Matches";




export async function POST(request: NextRequest) {
    try {
        await connectDB()

        const reqBody = await request.json();

        const { id, winnerTeam, team1Score, team2Score } = reqBody;

        const setwinner = await Match.findByIdAndUpdate(id, { winnerTeam, team1Score, team2Score });


        return NextResponse.json({
            message: "successfully",
            success: true,
            setwinner
        })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}