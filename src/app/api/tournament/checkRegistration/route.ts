// /api/tournament/checkRegistration.js
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Team from '@/models/Team';

export async function POST(request: NextRequest) {
    const reqBody = await request.json();
    const { userId, tournamentId } = reqBody; // Gelen istekteki tournamentId'yi alıyoruz

    await connectDB();

    try {
        const team = await Team.findOne({ tournamentId, 'members.memberId': userId });

        return NextResponse.json({ isRegistered: !!team }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Server error', error }, { status: 500 });
    }
}
