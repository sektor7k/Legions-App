import { connectDB } from "@/lib/mongodb"
import Tournament from "@/models/Tournament";
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    await connectDB();


    const { id, status } = await request.json()

  const edit = await Tournament.findByIdAndUpdate(id, {
    status:status
  })
   

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to update tournament status:", error)
    return NextResponse.json({ success: false, error: "Failed to update tournament status" }, { status: 500 })
  }
}

