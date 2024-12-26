import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {

    try {

        await connectDB()

        const reqBody = await request.json();
        const { id, role } = reqBody;

        const editrole = await User.findByIdAndUpdate(id, { role });
        if (!editrole) {
            return NextResponse.json({ message: 'edit role Error' }, { status: 403 })
        }
        return NextResponse.json(editrole, { status: 200 });
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