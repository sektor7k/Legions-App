import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Invite from '@/models/Invite';
import Team from '@/models/Team'; // Team modelini içe aktarın
import User from '@/models/User'; // User modelini içe aktarın

export async function POST(request: NextRequest) {
    const reqBody = await request.json();
    const { leadId } = reqBody;

    if (!leadId) {
        return NextResponse.json({ message: 'Lead ID is required' }, { status: 400 });
    }

    await connectDB();

    try {
        const invites = await Invite.find({ leadId })
            .populate({
                path: 'userId',
                select: 'username image'
            })
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
