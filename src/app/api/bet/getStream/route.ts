import { connectDB } from "@/lib/mongodb";
import BetStream from "@/models/BetStream";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest){

    try {
        await connectDB();

        const streams = await BetStream.find();

        return NextResponse.json({data:streams}, {status:200})
        
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            return NextResponse.json(
                { message: error.message },
                { status: 400 }
            );
        } else {
            console.error("Error during match creation:", error);
            return NextResponse.error();
        }
    }
}