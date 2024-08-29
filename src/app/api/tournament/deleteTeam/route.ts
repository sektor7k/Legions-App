// /api/tournament/deleteTeam.js
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Team from '@/models/Team';

export async function POST(request: NextRequest) {
    const { teamId } = await request.json();

    await connectDB();

    try {
        const team = await Team.findByIdAndDelete(teamId);

        if (!team) {
            return NextResponse.json({ message: 'Team not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Team deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting team:', error);
        return NextResponse.json({ message: 'Server error', error }, { status: 500 });
    }
}
