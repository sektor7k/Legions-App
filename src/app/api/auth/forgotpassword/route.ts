import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/helpers/mailer";





export async function POST(request: NextRequest) {
    try {
        await connectDB()

        const reqBody = await request.json();
        const {  email } = reqBody;
        console.log(reqBody);

        const user = await User.findOne({ email })

        console.log(user)

        //send forgot password email
        await sendEmail({email, emailType: "RESET", userId: user._id})

        return NextResponse.json({
            message: "Forgot password successfully",
            success: true,
            user
        })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}