import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Tournament from "@/models/Tournament"; // Tournament modelini import edin
import mongoose from "mongoose";

export async function POST(request: Request) {
  try {
    await connectDB(); // Veritabanına bağlan

    const reqBody = await request.json(); // İstek gövdesini al
    const {
      thumbnail,
      thumbnailGif,
      tname, 
      tdescription,
      organizer,
      organizerAvatar,
      participants,
      capacity,
      checkin,
      checkinTime,
      starts,
      startsTime,
      ends,
      endsTime,
      teamsize,
      teamcount,
      region,
      bracket,
      prizePool,
    } = reqBody;

    // console.log(tname,
    //     tdescription,
    //     checkin,
    //     checkinTime,
    //     starts,
    //     startsTime,
    //     ends,
    //     endsTime,
    //     teamsize,
    //     teamcount,
    //     region,
    //     bracket,
    //     prizePool)

    // Yeni turnuva oluştur
    const tournament = new Tournament({
      thumbnail,
      thumbnailGif,
      tname, 
      tdescription,
      organizer,
      organizerAvatar,
      participants,
      capacity,
      checkin,
      checkinTime,
      starts,
      startsTime,
      ends,
      endsTime,
      teamsize,
      teamcount,
      region,
      bracket,
      prizePool,
    });

    // Turnuvayı kaydet
    const savedTournament = await tournament.save();

    return NextResponse.json(
      {
        message: "Tournament created successfully",
        tournament: savedTournament,
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
      console.error("Error during tournament creation:", error);
      return NextResponse.error();
    }
  }
}
