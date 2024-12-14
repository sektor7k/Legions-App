// /api/tournament/checkRegistration.js
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Team from '@/models/Team';
import Invite from '@/models/Invite';

export async function POST(request: NextRequest) {
    const reqBody = await request.json();
    const { userId, tournamentId } = reqBody; // Gelen istekteki tournamentId'yi alıyoruz

    await connectDB();

    try {
        const team = await Team.findOne({ tournamentId, 'members.memberId': userId, isDeleted: false });

        const teamsInTournament = await Team.find({ tournamentId }).select('_id');

        // Bu takımlara gönderilen pending davetleri kontrol et
        const pendingInvite = await Invite.findOne({ userId, teamId: { $in: teamsInTournament.map(team => team._id) }, status: 'pending' });


        const isRegistered = !!team;
        const hasPendingInvite = !!pendingInvite;

        return NextResponse.json({ isRegistered, hasPendingInvite }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Server error', error }, { status: 500 });
    }
}
