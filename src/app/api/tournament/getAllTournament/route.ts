import { connectDB } from "@/lib/mongodb";
import Tournament from "@/models/Tournament";
import { NextResponse } from "next/server";

export async function GET() {
  try {

    await connectDB();

    const tournaments = await Tournament.find({});

    
    return NextResponse.json({ tournaments }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching tournaments", error }, { status: 500 });
  }
}
