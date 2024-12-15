import { connectDB } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Match from "@/models/Matches";

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const reqBody = await request.json();
        const { matchId, team1Id, team2Id, matchDate, matchTime } = reqBody;

        
        if (!matchId) {
            return NextResponse.json({ error: "Match ID is required" }, { status: 400 });
        }

        // Dinamik olarak güncellenecek alanları oluştur
        const updateData: any = {};

        if (team1Id) updateData["team1Id"] = team1Id;
        if (team2Id) updateData["team2Id"] = team2Id;
        if (matchDate) updateData["matchDate"] = matchDate;
        if (matchTime) updateData["matchTime"] = matchTime;

        console.log(updateData)

        // Hiçbir güncelleme alanı yoksa hata döndür
        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: "No data to update" }, { status: 400 });
        }

        // Veritabanında güncelleme yap
        const updatedMatch = await Match.findByIdAndUpdate(
             matchId, 
            { $set: updateData  }, 
            { new: true } 
        );

        if (!updatedMatch) {
            console.log("sasasa")
            return NextResponse.json({ error: "Match not found" }, { status: 404 });
        }

        return NextResponse.json({
            message: "Match updated successfully",
            success: true,
            match: updatedMatch,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
