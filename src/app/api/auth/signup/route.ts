import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { sendEmail } from "@/helpers/mailer";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Tüm domainlere izin verir
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// OPTIONS methodu preflight istekleri için
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const reqBody = await request.json();
    const { username, email, password} = reqBody;



    const userFound = await User.findOne({ email });

    if (userFound) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      username,
      email,
      password: hashedPassword,
    });


    const savedUser = await user.save();


    await sendEmail({email, emailType: "VERIFY", userId: savedUser._id})

    return NextResponse.json(
      {
        username: savedUser.username,
        email: savedUser.email,
        createdAt: savedUser.createdAt,
        updatedAt: savedUser.updatedAt,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      );
    } else {
      console.error("Error during signup:", error);
      return NextResponse.error();
    }
  }
}
