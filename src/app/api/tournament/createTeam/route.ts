import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Team from "@/models/Team"; // Team modelini import edin
import mongoose from "mongoose";
import { updateParticipantsCount } from "@/helpers/participantscount";

export async function POST(request: Request) {
  try {
    await connectDB(); // Veritabanına bağlan

    const reqBody = await request.json(); // İstek gövdesini al
    const { tournamentId, teamName, teamImage, status, members } = reqBody;

    console.log(tournamentId, teamName, teamImage, status, members)

    // Yeni takım oluştur
    const team = new Team({
      tournamentId,
      teamName,
      teamImage,
      status,
      members,
    });

    // Takımı kaydet
    const savedTeam = await team.save();

    await updateParticipantsCount({
      countType: "increase",  
      countSize: 1,          
      tournamentId,          
    });

    return NextResponse.json(
      {
        message: "Team created successfully",
        team: savedTeam,
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
      console.error("Error during team creation:", error);
      return NextResponse.error();
    }
  }
}
