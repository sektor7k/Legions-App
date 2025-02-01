import { NextRequest, NextResponse } from "next/server";
import Result from "@/models/Result";
import { connectDB } from "@/lib/mongodb";

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const { tournamentId } = await request.json();

        if (!tournamentId) {
            return NextResponse.json({ error: "Tournament ID is required" }, { status: 400 });
        }

        const result = await Result.findOne({ tournamentId }).populate("teams.teamId");

        if (!result) {
            return NextResponse.json({ message: "No results found", results: [] }, { status: 200 });
        }

        const formattedResults = result.teams.map((team: any) => ({
            position: team.position,
            team: {
                _id: team.teamId._id,
                teamName: team.teamId.teamName,
                teamImage: team.teamId.teamImage,
            },
            wins: team.win,
            losses: team.lose,
            draws: team.draw,
        }));

        return NextResponse.json(formattedResults, { status: 200 });
    } catch (error) {
        console.error("Error fetching results:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
