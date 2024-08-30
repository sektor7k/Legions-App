import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Bracket from '@/models/Bracket';
import { Types } from 'mongoose';

export async function POST(request: NextRequest) {
    const { teamCount, tournamentId } = await request.json();

    if (!teamCount || !tournamentId) {
        return NextResponse.json({ message: 'Team count and tournament ID are required' }, { status: 400 });
    }

    // teamCount string olarak geldiği için bunu sayıya çevirelim
    const teamCountNumber = parseInt(teamCount, 10);

    if (isNaN(teamCountNumber) || teamCountNumber <= 0) {
        return NextResponse.json({ message: 'Invalid team count' }, { status: 400 });
    }

    await connectDB();

    try {
        // Mevcut turnuva için bir Bracket olup olmadığını kontrol et
        let bracket = await Bracket.findOne({ tournamentId });

        if (!bracket) {
            // Turnuva için yeni bir Bracket oluştur
            bracket = new Bracket({ tournamentId, teams: [] });
        }

        // Round'ları oluştur
        const teams = [];
        let currentTeamCount = teamCountNumber;
        let round = 1;

        while (currentTeamCount >= 1) {
            for (let i = 0; i < currentTeamCount; i++) {
                teams.push({
                    teamId: null, // Boş takım için null değer veriyoruz
                    score: 0,
                    round: round,
                });
            }
            currentTeamCount = Math.floor(currentTeamCount / 2);
            round++;
        }

        // Takımları Bracket'e ekle
        bracket.teams = teams;
        await bracket.save();

        return NextResponse.json({ message: 'Bracket created successfully', bracket }, { status: 200 });
    } catch (error) {
        console.error('Error creating bracket:', error);
        return NextResponse.json({ message: 'Server error', error }, { status: 500 });
    }
}
