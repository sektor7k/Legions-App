import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Team from '@/models/Team';

export async function POST(request: NextRequest) {
    const reqBody = await request.json();
    const { tournamentId, leadId } = reqBody; // Gelen istekteki tournamentId'yi alıyoruz

    await connectDB();

    try {
        // tournamentId'ye göre tüm takımları bul
        const team = await Team.findOne({ 
            tournamentId, 
            'members.memberId': leadId, 
            'members.isLead': true ,
            isDeleted: false
          });

        if (!team || team.length === 0) {
            return NextResponse.json({ message: 'Teams not found' }, { status: 404 });
        }

        return NextResponse.json(team, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Server error', error }, { status: 500 });
    }
}
