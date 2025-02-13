import { connectDB } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    console.log("Connecting to database...");
    await connectDB();
    console.log("Database connected successfully");

    const reqBody = await request.json();
    console.log("Request body:", reqBody);

    let { token } = reqBody;
    console.log("Original token from request:", token);

    try {
      token = decodeURIComponent(token);
      console.log("Decoded token:", token);
    } catch (decodeError) {
      console.error("Error decoding token:", decodeError);
      return NextResponse.json({ message: "Error decoding token" }, { status: 400 });
    }

    console.log("Searching for user with token:", token);
    const user = await User.findOne({ verifyToken: token });
    console.log("User search result:", user);

    if (!user) {
      console.error("No user found with token:", token);
      return NextResponse.json({ message: "Invalid token" }, { status: 400 });
    }

    console.log("User found. Proceeding with verification...");
    user.isVerifed = true;
    user.verifyToken = undefined;
    user.verifyExpire = undefined;
    
    console.log("Saving user after verification update...");
    await user.save();
    console.log("User saved successfully");

    return NextResponse.json({
      message: "Email verified successfully",
      success: true,
    });
  } catch (error: any) {
    console.error("Error in email verification process:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
