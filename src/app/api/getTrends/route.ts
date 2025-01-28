
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import General from '@/models/General';

export async function GET() {
   

   

    await connectDB();

    if (!General) {
        return NextResponse.json({ message: 'Model not registered yet' }, { status: 500 });
    }

    try {
        
        const general = await General.findOne({});

        return NextResponse.json(general, { status: 200 });

    } catch (error) {
        console.error('Error fetching invites:', error);
        return NextResponse.json({ message: 'Server error', error }, { status: 500 });
    }
}
