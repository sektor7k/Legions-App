import { connectDB } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Tournament from "@/models/Tournament";
import { format } from "date-fns";




export async function POST(request: NextRequest) {
    try {
        await connectDB()

        const reqBody = await request.json();
console.log("klklk")

        const cardId = reqBody.id;
        const updateData: any = {};

        if (reqBody.teamsize) {
            updateData["teamsize"] = reqBody.teamsize
        }
        if (reqBody.teamcount) {
            updateData["teamcount"] = reqBody.teamcount;
        }
        if (reqBody.region) {
            updateData["region"] = reqBody.region;
        }
        if (reqBody.bracket) {
            updateData["bracket"] = reqBody.bracket;
        }


        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: "No tournament card data to update" }, { status: 400 });
        }

        const card = await Tournament.findByIdAndUpdate(cardId, { $set: updateData }, { new: true });




        return NextResponse.json({
            message: "successfully",
            success: true,
            card
        })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}