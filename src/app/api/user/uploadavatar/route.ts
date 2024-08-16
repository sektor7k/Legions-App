import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";




export async function POST(request: NextRequest) {
    try {
        console.log("AVATAR IMAGE");
        await connectDB()

        const reqBody = await request.json()
        const { avatarimage } = reqBody

        console.log("AVATAR IMAGE",avatarimage);

        const self = await getServerSession({...authOptions});
     

      const res = await User.findOneAndUpdate(
        { username: self?.user.username },
        { image: avatarimage },
        { new: true, runValidators: true }
      );
      console.log("res",res);



        return NextResponse.json({
            success: true
        })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}