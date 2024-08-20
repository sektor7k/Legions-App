import { NextRequest, NextResponse } from 'next/server';
import Tournament from '@/models/Tournament'; // Modelin doğru yolu olmalı
import { connectDB } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
    const reqBody = await request.json();
    const { id } = reqBody;

    await connectDB();

    try {
        const tournament = await Tournament.findById(id); // ID'ye göre turnuvayı bul

        if (!tournament) {
            return NextResponse.json({ message: 'Tournament not found' }, { status: 404 });
        }

        return NextResponse.json(tournament, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Server error', error }, { status: 500 });
    }
}
