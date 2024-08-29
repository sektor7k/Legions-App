// /api/tournament/team/removeMember.js
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Team from '@/models/Team';
import { Types } from 'mongoose';

export async function POST(request: NextRequest) {
    const { teamId, memberId } = await request.json();

    await connectDB();

    try {
        const team = await Team.findById(teamId);

        if (!team) {
            return NextResponse.json({ message: 'Team not found' }, { status: 404 });
        }

        // Üyeyi takımdan çıkar
        team.members = team.members.filter((member:{ memberId: Types.ObjectId }) => !member.memberId.equals(memberId));

        await team.save();

        return NextResponse.json({ message: 'Member removed successfully', team }, { status: 200 });
    } catch (error) {
        console.error('Error removing member:', error);
        return NextResponse.json({ message: 'Server error', error }, { status: 500 });
    }
}
