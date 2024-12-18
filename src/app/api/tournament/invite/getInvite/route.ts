import Team from '@/models/Team';
import Invite from '@/models/Invite';
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
    const reqBody = await request.json();
    const { leadId, userId } = reqBody;

    if (!leadId && !userId) {
        return NextResponse.json({ message: 'Lead ID or User ID is required' }, { status: 400 });
    }

    // Veritabanına bağlantı kur
    await connectDB();

    // Model kaydını kontrol edin
    if (!Team || !Invite || !User) {
        return NextResponse.json({ message: 'Model not registered yet' }, { status: 500 });
    }

    try {
        // inviteType 'leader' olan ve leadId ile eşleşen davetleri al
        const leaderInvites = leadId ? await Invite.find({ 
            inviteType: 'leader', 
            leadId 
        })
        .populate({
            path: 'userId',
            select: 'username image'
        })
        .populate({
            path: 'leadId',
            select: 'username image'
        })
        .populate({
            path: 'teamId',
            select: 'teamName teamImage'
        }) : [];

        // inviteType 'member' olan ve userId ile eşleşen davetleri al
        const memberInvites = userId ? await Invite.find({ 
            inviteType: 'member', 
            userId 
        })
        .populate({
            path: 'userId',
            select: 'username image'
        })
        .populate({
            path: 'leadId',
            select: 'username image'
        })
        .populate({
            path: 'teamId',
            select: 'teamName teamImage'
        }) : [];

        // İki sorgunun sonucunu birleştir
        const allInvites = [...leaderInvites, ...memberInvites];

        // Eğer davet bulunmazsa hata döndür
        if (allInvites.length === 0) {
            return NextResponse.json({ message: 'No invites found' }, { status: 404 });
        }

        // Tüm davetleri döndür
        return NextResponse.json(allInvites, { status: 200 });

    } catch (error) {
        console.error('Error fetching invites:', error);
        return NextResponse.json({ message: 'Server error', error }, { status: 500 });
    }
}
