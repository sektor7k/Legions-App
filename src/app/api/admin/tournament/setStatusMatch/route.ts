import { connectDB } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Match from "@/models/Matches";




export async function POST(request: NextRequest) {
    try {
        await connectDB()

        const reqBody = await request.json();

        const { id,status} = reqBody;

        const setStatus = await Match.findByIdAndUpdate(id, { status });


        return NextResponse.json({
            message: "successfully",
            success: true,
            setStatus
        })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}