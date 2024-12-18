import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Invite from '@/models/Invite';

export async function POST(request: NextRequest) {
    const reqBody = await request.json();
    const { teamId, userId, leadId, inviteType } = reqBody;

    if (!teamId || !userId || !leadId || !inviteType) {
        return NextResponse.json({ message: 'Team ID, User ID, and Lead ID are required' }, { status: 400 });
    }

    await connectDB();

    try {
        // Yeni bir davet oluştur
        const newInvite = new Invite({
            teamId,
            userId,
            leadId,
            status: 'pending',
            inviteType,
        });

        // Daveti kaydet
        await newInvite.save();

        return NextResponse.json({ message: 'Invite sent successfully', invite: newInvite }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Server error', error }, { status: 500 });
    }
}
