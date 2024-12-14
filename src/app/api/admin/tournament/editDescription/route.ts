import { connectDB } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Tournament from "@/models/Tournament";




export async function POST(request: NextRequest) {
    try {
        await connectDB()

        const reqBody = await request.json();


        const { tdescription } = reqBody
        const cardId = reqBody.id
        const card = await Tournament.findByIdAndUpdate(cardId, { $set: {tdescription} }, { new: true });

        return NextResponse.json({
            message: "successfully",
            success: true,
            card
        })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}