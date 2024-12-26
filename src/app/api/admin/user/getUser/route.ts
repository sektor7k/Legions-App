import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {

    try {

        await connectDB();

        const users = (await User.find()).reverse();

        return NextResponse.json(users, { status: 200 })
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