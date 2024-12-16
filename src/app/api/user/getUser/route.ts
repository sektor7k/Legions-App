import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {

    try {

        await connectDB();

        const session = await getServerSession(authOptions)

        const user = await User.findById(session?.user.id)


        return NextResponse.json(user, { status: 200 })

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