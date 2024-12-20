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
        // Kullanıcının takımlara katılma isteği (Leader davetleri) - userId'ye göre alınır
        const leaderInvites = await Invite.find({ 
            inviteType: 'leader', 
            userId 
        })
        .populate({
            path: 'teamId',
            select: 'teamName teamImage'
        })
        .populate({
            path: 'userId',
            select: 'username image'
        })
        .populate({
            path: 'leadId',
            select: 'username image'
        });

        // Kullanıcının takıma kullanıcı davet etme isteği (Member davetleri) - leadId'ye göre alınır
        const memberInvites = await Invite.find({ 
            inviteType: 'member', 
            leadId: userId 
        })
        .populate({
            path: 'teamId',
            select: 'teamName teamImage'
        })
        .populate({
            path: 'userId',
            select: 'username image'
        })
        .populate({
            path: 'leadId',
            select: 'username image'
        });

        // Tüm davetleri birleştiriyoruz
        const allInvites = [...leaderInvites, ...memberInvites];

        if (allInvites.length === 0) {
            return NextResponse.json({ message: 'No outbox invites found' }, { status: 404 });
        }

        return NextResponse.json(allInvites, { status: 200 });

    } catch (error) {
        console.error('Error fetching outbox invites:', error);
        return NextResponse.json({ message: 'Server error', error }, { status: 500 });
    }
}
