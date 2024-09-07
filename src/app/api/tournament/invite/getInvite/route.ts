import Team from '@/models/Team';
import Invite from '@/models/Invite';
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
    const reqBody = await request.json();
    const { leadId } = reqBody;

    if (!leadId) {
        return NextResponse.json({ message: 'Lead ID is required' }, { status: 400 });
    }

    // Veritabanına bağlantı kur
    await connectDB();

    // Model kaydını kontrol edin
    if (!Team || !Invite) {
        return NextResponse.json({ message: 'Model not registered yet' }, { status: 500 });
    }

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
