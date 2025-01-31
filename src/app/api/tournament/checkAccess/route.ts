// app/api/tournament/checkAccess/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Tournament from "@/models/Tournament";

export async function POST(request: NextRequest) {
  try {
    // Veritabanına bağlan
    await connectDB();

    // request'ten JSON body'yi al
    const { userId, tournamentId, userRole } = await request.json();

    // Eğer kullanıcı genel admin ise direkt erişim ver
    if (userRole === "admin") {
      return NextResponse.json({ hasAccess: true }, { status: 200 });
    }

    // Turnuvayı bul
    const tournament = await Tournament.findById(tournamentId, "moderators");
    if (!tournament) {
      return NextResponse.json(
        { message: "Tournament not found", hasAccess: false },
        { status: 404 }
      );
    }

    // Moderators dizisinde userId var mı kontrol et
    const isModerator = tournament.moderators.some(
      (modId: any) => modId.toString() === userId
    );

    return NextResponse.json({ hasAccess: isModerator }, { status: 200 });
  } catch (error: any) {
    console.error("CheckAccess Error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
