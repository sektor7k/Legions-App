import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import Match from "@/models/Matches";

export async function POST(request: Request) {

    try {

        connectDB();

        if (!Match) {
            return NextResponse.json({ message: 'Model not registered yet' }, { status: 500 });
        }

        const reqBody = await request.json();
        const { id } = reqBody;

        const res = await Match.findByIdAndUpdate(id, { isDeleted: true });

        return NextResponse.json({
            message: "Match deleted successfully",
            data: res,
        },
            {
                status: 200,
            })

    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            return NextResponse.json(
                { message: error.message },
                { status: 400 }
            );
        } else {
            console.error("Error during match fetching:", error);
            return NextResponse.error();
        }
    }
}