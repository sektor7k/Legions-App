import { connectDB } from "@/lib/mongodb";
import Tournament from "@/models/Tournament";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {

    await connectDB();

    if (!User){
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const tournaments = await Tournament.find({})
    .populate("moderators", "username image"); 


    
    return NextResponse.json({ tournaments }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching tournaments", error }, { status: 500 });
  }
}
