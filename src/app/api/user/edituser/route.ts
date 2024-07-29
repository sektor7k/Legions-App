import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";




export async function POST(request: NextRequest) {
    try {
        await connectDB()

        const reqBody = await request.json();
        const { newUsername } = reqBody;

        const session = await getServerSession({ ...authOptions });

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        const user = await User.findOneAndUpdate(
            { _id: userId },
            { username: newUsername },
            { new: true }
        );

        return NextResponse.json({
            message: "Edit User successfully",
            success: true,
            user
        })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}