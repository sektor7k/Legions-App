import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {

    try {
        
        await connectDB();

        const reqBody = await request.json();
        const {id, status} = reqBody;

        if (status == "active"){
            const user = await User.findByIdAndUpdate(id, {status: "blocked"});
        }
        if (status == "blocked"){
            const user = await User.findByIdAndUpdate(id, {status: "active"});
        }


        return NextResponse.json({message:"successfull edit status"}, {status: 200})
    }  catch (error) {
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