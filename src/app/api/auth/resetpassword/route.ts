import { connectDB } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import bcrypt from 'bcryptjs';



export async function POST(request: NextRequest) {
    try {
        await connectDB()

        const reqBody = await request.json()
        const { token, password } = reqBody

        const user = await User.findOne({ forgotPasswordToken: token })



        if(!user) {
            return NextResponse.json({ message: "Invalid token" }, { status: 400 })
        }

        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(password, salt);

        user.password = hashedPassword;
        user.forgotPasswordExpire = undefined;
        user.forgotPasswordToken = undefined;
        await user.save();



        return NextResponse.json({
            message: "Password has been reset successfully",
            success: true
        })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}