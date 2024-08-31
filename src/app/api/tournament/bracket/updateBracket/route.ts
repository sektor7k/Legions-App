import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Bracket from '@/models/Bracket';

export async function POST(request: NextRequest) {
    const { bracketTeamId, teamId, score } = await request.json();

    await connectDB();

    try {
        // Bracket'te bracketTeamId'ye sahip olan takımı buluyoruz
        const bracket = await Bracket.findOneAndUpdate(
            { 'teams._id': bracketTeamId }, // teams dizisindeki _id'ye göre arama
            { 
                $set: { 
                    'teams.$.teamId': teamId, // teamId'yi güncelliyoruz
                    'teams.$.score': score // score'u güncelliyoruz
                } 
            },
            { new: true } // Güncellenmiş dökümanı döndür
        );

        if (!bracket) {
            return NextResponse.json({ message: 'Bracket not found' }, { status: 404 });
        }

        return NextResponse.json({
            message: 'Bracket updated successfully',
            bracket
        },
        { status: 200 });
    } catch (error) {
        console.error('Error updating bracket:', error);
        return NextResponse.json({ message: 'Server error', error }, { status: 500 });
    }
}