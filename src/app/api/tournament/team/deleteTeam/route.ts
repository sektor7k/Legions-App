// /api/tournament/deleteTeam.js
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Team from '@/models/Team';
import { updateParticipantsCount } from '@/helpers/participantscount';

export async function POST(request: NextRequest) {
    const { teamId } = await request.json();

    await connectDB();

    try {
        const team = await Team.findById(teamId);

        if (!team) {
            return NextResponse.json({ message: 'Team not found' }, { status: 404 });
        }

        const memberCount = team.members.length;

        await Team.findByIdAndUpdate(teamId, { isDeleted: true });

        await updateParticipantsCount({
            countType: "decrease",
            countSize: memberCount,
            tournamentId: team.tournamentId,
        });

        if (!team) {
            return NextResponse.json({ message: 'Team not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Team deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting team:', error);
        return NextResponse.json({ message: 'Server error', error }, { status: 500 });
    }
}
