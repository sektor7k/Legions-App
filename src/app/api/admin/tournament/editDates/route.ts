import { connectDB } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Tournament from "@/models/Tournament";
import { format } from "date-fns";




export async function POST(request: NextRequest) {
    try {
        await connectDB()

        const reqBody = await request.json();


        const cardId = reqBody.id;
        const updateData: any = {};

        if (reqBody.checkin) {
            updateData["checkin"] = format(reqBody.checkin, "PPP");
        }
        if (reqBody.checkinTime) {
            updateData["checkinTime"] = reqBody.checkinTime;
        }
        if (reqBody.starts) {
            updateData["starts"] = format(reqBody.starts, "PPP");;
        }
        if (reqBody.startsTime) {
            updateData["startsTime"] = reqBody.startsTime;
        }
        if (reqBody.ends) {
            updateData["ends"] = format(reqBody.ends, "PPP");;
        }
        if (reqBody.endsTime) {
            updateData["endsTime"] = reqBody.endsTime;
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