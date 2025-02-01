import { NextResponse } from "next/server";
import Result from "@/models/Result";
import Tournament from "@/models/Tournament";
import Team from "@/models/Team";
import { connectDB } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { tournamentId, teams } = await req.json();

    if (!tournamentId || !Array.isArray(teams)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Turnuvanın var olup olmadığını kontrol et
    const tournamentExists = await Tournament.findById(tournamentId);
    if (!tournamentExists) {
      return NextResponse.json({ error: "Tournament not found" }, { status: 404 });
    }

    // Turnuvaya ait sonuç var mı kontrol et
    const existingResult = await Result.findOne({ tournamentId });
    if (existingResult) {
      // Mevcut veriyi güncelle
      existingResult.teams = teams.map((team) => ({
        position: team.position,
        teamId: team.team._id,
        win: team.wins,
        lose: team.losses,
        draw: team.draws,
      }));
      await existingResult.save();
      return NextResponse.json({ message: "Results updated successfully", result: existingResult }, { status: 200 });
    } else {
      // Yeni sonuç kaydı oluştur
      const newResult = await Result.create({
        tournamentId,
        teams: teams.map((team) => ({
          position: team.position,
          teamId: team.team._id,
          win: team.wins,
          lose: team.losses,
          draw: team.draws,
        })),
      });

      return NextResponse.json({ message: "Results saved successfully", result: newResult }, { status: 201 });
    }
  } catch (error) {
    console.error("Error saving results:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
