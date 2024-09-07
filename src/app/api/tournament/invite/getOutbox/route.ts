import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Invite from '@/models/Invite';
import Team from '@/models/Team';

 
export async function POST(request: NextRequest) {
    const reqBody = await request.json();
    const { userId } = reqBody;

    if (!userId) {
        return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    await connectDB();

    if (!Team || !Invite) {
        return NextResponse.json({ message: 'Model not registered yet' }, { status: 500 });
    }

    try {
        const invites = await Invite.find({ userId })
            .populate({
                path: 'teamId',
                select: 'teamName teamImage'
            });
        return NextResponse.json(invites, { status: 200 });
    } catch (error) {
        console.error('Error fetching invites:', error);
        return NextResponse.json({ message: 'Server error', error }, { status: 500 });
    }
}
