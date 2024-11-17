import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Team from '@/models/Team';
import User from '@/models/User';

export async function POST(request: NextRequest) {
    const reqBody = await request.json();
    const { tournamentId } = reqBody; // Gelen istekteki tournamentId'yi alıyoruz

    await connectDB();

    try {

        if (!User) {
            return NextResponse.json({ message: 'Model not registered yet' }, { status: 500 });
        }
        // tournamentId'ye göre tüm takımları bul
        const teams = await Team.find({ tournamentId })
        .populate({
            path: 'members.memberId',
            select: 'username image' // Sadece kullanıcı adı ve resmi al
        });

        if (!teams || teams.length === 0) {
            return NextResponse.json({ message: 'Teams not found' }, { status: 404 });
        }

        return NextResponse.json(teams, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Server error', error }, { status: 500 });
    }
}
