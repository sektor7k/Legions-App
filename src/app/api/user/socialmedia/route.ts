import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";




export async function POST(request: NextRequest) {
    try {
        await connectDB()

        const reqBody = await request.json();
        console.log(reqBody)

        const session = await getServerSession({ ...authOptions });

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        const updateData: any = {};

        if (reqBody.socialMedia?.twitter) {
            updateData["socialMedia.twitter"] = reqBody.socialMedia.twitter;
        }
        if (reqBody.socialMedia?.discord) {
            updateData["socialMedia.discord"] = reqBody.socialMedia.discord;
        }
        if (reqBody.socialMedia?.telegram) {
            updateData["socialMedia.telegram"] = reqBody.socialMedia.telegram;
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: "No social media data to update" }, { status: 400 });
        }

        const user = await User.findByIdAndUpdate(userId, { $set: updateData }, { new: true });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }



        return NextResponse.json({
            message: "successfully",
            success: true,
            user
        })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}