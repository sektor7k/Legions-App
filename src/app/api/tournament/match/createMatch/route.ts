import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Match from "@/models/Matches";

export async function POST(request: Request) {
    try {
        await connectDB();

        if (!Match) {
            return NextResponse.json({ message: 'Model not registered yet' }, { status: 500 });
        }

        const reqBody = await request.json();
        const { tournamentId, team1Id, team2Id, matchDate, matchTime } = reqBody;

        console.log(tournamentId, team1Id, team2Id, matchDate, matchTime);

        // Yeni maçı oluştur
        const match = new Match({
            tournamentId,
            team1Id,
            team2Id,
            matchDate,
            matchTime,
        });

        // Maçı kaydet
        const savedMatch = await match.save();

        // Kaydedilen maçı populate ile tekrar yükle
        const populatedMatch = await Match.findById(savedMatch._id)
            .populate({
                path: "team1Id",
                select: "teamName teamImage",
            })
            .populate({
                path: "team2Id",
                select: "teamName teamImage",
            });

            console.log(populatedMatch)

        return NextResponse.json(
            {
                message: "Match created successfully",
                match: populatedMatch,
            },
            { status: 201 }
        );
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
