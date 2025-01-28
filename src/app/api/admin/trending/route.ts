import { connectDB } from "@/lib/mongodb"
import General from "@/models/General"
import mongoose from "mongoose"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    // Gelen body'den tokenIds'i al
    const reqBody = await request.json()
    const { tokenIds } = reqBody

    if (!tokenIds || !Array.isArray(tokenIds)) {
      return NextResponse.json(
        { message: "tokenIds is required and must be an array" },
        { status: 400 }
      )
    }

    // Tek bir kaydı güncelle veya yoksa oluştur:
    const updatedDoc = await General.findOneAndUpdate(
      {},
      { tokenIds },
      {
        upsert: true,   // eğer bulamazsa yeni kayıdı oluştur
        new: true,      // update sonrası güncel dokümanı döndür
      }
    )

    return NextResponse.json(updatedDoc, { status: 200 })
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      )
    } else {
      console.error("Error updating tokenIds:", error)
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
  }
}
