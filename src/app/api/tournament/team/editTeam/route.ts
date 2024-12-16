import { connectDB } from "@/lib/mongodb";
import Team from "@/models/Team";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {

    try {

        await connectDB();

        const reqBody = await request.json();
        const { teamId, teamName, teamImage, status } = reqBody;

        console.log(teamName, status);

        const updateData: any = {};

        if (teamName) {
            updateData["teamName"] = teamName;
        }

        if (teamImage) {
            updateData["teamImage"] = teamImage;
        }
        if (status) {
            updateData["status"] = status;
        }
        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: "No team detail data to update" }, { status: 400 });
        }

        const card = await Team.findByIdAndUpdate(teamId, { $set: updateData }, { new: true });

        return NextResponse.json({ message: "Edit team successfuly" }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ error }, { status: 500 })
    }
}