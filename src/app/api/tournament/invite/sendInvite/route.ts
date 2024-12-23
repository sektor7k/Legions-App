import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Invite from '@/models/Invite';
import Team from '@/models/Team';

export async function POST(request: NextRequest) {
    const reqBody = await request.json();
    const { teamId, userId, leadId, inviteType } = reqBody;

    if (!teamId || !userId || !leadId || !inviteType) {
        return NextResponse.json({ message: 'Team ID, User ID, and Lead ID are required' }, { status: 400 });
    }

    await connectDB();

    console.log(teamId, userId, leadId, inviteType)

    try {
        const team = await Team.findById(teamId);

        if (!team) {
            return NextResponse.json({ message: 'Team not found' }, { status: 404 });
        }
        if (inviteType === 'member') {
            const existingTeam = await Team.findOne({ 'members.memberId': userId, isDeleted: false });

            if (existingTeam) {
                return NextResponse.json({
                    message: 'User is already a member of another team'
                }, { status: 400 });
            }

        }

        if (team.isDeleted) {
            return NextResponse.json({ message: 'Cannot send invite to a deleted team' }, { status: 403 });
        }
        const newInvite = new Invite({
            teamId,
            userId,
            leadId,
            status: 'pending',
            inviteType,
        });

        await newInvite.save();

        return NextResponse.json({ message: 'Invite sent successfully', invite: newInvite }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Server error', error }, { status: 500 });
    }
}
