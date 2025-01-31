import { connectDB } from "@/lib/mongodb";
import Tournament from "@/models/Tournament";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await connectDB();

    const { id, ...updateFields } = await request.json();

    if (!id || Object.keys(updateFields).length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid request: Missing fields" },
        { status: 400 }
      );
    }

    const updatedTournament = await Tournament.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    );

    if (!updatedTournament) {
      return NextResponse.json(
        { success: false, error: "Tournament not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedTournament });
  } catch (error) {
    console.error("Failed to update tournament status:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update tournament" },
      { status: 500 }
    );
  }
}
