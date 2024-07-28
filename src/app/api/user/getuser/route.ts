import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";



export async function GET() {
    try {
        await connectDB()


        const session = await getServerSession();

        if (!session) {
            return NextResponse.json({ message: "session failed " }, { status: 400 })
        }

        const user = await User.findOne({ email: session.user.email });
        

        return NextResponse.json({
            message: "Forgot password successfully",
            success: true,
            user
        })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}