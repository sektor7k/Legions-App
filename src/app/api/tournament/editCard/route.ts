import { connectDB } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Tournament from "@/models/Tournament";




export async function POST(request: NextRequest) {
    try {
        await connectDB()

        const reqBody = await request.json();
        console.log(reqBody)


        const cardId = reqBody.editCard.id;

        const updateData: any = {};

        if (reqBody.editCard?.thumbnail2) {
            updateData["thumbnail"] = reqBody.editCard.thumbnail2;
        }
        if (reqBody.editCard?.thumbnailGif2) {
            updateData["thumbnailGif"] = reqBody.editCard.thumbnailGif2;
        }
        if (reqBody.editCard?.organizer2) {
            updateData["organizer"] = reqBody.editCard.organizer2;
        }
        if (reqBody.editCard?.organizerAvatar2) {
            updateData["organizerAvatar"] = reqBody.editCard.organizerAvatar2;
        }
        if (reqBody.editCard?.name2) {
            updateData["name"] = reqBody.editCard.name2;
        }
        if (reqBody.editCard?.capacity2) {
            updateData["capacity"] = reqBody.editCard.capacity2;
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