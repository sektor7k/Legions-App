import { connectDB } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const reqBody = await request.json();

    let { token } = reqBody;

    try {
      token = decodeURIComponent(token);
    } catch (decodeError) {
      return NextResponse.json({ message: "Error decoding token" }, { status: 400 });
    }

    const user = await User.findOne({ verifyToken: token });

    if (!user) {
      return NextResponse.json({ message: "Invalid token" }, { status: 400 });
    }

    user.isVerifed = true;
    user.verifyToken = undefined;
    user.verifyExpire = undefined;
    
    await user.save();

    return NextResponse.json({
      message: "Email verified successfully",
      success: true,
    });
  } catch (error: any) {
    console.error("Error in email verification process:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
