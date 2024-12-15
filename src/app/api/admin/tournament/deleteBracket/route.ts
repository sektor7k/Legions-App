import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Bracket from '@/models/Bracket';

export async function POST(request: NextRequest) {
    const { bracketId } = await request.json();

    await connectDB();

    try {
        // Bracket'i veritabanından sil
        const deletedBracket = await Bracket.findByIdAndDelete(bracketId);

        if (!deletedBracket) {
            return NextResponse.json({ message: 'Bracket not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Bracket deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting bracket:', error);
        return NextResponse.json({ message: 'Server error', error }, { status: 500 });
    }
}