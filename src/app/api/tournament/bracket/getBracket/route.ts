// /api/tournament/bracket/getBracket.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Bracket from '@/models/Bracket';
import Team from '@/models/Team'; 

export async function POST(request: NextRequest) {
    const reqBody = await request.json();
    const { tournamentId } = reqBody;

    await connectDB();


    if (!Team || !Bracket) {
        return NextResponse.json({ message: 'Model not registered yet' }, { status: 500 });
    }

    try {
        const bracket = await Bracket.findOne({ tournamentId }).populate({
            path: 'teams.teamId',
            select: 'teamName teamImage',
            match: { _id: { $ne: null } }, // Sadece teamId null olmayanları populate et
        });

        if (!bracket) {
            return NextResponse.json(null, { status: 200 });
        }

        return NextResponse.json(bracket, { status: 200 });
    } catch (error) {
        console.error('Error fetching bracket:', error);
        return NextResponse.json({ message: 'Server error', error }, { status: 500 });
    }
}
